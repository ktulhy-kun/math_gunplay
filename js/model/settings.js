// Generated by CoffeeScript 1.8.0
(function() {
  define(["tools/storage"], function(storage) {
    var Settings, settingsDesc;
    settingsDesc = {
      info: {
        type: "text",
        before: "Помните: настройки обновляются <b>сразу</b>!"
      },
      wiki: {
        type: "text",
        before: "<a href='https://github.com/ktulhy-kun/math_gunplay/wiki'>Как играть</a>"
      },
      stTime: {
        type: "number",
        before: "Продолжительность дня",
        after: "мин",
        def: "20",
        help: "Если вы меняете это поле днём, то изменения вступят в силу только на <b>следующий</b> день"
      },
      maxAttack: {
        type: "number",
        before: "Максимальная атака",
        after: "%",
        def: "15"
      },
      selfDestroyAttack: {
        type: "checkbox",
        after: "Самоубийство (Атака)",
        def: true
      },
      selfDestroyTreat: {
        type: "checkbox",
        after: "Самоубийство (Лечение)",
        def: true
      },
      selfDestroyResuscitation: {
        type: "checkbox",
        after: "Самоубийство (Реанимация)",
        def: false
      },
      hospitalPlus10: {
        type: "checkbox",
        after: "Дополнительные +10 при лечении в госпитале",
        def: true
      },
      nullTreatIfTreatResuscitation: {
        type: "checkbox",
        after: "Обнуление количества лечений при лечении в реанимации",
        def: true
      },
      attackFormula: {
        type: "text",
        before: "Формула расчёта урона:<br>min (10 + Р - Н - 3 * Л, МАКСУРОН)",
        help: "Р -- кол-во решённых задач<br> Н -- кол-во нерешённых задач<br> Л -- кол-во попыток лечения<br> МАКСУРОН -- максимальный урон, см. выше"
      },
      treatFormula: {
        type: "text",
        before: "Формула расчёта лечения:<br>5 * У + Р - Н - 3 * Л - 5",
        help: "У -- кол-во решённых задач из 3-х, остальное см. выше"
      },
      github: {
        type: "text",
        before: "<a href='https://github.com/ktulhy-kun/math_gunplay'>Исходный код</a>"
      }
    };
    Settings = (function() {
      Settings.protocolVersion = 1;

      function Settings(_at__settingsDesc) {
        var k, v, _f, _ref;
        this._settingsDesc = _at__settingsDesc != null ? _at__settingsDesc : settingsDesc;
        this.datas = storage.load('settings');
        if (this.datas && this.datas.version !== this.protocolVersion) {
          this.datas = this._setDefault();
        }
        _ref = this._settingsDesc;
        for (k in _ref) {
          v = _ref[k];
          _f = (function(_this) {
            return function() {
              var _closure;
              _closure = v;
              if (_closure.def != null) {
                return _this[k] = function() {
                  return _closure.def;
                };
              }
            };
          })(this);
          _f();
        }
      }

      Settings.prototype._save = function() {
        return storage.save('settings', this.datas);
      };

      Settings.prototype._setDefault = function() {
        var k, v, _ref;
        delete this.datas;
        this.datas = {};
        _ref = this._settingsDesc;
        for (k in _ref) {
          v = _ref[k];
          if (this._settingsDesc[k].def != null) {
            this.datas[k] = v.def;
          }
        }
        return this._save();
      };

      Settings.prototype.set = function(name, value) {
        this.datas[name] = value;
        return this._save();
      };

      return Settings;

    })();
    return {
      settingsDesc: settingsDesc,
      Settings: Settings
    };
  });

}).call(this);

//# sourceMappingURL=settings.js.map
