// Generated by CoffeeScript 1.8.0
(function() {
  var Snapshot, getValScope, loadByStructure, saveByStructure;

  saveByStructure = Tools.saveByStructure;

  loadByStructure = Tools.loadByStructure;

  getValScope = Tools.getValScope;

  Snapshot = (function() {
    function Snapshot(_at_structure) {
      this.structure = _at_structure;
      this.datas = [];
      this.current = -1;
      this.add();
      void 0;
    }

    Snapshot.prototype.add = function() {
      this.datas = this.datas.slice(0, this.current + 1);
      this.datas.push(saveByStructure(this.structure, true));
      return this.current += 1;
    };

    Snapshot.prototype.clear = function() {
      this.current = -1;
      this.datas = [];
      this.add();
      return void 0;
    };

    Snapshot.prototype._load = function(id) {
      if (id == null) {
        id = this.current - 1;
      }
      this.current = getValScope(id, [0, this.data.length]);
      loadByStructure(this.structure, this.datas[this.current]);
      return void 0;
    };

    Snapshot.prototype.undo = function() {
      return this._load();
    };

    Snapshot.prototype.redo = function() {
      this.current = getValScope(this.current + 1, [0, this.data.length]);
      return loadByStructure(this.structure, this.datas[this.current]);
    };

    return Snapshot;

  })();

  window.Model.Snapshot = Snapshot;

}).call(this);

//# sourceMappingURL=snapshot.js.map
