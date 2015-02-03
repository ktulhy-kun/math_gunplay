// Generated by CoffeeScript 1.8.0
(function() {
  var JSONify, Player, Saves, Snapshot, Statistic, storage, _Model,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __hasProp = {}.hasOwnProperty;

  storage = Tools.storage;

  JSONify = Tools.JSONify;

  Player = Model.Player;

  Statistic = Model.Statistic;

  Snapshot = Model.Snapshot;

  Saves = Model.Saves;

  _Model = (function(_super) {
    __extends(_Model, _super);

    function _Model(_at_settings) {
      this.settings = _at_settings;
      this.className = "_Model";
      this.JSONProperties = ["players", "statistic", "isGame"];
      this.register(_Model);
      this.isDay = 0;
      this.isGame = 0;
      this.time = 0;
      this.timer = void 0;
      this.players = {
        "length": 0
      };
      this.statistic = new Statistic(this.players);
      this.snapshots = new Snapshot(this);
      this.saves = new Saves(this);
      void 0;
    }

    _Model.prototype.addPlayer = function(name) {
      var id;
      if (this.isGame) {
        throw "Нельзя добавлять игроков во время игры";
      }
      id = this.players.length;
      this.players[id] = new Player(id, name, this.settings);
      this.players.length += 1;
      return void 0;
    };

    _Model.prototype.save = function() {
      return this.saves["new"]();
    };

    _Model.prototype.load = function(id) {
      return this.saves.load(id);
    };

    _Model.prototype.savesList = function() {
      return this.saves.getList();
    };

    _Model.prototype.startGame = function() {
      var player, _i, _len, _ref;
      _ref = this.players;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        player = _ref[_i];
        player.eventBind(["all"], (function(_this) {
          return function(pF, pT, v) {
            return _this.snapshots.add();
          };
        })(this));
      }
      return this.statistic.binds();
    };

    _Model.prototype.undo = function() {
      return this.snapshots.undo();
    };

    _Model.prototype.redo = function() {
      return this.snapshots.redo();
    };

    _Model.prototype.setDayTimer = function() {
      this.time = this.settings.stTime * 60;
      this.timer = setInterval((function(_this) {
        return function() {
          _this.time -= 1;
          if (_this.time <= 0) {
            _this.changeDayNight();
          } else {
            void 0;
          }
          return void 0;
        };
      })(this), 1000);
      return void 0;
    };

    _Model.prototype.changeDayNight = function() {
      clearInterval(this.timer);
      if (!this.isGame) {
        this.isGame = 1;
        this.isDay = 1;
      } else {
        this.isDay = !this.isDay;
      }
      if (this.isDay) {
        this.setDayTimer();
      }
      this.snapshots.clear();
      return void 0;
    };

    return _Model;

  })(JSONify);

  window.Model.Model = _Model;

}).call(this);

//# sourceMappingURL=model.js.map
