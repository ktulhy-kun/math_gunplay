// Generated by CoffeeScript 1.8.0
(function() {
  var deepCopy, getValScope, max, min, strCopy, _Carousel;

  getValScope = function(val, scope) {
    switch (false) {
      case !(scope[0] > val):
        return scope[0];
      case !(scope[1] < val):
        return scope[1];
      default:
        return val;
    }
  };

  strCopy = function(s, n) {
    var i, res;
    res = "";
    i = 0;
    while (i < n) {
      i += 1;
      res += s;
    }
    return res;
  };

  deepCopy = function(v) {
    var property, result, value;
    result = new Object;
    for (property in v) {
      value = v[property];
      if (property[0] !== "_") {
        if (typeof value === "object") {
          result[property] = deepCopy(value);
        } else {
          result[property] = value;
        }
      }
    }
    return result;
  };

  max = function(a, b) {
    if (a > b) {
      return a;
    } else {
      return b;
    }
  };

  min = function(a, b) {
    if (a < b) {
      return a;
    } else {
      return b;
    }
  };

  _Carousel = (function() {
    function _Carousel(_at_elem) {
      this.elem = _at_elem;
    }

    _Carousel.prototype.start = function() {
      return this.elem.carousel("cycle");
    };

    _Carousel.prototype.pause = function() {
      return this.elem.carousel("pause");
    };

    _Carousel.prototype.go = function(num) {
      return this.elem.carousel(num);
    };

    _Carousel.prototype.next = function() {
      return this.elem.carousel("next");
    };

    _Carousel.prototype.prev = function() {
      return this.elem.carousel("prev");
    };

    _Carousel.prototype.hideControls = function() {
      this.elem.find(".carousel-control").fadeOut(500);
      this.elem.find(".carousel-indicators").fadeOut(500);
      return void 0;
    };

    _Carousel.prototype.showControls = function() {
      this.elem.find(".carousel-control").fadeIn(500);
      this.elem.find(".carousel-indicators").fadeIn(500);
      return void 0;
    };

    _Carousel.prototype.overflow = function(st) {
      return this.elem.css({
        "overflow": st
      });
    };

    return _Carousel;

  })();

  window.Tools.getValScope = getValScope;

  window.Tools.strCopy = strCopy;

  window.Tools.deepCopy = deepCopy;

  window._Carousel = _Carousel;

  window.Tools.max = max;

  window.Tools.min = min;

}).call(this);

//# sourceMappingURL=tools.js.map
