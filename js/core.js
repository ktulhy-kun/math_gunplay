// Generated by CoffeeScript 1.7.1
(function() {
  var Model, View, deepCopy, getValScope;

  getValScope = function(val, scope) {
    if (scope[0] > val) {
      return scope[0];
    } else if (scope[1] < val) {
      return scope[1];
    }
    return val;
  };

  deepCopy = function(v) {
    return $.extend(true, [], v);
  };

  Model = (function() {
    function Model() {
      this.isDay = true;
      this.stTime = 15 * 60;
      this.time = 0;
      this.timer = void 0;
      this.players = [];
      this.snapshots = [];
      this.snapshotPoint = -1;
      this.levels = {
        square: [0.8, 1],
        hospital: [0.3, 0.8],
        resuscitation: [0, 0.3],
        morgue: [-10000, 0]
      };
      this.view = void 0;
      this.addSnapshot();
      void 0;
    }

    Model.prototype.joinView = function(view) {
      this.view = view;
    };

    Model.prototype.addSnapshot = function() {
      var _ref, _ref1;
      this.snapshotPoint += 1;
      [].splice.apply(this.snapshots, [(_ref = this.snapshotPoint), 9e9].concat(_ref1 = {
        'isDay': this.isDay,
        'players': deepCopy(this.players)
      })), _ref1;
      return void 0;
    };

    Model.prototype.loadSnapshot = function(snapshotN) {
      var _ref;
      if (snapshotN == null) {
        snapshotN = this.snapshotPoint - 1;
      }
      this.snapshotPoint = snapshotN;
      _ref = this.snapshots[this.snapshotPoint], this.isDay = _ref.isDay, this.players = _ref.players;
      this.view.updateUi();
      return void 0;
    };

    Model.prototype.forwardSnapshot = function() {
      this.snapshotPoint += 1;
      return this.loadSnapshot(this.snapshotPoint);
    };

    Model.prototype.setDayTimer = function() {
      this.time = this.stTime;
      return this.timer = setInterval(function(_this) {
        _this.time -= 1;
        if (!_this.time) {
          clearTimeout(_this.timer);
          _this.changeDayNight;
        } else {
          _this.view.updateTime();
        }
        return void 0;
      }, 1000, this);
    };

    Model.prototype.changeDayNight = function() {
      this.isDay = !this.isDay;
      if (this.isDay) {
        this.setDayTimer();
      }
      return this.view.updateUi();
    };

    Model.prototype.setHealth = function(plN, health) {
      var pl;
      pl = this.players[plN];
      pl.health = getValScope(health, [0, 1]);
      return void 0;
    };

    Model.prototype.getLevel = function(plN) {
      var h, level, scope, _ref;
      h = this.players[plN].health;
      _ref = this.levels;
      for (level in _ref) {
        scope = _ref[level];
        if ((scope[0] < h && h <= scope[1])) {
          return level;
        }
      }
    };

    Model.prototype.getAttack = function(plN) {
      var pl;
      pl = this.players[plN];
      return (getValScope(10 + pl.solve - pl.unsolve - 3 * pl.treatment, [0, 20])) / 100;
    };

    Model.prototype.getTreat = function(plN, solved) {
      var h, pl;
      pl = this.players[plN];
      h = 5 * solved + pl.solve - pl.unsolve - 3 * pl.treatment - 5;
      if ((this.getLevel(plN)) === 'hospital') {
        h += 10;
      }
      return (getValScope(h, [-Infinity, Infinity])) / 100;
    };

    Model.prototype.treat = function(plN, solved) {
      var pl;
      pl = this.players[plN];
      this.setHealth(pl, pl.health + this.getTreat(plN, solved));
      if (this.getLevel(plN === "resuscitation")) {
        pl.treatment = 0;
      } else {
        pl.treatment += 1;
      }
      this.addSnapshot();
      this.view.updateUi();
      return void 0;
    };

    Model.prototype.attack = function(plN1, plN2) {
      var pl1, pl2;
      pl1 = this.players[plN1];
      pl2 = this.players[plN2];
      this.setHealth(plN2, pl2.health - this.getAttack(plN1));
      pl1.solve += 1;
      this.view.hit(plN1, plN2);
      this.addSnapshot();
      return this.view.updateUi();
    };

    Model.prototype.miss = function(plN1) {
      var pl1;
      pl1 = this.players[plN1];
      pl1.unsolve += 1;
      this.view.miss(plN1);
      this.addSnapshot;
      return this.view.updateUi();
    };

    Model.prototype.addPlayer = function(name) {
      this.players.push({
        name: name,
        health: 1,
        solve: 0,
        unsolve: 0,
        treatment: 0
      });
      this.addSnapshot();
      this.view.updateUi();
      return void 0;
    };

    return Model;

  })();

  View = (function() {
    function View() {}

    View.prototype.joinModel = function(model) {
      this.model = model;
    };

    View.prototype.updateUi = function() {
      return console.log("I'm update UI!");
    };

    View.prototype.updateTime = function() {
      return console.log("time: " + this.model.time);
    };

    View.prototype.hit = function() {};

    View.prototype.miss = function() {};

    return View;

  })();

  ($(document)).ready(function() {
    var model, view;
    console.log("I'm alive!");
    model = new Model();
    view = new View();
    model.joinView(view);
    view.joinModel(model);
    window.Model = Model;
    window.View = View;
    window.model = model;
    window.view = view;
    ($("#version")).text(__version__);
    model.addPlayer("test1");
    model.addPlayer("test2");
    model.addPlayer("test3");
    model.getTreat(1, 2);
    return void 0;
  });

}).call(this);

//# sourceMappingURL=core.map
