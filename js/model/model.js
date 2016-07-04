// Generated by CoffeeScript 1.10.0
(function() {
  var Model, ModelSettings, Snapshotter, restorePlayers, takeSnapshot,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  window.MODE_ADD = 1;

  window.MODE_DAY = 2;

  window.MODE_NIGHT = 3;

  takeSnapshot = function() {
    return console.log("Take Snapshot ещё не готов");
  };

  window.isMode = function(gameModes) {
    var ref;
    if (Array.isArray(gameModes)) {
      return ref = mgModelSettings.gameMode, indexOf.call(gameModes, ref) >= 0;
    } else {
      return mgModelSettings.gameMode === gameModes;
    }
  };

  window.setMode = function(gameMode, isTakeSnapshot) {
    if (isTakeSnapshot == null) {
      isTakeSnapshot = true;
    }
    console.group("Change mode to " + gameMode);
    mgModelSettings.gameMode = gameMode;
    if (isMode(MODE_DAY)) {
      mgModel.setDayTimer();
    } else {
      clearInterval(mgModelSettings.timer);
    }
    if (isTakeSnapshot) {
      takeSnapshot();
    }
    return console.groupEnd();
  };

  restorePlayers = function(players) {
    var i, len, mPlayer, player;
    console.group("Restore players");
    if (typeof mgModel === "undefined" || mgModel === null) {
      console.log("Model not found. End");
      console.groupEnd();
      return;
    }
    mgModel.players = [];
    for (i = 0, len = players.length; i < len; i++) {
      player = players[i];
      console.log("Add Player #" + player.id + ": " + player.name);
      mPlayer = new Player(player.id, player.name);
      mPlayer.apply(player);
      mgModel.players.push(mPlayer);
    }
    console.groupEnd();
  };

  ModelSettings = (function() {
    function ModelSettings() {
      this.settingsVersion = 1;
      this.savesVersion = 2;
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
      this.connectToStorage();
      this.loadSettings();
    }

    ModelSettings.prototype.connectToStorage = function() {
      this.saves = Stor.get('saves');
      if ((this.saves == null) || this.saves.version !== this.savesVersion) {
        this.saves = null;
      }
      if (this.saves === null) {
        this.saves = {
          version: this.savesVersion,
          ids: {}
        };
      }
      Stor.set('saves', this.saves);
    };

    ModelSettings.prototype.findId = function() {
      var id;
      id = 1853;
      while (id in this.saves.ids) {
        id = Math.floor(Math.random() * 100000000000000000);
      }
      return id;
    };

    ModelSettings.prototype.writeSave = function(name) {
      var id, now;
      now = new Date();
      id = this.findId();
      console.log("Write new save " + id + ": " + name);
      this.saves.ids[id] = name;
      Stor.set('saves', this.saves);
      Stor.set(id, {
        settings: {
          maxAttack: this.maxAttack,
          selfDestroyAttack: this.selfDestroyAttack,
          selfDestroyTreat: this.selfDestroyTreat,
          selfDestroyResuscitation: this.selfDestroyResuscitation,
          hospitalPlus: this.hospitalPlus,
          nullResus: this.nullResus,
          dayTime: this.dayTime
        },
        players: mgModel.players,
        date: now
      });
    };

    ModelSettings.prototype.deleteSave = function(id) {
      console.log("Write save " + id);
      delete this.saves.ids[id];
      Stor.set('saves', this.saves);
      Stor.remove(id);
    };

    ModelSettings.prototype.loadSave = function(id) {
      var save;
      console.group("loadSave");
      save = Stor.get(id);
      this.maxAttack = save.settings.maxAttack;
      this.selfDestroyAttack = save.settings.selfDestroyAttack;
      this.selfDestroyTreat = save.settings.selfDestroyTreat;
      this.selfDestroyResuscitation = save.settings.selfDestroyResuscitation;
      this.hospitalPlus = save.settings.hospitalPlus;
      this.nullResus = save.settings.nullResus;
      this.dayTime = save.settings.dayTime;
      setMode(MODE_NIGHT, false);
      this.time = 0;
      clearInterval(this.timer);
      restorePlayers(save.players);
      console.groupEnd();
    };

    ModelSettings.prototype.saveSettings = function() {
      Stor.set('settings', {
        version: this.settingsVersion,
        maxAttack: this.maxAttack,
        selfDestroyAttack: this.selfDestroyAttack,
        selfDestroyTreat: this.selfDestroyTreat,
        selfDestroyResuscitation: this.selfDestroyResuscitation,
        hospitalPlus: this.hospitalPlus,
        nullResus: this.nullResus,
        dayTime: this.dayTime
      });
    };

    ModelSettings.prototype.loadSettings = function() {
      var _sett;
      _sett = Stor.get('settings');
      if ((_sett == null) || _sett.version !== this.settingsVersion) {
        this.saveSettings();
      }
      this.maxAttack = _sett.maxAttack;
      this.selfDestroyAttack = _sett.selfDestroyAttack;
      this.selfDestroyTreat = _sett.selfDestroyTreat;
      this.selfDestroyResuscitation = _sett.selfDestroyResuscitation;
      this.hospitalPlus = _sett.hospitalPlus;
      this.nullResus = _sett.nullResus;
      this.dayTime = _sett.dayTime;
    };

    return ModelSettings;

  })();

  window.mgModelSettings = new ModelSettings();

  Model = (function() {
    function Model() {
      this.players = [];
      return;
    }

    Model.prototype.addPlayer = function(name) {
      this.players.push(new Player(this.players.length, name));
      takeSnapshot();
    };

    Model.prototype.getPlayer = function(id) {
      return this.players[id];
    };

    Model.prototype.hit = function(fromId, toId) {
      var attackValue, newLife, playerFrom, playerTo;
      playerFrom = this.getPlayer(fromId);
      playerTo = this.getPlayer(toId);
      attackValue = playerFrom.getAttackValue();
      playerFrom.solved += 1;
      if ((playerTo.health === 0) || (playerFrom.getLevel() !== playerTo.getLevel())) {
        takeSnapshot();
        return 0;
      }
      if (fromId === toId) {
        if (playerFrom.level === RESUSCITATION) {
          if (mgModelSettings.selfDestroyResuscitation) {
            takeSnapshot();
            return 0;
          }
        }
        if (!mgModelSettings.selfDestroyAttack) {
          takeSnapshot();
          return 0;
        }
      }
      newLife = playerTo.dHealth(-attackValue);
      takeSnapshot();
      return newLife;
    };

    Model.prototype.miss = function(plId) {
      var player;
      player = this.getPlayer(plId);
      player.unsolved += 1;
      takeSnapshot();
      return 0;
    };

    Model.prototype.treat = function(plId, correct) {
      var newLife, player, value;
      player = this.getPlayer(plId);
      value = player.getTreatValue(correct);
      player.solved += 1 * correct;
      player.unsolved += 3 - 1 * correct;
      if ((player.getLevel() === RESUSCITATION) && mgModelSettings.nullResus) {
        player.treatment = 0;
      } else {
        player.treatment += 1;
      }
      newLife = player.dHealth(value);
      takeSnapshot();
      return newLife;
    };

    Model.prototype.penalty = function(plId) {
      var player;
      player = this.getPlayer(plId);
      player.addPenalty();
      return takeSnapshot();
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

  Snapshotter = (function() {
    function Snapshotter() {
      this.loadSnapshot();
    }

    Snapshotter.prototype.saveSnapshot = function() {
      var _id, i, id, ref, ref1, snapshots;
      console.group("Saving Snapshot");
      snapshots = Stor.get('snapshots');
      id = snapshots.currentId += 1;
      snapshots.maxId = Math.max(id, snapshots.maxId);
      for (_id = i = ref = id, ref1 = snapshots.maxId; ref <= ref1 ? i <= ref1 : i >= ref1; _id = ref <= ref1 ? ++i : --i) {
        Stor.remove("snap_" + _id);
      }
      Stor.set("snap_" + id, {
        players: typeof mgModel !== "undefined" && mgModel !== null ? mgModel.players : [],
        gameMode: mgModelSettings.gameMode
      });
      Stor.set("snapshots", snapshots);
      console.groupEnd();
    };

    Snapshotter.prototype.loadSnapshot = function() {
      var snapshot, snapshots;
      console.group("Load Snapshot");
      snapshots = Stor.get('snapshots');
      if ((snapshots == null) || snapshots.maxId === -1) {
        console.log("Create new game");
        Stor.set('snapshots', {
          currentId: -1,
          maxId: -1
        });
        this.saveSnapshot();
        snapshots = Stor.get('snapshots');
      }
      snapshot = Stor.get("snap_" + snapshots.currentId);
      Stor.set('snapshots', snapshots);
      restorePlayers(snapshot.players);
      setMode(snapshot.gameMode, false);
      return console.groupEnd();
    };

    Snapshotter.prototype.prevSnapshot = function() {
      var snapshots;
      console.group("Take previous snapshot");
      snapshots = Stor.get('snapshots');
      if (this.isPrev()) {
        snapshots.currentId -= 1;
      }
      Stor.set('snapshots', snapshots);
      this.loadSnapshot();
      return console.groupEnd();
    };

    Snapshotter.prototype.nextSnapshot = function() {
      var snapshots;
      console.group("Take next snapshot");
      snapshots = Stor.get('snapshots');
      if (this.isNext()) {
        snapshots.currentId += 1;
      }
      Stor.set('snapshots', snapshots);
      this.loadSnapshot();
      return console.groupEnd();
    };

    Snapshotter.prototype.removeSnapshots = function() {
      var i, id, ref, snapshots;
      console.group("NEW GAME");
      snapshots = Stor.get('snapshots');
      for (id = i = 0, ref = snapshots.maxId; 0 <= ref ? i <= ref : i >= ref; id = 0 <= ref ? ++i : --i) {
        Stor.remove("snap_" + id);
      }
      Stor.remove('snapshots');
      mgModel.players = [];
      this.loadSnapshot();
      return console.groupEnd();
    };

    Snapshotter.prototype.isPrev = function() {
      var snapshots;
      snapshots = Stor.get('snapshots');
      return (snapshots != null) && snapshots.currentId !== 0;
    };

    Snapshotter.prototype.isNext = function() {
      var snapshots;
      snapshots = Stor.get('snapshots');
      return (snapshots != null) && snapshots.currentId !== snapshots.maxId;
    };

    return Snapshotter;

  })();

  window.snapshotter = new Snapshotter();

  takeSnapshot = snapshotter.saveSnapshot;

}).call(this);

//# sourceMappingURL=model.js.map
