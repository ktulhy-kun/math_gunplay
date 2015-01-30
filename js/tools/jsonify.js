// Generated by CoffeeScript 1.8.0
(function() {
  var JSONify, deserialize, deserializeFromObject, isSerializable, serialize, serialize2object;

  window.Tools._JSONify_classes = {};

  isSerializable = function(obj) {
    return obj.serialize != null;
  };

  serialize2object = function(obj) {
    var k, res, v;
    if (isSerializable(obj)) {
      return obj._serialize();
    } else if (typeof obj === "object") {
      res = new Object();
      for (k in obj) {
        v = obj[k];
        res[k] = (function() {
          switch (isSerializable(v)) {
            case true:
              return v._serialize();
            case false:
              return serialize2object(v);
          }
        })();
      }
      return res;
    } else {
      return obj;
    }
  };

  serialize = function(obj) {
    console.info(obj);
    return JSON.stringify(serialize2object(obj));
  };

  deserializeFromObject = function(datas) {
    var k, obj, v;
    obj = null;
    if ((datas._className != null) && (datas._data != null)) {
      obj = new window.Tools._JSONify_classes[datas._className];
      obj._deserialize(datas);
    } else if (typeof datas === "object") {
      obj = new Object();
      for (k in datas) {
        v = datas[k];
        obj[k] = deserializeFromObject(v);
      }
    } else {
      obj = datas;
    }
    return obj;
  };

  deserialize = function(jsonString) {
    return deserializeFromObject(JSON.parse(jsonString));
  };

  JSONify = (function() {
    function JSONify() {
      this.JSONProperties = [];
      this.className = "JSONify";
    }

    JSONify.prototype.register = function(_class) {
      return window.Tools._JSONify_classes[this.className] = _class;
    };

    JSONify.prototype._serialize = function() {
      var prop, res, _i, _len, _ref;
      res = new Object();
      res._className = this.className;
      res._data = {};
      _ref = this.JSONProperties;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        prop = _ref[_i];
        res._data[prop] = serialize2object(this[prop]);
      }
      return res;
    };

    JSONify.prototype.serialize = function() {
      return JSON.stringify(this._serialize());
    };

    JSONify.prototype._deserialize = function(datas) {
      var prop, _i, _len, _ref;
      if ((datas._className != null) && (datas._data != null)) {
        _ref = this.JSONProperties;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          prop = _ref[_i];
          this[prop] = deserializeFromObject(datas._data[prop]);
        }
      } else {
        throw datas + " is not serialized " + this.className;
      }
      return void 0;
    };

    JSONify.prototype.deserialize = function(jsonString) {
      return this._deserialize(JSON.parse(jsonString));
    };

    return JSONify;

  })();

  window.Tools.serialize2object = serialize2object;

  window.Tools.deserializeFromObject = deserializeFromObject;

  window.Tools.serialize = serialize;

  window.Tools.deserialize = deserialize;

  window.Tools.JSONify = JSONify;

}).call(this);

//# sourceMappingURL=jsonify.js.map
