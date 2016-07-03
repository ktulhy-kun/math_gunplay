// Generated by CoffeeScript 1.10.0
(function() {
  var HOSPITAL, MORGUE, Model, ModelSettings, Player, RESUSCITATION, SQUARE, levels, obj, penalties,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  penalties = [
    {
      "treat": 0,
      "attack": 0
    }, {
      "treat": 1,
      "attack": 3
    }, {
      "treat": 3,
      "attack": 6
    }, {
      "treat": 5,
      "attack": 9
    }, {
      "treat": 1,
      "attack": 12
    }
  ];

  window.MODE_ADD = 1;

  window.MODE_DAY = 2;

  window.MODE_NIGHT = 3;

  window.isMode = function(gameModes) {
    var ref;
    if (Array.isArray(gameModes)) {
      return ref = mgModelSettings.gameMode, indexOf.call(gameModes, ref) >= 0;
    } else {
      return mgModelSettings.gameMode === gameModes;
    }
  };

  window.setMode = function(gameMode) {
    mgModelSettings.gameMode = gameMode;
    if (isMode(MODE_DAY)) {
      return mgModel.setDayTimer();
    } else {
      return clearInterval(mgModelSettings.timer);
    }
  };

  ModelSettings = (function() {
    function ModelSettings() {
      this.settingsVersion = 1;
      this.savesVersion = 1;
      this.maxAttack = 15;
      this.selfDestroyAttack = true;
      this.selfDestroyTreat = true;
      this.selfDestroyResuscitation = false;
      this.hospitalPlus = 10;
      this.nullResus = true;
      this.dayTime = 4;
      this.gameMode = MODE_ADD;
      this.time = 0;
      this.timer = null;
      this.endDayCallback = function() {};
      this.daySecondCallback = function() {};
    }

    return ModelSettings;

  })();

  window.mgModelSettings = new ModelSettings();

  SQUARE = "square";

  HOSPITAL = "hospital";

  RESUSCITATION = "resuscitation";

  MORGUE = "morgue";

  levels = (
    obj = {},
    obj["" + SQUARE] = [60, 100],
    obj["" + HOSPITAL] = [30, 60],
    obj["" + RESUSCITATION] = [0, 30],
    obj["" + MORGUE] = [-100000, 0],
    obj
  );

  Model = (function() {
    function Model() {
      this.players = [];
      return;
    }

    Model.prototype.addPlayer = function(name) {
      this.players.push(new Player(this.players.length, name));
    };

    Model.prototype.getPlayer = function(id) {
      return this.players[id];
    };

    Model.prototype.hit = function(fromId, toId) {
      var attackValue, playerFrom, playerTo;
      playerFrom = this.getPlayer(fromId);
      playerTo = this.getPlayer(toId);
      attackValue = playerFrom.getAttackValue();
      playerFrom.solved += 1;
      if ((playerTo.health === 0) || (playerFrom.getLevel() !== playerTo.getLevel())) {
        return 0;
      }
      if (fromId === toId) {
        if (playerFrom.level === RESUSCITATION) {
          if (mgModelSettings.selfDestroyResuscitation) {
            return 0;
          }
        }
        if (!mgModelSettings.selfDestroyAttack) {
          return 0;
        }
      }
      return playerTo.dHealth(-attackValue);
    };

    Model.prototype.miss = function(plId) {
      var player;
      player = this.getPlayer(plId);
      player.unsolved += 1;
      return 0;
    };

    Model.prototype.treat = function(plId, correct) {
      var player, value;
      player = this.getPlayer(plId);
      value = player.getTreatValue(correct);
      player.solved += 1 * correct;
      player.unsolved += 3 - 1 * correct;
      if ((player.getLevel() === RESUSCITATION) && mgModelSettings.nullResus) {
        player.treatment = 0;
      } else {
        player.treatment += 1;
      }
      return player.dHealth(value);
    };

    Model.prototype.penalty = function(plId) {
      var player;
      player = this.getPlayer(plId);
      return player.addPenalty();
    };

    Model.prototype.setDayTimer = function() {
      clearInterval(mgModelSettings.timer);
      mgModelSettings.time = Math.max(1, mgModelSettings.dayTime);
      return mgModelSettings.timer = setInterval(function() {
        mgModelSettings.time -= 1;
        if (mgModelSettings.time <= 0) {
          mgModelSettings.endDayCallback();
          clearInterval(mgModelSettings.timer);
          return mgModelSettings.timer = null;
        } else {
          return mgModelSettings.daySecondCallback();
        }
      }, 1000);
    };

    return Model;

  })();

  window.mgModel = new Model();

  Player = (function() {
    function Player(id1, name1) {
      this.id = id1;
      this.name = name1;
      this.health = 100;
      this.solved = 0;
      this.unsolved = 0;
      this.treatment = 0;
      this.penalties = 0;
    }

    Player.prototype.getLevel = function() {
      var level, ref, scope;
      for (level in levels) {
        scope = levels[level];
        if ((scope[0] < (ref = this.health) && ref <= scope[1])) {
          return level;
        }
      }
    };

    Player.prototype.getAttackValue = function() {
      var penalty;
      penalty = penalties[this.penalties]["attack"];
      return getValScope(10 + this.solved - this.unsolved - penalty - 3 * this.treatment, [0, mgModelSettings.maxAttack]);
    };

    Player.prototype.getTreatValue = function(correct) {
      var penalty, value;
      penalty = penalties[this.penalties]["treat"];
      value = 5 * correct + this.solved - this.unsolved - 3 * this.treatment - 5 - penalty;
      if (mgModelSettings.selfDestroyTreat && (value < 0)) {
        return 0;
      }
      if (mgModelSettings.selfDestroyResuscitation && (this.getLevel() === RESUSCITATION) && (value < 0)) {
        return 0;
      }
      if (this.getLevel() === HOSPITAL) {
        value += mgModelSettings.hospitalPlus;
      }
      return value;
    };

    Player.prototype.dHealth = function(delta) {
      return this.health = getValScope(this.health + delta, [0, 100]);
    };

    Player.prototype.addPenalty = function() {
      return this.penalties = getValScope(this.penalties + 1, [0, penalties.length - 1]);
    };

    return Player;

  })();

}).call(this);

//# sourceMappingURL=model.js.map
