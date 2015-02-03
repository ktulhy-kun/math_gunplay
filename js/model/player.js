// Generated by CoffeeScript 1.8.0
(function() {
  var __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __hasProp = {}.hasOwnProperty,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  define(["tools/tools", "tools/jsonify", "model/settings"], function(Tools, JSONify, Settings) {
    var EVENTS_DEBUG, Player, getValScope, levels, penalties_list, remove, settingsDesc;
    getValScope = Tools.getValScope;
    remove = Tools.remove;
    settingsDesc = Settings.settingsDesc;
    EVENTS_DEBUG = false;
    levels = {
      square: [0.6, 1],
      hospital: [0.3, 0.6],
      resuscitation: [0, 0.3],
      morgue: [-10000, 0]
    };
    penalties_list = [
      {
        "treat": 0,
        "attack": 0
      }, {
        "treat": 0.01,
        "attack": 3
      }, {
        "treat": 0.03,
        "attack": 6
      }, {
        "treat": 0.05,
        "attack": 9
      }, {
        "treat": 0.1,
        "attack": 12
      }
    ];
    Player = (function(_super) {
      __extends(Player, _super);

      function Player(_at_id, _at_name, _at_settings) {
        this.id = _at_id != null ? _at_id : -1;
        this.name = _at_name != null ? _at_name : "ERR";
        this.settings = _at_settings != null ? _at_settings : settingsDesc;
        this._eventInit();
        this.setHealth(1);
        this.solved = this.unsolved = this.treatment = this.penalties = 0;
        this.className = "Player";
        this.JSONProperties = ["id", "name", "health", "solved", "unsolved", "treatment", "penalties"];
        this.register(Player);
      }

      Player.prototype._rawAttack = function() {
        var penalty;
        penalty = penalties_list[this.penalties].attack;
        return 10 + this.solved - this.unsolved - penalty - 3 * this.treatment;
      };

      Player.prototype._rawTreat = function(solved) {
        return 5 * solved + this.solved - this.unsolved - 3 * this.treatment - 5;
      };

      Player.prototype.setHealth = function(health) {
        var diff, _health;
        _health = getValScope(health, [0, 1]);
        diff = _health - this.health;
        this.health = _health;
        return this._eventGenerate("healthChanged", void 0, diff);
      };

      Player.prototype.getHealth = function() {
        return this.health;
      };

      Player.prototype.getLevel = function() {
        var level, scope, _ref;
        for (level in levels) {
          scope = levels[level];
          if ((scope[0] < (_ref = this.getHealth()) && _ref <= scope[1])) {
            return level;
          }
        }
        return void 0;
      };

      Player.prototype.getAttackWithoutTreat = function() {
        return (getValScope(this._rawAttack() + 3 * this.treatment, [0, this.settings.maxAttack()])) / 100;
      };

      Player.prototype.getAttack = function() {
        return (getValScope(this._rawAttack(), [0, this.settings.maxAttack()])) / 100;
      };

      Player.prototype.getAttackTo = function(player) {
        switch (false) {
          case 0 !== this.getHealth():
            return 0;
          case this.getLevel() === player.getLevel():
            return 0;
          case !((this.id === player.id) && (this.getLevel() === "resuscitation") && !this.settings.selfDestroyResuscitation()):
            return 0;
          case !((this.id === player.id) && !this.settings.selfDestroyAttack()):
            return 0;
          default:
            return this.getAttack();
        }
      };

      Player.prototype.hit = function(player) {
        var dmg;
        dmg = this.getAttackTo(player);
        player.setHealth(player.getHealth() - dmg);
        this.solved += 1;
        this._eventGenerate("attack", player, dmg);
        this._eventGenerate("attacked", void 0, dmg);
        return this._eventGenerate("solveChanged", void 0, 1);
      };

      Player.prototype.miss = function() {
        this.unsolved += 1;
        return this._eventGenerate("unsolveChanged", void 0, 1);
      };

      Player.prototype.getTreat = function(solved) {
        var h;
        h = this._rawTreat(solved);
        h += ("hospital" === this.getLevel()) * (this.settings.hospitalPlus10()) * 10;
        return h = getValScope(h, [(this.settings.selfDestroyTreat() ? -Infinity : 0), 1 - this.getHealth()]);
      };

      Player.prototype.incTreatment = function() {
        var _treatment;
        if ((this.settings.nullTreatIfTreatResuscitation()) && (this.getLevel() === "resuscitation")) {
          _treatment = -this.treatment;
        } else {
          _treatment = 1;
        }
        this.treatment += _treatment;
        return this._eventGenerate("treatChanged", void 0, _treatment);
      };

      Player.prototype.treat = function(solved) {
        var inc;
        inc = this.getTreat(solved);
        this.setHealth(this.getHealth() + inc);
        this.incTreatment();
        this.solve += solved;
        this.unsolved += 3 - solved;
        this._eventGenerate("treat", void 0, inc);
        this._eventGenerate("solveChanged", void 0, solved);
        return this._eventGenerate("unsolveChanged", void 0, 3 - solved);
      };

      Player.prototype.penalty = function() {
        this.penalty = getValScope(this.penalties += 1, [0, penalties_list.lenght() - 1]);
        this._eventGenerate("penalty", void 0, 1);
        return this._eventGenerate("penaltyChanged", void 0, 1);
      };

      Player.prototype.toString = function() {
        return "Player#" + this.id + "♥" + (this.getHealth()) + "/" + this.solved + ":" + this.unsolved;
      };

      Player.prototype._eventInit = function() {
        this.callbacks = {};
        this.callbackIdList = {};
        this.metaEvents = {
          smthChanged: ["healthChanged", "solveChanged", "unsolveChanged", "penaltyChanged", "treatChanged"],
          situations: ["attack", "miss", "treat", "penalty"]
        };
        return this.metaEvents["all"] = ["attacked"].concat(this.metaEvents["smthChanged"]).concat(this.metaEvents["situations"]);
      };

      Player.prototype._eventGenerate = function(eventName, playerTo, value, parentEventName) {
        var callback, eventList, metaEventName, _, _ref, _ref1;
        if (parentEventName == null) {
          parentEventName = void 0;
        }
        if (EVENTS_DEBUG) {
          console.group("`" + eventName + "` generate");
        }
        if (this.callbacks[eventName] != null) {
          if (EVENTS_DEBUG) {
            console.info("Callbacks exist");
          }
          _ref = this.callbacks[eventName];
          for (_ in _ref) {
            callback = _ref[_];
            if (EVENTS_DEBUG) {
              console.info("Callback id: " + _);
            }
            if (EVENTS_DEBUG) {
              console.info(this + " -->(" + value + ") " + playerTo);
            }
            callback(this, playerTo, value, parentEventName != null ? parentEventName : eventName);
            _ref1 = this.metaEvents;
            for (metaEventName in _ref1) {
              eventList = _ref1[metaEventName];
              if (EVENTS_DEBUG) {
                if (__indexOf.call(eventList, eventName) >= 0) {
                  console.info("Meta event `" + metaEventName + "` generate");
                }
              }
              if (__indexOf.call(eventList, eventName) >= 0) {
                this._eventGenerate(metaEventName, playerTo, value, eventName);
              }
            }
          }
        }
        if (EVENTS_DEBUG) {
          return console.groupEnd();
        }
      };

      Player.prototype.eventBind = function(eventsList, callback) {
        var eventName, id, _base, _i, _len;
        if (eventsList == null) {
          throw "Список событий не может быть " + eventsList;
        }
        id = 5;
        while (this.callbackIdList[id] != null) {
          id = Math.floor(Math.random() * 100000000000000000);
        }
        for (_i = 0, _len = eventsList.length; _i < _len; _i++) {
          eventName = eventsList[_i];
          if ((_base = this.callbacks)[eventName] == null) {
            _base[eventName] = {};
          }
          this.callbacks[eventName][id] = callback;
          this.callbackIdList[id] = eventName;
        }
        return id;
      };

      Player.prototype.eventUnbind = function(callbackId) {
        var eventName, _i, _len, _ref, _results;
        remove(this.callbackIdList, callbackId);
        _ref = this.callbackIdList[callbackId];
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          eventName = _ref[_i];
          _results.push(delete this.callbacks[eventName]);
        }
        return _results;
      };

      return Player;

    })(JSONify.JSONify);
    return Player;
  });

}).call(this);

//# sourceMappingURL=player.js.map
