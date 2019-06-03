webpackJsonp([0],{

/***/ 106:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__core_util__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Element__ = __webpack_require__(357);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__core_BoundingRect__ = __webpack_require__(81);
/**
 * Group是一个容器，可以插入子节点，Group的变换也会被应用到子节点上
 * @module zrender/graphic/Group
 * @example
 *     var Group = require('zrender/container/Group');
 *     var Circle = require('zrender/graphic/shape/Circle');
 *     var g = new Group();
 *     g.position[0] = 100;
 *     g.position[1] = 100;
 *     g.add(new Circle({
 *         style: {
 *             x: 100,
 *             y: 100,
 *             r: 20,
 *         }
 *     }));
 *     zr.add(g);
 */





/**
 * @alias module:zrender/graphic/Group
 * @constructor
 * @extends module:zrender/mixin/Transformable
 * @extends module:zrender/mixin/Eventful
 */
var Group = function (opts) {

    opts = opts || {};

    __WEBPACK_IMPORTED_MODULE_1__Element__["a" /* default */].call(this, opts);

    for (var key in opts) {
        if (opts.hasOwnProperty(key)) {
            this[key] = opts[key];
        }
    }

    this._children = [];

    this.__storage = null;

    this.__dirty = true;
};

Group.prototype = {

    constructor: Group,

    isGroup: true,

    /**
     * @type {string}
     */
    type: 'group',

    /**
     * 所有子孙元素是否响应鼠标事件
     * @name module:/zrender/container/Group#silent
     * @type {boolean}
     * @default false
     */
    silent: false,

    /**
     * @return {Array.<module:zrender/Element>}
     */
    children: function () {
        return this._children.slice();
    },

    /**
     * 获取指定 index 的儿子节点
     * @param  {number} idx
     * @return {module:zrender/Element}
     */
    childAt: function (idx) {
        return this._children[idx];
    },

    /**
     * 获取指定名字的儿子节点
     * @param  {string} name
     * @return {module:zrender/Element}
     */
    childOfName: function (name) {
        var children = this._children;
        for (var i = 0; i < children.length; i++) {
            if (children[i].name === name) {
                return children[i];
            }
            }
    },

    /**
     * @return {number}
     */
    childCount: function () {
        return this._children.length;
    },

    /**
     * 添加子节点到最后
     * @param {module:zrender/Element} child
     */
    add: function (child) {
        if (child && child !== this && child.parent !== this) {

            this._children.push(child);

            this._doAdd(child);
        }

        return this;
    },

    /**
     * 添加子节点在 nextSibling 之前
     * @param {module:zrender/Element} child
     * @param {module:zrender/Element} nextSibling
     */
    addBefore: function (child, nextSibling) {
        if (child && child !== this && child.parent !== this
            && nextSibling && nextSibling.parent === this) {

            var children = this._children;
            var idx = children.indexOf(nextSibling);

            if (idx >= 0) {
                children.splice(idx, 0, child);
                this._doAdd(child);
            }
        }

        return this;
    },

    _doAdd: function (child) {
        if (child.parent) {
            child.parent.remove(child);
        }

        child.parent = this;

        var storage = this.__storage;
        var zr = this.__zr;
        if (storage && storage !== child.__storage) {

            storage.addToStorage(child);

            if (child instanceof Group) {
                child.addChildrenToStorage(storage);
            }
        }

        zr && zr.refresh();
    },

    /**
     * 移除子节点
     * @param {module:zrender/Element} child
     */
    remove: function (child) {
        var zr = this.__zr;
        var storage = this.__storage;
        var children = this._children;

        var idx = __WEBPACK_IMPORTED_MODULE_0__core_util__["c" /* indexOf */](children, child);
        if (idx < 0) {
            return this;
        }
        children.splice(idx, 1);

        child.parent = null;

        if (storage) {

            storage.delFromStorage(child);

            if (child instanceof Group) {
                child.delChildrenFromStorage(storage);
            }
        }

        zr && zr.refresh();

        return this;
    },

    /**
     * 移除所有子节点
     */
    removeAll: function () {
        var children = this._children;
        var storage = this.__storage;
        var child;
        var i;
        for (i = 0; i < children.length; i++) {
            child = children[i];
            if (storage) {
                storage.delFromStorage(child);
                if (child instanceof Group) {
                    child.delChildrenFromStorage(storage);
                }
            }
            child.parent = null;
        }
        children.length = 0;

        return this;
    },

    /**
     * 遍历所有子节点
     * @param  {Function} cb
     * @param  {}   context
     */
    eachChild: function (cb, context) {
        var children = this._children;
        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            cb.call(context, child, i);
        }
        return this;
    },

    /**
     * 深度优先遍历所有子孙节点
     * @param  {Function} cb
     * @param  {}   context
     */
    traverse: function (cb, context) {
        for (var i = 0; i < this._children.length; i++) {
            var child = this._children[i];
            cb.call(context, child);

            if (child.type === 'group') {
                child.traverse(cb, context);
            }
        }
        return this;
    },

    addChildrenToStorage: function (storage) {
        for (var i = 0; i < this._children.length; i++) {
            var child = this._children[i];
            storage.addToStorage(child);
            if (child instanceof Group) {
                child.addChildrenToStorage(storage);
            }
        }
    },

    delChildrenFromStorage: function (storage) {
        for (var i = 0; i < this._children.length; i++) {
            var child = this._children[i];
            storage.delFromStorage(child);
            if (child instanceof Group) {
                child.delChildrenFromStorage(storage);
            }
        }
    },

    dirty: function () {
        this.__dirty = true;
        this.__zr && this.__zr.refresh();
        return this;
    },

    /**
     * @return {module:zrender/core/BoundingRect}
     */
    getBoundingRect: function (includeChildren) {
        // TODO Caching
        var rect = null;
        var tmpRect = new __WEBPACK_IMPORTED_MODULE_2__core_BoundingRect__["a" /* default */](0, 0, 0, 0);
        var children = includeChildren || this._children;
        var tmpMat = [];

        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            if (child.ignore || child.invisible) {
                continue;
            }

            var childRect = child.getBoundingRect();
            var transform = child.getLocalTransform(tmpMat);
            // TODO
            // The boundingRect cacluated by transforming original
            // rect may be bigger than the actual bundingRect when rotation
            // is used. (Consider a circle rotated aginst its center, where
            // the actual boundingRect should be the same as that not be
            // rotated.) But we can not find better approach to calculate
            // actual boundingRect yet, considering performance.
            if (transform) {
                tmpRect.copy(childRect);
                tmpRect.applyTransform(transform);
                rect = rect || tmpRect.clone();
                rect.union(tmpRect);
            }
            else {
                rect = rect || childRect.clone();
                rect.union(childRect);
            }
        }
        return rect || tmpRect;
    }
};

__WEBPACK_IMPORTED_MODULE_0__core_util__["a" /* inherits */](Group, __WEBPACK_IMPORTED_MODULE_1__Element__["a" /* default */]);

/* harmony default export */ __webpack_exports__["default"] = (Group);

/***/ }),

/***/ 107:
/***/ (function(module, exports) {


module.exports = function(a, b){
  var fn = function(){};
  fn.prototype = b.prototype;
  a.prototype = new fn;
  a.prototype.constructor = a;
};

/***/ }),

/***/ 127:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {/**
 * This is the web browser implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = __webpack_require__(692);
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = 'undefined' != typeof chrome
               && 'undefined' != typeof chrome.storage
                  ? chrome.storage.local
                  : localstorage();

/**
 * Colors.
 */

exports.colors = [
  '#0000CC', '#0000FF', '#0033CC', '#0033FF', '#0066CC', '#0066FF', '#0099CC',
  '#0099FF', '#00CC00', '#00CC33', '#00CC66', '#00CC99', '#00CCCC', '#00CCFF',
  '#3300CC', '#3300FF', '#3333CC', '#3333FF', '#3366CC', '#3366FF', '#3399CC',
  '#3399FF', '#33CC00', '#33CC33', '#33CC66', '#33CC99', '#33CCCC', '#33CCFF',
  '#6600CC', '#6600FF', '#6633CC', '#6633FF', '#66CC00', '#66CC33', '#9900CC',
  '#9900FF', '#9933CC', '#9933FF', '#99CC00', '#99CC33', '#CC0000', '#CC0033',
  '#CC0066', '#CC0099', '#CC00CC', '#CC00FF', '#CC3300', '#CC3333', '#CC3366',
  '#CC3399', '#CC33CC', '#CC33FF', '#CC6600', '#CC6633', '#CC9900', '#CC9933',
  '#CCCC00', '#CCCC33', '#FF0000', '#FF0033', '#FF0066', '#FF0099', '#FF00CC',
  '#FF00FF', '#FF3300', '#FF3333', '#FF3366', '#FF3399', '#FF33CC', '#FF33FF',
  '#FF6600', '#FF6633', '#FF9900', '#FF9933', '#FFCC00', '#FFCC33'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

function useColors() {
  // NB: In an Electron preload script, document will be defined but not fully
  // initialized. Since we know we're in Chrome, we'll just detect this case
  // explicitly
  if (typeof window !== 'undefined' && window.process && window.process.type === 'renderer') {
    return true;
  }

  // Internet Explorer and Edge do not support colors.
  if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
    return false;
  }

  // is webkit? http://stackoverflow.com/a/16459606/376773
  // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
  return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
    // is firebug? http://stackoverflow.com/a/398120/376773
    (typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
    // is firefox >= v31?
    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
    // double check webkit in userAgent just in case we are in a worker
    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
}

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

exports.formatters.j = function(v) {
  try {
    return JSON.stringify(v);
  } catch (err) {
    return '[UnexpectedJSONParseError]: ' + err.message;
  }
};


/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs(args) {
  var useColors = this.useColors;

  args[0] = (useColors ? '%c' : '')
    + this.namespace
    + (useColors ? ' %c' : ' ')
    + args[0]
    + (useColors ? '%c ' : ' ')
    + '+' + exports.humanize(this.diff);

  if (!useColors) return;

  var c = 'color: ' + this.color;
  args.splice(1, 0, c, 'color: inherit')

  // the final "%c" is somewhat tricky, because there could be other
  // arguments passed either before or after the %c, so we need to
  // figure out the correct index to insert the CSS into
  var index = 0;
  var lastC = 0;
  args[0].replace(/%[a-zA-Z%]/g, function(match) {
    if ('%%' === match) return;
    index++;
    if ('%c' === match) {
      // we only are interested in the *last* %c
      // (the user may have provided their own)
      lastC = index;
    }
  });

  args.splice(lastC, 0, c);
}

/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */

function log() {
  // this hackery is required for IE8/9, where
  // the `console.log` function doesn't have 'apply'
  return 'object' === typeof console
    && console.log
    && Function.prototype.apply.call(console.log, console, arguments);
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */

function save(namespaces) {
  try {
    if (null == namespaces) {
      exports.storage.removeItem('debug');
    } else {
      exports.storage.debug = namespaces;
    }
  } catch(e) {}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
  var r;
  try {
    r = exports.storage.debug;
  } catch(e) {}

  // If debug isn't set in LS, and we're in Electron, try to load $DEBUG
  if (!r && typeof process !== 'undefined' && 'env' in process) {
    r = process.env.DEBUG;
  }

  return r;
}

/**
 * Enable namespaces listed in `localStorage.debug` initially.
 */

exports.enable(load());

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage() {
  try {
    return window.localStorage;
  } catch (e) {}
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ }),

/***/ 129:
/***/ (function(module, exports) {

/**
 * Compiles a querystring
 * Returns string representation of the object
 *
 * @param {Object}
 * @api private
 */

exports.encode = function (obj) {
  var str = '';

  for (var i in obj) {
    if (obj.hasOwnProperty(i)) {
      if (str.length) str += '&';
      str += encodeURIComponent(i) + '=' + encodeURIComponent(obj[i]);
    }
  }

  return str;
};

/**
 * Parses a simple querystring into an object
 *
 * @param {String} qs
 * @api private
 */

exports.decode = function(qs){
  var qry = {};
  var pairs = qs.split('&');
  for (var i = 0, l = pairs.length; i < l; i++) {
    var pair = pairs[i].split('=');
    qry[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
  }
  return qry;
};


/***/ }),

/***/ 137:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {/**
 * This is the web browser implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = __webpack_require__(813);
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = 'undefined' != typeof chrome
               && 'undefined' != typeof chrome.storage
                  ? chrome.storage.local
                  : localstorage();

/**
 * Colors.
 */

exports.colors = [
  '#0000CC', '#0000FF', '#0033CC', '#0033FF', '#0066CC', '#0066FF', '#0099CC',
  '#0099FF', '#00CC00', '#00CC33', '#00CC66', '#00CC99', '#00CCCC', '#00CCFF',
  '#3300CC', '#3300FF', '#3333CC', '#3333FF', '#3366CC', '#3366FF', '#3399CC',
  '#3399FF', '#33CC00', '#33CC33', '#33CC66', '#33CC99', '#33CCCC', '#33CCFF',
  '#6600CC', '#6600FF', '#6633CC', '#6633FF', '#66CC00', '#66CC33', '#9900CC',
  '#9900FF', '#9933CC', '#9933FF', '#99CC00', '#99CC33', '#CC0000', '#CC0033',
  '#CC0066', '#CC0099', '#CC00CC', '#CC00FF', '#CC3300', '#CC3333', '#CC3366',
  '#CC3399', '#CC33CC', '#CC33FF', '#CC6600', '#CC6633', '#CC9900', '#CC9933',
  '#CCCC00', '#CCCC33', '#FF0000', '#FF0033', '#FF0066', '#FF0099', '#FF00CC',
  '#FF00FF', '#FF3300', '#FF3333', '#FF3366', '#FF3399', '#FF33CC', '#FF33FF',
  '#FF6600', '#FF6633', '#FF9900', '#FF9933', '#FFCC00', '#FFCC33'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

function useColors() {
  // NB: In an Electron preload script, document will be defined but not fully
  // initialized. Since we know we're in Chrome, we'll just detect this case
  // explicitly
  if (typeof window !== 'undefined' && window.process && window.process.type === 'renderer') {
    return true;
  }

  // Internet Explorer and Edge do not support colors.
  if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
    return false;
  }

  // is webkit? http://stackoverflow.com/a/16459606/376773
  // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
  return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
    // is firebug? http://stackoverflow.com/a/398120/376773
    (typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
    // is firefox >= v31?
    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
    // double check webkit in userAgent just in case we are in a worker
    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
}

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

exports.formatters.j = function(v) {
  try {
    return JSON.stringify(v);
  } catch (err) {
    return '[UnexpectedJSONParseError]: ' + err.message;
  }
};


/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs(args) {
  var useColors = this.useColors;

  args[0] = (useColors ? '%c' : '')
    + this.namespace
    + (useColors ? ' %c' : ' ')
    + args[0]
    + (useColors ? '%c ' : ' ')
    + '+' + exports.humanize(this.diff);

  if (!useColors) return;

  var c = 'color: ' + this.color;
  args.splice(1, 0, c, 'color: inherit')

  // the final "%c" is somewhat tricky, because there could be other
  // arguments passed either before or after the %c, so we need to
  // figure out the correct index to insert the CSS into
  var index = 0;
  var lastC = 0;
  args[0].replace(/%[a-zA-Z%]/g, function(match) {
    if ('%%' === match) return;
    index++;
    if ('%c' === match) {
      // we only are interested in the *last* %c
      // (the user may have provided their own)
      lastC = index;
    }
  });

  args.splice(lastC, 0, c);
}

/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */

function log() {
  // this hackery is required for IE8/9, where
  // the `console.log` function doesn't have 'apply'
  return 'object' === typeof console
    && console.log
    && Function.prototype.apply.call(console.log, console, arguments);
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */

function save(namespaces) {
  try {
    if (null == namespaces) {
      exports.storage.removeItem('debug');
    } else {
      exports.storage.debug = namespaces;
    }
  } catch(e) {}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
  var r;
  try {
    r = exports.storage.debug;
  } catch(e) {}

  // If debug isn't set in LS, and we're in Electron, try to load $DEBUG
  if (!r && typeof process !== 'undefined' && 'env' in process) {
    r = process.env.DEBUG;
  }

  return r;
}

/**
 * Enable namespaces listed in `localStorage.debug` initially.
 */

exports.enable(load());

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage() {
  try {
    return window.localStorage;
  } catch (e) {}
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ }),

/***/ 144:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return debugMode; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return devicePixelRatio; });
var dpr = 1;

// If in browser environment
if (typeof window !== 'undefined') {
    dpr = Math.max(window.devicePixelRatio || 1, 1);
}

/**
 * config默认配置项
 * @exports zrender/config
 * @author Kener (@Kener-林峰, kener.linfeng@gmail.com)
 */

/**
 * debug日志选项：catchBrushException为true下有效
 * 0 : 不生成debug数据，发布用
 * 1 : 异常抛出，调试用
 * 2 : 控制台输出，调试用
 */
var debugMode = 0;

// retina 屏幕优化
var devicePixelRatio = dpr;


/***/ }),

/***/ 145:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__curve__ = __webpack_require__(82);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__vector__ = __webpack_require__(50);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__bbox__ = __webpack_require__(886);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__BoundingRect__ = __webpack_require__(81);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__config__ = __webpack_require__(144);
/**
 * Path 代理，可以在`buildPath`中用于替代`ctx`, 会保存每个path操作的命令到pathCommands属性中
 * 可以用于 isInsidePath 判断以及获取boundingRect
 *
 * @module zrender/core/PathProxy
 * @author Yi Shen (http://www.github.com/pissang)
 */

// TODO getTotalLength, getPointAtLength







var CMD = {
    M: 1,
    L: 2,
    C: 3,
    Q: 4,
    A: 5,
    Z: 6,
    // Rect
    R: 7
};

// var CMD_MEM_SIZE = {
//     M: 3,
//     L: 3,
//     C: 7,
//     Q: 5,
//     A: 9,
//     R: 5,
//     Z: 1
// };

var min = [];
var max = [];
var min2 = [];
var max2 = [];
var mathMin = Math.min;
var mathMax = Math.max;
var mathCos = Math.cos;
var mathSin = Math.sin;
var mathSqrt = Math.sqrt;
var mathAbs = Math.abs;

var hasTypedArray = typeof Float32Array != 'undefined';

/**
 * @alias module:zrender/core/PathProxy
 * @constructor
 */
var PathProxy = function (notSaveData) {

    this._saveData = !(notSaveData || false);

    if (this._saveData) {
        /**
         * Path data. Stored as flat array
         * @type {Array.<Object>}
         */
        this.data = [];
    }

    this._ctx = null;
};

/**
 * 快速计算Path包围盒（并不是最小包围盒）
 * @return {Object}
 */
PathProxy.prototype = {

    constructor: PathProxy,

    _xi: 0,
    _yi: 0,

    _x0: 0,
    _y0: 0,
    // Unit x, Unit y. Provide for avoiding drawing that too short line segment
    _ux: 0,
    _uy: 0,

    _len: 0,

    _lineDash: null,

    _dashOffset: 0,

    _dashIdx: 0,

    _dashSum: 0,

    /**
     * @readOnly
     */
    setScale: function (sx, sy) {
        this._ux = mathAbs(1 / __WEBPACK_IMPORTED_MODULE_4__config__["b" /* devicePixelRatio */] / sx) || 0;
        this._uy = mathAbs(1 / __WEBPACK_IMPORTED_MODULE_4__config__["b" /* devicePixelRatio */] / sy) || 0;
    },

    getContext: function () {
        return this._ctx;
    },

    /**
     * @param  {CanvasRenderingContext2D} ctx
     * @return {module:zrender/core/PathProxy}
     */
    beginPath: function (ctx) {

        this._ctx = ctx;

        ctx && ctx.beginPath();

        ctx && (this.dpr = ctx.dpr);

        // Reset
        if (this._saveData) {
            this._len = 0;
        }

        if (this._lineDash) {
            this._lineDash = null;

            this._dashOffset = 0;
        }

        return this;
    },

    /**
     * @param  {number} x
     * @param  {number} y
     * @return {module:zrender/core/PathProxy}
     */
    moveTo: function (x, y) {
        this.addData(CMD.M, x, y);
        this._ctx && this._ctx.moveTo(x, y);

        // x0, y0, xi, yi 是记录在 _dashedXXXXTo 方法中使用
        // xi, yi 记录当前点, x0, y0 在 closePath 的时候回到起始点。
        // 有可能在 beginPath 之后直接调用 lineTo，这时候 x0, y0 需要
        // 在 lineTo 方法中记录，这里先不考虑这种情况，dashed line 也只在 IE10- 中不支持
        this._x0 = x;
        this._y0 = y;

        this._xi = x;
        this._yi = y;

        return this;
    },

    /**
     * @param  {number} x
     * @param  {number} y
     * @return {module:zrender/core/PathProxy}
     */
    lineTo: function (x, y) {
        var exceedUnit = mathAbs(x - this._xi) > this._ux
            || mathAbs(y - this._yi) > this._uy
            // Force draw the first segment
            || this._len < 5;

        this.addData(CMD.L, x, y);

        if (this._ctx && exceedUnit) {
            this._needsDash() ? this._dashedLineTo(x, y)
                : this._ctx.lineTo(x, y);
        }
        if (exceedUnit) {
            this._xi = x;
            this._yi = y;
        }

        return this;
    },

    /**
     * @param  {number} x1
     * @param  {number} y1
     * @param  {number} x2
     * @param  {number} y2
     * @param  {number} x3
     * @param  {number} y3
     * @return {module:zrender/core/PathProxy}
     */
    bezierCurveTo: function (x1, y1, x2, y2, x3, y3) {
        this.addData(CMD.C, x1, y1, x2, y2, x3, y3);
        if (this._ctx) {
            this._needsDash() ? this._dashedBezierTo(x1, y1, x2, y2, x3, y3)
                : this._ctx.bezierCurveTo(x1, y1, x2, y2, x3, y3);
        }
        this._xi = x3;
        this._yi = y3;
        return this;
    },

    /**
     * @param  {number} x1
     * @param  {number} y1
     * @param  {number} x2
     * @param  {number} y2
     * @return {module:zrender/core/PathProxy}
     */
    quadraticCurveTo: function (x1, y1, x2, y2) {
        this.addData(CMD.Q, x1, y1, x2, y2);
        if (this._ctx) {
            this._needsDash() ? this._dashedQuadraticTo(x1, y1, x2, y2)
                : this._ctx.quadraticCurveTo(x1, y1, x2, y2);
        }
        this._xi = x2;
        this._yi = y2;
        return this;
    },

    /**
     * @param  {number} cx
     * @param  {number} cy
     * @param  {number} r
     * @param  {number} startAngle
     * @param  {number} endAngle
     * @param  {boolean} anticlockwise
     * @return {module:zrender/core/PathProxy}
     */
    arc: function (cx, cy, r, startAngle, endAngle, anticlockwise) {
        this.addData(
            CMD.A, cx, cy, r, r, startAngle, endAngle - startAngle, 0, anticlockwise ? 0 : 1
        );
        this._ctx && this._ctx.arc(cx, cy, r, startAngle, endAngle, anticlockwise);

        this._xi = mathCos(endAngle) * r + cx;
        this._yi = mathSin(endAngle) * r + cx;
        return this;
    },

    // TODO
    arcTo: function (x1, y1, x2, y2, radius) {
        if (this._ctx) {
            this._ctx.arcTo(x1, y1, x2, y2, radius);
        }
        return this;
    },

    // TODO
    rect: function (x, y, w, h) {
        this._ctx && this._ctx.rect(x, y, w, h);
        this.addData(CMD.R, x, y, w, h);
        return this;
    },

    /**
     * @return {module:zrender/core/PathProxy}
     */
    closePath: function () {
        this.addData(CMD.Z);

        var ctx = this._ctx;
        var x0 = this._x0;
        var y0 = this._y0;
        if (ctx) {
            this._needsDash() && this._dashedLineTo(x0, y0);
            ctx.closePath();
        }

        this._xi = x0;
        this._yi = y0;
        return this;
    },

    /**
     * Context 从外部传入，因为有可能是 rebuildPath 完之后再 fill。
     * stroke 同样
     * @param {CanvasRenderingContext2D} ctx
     * @return {module:zrender/core/PathProxy}
     */
    fill: function (ctx) {
        ctx && ctx.fill();
        this.toStatic();
    },

    /**
     * @param {CanvasRenderingContext2D} ctx
     * @return {module:zrender/core/PathProxy}
     */
    stroke: function (ctx) {
        ctx && ctx.stroke();
        this.toStatic();
    },

    /**
     * 必须在其它绘制命令前调用
     * Must be invoked before all other path drawing methods
     * @return {module:zrender/core/PathProxy}
     */
    setLineDash: function (lineDash) {
        if (lineDash instanceof Array) {
            this._lineDash = lineDash;

            this._dashIdx = 0;

            var lineDashSum = 0;
            for (var i = 0; i < lineDash.length; i++) {
                lineDashSum += lineDash[i];
            }
            this._dashSum = lineDashSum;
        }
        return this;
    },

    /**
     * 必须在其它绘制命令前调用
     * Must be invoked before all other path drawing methods
     * @return {module:zrender/core/PathProxy}
     */
    setLineDashOffset: function (offset) {
        this._dashOffset = offset;
        return this;
    },

    /**
     *
     * @return {boolean}
     */
    len: function () {
        return this._len;
    },

    /**
     * 直接设置 Path 数据
     */
    setData: function (data) {

        var len = data.length;

        if (! (this.data && this.data.length == len) && hasTypedArray) {
            this.data = new Float32Array(len);
        }

        for (var i = 0; i < len; i++) {
            this.data[i] = data[i];
        }

        this._len = len;
    },

    /**
     * 添加子路径
     * @param {module:zrender/core/PathProxy|Array.<module:zrender/core/PathProxy>} path
     */
    appendPath: function (path) {
        if (!(path instanceof Array)) {
            path = [path];
        }
        var len = path.length;
        var appendSize = 0;
        var offset = this._len;
        for (var i = 0; i < len; i++) {
            appendSize += path[i].len();
        }
        if (hasTypedArray && (this.data instanceof Float32Array)) {
            this.data = new Float32Array(offset + appendSize);
        }
        for (var i = 0; i < len; i++) {
            var appendPathData = path[i].data;
            for (var k = 0; k < appendPathData.length; k++) {
                this.data[offset++] = appendPathData[k];
            }
        }
        this._len = offset;
    },

    /**
     * 填充 Path 数据。
     * 尽量复用而不申明新的数组。大部分图形重绘的指令数据长度都是不变的。
     */
    addData: function (cmd) {
        if (!this._saveData) {
            return;
        }

        var data = this.data;
        if (this._len + arguments.length > data.length) {
            // 因为之前的数组已经转换成静态的 Float32Array
            // 所以不够用时需要扩展一个新的动态数组
            this._expandData();
            data = this.data;
        }
        for (var i = 0; i < arguments.length; i++) {
            data[this._len++] = arguments[i];
        }

        this._prevCmd = cmd;
    },

    _expandData: function () {
        // Only if data is Float32Array
        if (!(this.data instanceof Array)) {
            var newData = [];
            for (var i = 0; i < this._len; i++) {
                newData[i] = this.data[i];
            }
            this.data = newData;
        }
    },

    /**
     * If needs js implemented dashed line
     * @return {boolean}
     * @private
     */
    _needsDash: function () {
        return this._lineDash;
    },

    _dashedLineTo: function (x1, y1) {
        var dashSum = this._dashSum;
        var offset = this._dashOffset;
        var lineDash = this._lineDash;
        var ctx = this._ctx;

        var x0 = this._xi;
        var y0 = this._yi;
        var dx = x1 - x0;
        var dy = y1 - y0;
        var dist = mathSqrt(dx * dx + dy * dy);
        var x = x0;
        var y = y0;
        var dash;
        var nDash = lineDash.length;
        var idx;
        dx /= dist;
        dy /= dist;

        if (offset < 0) {
            // Convert to positive offset
            offset = dashSum + offset;
        }
        offset %= dashSum;
        x -= offset * dx;
        y -= offset * dy;

        while ((dx > 0 && x <= x1) || (dx < 0 && x >= x1)
        || (dx == 0 && ((dy > 0 && y <= y1) || (dy < 0 && y >= y1)))) {
            idx = this._dashIdx;
            dash = lineDash[idx];
            x += dx * dash;
            y += dy * dash;
            this._dashIdx = (idx + 1) % nDash;
            // Skip positive offset
            if ((dx > 0 && x < x0) || (dx < 0 && x > x0) || (dy > 0 && y < y0) || (dy < 0 && y > y0)) {
                continue;
            }
            ctx[idx % 2 ? 'moveTo' : 'lineTo'](
                dx >= 0 ? mathMin(x, x1) : mathMax(x, x1),
                dy >= 0 ? mathMin(y, y1) : mathMax(y, y1)
            );
        }
        // Offset for next lineTo
        dx = x - x1;
        dy = y - y1;
        this._dashOffset = -mathSqrt(dx * dx + dy * dy);
    },

    // Not accurate dashed line to
    _dashedBezierTo: function (x1, y1, x2, y2, x3, y3) {
        var dashSum = this._dashSum;
        var offset = this._dashOffset;
        var lineDash = this._lineDash;
        var ctx = this._ctx;

        var x0 = this._xi;
        var y0 = this._yi;
        var t;
        var dx;
        var dy;
        var cubicAt = __WEBPACK_IMPORTED_MODULE_0__curve__["b" /* cubicAt */];
        var bezierLen = 0;
        var idx = this._dashIdx;
        var nDash = lineDash.length;

        var x;
        var y;

        var tmpLen = 0;

        if (offset < 0) {
            // Convert to positive offset
            offset = dashSum + offset;
        }
        offset %= dashSum;
        // Bezier approx length
        for (t = 0; t < 1; t += 0.1) {
            dx = cubicAt(x0, x1, x2, x3, t + 0.1)
                - cubicAt(x0, x1, x2, x3, t);
            dy = cubicAt(y0, y1, y2, y3, t + 0.1)
                - cubicAt(y0, y1, y2, y3, t);
            bezierLen += mathSqrt(dx * dx + dy * dy);
        }

        // Find idx after add offset
        for (; idx < nDash; idx++) {
            tmpLen += lineDash[idx];
            if (tmpLen > offset) {
                break;
            }
        }
        t = (tmpLen - offset) / bezierLen;

        while (t <= 1) {

            x = cubicAt(x0, x1, x2, x3, t);
            y = cubicAt(y0, y1, y2, y3, t);

            // Use line to approximate dashed bezier
            // Bad result if dash is long
            idx % 2 ? ctx.moveTo(x, y)
                : ctx.lineTo(x, y);

            t += lineDash[idx] / bezierLen;

            idx = (idx + 1) % nDash;
        }

        // Finish the last segment and calculate the new offset
        (idx % 2 !== 0) && ctx.lineTo(x3, y3);
        dx = x3 - x;
        dy = y3 - y;
        this._dashOffset = -mathSqrt(dx * dx + dy * dy);
    },

    _dashedQuadraticTo: function (x1, y1, x2, y2) {
        // Convert quadratic to cubic using degree elevation
        var x3 = x2;
        var y3 = y2;
        x2 = (x2 + 2 * x1) / 3;
        y2 = (y2 + 2 * y1) / 3;
        x1 = (this._xi + 2 * x1) / 3;
        y1 = (this._yi + 2 * y1) / 3;

        this._dashedBezierTo(x1, y1, x2, y2, x3, y3);
    },

    /**
     * 转成静态的 Float32Array 减少堆内存占用
     * Convert dynamic array to static Float32Array
     */
    toStatic: function () {
        var data = this.data;
        if (data instanceof Array) {
            data.length = this._len;
            if (hasTypedArray) {
                this.data = new Float32Array(data);
            }
        }
    },

    /**
     * @return {module:zrender/core/BoundingRect}
     */
    getBoundingRect: function () {
        min[0] = min[1] = min2[0] = min2[1] = Number.MAX_VALUE;
        max[0] = max[1] = max2[0] = max2[1] = -Number.MAX_VALUE;

        var data = this.data;
        var xi = 0;
        var yi = 0;
        var x0 = 0;
        var y0 = 0;

        for (var i = 0; i < data.length;) {
            var cmd = data[i++];

            if (i == 1) {
                // 如果第一个命令是 L, C, Q
                // 则 previous point 同绘制命令的第一个 point
                //
                // 第一个命令为 Arc 的情况下会在后面特殊处理
                xi = data[i];
                yi = data[i + 1];

                x0 = xi;
                y0 = yi;
            }

            switch (cmd) {
                case CMD.M:
                    // moveTo 命令重新创建一个新的 subpath, 并且更新新的起点
                    // 在 closePath 的时候使用
                    x0 = data[i++];
                    y0 = data[i++];
                    xi = x0;
                    yi = y0;
                    min2[0] = x0;
                    min2[1] = y0;
                    max2[0] = x0;
                    max2[1] = y0;
                    break;
                case CMD.L:
                    __WEBPACK_IMPORTED_MODULE_2__bbox__["a" /* fromLine */](xi, yi, data[i], data[i + 1], min2, max2);
                    xi = data[i++];
                    yi = data[i++];
                    break;
                case CMD.C:
                    __WEBPACK_IMPORTED_MODULE_2__bbox__["b" /* fromCubic */](
                        xi, yi, data[i++], data[i++], data[i++], data[i++], data[i], data[i + 1],
                        min2, max2
                    );
                    xi = data[i++];
                    yi = data[i++];
                    break;
                case CMD.Q:
                    __WEBPACK_IMPORTED_MODULE_2__bbox__["c" /* fromQuadratic */](
                        xi, yi, data[i++], data[i++], data[i], data[i + 1],
                        min2, max2
                    );
                    xi = data[i++];
                    yi = data[i++];
                    break;
                case CMD.A:
                    // TODO Arc 判断的开销比较大
                    var cx = data[i++];
                    var cy = data[i++];
                    var rx = data[i++];
                    var ry = data[i++];
                    var startAngle = data[i++];
                    var endAngle = data[i++] + startAngle;
                    // TODO Arc 旋转
                    var psi = data[i++];
                    var anticlockwise = 1 - data[i++];

                    if (i == 1) {
                        // 直接使用 arc 命令
                        // 第一个命令起点还未定义
                        x0 = mathCos(startAngle) * rx + cx;
                        y0 = mathSin(startAngle) * ry + cy;
                    }

                    __WEBPACK_IMPORTED_MODULE_2__bbox__["d" /* fromArc */](
                        cx, cy, rx, ry, startAngle, endAngle,
                        anticlockwise, min2, max2
                    );

                    xi = mathCos(endAngle) * rx + cx;
                    yi = mathSin(endAngle) * ry + cy;
                    break;
                case CMD.R:
                    x0 = xi = data[i++];
                    y0 = yi = data[i++];
                    var width = data[i++];
                    var height = data[i++];
                    // Use fromLine
                    __WEBPACK_IMPORTED_MODULE_2__bbox__["a" /* fromLine */](x0, y0, x0 + width, y0 + height, min2, max2);
                    break;
                case CMD.Z:
                    xi = x0;
                    yi = y0;
                    break;
            }

            // Union
            __WEBPACK_IMPORTED_MODULE_1__vector__["e" /* min */](min, min, min2);
            __WEBPACK_IMPORTED_MODULE_1__vector__["f" /* max */](max, max, max2);
        }

        // No data
        if (i === 0) {
            min[0] = min[1] = max[0] = max[1] = 0;
        }

        return new __WEBPACK_IMPORTED_MODULE_3__BoundingRect__["a" /* default */](
            min[0], min[1], max[0] - min[0], max[1] - min[1]
        );
    },

    /**
     * Rebuild path from current data
     * Rebuild path will not consider javascript implemented line dash.
     * @param {CanvasRenderingContext2D} ctx
     */
    rebuildPath: function (ctx) {
        var d = this.data;
        var x0, y0;
        var xi, yi;
        var x, y;
        var ux = this._ux;
        var uy = this._uy;
        var len = this._len;
        for (var i = 0; i < len;) {
            var cmd = d[i++];

            if (i == 1) {
                // 如果第一个命令是 L, C, Q
                // 则 previous point 同绘制命令的第一个 point
                //
                // 第一个命令为 Arc 的情况下会在后面特殊处理
                xi = d[i];
                yi = d[i + 1];

                x0 = xi;
                y0 = yi;
            }
            switch (cmd) {
                case CMD.M:
                    x0 = xi = d[i++];
                    y0 = yi = d[i++];
                    ctx.moveTo(xi, yi);
                    break;
                case CMD.L:
                    x = d[i++];
                    y = d[i++];
                    // Not draw too small seg between
                    if (mathAbs(x - xi) > ux || mathAbs(y - yi) > uy || i === len - 1) {
                        ctx.lineTo(x, y);
                        xi = x;
                        yi = y;
                    }
                    break;
                case CMD.C:
                    ctx.bezierCurveTo(
                        d[i++], d[i++], d[i++], d[i++], d[i++], d[i++]
                    );
                    xi = d[i - 2];
                    yi = d[i - 1];
                    break;
                case CMD.Q:
                    ctx.quadraticCurveTo(d[i++], d[i++], d[i++], d[i++]);
                    xi = d[i - 2];
                    yi = d[i - 1];
                    break;
                case CMD.A:
                    var cx = d[i++];
                    var cy = d[i++];
                    var rx = d[i++];
                    var ry = d[i++];
                    var theta = d[i++];
                    var dTheta = d[i++];
                    var psi = d[i++];
                    var fs = d[i++];
                    var r = (rx > ry) ? rx : ry;
                    var scaleX = (rx > ry) ? 1 : rx / ry;
                    var scaleY = (rx > ry) ? ry / rx : 1;
                    var isEllipse = Math.abs(rx - ry) > 1e-3;
                    var endAngle = theta + dTheta;
                    if (isEllipse) {
                        ctx.translate(cx, cy);
                        ctx.rotate(psi);
                        ctx.scale(scaleX, scaleY);
                        ctx.arc(0, 0, r, theta, endAngle, 1 - fs);
                        ctx.scale(1 / scaleX, 1 / scaleY);
                        ctx.rotate(-psi);
                        ctx.translate(-cx, -cy);
                    }
                    else {
                        ctx.arc(cx, cy, r, theta, endAngle, 1 - fs);
                    }

                    if (i == 1) {
                        // 直接使用 arc 命令
                        // 第一个命令起点还未定义
                        x0 = mathCos(theta) * rx + cx;
                        y0 = mathSin(theta) * ry + cy;
                    }
                    xi = mathCos(endAngle) * rx + cx;
                    yi = mathSin(endAngle) * ry + cy;
                    break;
                case CMD.R:
                    x0 = xi = d[i];
                    y0 = yi = d[i + 1];
                    ctx.rect(d[i++], d[i++], d[i++], d[i++]);
                    break;
                case CMD.Z:
                    ctx.closePath();
                    xi = x0;
                    yi = y0;
            }
        }
    }
};

PathProxy.CMD = CMD;

/* harmony default export */ __webpack_exports__["a"] = (PathProxy);

/***/ }),

/***/ 146:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * echarts设备环境识别
 *
 * @desc echarts基于Canvas，纯Javascript图表库，提供直观，生动，可交互，可个性化定制的数据统计图表。
 * @author firede[firede@firede.us]
 * @desc thanks zepto.
 */

var env = {};

if (typeof navigator === 'undefined') {
    // In node
    env = {
        browser: {},
        os: {},
        node: true,
        // Assume canvas is supported
        canvasSupported: true,
        svgSupported: true
    };
}
else {
    env = detect(navigator.userAgent);
}

/* harmony default export */ __webpack_exports__["a"] = (env);

// Zepto.js
// (c) 2010-2013 Thomas Fuchs
// Zepto.js may be freely distributed under the MIT license.

function detect(ua) {
    var os = {};
    var browser = {};
    // var webkit = ua.match(/Web[kK]it[\/]{0,1}([\d.]+)/);
    // var android = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
    // var ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
    // var ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
    // var iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/);
    // var webos = ua.match(/(webOS|hpwOS)[\s\/]([\d.]+)/);
    // var touchpad = webos && ua.match(/TouchPad/);
    // var kindle = ua.match(/Kindle\/([\d.]+)/);
    // var silk = ua.match(/Silk\/([\d._]+)/);
    // var blackberry = ua.match(/(BlackBerry).*Version\/([\d.]+)/);
    // var bb10 = ua.match(/(BB10).*Version\/([\d.]+)/);
    // var rimtabletos = ua.match(/(RIM\sTablet\sOS)\s([\d.]+)/);
    // var playbook = ua.match(/PlayBook/);
    // var chrome = ua.match(/Chrome\/([\d.]+)/) || ua.match(/CriOS\/([\d.]+)/);
    var firefox = ua.match(/Firefox\/([\d.]+)/);
    // var safari = webkit && ua.match(/Mobile\//) && !chrome;
    // var webview = ua.match(/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/) && !chrome;
    var ie = ua.match(/MSIE\s([\d.]+)/)
        // IE 11 Trident/7.0; rv:11.0
        || ua.match(/Trident\/.+?rv:(([\d.]+))/);
    var edge = ua.match(/Edge\/([\d.]+)/); // IE 12 and 12+

    var weChat = (/micromessenger/i).test(ua);

    // Todo: clean this up with a better OS/browser seperation:
    // - discern (more) between multiple browsers on android
    // - decide if kindle fire in silk mode is android or not
    // - Firefox on Android doesn't specify the Android version
    // - possibly devide in os, device and browser hashes

    // if (browser.webkit = !!webkit) browser.version = webkit[1];

    // if (android) os.android = true, os.version = android[2];
    // if (iphone && !ipod) os.ios = os.iphone = true, os.version = iphone[2].replace(/_/g, '.');
    // if (ipad) os.ios = os.ipad = true, os.version = ipad[2].replace(/_/g, '.');
    // if (ipod) os.ios = os.ipod = true, os.version = ipod[3] ? ipod[3].replace(/_/g, '.') : null;
    // if (webos) os.webos = true, os.version = webos[2];
    // if (touchpad) os.touchpad = true;
    // if (blackberry) os.blackberry = true, os.version = blackberry[2];
    // if (bb10) os.bb10 = true, os.version = bb10[2];
    // if (rimtabletos) os.rimtabletos = true, os.version = rimtabletos[2];
    // if (playbook) browser.playbook = true;
    // if (kindle) os.kindle = true, os.version = kindle[1];
    // if (silk) browser.silk = true, browser.version = silk[1];
    // if (!silk && os.android && ua.match(/Kindle Fire/)) browser.silk = true;
    // if (chrome) browser.chrome = true, browser.version = chrome[1];
    if (firefox) {
        browser.firefox = true;
        browser.version = firefox[1];
    }
    // if (safari && (ua.match(/Safari/) || !!os.ios)) browser.safari = true;
    // if (webview) browser.webview = true;

    if (ie) {
        browser.ie = true;
        browser.version = ie[1];
    }

    if (edge) {
        browser.edge = true;
        browser.version = edge[1];
    }

    // It is difficult to detect WeChat in Win Phone precisely, because ua can
    // not be set on win phone. So we do not consider Win Phone.
    if (weChat) {
        browser.weChat = true;
    }

    // os.tablet = !!(ipad || playbook || (android && !ua.match(/Mobile/)) ||
    //     (firefox && ua.match(/Tablet/)) || (ie && !ua.match(/Phone/) && ua.match(/Touch/)));
    // os.phone  = !!(!os.tablet && !os.ipod && (android || iphone || webos ||
    //     (chrome && ua.match(/Android/)) || (chrome && ua.match(/CriOS\/([\d.]+)/)) ||
    //     (firefox && ua.match(/Mobile/)) || (ie && ua.match(/Touch/))));

    return {
        browser: browser,
        os: os,
        node: false,
        // 原生canvas支持，改极端点了
        // canvasSupported : !(browser.ie && parseFloat(browser.version) < 9)
        canvasSupported: !!document.createElement('canvas').getContext,
        svgSupported: typeof SVGRect !== 'undefined',
        // @see <http://stackoverflow.com/questions/4817029/whats-the-best-way-to-detect-a-touch-screen-device-using-javascript>
        // works on most browsers
        // IE10/11 does not support touch event, and MS Edge supports them but not by
        // default, so we dont check navigator.maxTouchPoints for them here.
        touchEventsSupported: 'ontouchstart' in window && !browser.ie && !browser.edge,
        // <http://caniuse.com/#search=pointer%20event>.
        pointerEventsSupported: 'onpointerdown' in window
            // Firefox supports pointer but not by default, only MS browsers are reliable on pointer
            // events currently. So we dont use that on other browsers unless tested sufficiently.
            // Although IE 10 supports pointer event, it use old style and is different from the
            // standard. So we exclude that. (IE 10 is hardly used on touch device)
            && (browser.edge || (browser.ie && browser.version >= 11))
    };
}

/***/ }),

/***/ 147:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * 事件扩展
 * @module zrender/mixin/Eventful
 * @author Kener (@Kener-林峰, kener.linfeng@gmail.com)
 *         pissang (https://www.github.com/pissang)
 */

var arrySlice = Array.prototype.slice;

/**
 * 事件分发器
 * @alias module:zrender/mixin/Eventful
 * @constructor
 */
var Eventful = function () {
    this._$handlers = {};
};

Eventful.prototype = {

    constructor: Eventful,

    /**
     * 单次触发绑定，trigger后销毁
     *
     * @param {string} event 事件名
     * @param {Function} handler 响应函数
     * @param {Object} context
     */
    one: function (event, handler, context) {
        var _h = this._$handlers;

        if (!handler || !event) {
            return this;
        }

        if (!_h[event]) {
            _h[event] = [];
        }

        for (var i = 0; i < _h[event].length; i++) {
            if (_h[event][i].h === handler) {
                return this;
            }
        }

        _h[event].push({
            h: handler,
            one: true,
            ctx: context || this
        });

        return this;
    },

    /**
     * 绑定事件
     * @param {string} event 事件名
     * @param {Function} handler 事件处理函数
     * @param {Object} [context]
     */
    on: function (event, handler, context) {
        var _h = this._$handlers;

        if (!handler || !event) {
            return this;
        }

        if (!_h[event]) {
            _h[event] = [];
        }

        for (var i = 0; i < _h[event].length; i++) {
            if (_h[event][i].h === handler) {
                return this;
            }
        }

        _h[event].push({
            h: handler,
            one: false,
            ctx: context || this
        });

        return this;
    },

    /**
     * 是否绑定了事件
     * @param  {string}  event
     * @return {boolean}
     */
    isSilent: function (event) {
        var _h = this._$handlers;
        return _h[event] && _h[event].length;
    },

    /**
     * 解绑事件
     * @param {string} event 事件名
     * @param {Function} [handler] 事件处理函数
     */
    off: function (event, handler) {
        var _h = this._$handlers;

        if (!event) {
            this._$handlers = {};
            return this;
        }

        if (handler) {
            if (_h[event]) {
                var newList = [];
                for (var i = 0, l = _h[event].length; i < l; i++) {
                    if (_h[event][i]['h'] != handler) {
                        newList.push(_h[event][i]);
                    }
                }
                _h[event] = newList;
            }

            if (_h[event] && _h[event].length === 0) {
                delete _h[event];
            }
        }
        else {
            delete _h[event];
        }

        return this;
    },

    /**
     * 事件分发
     *
     * @param {string} type 事件类型
     */
    trigger: function (type) {
        if (this._$handlers[type]) {
            var args = arguments;
            var argLen = args.length;

            if (argLen > 3) {
                args = arrySlice.call(args, 1);
            }

            var _h = this._$handlers[type];
            var len = _h.length;
            for (var i = 0; i < len;) {
                // Optimize advise from backbone
                switch (argLen) {
                    case 1:
                        _h[i]['h'].call(_h[i]['ctx']);
                        break;
                    case 2:
                        _h[i]['h'].call(_h[i]['ctx'], args[1]);
                        break;
                    case 3:
                        _h[i]['h'].call(_h[i]['ctx'], args[1], args[2]);
                        break;
                    default:
                        // have more than 2 given arguments
                        _h[i]['h'].apply(_h[i]['ctx'], args);
                        break;
                }

                if (_h[i]['one']) {
                    _h.splice(i, 1);
                    len--;
                }
                else {
                    i++;
                }
            }
        }

        return this;
    },

    /**
     * 带有context的事件分发, 最后一个参数是事件回调的context
     * @param {string} type 事件类型
     */
    triggerWithContext: function (type) {
        if (this._$handlers[type]) {
            var args = arguments;
            var argLen = args.length;

            if (argLen > 4) {
                args = arrySlice.call(args, 1, args.length - 1);
            }
            var ctx = args[args.length - 1];

            var _h = this._$handlers[type];
            var len = _h.length;
            for (var i = 0; i < len;) {
                // Optimize advise from backbone
                switch (argLen) {
                    case 1:
                        _h[i]['h'].call(ctx);
                        break;
                    case 2:
                        _h[i]['h'].call(ctx, args[1]);
                        break;
                    case 3:
                        _h[i]['h'].call(ctx, args[1], args[2]);
                        break;
                    default:
                        // have more than 2 given arguments
                        _h[i]['h'].apply(ctx, args);
                        break;
                }

                if (_h[i]['one']) {
                    _h.splice(i, 1);
                    len--;
                }
                else {
                    i++;
                }
            }
        }

        return this;
    }
};

// 对象可以通过 onxxxx 绑定事件
/**
 * @event module:zrender/mixin/Eventful#onclick
 * @type {Function}
 * @default null
 */
/**
 * @event module:zrender/mixin/Eventful#onmouseover
 * @type {Function}
 * @default null
 */
/**
 * @event module:zrender/mixin/Eventful#onmouseout
 * @type {Function}
 * @default null
 */
/**
 * @event module:zrender/mixin/Eventful#onmousemove
 * @type {Function}
 * @default null
 */
/**
 * @event module:zrender/mixin/Eventful#onmousewheel
 * @type {Function}
 * @default null
 */
/**
 * @event module:zrender/mixin/Eventful#onmousedown
 * @type {Function}
 * @default null
 */
/**
 * @event module:zrender/mixin/Eventful#onmouseup
 * @type {Function}
 * @default null
 */
/**
 * @event module:zrender/mixin/Eventful#ondrag
 * @type {Function}
 * @default null
 */
/**
 * @event module:zrender/mixin/Eventful#ondragstart
 * @type {Function}
 * @default null
 */
/**
 * @event module:zrender/mixin/Eventful#ondragend
 * @type {Function}
 * @default null
 */
/**
 * @event module:zrender/mixin/Eventful#ondragenter
 * @type {Function}
 * @default null
 */
/**
 * @event module:zrender/mixin/Eventful#ondragleave
 * @type {Function}
 * @default null
 */
/**
 * @event module:zrender/mixin/Eventful#ondragover
 * @type {Function}
 * @default null
 */
/**
 * @event module:zrender/mixin/Eventful#ondrop
 * @type {Function}
 * @default null
 */

/* harmony default export */ __webpack_exports__["a"] = (Eventful);

/***/ }),

/***/ 151:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */



var base64 = __webpack_require__(388)
var ieee754 = __webpack_require__(718)
var isArray = __webpack_require__(719)

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length)
    }
    that.length = length
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
}

function allocUnsafe (that, size) {
  assertSize(size)
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  that = createBuffer(that, length)

  var actual = that.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual)
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  that = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array)
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset)
  } else {
    array = new Uint8Array(array, byteOffset, length)
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array)
  }
  return that
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    that = createBuffer(that, len)

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len)
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start]
    }
  }

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString())
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(203)))

/***/ }),

/***/ 182:
/***/ (function(module, exports, __webpack_require__) {

/**
 * Module dependencies.
 */

var parser = __webpack_require__(74);
var Emitter = __webpack_require__(65);

/**
 * Module exports.
 */

module.exports = Transport;

/**
 * Transport abstract constructor.
 *
 * @param {Object} options.
 * @api private
 */

function Transport (opts) {
  this.path = opts.path;
  this.hostname = opts.hostname;
  this.port = opts.port;
  this.secure = opts.secure;
  this.query = opts.query;
  this.timestampParam = opts.timestampParam;
  this.timestampRequests = opts.timestampRequests;
  this.readyState = '';
  this.agent = opts.agent || false;
  this.socket = opts.socket;
  this.enablesXDR = opts.enablesXDR;

  // SSL options for Node.js client
  this.pfx = opts.pfx;
  this.key = opts.key;
  this.passphrase = opts.passphrase;
  this.cert = opts.cert;
  this.ca = opts.ca;
  this.ciphers = opts.ciphers;
  this.rejectUnauthorized = opts.rejectUnauthorized;
  this.forceNode = opts.forceNode;

  // results of ReactNative environment detection
  this.isReactNative = opts.isReactNative;

  // other options for Node.js client
  this.extraHeaders = opts.extraHeaders;
  this.localAddress = opts.localAddress;
}

/**
 * Mix in `Emitter`.
 */

Emitter(Transport.prototype);

/**
 * Emits an error.
 *
 * @param {String} str
 * @return {Transport} for chaining
 * @api public
 */

Transport.prototype.onError = function (msg, desc) {
  var err = new Error(msg);
  err.type = 'TransportError';
  err.description = desc;
  this.emit('error', err);
  return this;
};

/**
 * Opens the transport.
 *
 * @api public
 */

Transport.prototype.open = function () {
  if ('closed' === this.readyState || '' === this.readyState) {
    this.readyState = 'opening';
    this.doOpen();
  }

  return this;
};

/**
 * Closes the transport.
 *
 * @api private
 */

Transport.prototype.close = function () {
  if ('opening' === this.readyState || 'open' === this.readyState) {
    this.doClose();
    this.onClose();
  }

  return this;
};

/**
 * Sends multiple packets.
 *
 * @param {Array} packets
 * @api private
 */

Transport.prototype.send = function (packets) {
  if ('open' === this.readyState) {
    this.write(packets);
  } else {
    throw new Error('Transport not open');
  }
};

/**
 * Called upon open
 *
 * @api private
 */

Transport.prototype.onOpen = function () {
  this.readyState = 'open';
  this.writable = true;
  this.emit('open');
};

/**
 * Called with data.
 *
 * @param {String} data
 * @api private
 */

Transport.prototype.onData = function (data) {
  var packet = parser.decodePacket(data, this.socket.binaryType);
  this.onPacket(packet);
};

/**
 * Called with a decoded packet.
 */

Transport.prototype.onPacket = function (packet) {
  this.emit('packet', packet);
};

/**
 * Called upon close.
 *
 * @api private
 */

Transport.prototype.onClose = function () {
  this.readyState = 'closed';
  this.emit('close');
};


/***/ }),

/***/ 183:
/***/ (function(module, exports, __webpack_require__) {

// browser shim for xmlhttprequest module

var hasCORS = __webpack_require__(717);

module.exports = function (opts) {
  var xdomain = opts.xdomain;

  // scheme must be same when usign XDomainRequest
  // http://blogs.msdn.com/b/ieinternals/archive/2010/05/13/xdomainrequest-restrictions-limitations-and-workarounds.aspx
  var xscheme = opts.xscheme;

  // XDomainRequest has a flow of not sending cookie, therefore it should be disabled as a default.
  // https://github.com/Automattic/engine.io-client/pull/217
  var enablesXDR = opts.enablesXDR;

  // XMLHttpRequest can be disabled on IE
  try {
    if ('undefined' !== typeof XMLHttpRequest && (!xdomain || hasCORS)) {
      return new XMLHttpRequest();
    }
  } catch (e) { }

  // Use XDomainRequest for IE8 if enablesXDR is true
  // because loading bar keeps flashing when using jsonp-polling
  // https://github.com/yujiosaka/socke.io-ie8-loading-example
  try {
    if ('undefined' !== typeof XDomainRequest && !xscheme && enablesXDR) {
      return new XDomainRequest();
    }
  } catch (e) { }

  if (!xdomain) {
    try {
      return new self[['Active'].concat('Object').join('X')]('Microsoft.XMLHTTP');
    } catch (e) { }
  }
};


/***/ }),

/***/ 185:
/***/ (function(module, exports) {

/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

module.exports = function(val, options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isNaN(val) === false) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error(
    'val is not a non-empty string or a valid number. val=' +
      JSON.stringify(val)
  );
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(
    str
  );
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  if (ms >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (ms >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (ms >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (ms >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  return plural(ms, d, 'day') ||
    plural(ms, h, 'hour') ||
    plural(ms, m, 'minute') ||
    plural(ms, s, 'second') ||
    ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, n, name) {
  if (ms < n) {
    return;
  }
  if (ms < n * 1.5) {
    return Math.floor(ms / n) + ' ' + name;
  }
  return Math.ceil(ms / n) + ' ' + name + 's';
}


/***/ }),

/***/ 202:
/***/ (function(module, exports, __webpack_require__) {


/**
 * Module dependencies.
 */

var debug = __webpack_require__(815)('socket.io-parser');
var Emitter = __webpack_require__(65);
var binary = __webpack_require__(814);
var isArray = __webpack_require__(341);
var isBuf = __webpack_require__(340);

/**
 * Protocol version.
 *
 * @api public
 */

exports.protocol = 4;

/**
 * Packet types.
 *
 * @api public
 */

exports.types = [
  'CONNECT',
  'DISCONNECT',
  'EVENT',
  'ACK',
  'ERROR',
  'BINARY_EVENT',
  'BINARY_ACK'
];

/**
 * Packet type `connect`.
 *
 * @api public
 */

exports.CONNECT = 0;

/**
 * Packet type `disconnect`.
 *
 * @api public
 */

exports.DISCONNECT = 1;

/**
 * Packet type `event`.
 *
 * @api public
 */

exports.EVENT = 2;

/**
 * Packet type `ack`.
 *
 * @api public
 */

exports.ACK = 3;

/**
 * Packet type `error`.
 *
 * @api public
 */

exports.ERROR = 4;

/**
 * Packet type 'binary event'
 *
 * @api public
 */

exports.BINARY_EVENT = 5;

/**
 * Packet type `binary ack`. For acks with binary arguments.
 *
 * @api public
 */

exports.BINARY_ACK = 6;

/**
 * Encoder constructor.
 *
 * @api public
 */

exports.Encoder = Encoder;

/**
 * Decoder constructor.
 *
 * @api public
 */

exports.Decoder = Decoder;

/**
 * A socket.io Encoder instance
 *
 * @api public
 */

function Encoder() {}

var ERROR_PACKET = exports.ERROR + '"encode error"';

/**
 * Encode a packet as a single string if non-binary, or as a
 * buffer sequence, depending on packet type.
 *
 * @param {Object} obj - packet object
 * @param {Function} callback - function to handle encodings (likely engine.write)
 * @return Calls callback with Array of encodings
 * @api public
 */

Encoder.prototype.encode = function(obj, callback){
  debug('encoding packet %j', obj);

  if (exports.BINARY_EVENT === obj.type || exports.BINARY_ACK === obj.type) {
    encodeAsBinary(obj, callback);
  } else {
    var encoding = encodeAsString(obj);
    callback([encoding]);
  }
};

/**
 * Encode packet as string.
 *
 * @param {Object} packet
 * @return {String} encoded
 * @api private
 */

function encodeAsString(obj) {

  // first is type
  var str = '' + obj.type;

  // attachments if we have them
  if (exports.BINARY_EVENT === obj.type || exports.BINARY_ACK === obj.type) {
    str += obj.attachments + '-';
  }

  // if we have a namespace other than `/`
  // we append it followed by a comma `,`
  if (obj.nsp && '/' !== obj.nsp) {
    str += obj.nsp + ',';
  }

  // immediately followed by the id
  if (null != obj.id) {
    str += obj.id;
  }

  // json data
  if (null != obj.data) {
    var payload = tryStringify(obj.data);
    if (payload !== false) {
      str += payload;
    } else {
      return ERROR_PACKET;
    }
  }

  debug('encoded %j as %s', obj, str);
  return str;
}

function tryStringify(str) {
  try {
    return JSON.stringify(str);
  } catch(e){
    return false;
  }
}

/**
 * Encode packet as 'buffer sequence' by removing blobs, and
 * deconstructing packet into object with placeholders and
 * a list of buffers.
 *
 * @param {Object} packet
 * @return {Buffer} encoded
 * @api private
 */

function encodeAsBinary(obj, callback) {

  function writeEncoding(bloblessData) {
    var deconstruction = binary.deconstructPacket(bloblessData);
    var pack = encodeAsString(deconstruction.packet);
    var buffers = deconstruction.buffers;

    buffers.unshift(pack); // add packet info to beginning of data list
    callback(buffers); // write all the buffers
  }

  binary.removeBlobs(obj, writeEncoding);
}

/**
 * A socket.io Decoder instance
 *
 * @return {Object} decoder
 * @api public
 */

function Decoder() {
  this.reconstructor = null;
}

/**
 * Mix in `Emitter` with Decoder.
 */

Emitter(Decoder.prototype);

/**
 * Decodes an encoded packet string into packet JSON.
 *
 * @param {String} obj - encoded packet
 * @return {Object} packet
 * @api public
 */

Decoder.prototype.add = function(obj) {
  var packet;
  if (typeof obj === 'string') {
    packet = decodeString(obj);
    if (exports.BINARY_EVENT === packet.type || exports.BINARY_ACK === packet.type) { // binary packet's json
      this.reconstructor = new BinaryReconstructor(packet);

      // no attachments, labeled binary but no binary data to follow
      if (this.reconstructor.reconPack.attachments === 0) {
        this.emit('decoded', packet);
      }
    } else { // non-binary full packet
      this.emit('decoded', packet);
    }
  } else if (isBuf(obj) || obj.base64) { // raw binary data
    if (!this.reconstructor) {
      throw new Error('got binary data when not reconstructing a packet');
    } else {
      packet = this.reconstructor.takeBinaryData(obj);
      if (packet) { // received final buffer
        this.reconstructor = null;
        this.emit('decoded', packet);
      }
    }
  } else {
    throw new Error('Unknown type: ' + obj);
  }
};

/**
 * Decode a packet String (JSON data)
 *
 * @param {String} str
 * @return {Object} packet
 * @api private
 */

function decodeString(str) {
  var i = 0;
  // look up type
  var p = {
    type: Number(str.charAt(0))
  };

  if (null == exports.types[p.type]) {
    return error('unknown packet type ' + p.type);
  }

  // look up attachments if type binary
  if (exports.BINARY_EVENT === p.type || exports.BINARY_ACK === p.type) {
    var buf = '';
    while (str.charAt(++i) !== '-') {
      buf += str.charAt(i);
      if (i == str.length) break;
    }
    if (buf != Number(buf) || str.charAt(i) !== '-') {
      throw new Error('Illegal attachments');
    }
    p.attachments = Number(buf);
  }

  // look up namespace (if any)
  if ('/' === str.charAt(i + 1)) {
    p.nsp = '';
    while (++i) {
      var c = str.charAt(i);
      if (',' === c) break;
      p.nsp += c;
      if (i === str.length) break;
    }
  } else {
    p.nsp = '/';
  }

  // look up id
  var next = str.charAt(i + 1);
  if ('' !== next && Number(next) == next) {
    p.id = '';
    while (++i) {
      var c = str.charAt(i);
      if (null == c || Number(c) != c) {
        --i;
        break;
      }
      p.id += str.charAt(i);
      if (i === str.length) break;
    }
    p.id = Number(p.id);
  }

  // look up json data
  if (str.charAt(++i)) {
    var payload = tryParse(str.substr(i));
    var isPayloadValid = payload !== false && (p.type === exports.ERROR || isArray(payload));
    if (isPayloadValid) {
      p.data = payload;
    } else {
      return error('invalid payload');
    }
  }

  debug('decoded %s as %j', str, p);
  return p;
}

function tryParse(str) {
  try {
    return JSON.parse(str);
  } catch(e){
    return false;
  }
}

/**
 * Deallocates a parser's resources
 *
 * @api public
 */

Decoder.prototype.destroy = function() {
  if (this.reconstructor) {
    this.reconstructor.finishedReconstruction();
  }
};

/**
 * A manager of a binary event's 'buffer sequence'. Should
 * be constructed whenever a packet of type BINARY_EVENT is
 * decoded.
 *
 * @param {Object} packet
 * @return {BinaryReconstructor} initialized reconstructor
 * @api private
 */

function BinaryReconstructor(packet) {
  this.reconPack = packet;
  this.buffers = [];
}

/**
 * Method to be called when binary data received from connection
 * after a BINARY_EVENT packet.
 *
 * @param {Buffer | ArrayBuffer} binData - the raw binary data received
 * @return {null | Object} returns null if more binary data is expected or
 *   a reconstructed packet object if all buffers have been received.
 * @api private
 */

BinaryReconstructor.prototype.takeBinaryData = function(binData) {
  this.buffers.push(binData);
  if (this.buffers.length === this.reconPack.attachments) { // done with buffer list
    var packet = binary.reconstructPacket(this.reconPack, this.buffers);
    this.finishedReconstruction();
    return packet;
  }
  return null;
};

/**
 * Cleans up binary packet reconstruction variables.
 *
 * @api private
 */

BinaryReconstructor.prototype.finishedReconstruction = function() {
  this.reconPack = null;
  this.buffers = [];
};

function error(msg) {
  return {
    type: exports.ERROR,
    data: 'parser error: ' + msg
  };
}


/***/ }),

/***/ 212:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["e"] = clientToLocal;
/* harmony export (immutable) */ __webpack_exports__["b"] = normalizeEvent;
/* harmony export (immutable) */ __webpack_exports__["c"] = addEventListener;
/* harmony export (immutable) */ __webpack_exports__["d"] = removeEventListener;
/* unused harmony export stop */
/* unused harmony export notLeftMouse */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__mixin_Eventful__ = __webpack_require__(147);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__env__ = __webpack_require__(146);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_0__mixin_Eventful__["a"]; });
/**
 * 事件辅助类
 * @module zrender/core/event
 * @author Kener (@Kener-林峰, kener.linfeng@gmail.com)
 */




var isDomLevel2 = (typeof window !== 'undefined') && !!window.addEventListener;

var MOUSE_EVENT_REG = /^(?:mouse|pointer|contextmenu|drag|drop)|click/;

function getBoundingClientRect(el) {
    // BlackBerry 5, iOS 3 (original iPhone) don't have getBoundingRect
    return el.getBoundingClientRect ? el.getBoundingClientRect() : {left: 0, top: 0};
}

// `calculate` is optional, default false
function clientToLocal(el, e, out, calculate) {
    out = out || {};

    // According to the W3C Working Draft, offsetX and offsetY should be relative
    // to the padding edge of the target element. The only browser using this convention
    // is IE. Webkit uses the border edge, Opera uses the content edge, and FireFox does
    // not support the properties.
    // (see http://www.jacklmoore.com/notes/mouse-position/)
    // In zr painter.dom, padding edge equals to border edge.

    // FIXME
    // When mousemove event triggered on ec tooltip, target is not zr painter.dom, and
    // offsetX/Y is relative to e.target, where the calculation of zrX/Y via offsetX/Y
    // is too complex. So css-transfrom dont support in this case temporarily.
    if (calculate || !__WEBPACK_IMPORTED_MODULE_1__env__["a" /* default */].canvasSupported) {
        defaultGetZrXY(el, e, out);
    }
    // Caution: In FireFox, layerX/layerY Mouse position relative to the closest positioned
    // ancestor element, so we should make sure el is positioned (e.g., not position:static).
    // BTW1, Webkit don't return the same results as FF in non-simple cases (like add
    // zoom-factor, overflow / opacity layers, transforms ...)
    // BTW2, (ev.offsetY || ev.pageY - $(ev.target).offset().top) is not correct in preserve-3d.
    // <https://bugs.jquery.com/ticket/8523#comment:14>
    // BTW3, In ff, offsetX/offsetY is always 0.
    else if (__WEBPACK_IMPORTED_MODULE_1__env__["a" /* default */].browser.firefox && e.layerX != null && e.layerX !== e.offsetX) {
        out.zrX = e.layerX;
        out.zrY = e.layerY;
    }
    // For IE6+, chrome, safari, opera. (When will ff support offsetX?)
    else if (e.offsetX != null) {
        out.zrX = e.offsetX;
        out.zrY = e.offsetY;
    }
    // For some other device, e.g., IOS safari.
    else {
        defaultGetZrXY(el, e, out);
    }

    return out;
}

function defaultGetZrXY(el, e, out) {
    // This well-known method below does not support css transform.
    var box = getBoundingClientRect(el);
    out.zrX = e.clientX - box.left;
    out.zrY = e.clientY - box.top;
}

/**
 * 如果存在第三方嵌入的一些dom触发的事件，或touch事件，需要转换一下事件坐标.
 * `calculate` is optional, default false.
 */
function normalizeEvent(el, e, calculate) {

    e = e || window.event;

    if (e.zrX != null) {
        return e;
    }

    var eventType = e.type;
    var isTouch = eventType && eventType.indexOf('touch') >= 0;

    if (!isTouch) {
        clientToLocal(el, e, e, calculate);
        e.zrDelta = (e.wheelDelta) ? e.wheelDelta / 120 : -(e.detail || 0) / 3;
    }
    else {
        var touch = eventType != 'touchend'
            ? e.targetTouches[0]
            : e.changedTouches[0];
        touch && clientToLocal(el, touch, e, calculate);
    }

    // Add which for click: 1 === left; 2 === middle; 3 === right; otherwise: 0;
    // See jQuery: https://github.com/jquery/jquery/blob/master/src/event.js
    // If e.which has been defined, if may be readonly,
    // see: https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/which
    var button = e.button;
    if (e.which == null && button !== undefined && MOUSE_EVENT_REG.test(e.type)) {
        e.which = (button & 1 ? 1 : (button & 2 ? 3 : (button & 4 ? 2 : 0)));
    }

    return e;
}

function addEventListener(el, name, handler) {
    if (isDomLevel2) {
        el.addEventListener(name, handler);
    }
    else {
        el.attachEvent('on' + name, handler);
    }
}

function removeEventListener(el, name, handler) {
    if (isDomLevel2) {
        el.removeEventListener(name, handler);
    }
    else {
        el.detachEvent('on' + name, handler);
    }
}

/**
 * preventDefault and stopPropagation.
 * Notice: do not do that in zrender. Upper application
 * do that if necessary.
 *
 * @memberOf module:zrender/core/event
 * @method
 * @param {Event} e : event对象
 */
var stop = isDomLevel2
    ? function (e) {
        e.preventDefault();
        e.stopPropagation();
        e.cancelBubble = true;
    }
    : function (e) {
        e.returnValue = false;
        e.cancelBubble = true;
    };

function notLeftMouse(e) {
    // If e.which is undefined, considered as left mouse event.
    return e.which > 1;
}

// 做向上兼容



/***/ }),

/***/ 213:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Displayable__ = __webpack_require__(366);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_util__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__core_PathProxy__ = __webpack_require__(145);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__contain_path__ = __webpack_require__(881);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__Pattern__ = __webpack_require__(367);






var getCanvasPattern = __WEBPACK_IMPORTED_MODULE_4__Pattern__["a" /* default */].prototype.getCanvasPattern;

var abs = Math.abs;

var pathProxyForDraw = new __WEBPACK_IMPORTED_MODULE_2__core_PathProxy__["a" /* default */](true);
/**
 * @alias module:zrender/graphic/Path
 * @extends module:zrender/graphic/Displayable
 * @constructor
 * @param {Object} opts
 */
function Path(opts) {
    __WEBPACK_IMPORTED_MODULE_0__Displayable__["a" /* default */].call(this, opts);

    /**
     * @type {module:zrender/core/PathProxy}
     * @readOnly
     */
    this.path = null;
}

Path.prototype = {

    constructor: Path,

    type: 'path',

    __dirtyPath: true,

    strokeContainThreshold: 5,

    brush: function (ctx, prevEl) {
        var style = this.style;
        var path = this.path || pathProxyForDraw;
        var hasStroke = style.hasStroke();
        var hasFill = style.hasFill();
        var fill = style.fill;
        var stroke = style.stroke;
        var hasFillGradient = hasFill && !!(fill.colorStops);
        var hasStrokeGradient = hasStroke && !!(stroke.colorStops);
        var hasFillPattern = hasFill && !!(fill.image);
        var hasStrokePattern = hasStroke && !!(stroke.image);

        style.bind(ctx, this, prevEl);
        this.setTransform(ctx);

        if (this.__dirty) {
            var rect;
            // Update gradient because bounding rect may changed
            if (hasFillGradient) {
                rect = rect || this.getBoundingRect();
                this._fillGradient = style.getGradient(ctx, fill, rect);
            }
            if (hasStrokeGradient) {
                rect = rect || this.getBoundingRect();
                this._strokeGradient = style.getGradient(ctx, stroke, rect);
            }
        }
        // Use the gradient or pattern
        if (hasFillGradient) {
            // PENDING If may have affect the state
            ctx.fillStyle = this._fillGradient;
        }
        else if (hasFillPattern) {
            ctx.fillStyle = getCanvasPattern.call(fill, ctx);
        }
        if (hasStrokeGradient) {
            ctx.strokeStyle = this._strokeGradient;
        }
        else if (hasStrokePattern) {
            ctx.strokeStyle = getCanvasPattern.call(stroke, ctx);
        }

        var lineDash = style.lineDash;
        var lineDashOffset = style.lineDashOffset;

        var ctxLineDash = !!ctx.setLineDash;

        // Update path sx, sy
        var scale = this.getGlobalScale();
        path.setScale(scale[0], scale[1]);

        // Proxy context
        // Rebuild path in following 2 cases
        // 1. Path is dirty
        // 2. Path needs javascript implemented lineDash stroking.
        //    In this case, lineDash information will not be saved in PathProxy
        if (this.__dirtyPath
            || (lineDash && !ctxLineDash && hasStroke)
        ) {
            path.beginPath(ctx);

            // Setting line dash before build path
            if (lineDash && !ctxLineDash) {
                path.setLineDash(lineDash);
                path.setLineDashOffset(lineDashOffset);
            }

            this.buildPath(path, this.shape, false);

            // Clear path dirty flag
            if (this.path) {
                this.__dirtyPath = false;
            }
        }
        else {
            // Replay path building
            ctx.beginPath();
            this.path.rebuildPath(ctx);
        }

        hasFill && path.fill(ctx);

        if (lineDash && ctxLineDash) {
            ctx.setLineDash(lineDash);
            ctx.lineDashOffset = lineDashOffset;
        }

        hasStroke && path.stroke(ctx);

        if (lineDash && ctxLineDash) {
            // PENDING
            // Remove lineDash
            ctx.setLineDash([]);
        }

        this.restoreTransform(ctx);

        // Draw rect text
        if (style.text != null) {
            this.drawRectText(ctx, this.getBoundingRect());
        }
    },

    // When bundling path, some shape may decide if use moveTo to begin a new subpath or closePath
    // Like in circle
    buildPath: function (ctx, shapeCfg, inBundle) {},

    createPathProxy: function () {
        this.path = new __WEBPACK_IMPORTED_MODULE_2__core_PathProxy__["a" /* default */]();
    },

    getBoundingRect: function () {
        var rect = this._rect;
        var style = this.style;
        var needsUpdateRect = !rect;
        if (needsUpdateRect) {
            var path = this.path;
            if (!path) {
                // Create path on demand.
                path = this.path = new __WEBPACK_IMPORTED_MODULE_2__core_PathProxy__["a" /* default */]();
            }
            if (this.__dirtyPath) {
                path.beginPath();
                this.buildPath(path, this.shape, false);
            }
            rect = path.getBoundingRect();
        }
        this._rect = rect;

        if (style.hasStroke()) {
            // Needs update rect with stroke lineWidth when
            // 1. Element changes scale or lineWidth
            // 2. Shape is changed
            var rectWithStroke = this._rectWithStroke || (this._rectWithStroke = rect.clone());
            if (this.__dirty || needsUpdateRect) {
                rectWithStroke.copy(rect);
                // FIXME Must after updateTransform
                var w = style.lineWidth;
                // PENDING, Min line width is needed when line is horizontal or vertical
                var lineScale = style.strokeNoScale ? this.getLineScale() : 1;

                // Only add extra hover lineWidth when there are no fill
                if (!style.hasFill()) {
                    w = Math.max(w, this.strokeContainThreshold || 4);
                }
                // Consider line width
                // Line scale can't be 0;
                if (lineScale > 1e-10) {
                    rectWithStroke.width += w / lineScale;
                    rectWithStroke.height += w / lineScale;
                    rectWithStroke.x -= w / lineScale / 2;
                    rectWithStroke.y -= w / lineScale / 2;
                }
            }

            // Return rect with stroke
            return rectWithStroke;
        }

        return rect;
    },

    contain: function (x, y) {
        var localPos = this.transformCoordToLocal(x, y);
        var rect = this.getBoundingRect();
        var style = this.style;
        x = localPos[0];
        y = localPos[1];

        if (rect.contain(x, y)) {
            var pathData = this.path.data;
            if (style.hasStroke()) {
                var lineWidth = style.lineWidth;
                var lineScale = style.strokeNoScale ? this.getLineScale() : 1;
                // Line scale can't be 0;
                if (lineScale > 1e-10) {
                    // Only add extra hover lineWidth when there are no fill
                    if (!style.hasFill()) {
                        lineWidth = Math.max(lineWidth, this.strokeContainThreshold);
                    }
                    if (__WEBPACK_IMPORTED_MODULE_3__contain_path__["a" /* containStroke */](
                        pathData, lineWidth / lineScale, x, y
                    )) {
                        return true;
                    }
                }
            }
            if (style.hasFill()) {
                return __WEBPACK_IMPORTED_MODULE_3__contain_path__["b" /* contain */](pathData, x, y);
            }
        }
        return false;
    },

    /**
     * @param  {boolean} dirtyPath
     */
    dirty: function (dirtyPath) {
        if (dirtyPath == null) {
            dirtyPath = true;
        }
        // Only mark dirty, not mark clean
        if (dirtyPath) {
            this.__dirtyPath = dirtyPath;
            this._rect = null;
        }

        this.__dirty = true;

        this.__zr && this.__zr.refresh();

        // Used as a clipping path
        if (this.__clipTarget) {
            this.__clipTarget.dirty();
        }
    },

    /**
     * Alias for animate('shape')
     * @param {boolean} loop
     */
    animateShape: function (loop) {
        return this.animate('shape', loop);
    },

    // Overwrite attrKV
    attrKV: function (key, value) {
        // FIXME
        if (key === 'shape') {
            this.setShape(value);
            this.__dirtyPath = true;
            this._rect = null;
        }
        else {
            __WEBPACK_IMPORTED_MODULE_0__Displayable__["a" /* default */].prototype.attrKV.call(this, key, value);
        }
    },

    /**
     * @param {Object|string} key
     * @param {*} value
     */
    setShape: function (key, value) {
        var shape = this.shape;
        // Path from string may not have shape
        if (shape) {
            if (__WEBPACK_IMPORTED_MODULE_1__core_util__["h" /* isObject */](key)) {
                for (var name in key) {
                    if (key.hasOwnProperty(name)) {
                        shape[name] = key[name];
                    }
                }
            }
            else {
                shape[key] = value;
            }
            this.dirty(true);
        }
        return this;
    },

    getLineScale: function () {
        var m = this.transform;
        // Get the line scale.
        // Determinant of `m` means how much the area is enlarged by the
        // transformation. So its square root can be used as a scale factor
        // for width.
        return m && abs(m[0] - 1) > 1e-10 && abs(m[3] - 1) > 1e-10
            ? Math.sqrt(abs(m[0] * m[3] - m[2] * m[1]))
            : 1;
    }
};

/**
 * 扩展一个 Path element, 比如星形，圆等。
 * Extend a path element
 * @param {Object} props
 * @param {string} props.type Path type
 * @param {Function} props.init Initialize
 * @param {Function} props.buildPath Overwrite buildPath method
 * @param {Object} [props.style] Extended default style config
 * @param {Object} [props.shape] Extended default shape config
 */
Path.extend = function (defaults) {
    var Sub = function (opts) {
        Path.call(this, opts);

        if (defaults.style) {
            // Extend default style
            this.style.extendFrom(defaults.style, false);
        }

        // Extend default shape
        var defaultShape = defaults.shape;
        if (defaultShape) {
            this.shape = this.shape || {};
            var thisShape = this.shape;
            for (var name in defaultShape) {
                if (
                    ! thisShape.hasOwnProperty(name)
                    && defaultShape.hasOwnProperty(name)
                ) {
                    thisShape[name] = defaultShape[name];
                }
            }
        }

        defaults.init && defaults.init.call(this, opts);
    };

    __WEBPACK_IMPORTED_MODULE_1__core_util__["a" /* inherits */](Sub, Path);

    // FIXME 不能 extend position, rotation 等引用对象
    for (var name in defaults) {
        // Extending prototype values and methods
        if (name !== 'style' && name !== 'shape') {
            Sub.prototype[name] = defaults[name];
        }
    }

    return Sub;
};

__WEBPACK_IMPORTED_MODULE_1__core_util__["a" /* inherits */](Path, __WEBPACK_IMPORTED_MODULE_0__Displayable__["a" /* default */]);

/* harmony default export */ __webpack_exports__["a"] = (Path);

/***/ }),

/***/ 214:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["c"] = findExistImage;
/* harmony export (immutable) */ __webpack_exports__["a"] = createOrUpdateImage;
/* harmony export (immutable) */ __webpack_exports__["b"] = isImageReady;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__core_LRU__ = __webpack_require__(361);



var globalImageCache = new __WEBPACK_IMPORTED_MODULE_0__core_LRU__["a" /* default */](50);

/**
 * @param {string|HTMLImageElement|HTMLCanvasElement|Canvas} newImageOrSrc
 * @return {HTMLImageElement|HTMLCanvasElement|Canvas} image
 */
function findExistImage(newImageOrSrc) {
    if (typeof newImageOrSrc === 'string') {
        var cachedImgObj = globalImageCache.get(newImageOrSrc);
        return cachedImgObj && cachedImgObj.image;
    }
    else {
        return newImageOrSrc;
    }
}

/**
 * Caution: User should cache loaded images, but not just count on LRU.
 * Consider if required images more than LRU size, will dead loop occur?
 *
 * @param {string|HTMLImageElement|HTMLCanvasElement|Canvas} newImageOrSrc
 * @param {HTMLImageElement|HTMLCanvasElement|Canvas} image Existent image.
 * @param {module:zrender/Element} [hostEl] For calling `dirty`.
 * @param {Function} [cb] params: (image, cbPayload)
 * @param {Object} [cbPayload] Payload on cb calling.
 * @return {HTMLImageElement|HTMLCanvasElement|Canvas} image
 */
function createOrUpdateImage(newImageOrSrc, image, hostEl, cb, cbPayload) {
    if (!newImageOrSrc) {
        return image;
    }
    else if (typeof newImageOrSrc === 'string') {

        // Image should not be loaded repeatly.
        if ((image && image.__zrImageSrc === newImageOrSrc) || !hostEl) {
            return image;
        }

        // Only when there is no existent image or existent image src
        // is different, this method is responsible for load.
        var cachedImgObj = globalImageCache.get(newImageOrSrc);

        var pendingWrap = {hostEl: hostEl, cb: cb, cbPayload: cbPayload};

        if (cachedImgObj) {
            image = cachedImgObj.image;
            !isImageReady(image) && cachedImgObj.pending.push(pendingWrap);
        }
        else {
            !image && (image = new Image());
            image.onload = imageOnLoad;

            globalImageCache.put(
                newImageOrSrc,
                image.__cachedImgObj = {
                    image: image,
                    pending: [pendingWrap]
                }
            );

            image.src = image.__zrImageSrc = newImageOrSrc;
        }

        return image;
    }
    // newImageOrSrc is an HTMLImageElement or HTMLCanvasElement or Canvas
    else {
        return newImageOrSrc;
    }
}

function imageOnLoad() {
    var cachedImgObj = this.__cachedImgObj;
    this.onload = this.__cachedImgObj = null;

    for (var i = 0; i < cachedImgObj.pending.length; i++) {
        var pendingWrap = cachedImgObj.pending[i];
        var cb = pendingWrap.cb;
        cb && cb(this, pendingWrap.cbPayload);
        pendingWrap.hostEl.dirty();
    }
    cachedImgObj.pending.length = 0;
}

function isImageReady(image) {
    return image && image.width && image.height;
}



/***/ }),

/***/ 217:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Config = __webpack_require__(83);

var _Config2 = _interopRequireDefault(_Config);

var _mathUtil = __webpack_require__(385);

var _mathUtil2 = _interopRequireDefault(_mathUtil);

var _BezierCurve = __webpack_require__(893);

var _BezierCurve2 = _interopRequireDefault(_BezierCurve);

var _Group = __webpack_require__(106);

var _Group2 = _interopRequireDefault(_Group);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Link = function () {
    function Link(opts) {
        _classCallCheck(this, Link);

        this.from = opts['from'] || 0;
        this.to = opts['to'] || 0;
        this.loop = opts['loop'];
        this.callback = opts['callback'];
        this.lineWidth = opts['lineWidth'] || 2;
        this.stroke = opts['stroke'] || 'rgba(255, 255, 0, 1)';
        this.lineJoin = opts['lineJoin'] || 'round';
        this.lineCap = opts['lineCap'] || 'round';
        this.during = opts['during'] || _Config2.default.animationDefaultDuring;
        this.shadowBlur = opts['shadowBlur'] || 25;
    }

    _createClass(Link, [{
        key: 'render',
        value: function render() {
            var from = this.from,
                to = this.to;

            var cp = _mathUtil2.default.getCurvenessPoint(this.from, this.to);

            var link = new _BezierCurve2.default({
                shape: {
                    x1: from.x,
                    y1: from.y,
                    x2: to.x,
                    y2: to.y,
                    cpx1: cp.x,
                    cpy1: cp.y
                },
                style: {
                    stroke: this.stroke,
                    lineWidth: this.lineWidth,
                    fill: null,
                    lineJoin: this.lineJoin,
                    lineCap: this.lineCap,
                    shadowBlur: this.shadowBlur,
                    shadowColor: this.stroke
                }
            });

            return link;
        }
    }]);

    return Link;
}();

exports.default = Link;

/***/ }),

/***/ 218:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Config = __webpack_require__(83);

var _Config2 = _interopRequireDefault(_Config);

var _Link = __webpack_require__(217);

var _Link2 = _interopRequireDefault(_Link);

var _Circle = __webpack_require__(370);

var _Circle2 = _interopRequireDefault(_Circle);

var _Group = __webpack_require__(106);

var _Group2 = _interopRequireDefault(_Group);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Tail = function () {
    function Tail(opts) {
        _classCallCheck(this, Tail);

        this.link = opts['link'] || null;
        this.size = opts['size'] || 2;
        this.during = opts['during'] || _Config2.default.animationDefaultDuring;
        this.loop = opts['loop'];
        this.callback = opts['callback'];
    }

    _createClass(Tail, [{
        key: 'render',
        value: function render() {
            var _this = this;

            var g = new _Group2.default();

            for (var index = 60; index > 0; index--) {
                var c = new _Circle2.default({
                    shape: {
                        cx: 0,
                        cy: 0,
                        r: this.size
                    },
                    style: {
                        fill: 'rgba(255, 255, 255, ' + index * 0.003 + ')'
                    },
                    position: [0, 0]
                });

                g.add(c);
            }

            if (this.link) {
                g.animate('', this.loop).when(this.during, {
                    position: [1, 0]
                }).during(function (i, t) {
                    var tmp = t;

                    for (var _index = 0; _index < g.childCount(); _index++) {
                        if (tmp >= 0) {
                            var child = g.childAt(_index);

                            if (tmp >= 0.98) {
                                var _pos = _this.link.pointAt(1);
                                child.position = _pos;
                                child.style.opacity = 0;
                                continue;
                            }

                            var pos = _this.link.pointAt(tmp);
                            child.position = pos;
                            child.style.opacity = 1;
                        }

                        tmp -= 0.005;
                    }
                }).start(_Config2.default.animationEasing).done(this.callback);
            }

            return g;
        }
    }]);

    return Tail;
}();

exports.default = Tail;

/***/ }),

/***/ 219:
/***/ (function(module, exports) {

/**
 * Slice reference.
 */

var slice = [].slice;

/**
 * Bind `obj` to `fn`.
 *
 * @param {Object} obj
 * @param {Function|String} fn or string
 * @return {Function}
 * @api public
 */

module.exports = function(obj, fn){
  if ('string' == typeof fn) fn = obj[fn];
  if ('function' != typeof fn) throw new Error('bind() requires a function');
  var args = slice.call(arguments, 2);
  return function(){
    return fn.apply(obj, args.concat(slice.call(arguments)));
  }
};


/***/ }),

/***/ 24:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export $override */
/* unused harmony export clone */
/* harmony export (immutable) */ __webpack_exports__["l"] = merge;
/* unused harmony export mergeAll */
/* harmony export (immutable) */ __webpack_exports__["k"] = extend;
/* unused harmony export defaults */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "q", function() { return createCanvas; });
/* harmony export (immutable) */ __webpack_exports__["p"] = getContext;
/* harmony export (immutable) */ __webpack_exports__["c"] = indexOf;
/* harmony export (immutable) */ __webpack_exports__["a"] = inherits;
/* harmony export (immutable) */ __webpack_exports__["d"] = mixin;
/* harmony export (immutable) */ __webpack_exports__["e"] = isArrayLike;
/* harmony export (immutable) */ __webpack_exports__["f"] = each;
/* harmony export (immutable) */ __webpack_exports__["g"] = map;
/* unused harmony export reduce */
/* unused harmony export filter */
/* unused harmony export find */
/* harmony export (immutable) */ __webpack_exports__["b"] = bind;
/* unused harmony export curry */
/* unused harmony export isArray */
/* harmony export (immutable) */ __webpack_exports__["j"] = isFunction;
/* harmony export (immutable) */ __webpack_exports__["i"] = isString;
/* harmony export (immutable) */ __webpack_exports__["h"] = isObject;
/* unused harmony export isBuiltInObject */
/* unused harmony export isDom */
/* unused harmony export eqNaN */
/* unused harmony export retrieve */
/* harmony export (immutable) */ __webpack_exports__["o"] = retrieve2;
/* harmony export (immutable) */ __webpack_exports__["n"] = retrieve3;
/* unused harmony export slice */
/* harmony export (immutable) */ __webpack_exports__["m"] = normalizeCssArray;
/* unused harmony export assert */
/* unused harmony export setAsPrimitive */
/* unused harmony export isPrimitive */
/* unused harmony export createHashMap */
/* unused harmony export noop */
/**
 * @module zrender/core/util
 */

// 用于处理merge时无法遍历Date等对象的问题
var BUILTIN_OBJECT = {
    '[object Function]': 1,
    '[object RegExp]': 1,
    '[object Date]': 1,
    '[object Error]': 1,
    '[object CanvasGradient]': 1,
    '[object CanvasPattern]': 1,
    // For node-canvas
    '[object Image]': 1,
    '[object Canvas]': 1
};

var TYPED_ARRAY = {
    '[object Int8Array]': 1,
    '[object Uint8Array]': 1,
    '[object Uint8ClampedArray]': 1,
    '[object Int16Array]': 1,
    '[object Uint16Array]': 1,
    '[object Int32Array]': 1,
    '[object Uint32Array]': 1,
    '[object Float32Array]': 1,
    '[object Float64Array]': 1
};

var objToString = Object.prototype.toString;

var arrayProto = Array.prototype;
var nativeForEach = arrayProto.forEach;
var nativeFilter = arrayProto.filter;
var nativeSlice = arrayProto.slice;
var nativeMap = arrayProto.map;
var nativeReduce = arrayProto.reduce;

// Avoid assign to an exported variable, for transforming to cjs.
var methods = {};

function $override(name, fn) {
    methods[name] = fn;
}

/**
 * Those data types can be cloned:
 *     Plain object, Array, TypedArray, number, string, null, undefined.
 * Those data types will be assgined using the orginal data:
 *     BUILTIN_OBJECT
 * Instance of user defined class will be cloned to a plain object, without
 * properties in prototype.
 * Other data types is not supported (not sure what will happen).
 *
 * Caution: do not support clone Date, for performance consideration.
 * (There might be a large number of date in `series.data`).
 * So date should not be modified in and out of echarts.
 *
 * @param {*} source
 * @return {*} new
 */
function clone(source) {
    if (source == null || typeof source != 'object') {
        return source;
    }

    var result = source;
    var typeStr = objToString.call(source);

    if (typeStr === '[object Array]') {
        result = [];
        for (var i = 0, len = source.length; i < len; i++) {
            result[i] = clone(source[i]);
        }
    }
    else if (TYPED_ARRAY[typeStr]) {
        var Ctor = source.constructor;
        if (source.constructor.from) {
            result = Ctor.from(source);
        }
        else {
            result = new Ctor(source.length);
            for (var i = 0, len = source.length; i < len; i++) {
                result[i] = clone(source[i]);
            }
        }
    }
    else if (!BUILTIN_OBJECT[typeStr] && !isPrimitive(source) && !isDom(source)) {
        result = {};
        for (var key in source) {
            if (source.hasOwnProperty(key)) {
                result[key] = clone(source[key]);
            }
        }
    }

    return result;
}

/**
 * @memberOf module:zrender/core/util
 * @param {*} target
 * @param {*} source
 * @param {boolean} [overwrite=false]
 */
function merge(target, source, overwrite) {
    // We should escapse that source is string
    // and enter for ... in ...
    if (!isObject(source) || !isObject(target)) {
        return overwrite ? clone(source) : target;
    }

    for (var key in source) {
        if (source.hasOwnProperty(key)) {
            var targetProp = target[key];
            var sourceProp = source[key];

            if (isObject(sourceProp)
                && isObject(targetProp)
                && !isArray(sourceProp)
                && !isArray(targetProp)
                && !isDom(sourceProp)
                && !isDom(targetProp)
                && !isBuiltInObject(sourceProp)
                && !isBuiltInObject(targetProp)
                && !isPrimitive(sourceProp)
                && !isPrimitive(targetProp)
            ) {
                // 如果需要递归覆盖，就递归调用merge
                merge(targetProp, sourceProp, overwrite);
            }
            else if (overwrite || !(key in target)) {
                // 否则只处理overwrite为true，或者在目标对象中没有此属性的情况
                // NOTE，在 target[key] 不存在的时候也是直接覆盖
                target[key] = clone(source[key], true);
            }
        }
    }

    return target;
}

/**
 * @param {Array} targetAndSources The first item is target, and the rests are source.
 * @param {boolean} [overwrite=false]
 * @return {*} target
 */
function mergeAll(targetAndSources, overwrite) {
    var result = targetAndSources[0];
    for (var i = 1, len = targetAndSources.length; i < len; i++) {
        result = merge(result, targetAndSources[i], overwrite);
    }
    return result;
}

/**
 * @param {*} target
 * @param {*} source
 * @memberOf module:zrender/core/util
 */
function extend(target, source) {
    for (var key in source) {
        if (source.hasOwnProperty(key)) {
            target[key] = source[key];
        }
    }
    return target;
}

/**
 * @param {*} target
 * @param {*} source
 * @param {boolean} [overlay=false]
 * @memberOf module:zrender/core/util
 */
function defaults(target, source, overlay) {
    for (var key in source) {
        if (source.hasOwnProperty(key)
            && (overlay ? source[key] != null : target[key] == null)
        ) {
            target[key] = source[key];
        }
    }
    return target;
}

var createCanvas = function () {
    return methods.createCanvas();
};

methods.createCanvas = function () {
    return document.createElement('canvas');
};

// FIXME
var _ctx;

function getContext() {
    if (!_ctx) {
        // Use util.createCanvas instead of createCanvas
        // because createCanvas may be overwritten in different environment
        _ctx = createCanvas().getContext('2d');
    }
    return _ctx;
}

/**
 * 查询数组中元素的index
 * @memberOf module:zrender/core/util
 */
function indexOf(array, value) {
    if (array) {
        if (array.indexOf) {
            return array.indexOf(value);
        }
        for (var i = 0, len = array.length; i < len; i++) {
            if (array[i] === value) {
                return i;
            }
        }
    }
    return -1;
}

/**
 * 构造类继承关系
 *
 * @memberOf module:zrender/core/util
 * @param {Function} clazz 源类
 * @param {Function} baseClazz 基类
 */
function inherits(clazz, baseClazz) {
    var clazzPrototype = clazz.prototype;
    function F() {}
    F.prototype = baseClazz.prototype;
    clazz.prototype = new F();

    for (var prop in clazzPrototype) {
        clazz.prototype[prop] = clazzPrototype[prop];
    }
    clazz.prototype.constructor = clazz;
    clazz.superClass = baseClazz;
}

/**
 * @memberOf module:zrender/core/util
 * @param {Object|Function} target
 * @param {Object|Function} sorce
 * @param {boolean} overlay
 */
function mixin(target, source, overlay) {
    target = 'prototype' in target ? target.prototype : target;
    source = 'prototype' in source ? source.prototype : source;

    defaults(target, source, overlay);
}

/**
 * Consider typed array.
 * @param {Array|TypedArray} data
 */
function isArrayLike(data) {
    if (! data) {
        return;
    }
    if (typeof data == 'string') {
        return false;
    }
    return typeof data.length == 'number';
}

/**
 * 数组或对象遍历
 * @memberOf module:zrender/core/util
 * @param {Object|Array} obj
 * @param {Function} cb
 * @param {*} [context]
 */
function each(obj, cb, context) {
    if (!(obj && cb)) {
        return;
    }
    if (obj.forEach && obj.forEach === nativeForEach) {
        obj.forEach(cb, context);
    }
    else if (obj.length === +obj.length) {
        for (var i = 0, len = obj.length; i < len; i++) {
            cb.call(context, obj[i], i, obj);
        }
    }
    else {
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                cb.call(context, obj[key], key, obj);
            }
        }
    }
}

/**
 * 数组映射
 * @memberOf module:zrender/core/util
 * @param {Array} obj
 * @param {Function} cb
 * @param {*} [context]
 * @return {Array}
 */
function map(obj, cb, context) {
    if (!(obj && cb)) {
        return;
    }
    if (obj.map && obj.map === nativeMap) {
        return obj.map(cb, context);
    }
    else {
        var result = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            result.push(cb.call(context, obj[i], i, obj));
        }
        return result;
    }
}

/**
 * @memberOf module:zrender/core/util
 * @param {Array} obj
 * @param {Function} cb
 * @param {Object} [memo]
 * @param {*} [context]
 * @return {Array}
 */
function reduce(obj, cb, memo, context) {
    if (!(obj && cb)) {
        return;
    }
    if (obj.reduce && obj.reduce === nativeReduce) {
        return obj.reduce(cb, memo, context);
    }
    else {
        for (var i = 0, len = obj.length; i < len; i++) {
            memo = cb.call(context, memo, obj[i], i, obj);
        }
        return memo;
    }
}

/**
 * 数组过滤
 * @memberOf module:zrender/core/util
 * @param {Array} obj
 * @param {Function} cb
 * @param {*} [context]
 * @return {Array}
 */
function filter(obj, cb, context) {
    if (!(obj && cb)) {
        return;
    }
    if (obj.filter && obj.filter === nativeFilter) {
        return obj.filter(cb, context);
    }
    else {
        var result = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            if (cb.call(context, obj[i], i, obj)) {
                result.push(obj[i]);
            }
        }
        return result;
    }
}

/**
 * 数组项查找
 * @memberOf module:zrender/core/util
 * @param {Array} obj
 * @param {Function} cb
 * @param {*} [context]
 * @return {*}
 */
function find(obj, cb, context) {
    if (!(obj && cb)) {
        return;
    }
    for (var i = 0, len = obj.length; i < len; i++) {
        if (cb.call(context, obj[i], i, obj)) {
            return obj[i];
        }
    }
}

/**
 * @memberOf module:zrender/core/util
 * @param {Function} func
 * @param {*} context
 * @return {Function}
 */
function bind(func, context) {
    var args = nativeSlice.call(arguments, 2);
    return function () {
        return func.apply(context, args.concat(nativeSlice.call(arguments)));
    };
}

/**
 * @memberOf module:zrender/core/util
 * @param {Function} func
 * @return {Function}
 */
function curry(func) {
    var args = nativeSlice.call(arguments, 1);
    return function () {
        return func.apply(this, args.concat(nativeSlice.call(arguments)));
    };
}

/**
 * @memberOf module:zrender/core/util
 * @param {*} value
 * @return {boolean}
 */
function isArray(value) {
    return objToString.call(value) === '[object Array]';
}

/**
 * @memberOf module:zrender/core/util
 * @param {*} value
 * @return {boolean}
 */
function isFunction(value) {
    return typeof value === 'function';
}

/**
 * @memberOf module:zrender/core/util
 * @param {*} value
 * @return {boolean}
 */
function isString(value) {
    return objToString.call(value) === '[object String]';
}

/**
 * @memberOf module:zrender/core/util
 * @param {*} value
 * @return {boolean}
 */
function isObject(value) {
    // Avoid a V8 JIT bug in Chrome 19-20.
    // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
    var type = typeof value;
    return type === 'function' || (!!value && type == 'object');
}

/**
 * @memberOf module:zrender/core/util
 * @param {*} value
 * @return {boolean}
 */
function isBuiltInObject(value) {
    return !!BUILTIN_OBJECT[objToString.call(value)];
}

/**
 * @memberOf module:zrender/core/util
 * @param {*} value
 * @return {boolean}
 */
function isDom(value) {
    return typeof value === 'object'
        && typeof value.nodeType === 'number'
        && typeof value.ownerDocument === 'object';
}

/**
 * Whether is exactly NaN. Notice isNaN('a') returns true.
 * @param {*} value
 * @return {boolean}
 */
function eqNaN(value) {
    return value !== value;
}

/**
 * If value1 is not null, then return value1, otherwise judget rest of values.
 * Low performance.
 * @memberOf module:zrender/core/util
 * @return {*} Final value
 */
function retrieve(values) {
    for (var i = 0, len = arguments.length; i < len; i++) {
        if (arguments[i] != null) {
            return arguments[i];
        }
    }
}

function retrieve2(value0, value1) {
    return value0 != null
        ? value0
        : value1;
}

function retrieve3(value0, value1, value2) {
    return value0 != null
        ? value0
        : value1 != null
        ? value1
        : value2;
}

/**
 * @memberOf module:zrender/core/util
 * @param {Array} arr
 * @param {number} startIndex
 * @param {number} endIndex
 * @return {Array}
 */
function slice() {
    return Function.call.apply(nativeSlice, arguments);
}

/**
 * Normalize css liked array configuration
 * e.g.
 *  3 => [3, 3, 3, 3]
 *  [4, 2] => [4, 2, 4, 2]
 *  [4, 3, 2] => [4, 3, 2, 3]
 * @param {number|Array.<number>} val
 * @return {Array.<number>}
 */
function normalizeCssArray(val) {
    if (typeof (val) === 'number') {
        return [val, val, val, val];
    }
    var len = val.length;
    if (len === 2) {
        // vertical | horizontal
        return [val[0], val[1], val[0], val[1]];
    }
    else if (len === 3) {
        // top | horizontal | bottom
        return [val[0], val[1], val[2], val[1]];
    }
    return val;
}

/**
 * @memberOf module:zrender/core/util
 * @param {boolean} condition
 * @param {string} message
 */
function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}

var primitiveKey = '__ec_primitive__';
/**
 * Set an object as primitive to be ignored traversing children in clone or merge
 */
function setAsPrimitive(obj) {
    obj[primitiveKey] = true;
}

function isPrimitive(obj) {
    return obj[primitiveKey];
}

/**
 * @constructor
 * @param {Object} obj Only apply `ownProperty`.
 */
function HashMap(obj) {
    obj && each(obj, function (value, key) {
        this.set(key, value);
    }, this);
}

// Add prefix to avoid conflict with Object.prototype.
var HASH_MAP_PREFIX = '_ec_';
var HASH_MAP_PREFIX_LENGTH = 4;

HashMap.prototype = {
    constructor: HashMap,
    // Do not provide `has` method to avoid defining what is `has`.
    // (We usually treat `null` and `undefined` as the same, different
    // from ES6 Map).
    get: function (key) {
        return this[HASH_MAP_PREFIX + key];
    },
    set: function (key, value) {
        this[HASH_MAP_PREFIX + key] = value;
        // Comparing with invocation chaining, `return value` is more commonly
        // used in this case: `var someVal = map.set('a', genVal());`
        return value;
    },
    // Although util.each can be performed on this hashMap directly, user
    // should not use the exposed keys, who are prefixed.
    each: function (cb, context) {
        context !== void 0 && (cb = bind(cb, context));
        for (var prefixedKey in this) {
            this.hasOwnProperty(prefixedKey)
                && cb(this[prefixedKey], prefixedKey.slice(HASH_MAP_PREFIX_LENGTH));
        }
    },
    // Do not use this method if performance sensitive.
    removeKey: function (key) {
        delete this[HASH_MAP_PREFIX + key];
    }
};

function createHashMap(obj) {
    return new HashMap(obj);
}

function noop() {}


/***/ }),

/***/ 300:
/***/ (function(module, exports, __webpack_require__) {

/**
 * Module dependencies
 */

var XMLHttpRequest = __webpack_require__(183);
var XHR = __webpack_require__(690);
var JSONP = __webpack_require__(689);
var websocket = __webpack_require__(691);

/**
 * Export transports.
 */

exports.polling = polling;
exports.websocket = websocket;

/**
 * Polling transport polymorphic constructor.
 * Decides on xhr vs jsonp based on feature detection.
 *
 * @api private
 */

function polling (opts) {
  var xhr;
  var xd = false;
  var xs = false;
  var jsonp = false !== opts.jsonp;

  if (typeof location !== 'undefined') {
    var isSSL = 'https:' === location.protocol;
    var port = location.port;

    // some user agents have empty `location.port`
    if (!port) {
      port = isSSL ? 443 : 80;
    }

    xd = opts.hostname !== location.hostname || port !== opts.port;
    xs = opts.secure !== isSSL;
  }

  opts.xdomain = xd;
  opts.xscheme = xs;
  xhr = new XMLHttpRequest(opts);

  if ('open' in xhr && !opts.forceJSONP) {
    return new XHR(opts);
  } else {
    if (!jsonp) throw new Error('JSONP disabled');
    return new JSONP(opts);
  }
}


/***/ }),

/***/ 301:
/***/ (function(module, exports, __webpack_require__) {

/**
 * Module dependencies.
 */

var Transport = __webpack_require__(182);
var parseqs = __webpack_require__(129);
var parser = __webpack_require__(74);
var inherit = __webpack_require__(107);
var yeast = __webpack_require__(342);
var debug = __webpack_require__(127)('engine.io-client:polling');

/**
 * Module exports.
 */

module.exports = Polling;

/**
 * Is XHR2 supported?
 */

var hasXHR2 = (function () {
  var XMLHttpRequest = __webpack_require__(183);
  var xhr = new XMLHttpRequest({ xdomain: false });
  return null != xhr.responseType;
})();

/**
 * Polling interface.
 *
 * @param {Object} opts
 * @api private
 */

function Polling (opts) {
  var forceBase64 = (opts && opts.forceBase64);
  if (!hasXHR2 || forceBase64) {
    this.supportsBinary = false;
  }
  Transport.call(this, opts);
}

/**
 * Inherits from Transport.
 */

inherit(Polling, Transport);

/**
 * Transport name.
 */

Polling.prototype.name = 'polling';

/**
 * Opens the socket (triggers polling). We write a PING message to determine
 * when the transport is open.
 *
 * @api private
 */

Polling.prototype.doOpen = function () {
  this.poll();
};

/**
 * Pauses polling.
 *
 * @param {Function} callback upon buffers are flushed and transport is paused
 * @api private
 */

Polling.prototype.pause = function (onPause) {
  var self = this;

  this.readyState = 'pausing';

  function pause () {
    debug('paused');
    self.readyState = 'paused';
    onPause();
  }

  if (this.polling || !this.writable) {
    var total = 0;

    if (this.polling) {
      debug('we are currently polling - waiting to pause');
      total++;
      this.once('pollComplete', function () {
        debug('pre-pause polling complete');
        --total || pause();
      });
    }

    if (!this.writable) {
      debug('we are currently writing - waiting to pause');
      total++;
      this.once('drain', function () {
        debug('pre-pause writing complete');
        --total || pause();
      });
    }
  } else {
    pause();
  }
};

/**
 * Starts polling cycle.
 *
 * @api public
 */

Polling.prototype.poll = function () {
  debug('polling');
  this.polling = true;
  this.doPoll();
  this.emit('poll');
};

/**
 * Overloads onData to detect payloads.
 *
 * @api private
 */

Polling.prototype.onData = function (data) {
  var self = this;
  debug('polling got data %s', data);
  var callback = function (packet, index, total) {
    // if its the first message we consider the transport open
    if ('opening' === self.readyState) {
      self.onOpen();
    }

    // if its a close packet, we close the ongoing requests
    if ('close' === packet.type) {
      self.onClose();
      return false;
    }

    // otherwise bypass onData and handle the message
    self.onPacket(packet);
  };

  // decode payload
  parser.decodePayload(data, this.socket.binaryType, callback);

  // if an event did not trigger closing
  if ('closed' !== this.readyState) {
    // if we got data we're not polling
    this.polling = false;
    this.emit('pollComplete');

    if ('open' === this.readyState) {
      this.poll();
    } else {
      debug('ignoring poll - transport state "%s"', this.readyState);
    }
  }
};

/**
 * For polling, send a close packet.
 *
 * @api private
 */

Polling.prototype.doClose = function () {
  var self = this;

  function close () {
    debug('writing close packet');
    self.write([{ type: 'close' }]);
  }

  if ('open' === this.readyState) {
    debug('transport open - closing');
    close();
  } else {
    // in case we're trying to close while
    // handshaking is in progress (GH-164)
    debug('transport not open - deferring close');
    this.once('open', close);
  }
};

/**
 * Writes a packets payload.
 *
 * @param {Array} data packets
 * @param {Function} drain callback
 * @api private
 */

Polling.prototype.write = function (packets) {
  var self = this;
  this.writable = false;
  var callbackfn = function () {
    self.writable = true;
    self.emit('drain');
  };

  parser.encodePayload(packets, this.supportsBinary, function (data) {
    self.doWrite(data, callbackfn);
  });
};

/**
 * Generates uri for connection.
 *
 * @api private
 */

Polling.prototype.uri = function () {
  var query = this.query || {};
  var schema = this.secure ? 'https' : 'http';
  var port = '';

  // cache busting is forced
  if (false !== this.timestampRequests) {
    query[this.timestampParam] = yeast();
  }

  if (!this.supportsBinary && !query.sid) {
    query.b64 = 1;
  }

  query = parseqs.encode(query);

  // avoid port if default for schema
  if (this.port && (('https' === schema && Number(this.port) !== 443) ||
     ('http' === schema && Number(this.port) !== 80))) {
    port = ':' + this.port;
  }

  // prepend ? to query
  if (query.length) {
    query = '?' + query;
  }

  var ipv6 = this.hostname.indexOf(':') !== -1;
  return schema + '://' + (ipv6 ? '[' + this.hostname + ']' : this.hostname) + port + this.path + query;
};


/***/ }),

/***/ 305:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Buffer) {/* global Blob File */

/*
 * Module requirements.
 */

var isArray = __webpack_require__(716);

var toString = Object.prototype.toString;
var withNativeBlob = typeof Blob === 'function' ||
                        typeof Blob !== 'undefined' && toString.call(Blob) === '[object BlobConstructor]';
var withNativeFile = typeof File === 'function' ||
                        typeof File !== 'undefined' && toString.call(File) === '[object FileConstructor]';

/**
 * Module exports.
 */

module.exports = hasBinary;

/**
 * Checks for binary data.
 *
 * Supports Buffer, ArrayBuffer, Blob and File.
 *
 * @param {Object} anything
 * @api public
 */

function hasBinary (obj) {
  if (!obj || typeof obj !== 'object') {
    return false;
  }

  if (isArray(obj)) {
    for (var i = 0, l = obj.length; i < l; i++) {
      if (hasBinary(obj[i])) {
        return true;
      }
    }
    return false;
  }

  if ((typeof Buffer === 'function' && Buffer.isBuffer && Buffer.isBuffer(obj)) ||
    (typeof ArrayBuffer === 'function' && obj instanceof ArrayBuffer) ||
    (withNativeBlob && obj instanceof Blob) ||
    (withNativeFile && obj instanceof File)
  ) {
    return true;
  }

  // see: https://github.com/Automattic/has-binary/pull/4
  if (obj.toJSON && typeof obj.toJSON === 'function' && arguments.length === 1) {
    return hasBinary(obj.toJSON(), true);
  }

  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key) && hasBinary(obj[key])) {
      return true;
    }
  }

  return false;
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(151).Buffer))

/***/ }),

/***/ 306:
/***/ (function(module, exports) {


var indexOf = [].indexOf;

module.exports = function(arr, obj){
  if (indexOf) return arr.indexOf(obj);
  for (var i = 0; i < arr.length; ++i) {
    if (arr[i] === obj) return i;
  }
  return -1;
};

/***/ }),

/***/ 307:
/***/ (function(module, exports) {

/**
 * Parses an URI
 *
 * @author Steven Levithan <stevenlevithan.com> (MIT license)
 * @api private
 */

var re = /^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;

var parts = [
    'source', 'protocol', 'authority', 'userInfo', 'user', 'password', 'host', 'port', 'relative', 'path', 'directory', 'file', 'query', 'anchor'
];

module.exports = function parseuri(str) {
    var src = str,
        b = str.indexOf('['),
        e = str.indexOf(']');

    if (b != -1 && e != -1) {
        str = str.substring(0, b) + str.substring(b, e).replace(/:/g, ';') + str.substring(e, str.length);
    }

    var m = re.exec(str || ''),
        uri = {},
        i = 14;

    while (i--) {
        uri[parts[i]] = m[i] || '';
    }

    if (b != -1 && e != -1) {
        uri.source = src;
        uri.host = uri.host.substring(1, uri.host.length - 1).replace(/;/g, ':');
        uri.authority = uri.authority.replace('[', '').replace(']', '').replace(/;/g, ':');
        uri.ipv6uri = true;
    }

    return uri;
};


/***/ }),

/***/ 337:
/***/ (function(module, exports, __webpack_require__) {


/**
 * Module dependencies.
 */

var eio = __webpack_require__(687);
var Socket = __webpack_require__(339);
var Emitter = __webpack_require__(65);
var parser = __webpack_require__(202);
var on = __webpack_require__(338);
var bind = __webpack_require__(219);
var debug = __webpack_require__(137)('socket.io-client:manager');
var indexOf = __webpack_require__(306);
var Backoff = __webpack_require__(386);

/**
 * IE6+ hasOwnProperty
 */

var has = Object.prototype.hasOwnProperty;

/**
 * Module exports
 */

module.exports = Manager;

/**
 * `Manager` constructor.
 *
 * @param {String} engine instance or engine uri/opts
 * @param {Object} options
 * @api public
 */

function Manager (uri, opts) {
  if (!(this instanceof Manager)) return new Manager(uri, opts);
  if (uri && ('object' === typeof uri)) {
    opts = uri;
    uri = undefined;
  }
  opts = opts || {};

  opts.path = opts.path || '/socket.io';
  this.nsps = {};
  this.subs = [];
  this.opts = opts;
  this.reconnection(opts.reconnection !== false);
  this.reconnectionAttempts(opts.reconnectionAttempts || Infinity);
  this.reconnectionDelay(opts.reconnectionDelay || 1000);
  this.reconnectionDelayMax(opts.reconnectionDelayMax || 5000);
  this.randomizationFactor(opts.randomizationFactor || 0.5);
  this.backoff = new Backoff({
    min: this.reconnectionDelay(),
    max: this.reconnectionDelayMax(),
    jitter: this.randomizationFactor()
  });
  this.timeout(null == opts.timeout ? 20000 : opts.timeout);
  this.readyState = 'closed';
  this.uri = uri;
  this.connecting = [];
  this.lastPing = null;
  this.encoding = false;
  this.packetBuffer = [];
  var _parser = opts.parser || parser;
  this.encoder = new _parser.Encoder();
  this.decoder = new _parser.Decoder();
  this.autoConnect = opts.autoConnect !== false;
  if (this.autoConnect) this.open();
}

/**
 * Propagate given event to sockets and emit on `this`
 *
 * @api private
 */

Manager.prototype.emitAll = function () {
  this.emit.apply(this, arguments);
  for (var nsp in this.nsps) {
    if (has.call(this.nsps, nsp)) {
      this.nsps[nsp].emit.apply(this.nsps[nsp], arguments);
    }
  }
};

/**
 * Update `socket.id` of all sockets
 *
 * @api private
 */

Manager.prototype.updateSocketIds = function () {
  for (var nsp in this.nsps) {
    if (has.call(this.nsps, nsp)) {
      this.nsps[nsp].id = this.generateId(nsp);
    }
  }
};

/**
 * generate `socket.id` for the given `nsp`
 *
 * @param {String} nsp
 * @return {String}
 * @api private
 */

Manager.prototype.generateId = function (nsp) {
  return (nsp === '/' ? '' : (nsp + '#')) + this.engine.id;
};

/**
 * Mix in `Emitter`.
 */

Emitter(Manager.prototype);

/**
 * Sets the `reconnection` config.
 *
 * @param {Boolean} true/false if it should automatically reconnect
 * @return {Manager} self or value
 * @api public
 */

Manager.prototype.reconnection = function (v) {
  if (!arguments.length) return this._reconnection;
  this._reconnection = !!v;
  return this;
};

/**
 * Sets the reconnection attempts config.
 *
 * @param {Number} max reconnection attempts before giving up
 * @return {Manager} self or value
 * @api public
 */

Manager.prototype.reconnectionAttempts = function (v) {
  if (!arguments.length) return this._reconnectionAttempts;
  this._reconnectionAttempts = v;
  return this;
};

/**
 * Sets the delay between reconnections.
 *
 * @param {Number} delay
 * @return {Manager} self or value
 * @api public
 */

Manager.prototype.reconnectionDelay = function (v) {
  if (!arguments.length) return this._reconnectionDelay;
  this._reconnectionDelay = v;
  this.backoff && this.backoff.setMin(v);
  return this;
};

Manager.prototype.randomizationFactor = function (v) {
  if (!arguments.length) return this._randomizationFactor;
  this._randomizationFactor = v;
  this.backoff && this.backoff.setJitter(v);
  return this;
};

/**
 * Sets the maximum delay between reconnections.
 *
 * @param {Number} delay
 * @return {Manager} self or value
 * @api public
 */

Manager.prototype.reconnectionDelayMax = function (v) {
  if (!arguments.length) return this._reconnectionDelayMax;
  this._reconnectionDelayMax = v;
  this.backoff && this.backoff.setMax(v);
  return this;
};

/**
 * Sets the connection timeout. `false` to disable
 *
 * @return {Manager} self or value
 * @api public
 */

Manager.prototype.timeout = function (v) {
  if (!arguments.length) return this._timeout;
  this._timeout = v;
  return this;
};

/**
 * Starts trying to reconnect if reconnection is enabled and we have not
 * started reconnecting yet
 *
 * @api private
 */

Manager.prototype.maybeReconnectOnOpen = function () {
  // Only try to reconnect if it's the first time we're connecting
  if (!this.reconnecting && this._reconnection && this.backoff.attempts === 0) {
    // keeps reconnection from firing twice for the same reconnection loop
    this.reconnect();
  }
};

/**
 * Sets the current transport `socket`.
 *
 * @param {Function} optional, callback
 * @return {Manager} self
 * @api public
 */

Manager.prototype.open =
Manager.prototype.connect = function (fn, opts) {
  debug('readyState %s', this.readyState);
  if (~this.readyState.indexOf('open')) return this;

  debug('opening %s', this.uri);
  this.engine = eio(this.uri, this.opts);
  var socket = this.engine;
  var self = this;
  this.readyState = 'opening';
  this.skipReconnect = false;

  // emit `open`
  var openSub = on(socket, 'open', function () {
    self.onopen();
    fn && fn();
  });

  // emit `connect_error`
  var errorSub = on(socket, 'error', function (data) {
    debug('connect_error');
    self.cleanup();
    self.readyState = 'closed';
    self.emitAll('connect_error', data);
    if (fn) {
      var err = new Error('Connection error');
      err.data = data;
      fn(err);
    } else {
      // Only do this if there is no fn to handle the error
      self.maybeReconnectOnOpen();
    }
  });

  // emit `connect_timeout`
  if (false !== this._timeout) {
    var timeout = this._timeout;
    debug('connect attempt will timeout after %d', timeout);

    // set timer
    var timer = setTimeout(function () {
      debug('connect attempt timed out after %d', timeout);
      openSub.destroy();
      socket.close();
      socket.emit('error', 'timeout');
      self.emitAll('connect_timeout', timeout);
    }, timeout);

    this.subs.push({
      destroy: function () {
        clearTimeout(timer);
      }
    });
  }

  this.subs.push(openSub);
  this.subs.push(errorSub);

  return this;
};

/**
 * Called upon transport open.
 *
 * @api private
 */

Manager.prototype.onopen = function () {
  debug('open');

  // clear old subs
  this.cleanup();

  // mark as open
  this.readyState = 'open';
  this.emit('open');

  // add new subs
  var socket = this.engine;
  this.subs.push(on(socket, 'data', bind(this, 'ondata')));
  this.subs.push(on(socket, 'ping', bind(this, 'onping')));
  this.subs.push(on(socket, 'pong', bind(this, 'onpong')));
  this.subs.push(on(socket, 'error', bind(this, 'onerror')));
  this.subs.push(on(socket, 'close', bind(this, 'onclose')));
  this.subs.push(on(this.decoder, 'decoded', bind(this, 'ondecoded')));
};

/**
 * Called upon a ping.
 *
 * @api private
 */

Manager.prototype.onping = function () {
  this.lastPing = new Date();
  this.emitAll('ping');
};

/**
 * Called upon a packet.
 *
 * @api private
 */

Manager.prototype.onpong = function () {
  this.emitAll('pong', new Date() - this.lastPing);
};

/**
 * Called with data.
 *
 * @api private
 */

Manager.prototype.ondata = function (data) {
  this.decoder.add(data);
};

/**
 * Called when parser fully decodes a packet.
 *
 * @api private
 */

Manager.prototype.ondecoded = function (packet) {
  this.emit('packet', packet);
};

/**
 * Called upon socket error.
 *
 * @api private
 */

Manager.prototype.onerror = function (err) {
  debug('error', err);
  this.emitAll('error', err);
};

/**
 * Creates a new socket for the given `nsp`.
 *
 * @return {Socket}
 * @api public
 */

Manager.prototype.socket = function (nsp, opts) {
  var socket = this.nsps[nsp];
  if (!socket) {
    socket = new Socket(this, nsp, opts);
    this.nsps[nsp] = socket;
    var self = this;
    socket.on('connecting', onConnecting);
    socket.on('connect', function () {
      socket.id = self.generateId(nsp);
    });

    if (this.autoConnect) {
      // manually call here since connecting event is fired before listening
      onConnecting();
    }
  }

  function onConnecting () {
    if (!~indexOf(self.connecting, socket)) {
      self.connecting.push(socket);
    }
  }

  return socket;
};

/**
 * Called upon a socket close.
 *
 * @param {Socket} socket
 */

Manager.prototype.destroy = function (socket) {
  var index = indexOf(this.connecting, socket);
  if (~index) this.connecting.splice(index, 1);
  if (this.connecting.length) return;

  this.close();
};

/**
 * Writes a packet.
 *
 * @param {Object} packet
 * @api private
 */

Manager.prototype.packet = function (packet) {
  debug('writing packet %j', packet);
  var self = this;
  if (packet.query && packet.type === 0) packet.nsp += '?' + packet.query;

  if (!self.encoding) {
    // encode, then write to engine with result
    self.encoding = true;
    this.encoder.encode(packet, function (encodedPackets) {
      for (var i = 0; i < encodedPackets.length; i++) {
        self.engine.write(encodedPackets[i], packet.options);
      }
      self.encoding = false;
      self.processPacketQueue();
    });
  } else { // add packet to the queue
    self.packetBuffer.push(packet);
  }
};

/**
 * If packet buffer is non-empty, begins encoding the
 * next packet in line.
 *
 * @api private
 */

Manager.prototype.processPacketQueue = function () {
  if (this.packetBuffer.length > 0 && !this.encoding) {
    var pack = this.packetBuffer.shift();
    this.packet(pack);
  }
};

/**
 * Clean up transport subscriptions and packet buffer.
 *
 * @api private
 */

Manager.prototype.cleanup = function () {
  debug('cleanup');

  var subsLength = this.subs.length;
  for (var i = 0; i < subsLength; i++) {
    var sub = this.subs.shift();
    sub.destroy();
  }

  this.packetBuffer = [];
  this.encoding = false;
  this.lastPing = null;

  this.decoder.destroy();
};

/**
 * Close the current socket.
 *
 * @api private
 */

Manager.prototype.close =
Manager.prototype.disconnect = function () {
  debug('disconnect');
  this.skipReconnect = true;
  this.reconnecting = false;
  if ('opening' === this.readyState) {
    // `onclose` will not fire because
    // an open event never happened
    this.cleanup();
  }
  this.backoff.reset();
  this.readyState = 'closed';
  if (this.engine) this.engine.close();
};

/**
 * Called upon engine close.
 *
 * @api private
 */

Manager.prototype.onclose = function (reason) {
  debug('onclose');

  this.cleanup();
  this.backoff.reset();
  this.readyState = 'closed';
  this.emit('close', reason);

  if (this._reconnection && !this.skipReconnect) {
    this.reconnect();
  }
};

/**
 * Attempt a reconnection.
 *
 * @api private
 */

Manager.prototype.reconnect = function () {
  if (this.reconnecting || this.skipReconnect) return this;

  var self = this;

  if (this.backoff.attempts >= this._reconnectionAttempts) {
    debug('reconnect failed');
    this.backoff.reset();
    this.emitAll('reconnect_failed');
    this.reconnecting = false;
  } else {
    var delay = this.backoff.duration();
    debug('will wait %dms before reconnect attempt', delay);

    this.reconnecting = true;
    var timer = setTimeout(function () {
      if (self.skipReconnect) return;

      debug('attempting reconnect');
      self.emitAll('reconnect_attempt', self.backoff.attempts);
      self.emitAll('reconnecting', self.backoff.attempts);

      // check again for the case socket closed in above events
      if (self.skipReconnect) return;

      self.open(function (err) {
        if (err) {
          debug('reconnect attempt error');
          self.reconnecting = false;
          self.reconnect();
          self.emitAll('reconnect_error', err.data);
        } else {
          debug('reconnect success');
          self.onreconnect();
        }
      });
    }, delay);

    this.subs.push({
      destroy: function () {
        clearTimeout(timer);
      }
    });
  }
};

/**
 * Called upon successful reconnect.
 *
 * @api private
 */

Manager.prototype.onreconnect = function () {
  var attempt = this.backoff.attempts;
  this.reconnecting = false;
  this.backoff.reset();
  this.updateSocketIds();
  this.emitAll('reconnect', attempt);
};


/***/ }),

/***/ 338:
/***/ (function(module, exports) {


/**
 * Module exports.
 */

module.exports = on;

/**
 * Helper for subscriptions.
 *
 * @param {Object|EventEmitter} obj with `Emitter` mixin or `EventEmitter`
 * @param {String} event name
 * @param {Function} callback
 * @api public
 */

function on (obj, ev, fn) {
  obj.on(ev, fn);
  return {
    destroy: function () {
      obj.removeListener(ev, fn);
    }
  };
}


/***/ }),

/***/ 339:
/***/ (function(module, exports, __webpack_require__) {


/**
 * Module dependencies.
 */

var parser = __webpack_require__(202);
var Emitter = __webpack_require__(65);
var toArray = __webpack_require__(817);
var on = __webpack_require__(338);
var bind = __webpack_require__(219);
var debug = __webpack_require__(137)('socket.io-client:socket');
var parseqs = __webpack_require__(129);
var hasBin = __webpack_require__(305);

/**
 * Module exports.
 */

module.exports = exports = Socket;

/**
 * Internal events (blacklisted).
 * These events can't be emitted by the user.
 *
 * @api private
 */

var events = {
  connect: 1,
  connect_error: 1,
  connect_timeout: 1,
  connecting: 1,
  disconnect: 1,
  error: 1,
  reconnect: 1,
  reconnect_attempt: 1,
  reconnect_failed: 1,
  reconnect_error: 1,
  reconnecting: 1,
  ping: 1,
  pong: 1
};

/**
 * Shortcut to `Emitter#emit`.
 */

var emit = Emitter.prototype.emit;

/**
 * `Socket` constructor.
 *
 * @api public
 */

function Socket (io, nsp, opts) {
  this.io = io;
  this.nsp = nsp;
  this.json = this; // compat
  this.ids = 0;
  this.acks = {};
  this.receiveBuffer = [];
  this.sendBuffer = [];
  this.connected = false;
  this.disconnected = true;
  this.flags = {};
  if (opts && opts.query) {
    this.query = opts.query;
  }
  if (this.io.autoConnect) this.open();
}

/**
 * Mix in `Emitter`.
 */

Emitter(Socket.prototype);

/**
 * Subscribe to open, close and packet events
 *
 * @api private
 */

Socket.prototype.subEvents = function () {
  if (this.subs) return;

  var io = this.io;
  this.subs = [
    on(io, 'open', bind(this, 'onopen')),
    on(io, 'packet', bind(this, 'onpacket')),
    on(io, 'close', bind(this, 'onclose'))
  ];
};

/**
 * "Opens" the socket.
 *
 * @api public
 */

Socket.prototype.open =
Socket.prototype.connect = function () {
  if (this.connected) return this;

  this.subEvents();
  this.io.open(); // ensure open
  if ('open' === this.io.readyState) this.onopen();
  this.emit('connecting');
  return this;
};

/**
 * Sends a `message` event.
 *
 * @return {Socket} self
 * @api public
 */

Socket.prototype.send = function () {
  var args = toArray(arguments);
  args.unshift('message');
  this.emit.apply(this, args);
  return this;
};

/**
 * Override `emit`.
 * If the event is in `events`, it's emitted normally.
 *
 * @param {String} event name
 * @return {Socket} self
 * @api public
 */

Socket.prototype.emit = function (ev) {
  if (events.hasOwnProperty(ev)) {
    emit.apply(this, arguments);
    return this;
  }

  var args = toArray(arguments);
  var packet = {
    type: (this.flags.binary !== undefined ? this.flags.binary : hasBin(args)) ? parser.BINARY_EVENT : parser.EVENT,
    data: args
  };

  packet.options = {};
  packet.options.compress = !this.flags || false !== this.flags.compress;

  // event ack callback
  if ('function' === typeof args[args.length - 1]) {
    debug('emitting packet with ack id %d', this.ids);
    this.acks[this.ids] = args.pop();
    packet.id = this.ids++;
  }

  if (this.connected) {
    this.packet(packet);
  } else {
    this.sendBuffer.push(packet);
  }

  this.flags = {};

  return this;
};

/**
 * Sends a packet.
 *
 * @param {Object} packet
 * @api private
 */

Socket.prototype.packet = function (packet) {
  packet.nsp = this.nsp;
  this.io.packet(packet);
};

/**
 * Called upon engine `open`.
 *
 * @api private
 */

Socket.prototype.onopen = function () {
  debug('transport is open - connecting');

  // write connect packet if necessary
  if ('/' !== this.nsp) {
    if (this.query) {
      var query = typeof this.query === 'object' ? parseqs.encode(this.query) : this.query;
      debug('sending connect packet with query %s', query);
      this.packet({type: parser.CONNECT, query: query});
    } else {
      this.packet({type: parser.CONNECT});
    }
  }
};

/**
 * Called upon engine `close`.
 *
 * @param {String} reason
 * @api private
 */

Socket.prototype.onclose = function (reason) {
  debug('close (%s)', reason);
  this.connected = false;
  this.disconnected = true;
  delete this.id;
  this.emit('disconnect', reason);
};

/**
 * Called with socket packet.
 *
 * @param {Object} packet
 * @api private
 */

Socket.prototype.onpacket = function (packet) {
  var sameNamespace = packet.nsp === this.nsp;
  var rootNamespaceError = packet.type === parser.ERROR && packet.nsp === '/';

  if (!sameNamespace && !rootNamespaceError) return;

  switch (packet.type) {
    case parser.CONNECT:
      this.onconnect();
      break;

    case parser.EVENT:
      this.onevent(packet);
      break;

    case parser.BINARY_EVENT:
      this.onevent(packet);
      break;

    case parser.ACK:
      this.onack(packet);
      break;

    case parser.BINARY_ACK:
      this.onack(packet);
      break;

    case parser.DISCONNECT:
      this.ondisconnect();
      break;

    case parser.ERROR:
      this.emit('error', packet.data);
      break;
  }
};

/**
 * Called upon a server event.
 *
 * @param {Object} packet
 * @api private
 */

Socket.prototype.onevent = function (packet) {
  var args = packet.data || [];
  debug('emitting event %j', args);

  if (null != packet.id) {
    debug('attaching ack callback to event');
    args.push(this.ack(packet.id));
  }

  if (this.connected) {
    emit.apply(this, args);
  } else {
    this.receiveBuffer.push(args);
  }
};

/**
 * Produces an ack callback to emit with an event.
 *
 * @api private
 */

Socket.prototype.ack = function (id) {
  var self = this;
  var sent = false;
  return function () {
    // prevent double callbacks
    if (sent) return;
    sent = true;
    var args = toArray(arguments);
    debug('sending ack %j', args);

    self.packet({
      type: hasBin(args) ? parser.BINARY_ACK : parser.ACK,
      id: id,
      data: args
    });
  };
};

/**
 * Called upon a server acknowlegement.
 *
 * @param {Object} packet
 * @api private
 */

Socket.prototype.onack = function (packet) {
  var ack = this.acks[packet.id];
  if ('function' === typeof ack) {
    debug('calling ack %s with %j', packet.id, packet.data);
    ack.apply(this, packet.data);
    delete this.acks[packet.id];
  } else {
    debug('bad ack %s', packet.id);
  }
};

/**
 * Called upon server connect.
 *
 * @api private
 */

Socket.prototype.onconnect = function () {
  this.connected = true;
  this.disconnected = false;
  this.emit('connect');
  this.emitBuffered();
};

/**
 * Emit buffered events (received and emitted).
 *
 * @api private
 */

Socket.prototype.emitBuffered = function () {
  var i;
  for (i = 0; i < this.receiveBuffer.length; i++) {
    emit.apply(this, this.receiveBuffer[i]);
  }
  this.receiveBuffer = [];

  for (i = 0; i < this.sendBuffer.length; i++) {
    this.packet(this.sendBuffer[i]);
  }
  this.sendBuffer = [];
};

/**
 * Called upon server disconnect.
 *
 * @api private
 */

Socket.prototype.ondisconnect = function () {
  debug('server disconnect (%s)', this.nsp);
  this.destroy();
  this.onclose('io server disconnect');
};

/**
 * Called upon forced client/server side disconnections,
 * this method ensures the manager stops tracking us and
 * that reconnections don't get triggered for this.
 *
 * @api private.
 */

Socket.prototype.destroy = function () {
  if (this.subs) {
    // clean subscriptions to avoid reconnections
    for (var i = 0; i < this.subs.length; i++) {
      this.subs[i].destroy();
    }
    this.subs = null;
  }

  this.io.destroy(this);
};

/**
 * Disconnects the socket manually.
 *
 * @return {Socket} self
 * @api public
 */

Socket.prototype.close =
Socket.prototype.disconnect = function () {
  if (this.connected) {
    debug('performing disconnect (%s)', this.nsp);
    this.packet({ type: parser.DISCONNECT });
  }

  // remove socket from pool
  this.destroy();

  if (this.connected) {
    // fire events
    this.onclose('io client disconnect');
  }
  return this;
};

/**
 * Sets the compress flag.
 *
 * @param {Boolean} if `true`, compresses the sending data
 * @return {Socket} self
 * @api public
 */

Socket.prototype.compress = function (compress) {
  this.flags.compress = compress;
  return this;
};

/**
 * Sets the binary flag
 *
 * @param {Boolean} whether the emitted data contains binary
 * @return {Socket} self
 * @api public
 */

Socket.prototype.binary = function (binary) {
  this.flags.binary = binary;
  return this;
};


/***/ }),

/***/ 340:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Buffer) {
module.exports = isBuf;

var withNativeBuffer = typeof Buffer === 'function' && typeof Buffer.isBuffer === 'function';
var withNativeArrayBuffer = typeof ArrayBuffer === 'function';

var isView = function (obj) {
  return typeof ArrayBuffer.isView === 'function' ? ArrayBuffer.isView(obj) : (obj.buffer instanceof ArrayBuffer);
};

/**
 * Returns true if obj is a buffer or an arraybuffer.
 *
 * @api private
 */

function isBuf(obj) {
  return (withNativeBuffer && Buffer.isBuffer(obj)) ||
          (withNativeArrayBuffer && (obj instanceof ArrayBuffer || isView(obj)));
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(151).Buffer))

/***/ }),

/***/ 341:
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};


/***/ }),

/***/ 342:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_'.split('')
  , length = 64
  , map = {}
  , seed = 0
  , i = 0
  , prev;

/**
 * Return a string representing the specified number.
 *
 * @param {Number} num The number to convert.
 * @returns {String} The string representation of the number.
 * @api public
 */
function encode(num) {
  var encoded = '';

  do {
    encoded = alphabet[num % length] + encoded;
    num = Math.floor(num / length);
  } while (num > 0);

  return encoded;
}

/**
 * Return the integer value specified by the given string.
 *
 * @param {String} str The string to convert.
 * @returns {Number} The integer value represented by the string.
 * @api public
 */
function decode(str) {
  var decoded = 0;

  for (i = 0; i < str.length; i++) {
    decoded = decoded * length + map[str.charAt(i)];
  }

  return decoded;
}

/**
 * Yeast: A tiny growing id generator.
 *
 * @returns {String} A unique id.
 * @api public
 */
function yeast() {
  var now = encode(+new Date());

  if (now !== prev) return seed = 0, prev = now;
  return now +'.'+ encode(seed++);
}

//
// Map each character to its index.
//
for (; i < length; i++) map[alphabet[i]] = i;

//
// Expose the `yeast`, `encode` and `decode` functions.
//
yeast.encode = encode;
yeast.decode = decode;
module.exports = yeast;


/***/ }),

/***/ 357:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__core_guid__ = __webpack_require__(362);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__mixin_Eventful__ = __webpack_require__(147);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__mixin_Transformable__ = __webpack_require__(896);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__mixin_Animatable__ = __webpack_require__(894);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__core_util__ = __webpack_require__(24);






/**
 * @alias module:zrender/Element
 * @constructor
 * @extends {module:zrender/mixin/Animatable}
 * @extends {module:zrender/mixin/Transformable}
 * @extends {module:zrender/mixin/Eventful}
 */
var Element = function (opts) { // jshint ignore:line

    __WEBPACK_IMPORTED_MODULE_2__mixin_Transformable__["a" /* default */].call(this, opts);
    __WEBPACK_IMPORTED_MODULE_1__mixin_Eventful__["a" /* default */].call(this, opts);
    __WEBPACK_IMPORTED_MODULE_3__mixin_Animatable__["a" /* default */].call(this, opts);

    /**
     * 画布元素ID
     * @type {string}
     */
    this.id = opts.id || __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__core_guid__["a" /* default */])();
};

Element.prototype = {

    /**
     * 元素类型
     * Element type
     * @type {string}
     */
    type: 'element',

    /**
     * 元素名字
     * Element name
     * @type {string}
     */
    name: '',

    /**
     * ZRender 实例对象，会在 element 添加到 zrender 实例中后自动赋值
     * ZRender instance will be assigned when element is associated with zrender
     * @name module:/zrender/Element#__zr
     * @type {module:zrender/ZRender}
     */
    __zr: null,

    /**
     * 图形是否忽略，为true时忽略图形的绘制以及事件触发
     * If ignore drawing and events of the element object
     * @name module:/zrender/Element#ignore
     * @type {boolean}
     * @default false
     */
    ignore: false,

    /**
     * 用于裁剪的路径(shape)，所有 Group 内的路径在绘制时都会被这个路径裁剪
     * 该路径会继承被裁减对象的变换
     * @type {module:zrender/graphic/Path}
     * @see http://www.w3.org/TR/2dcontext/#clipping-region
     * @readOnly
     */
    clipPath: null,

    /**
     * Drift element
     * @param  {number} dx dx on the global space
     * @param  {number} dy dy on the global space
     */
    drift: function (dx, dy) {
        switch (this.draggable) {
            case 'horizontal':
                dy = 0;
                break;
            case 'vertical':
                dx = 0;
                break;
        }

        var m = this.transform;
        if (!m) {
            m = this.transform = [1, 0, 0, 1, 0, 0];
        }
        m[4] += dx;
        m[5] += dy;

        this.decomposeTransform();
        this.dirty(false);
    },

    /**
     * Hook before update
     */
    beforeUpdate: function () {},
    /**
     * Hook after update
     */
    afterUpdate: function () {},
    /**
     * Update each frame
     */
    update: function () {
        this.updateTransform();
    },

    /**
     * @param  {Function} cb
     * @param  {}   context
     */
    traverse: function (cb, context) {},

    /**
     * @protected
     */
    attrKV: function (key, value) {
        if (key === 'position' || key === 'scale' || key === 'origin') {
            // Copy the array
            if (value) {
                var target = this[key];
                if (!target) {
                    target = this[key] = [];
                }
                target[0] = value[0];
                target[1] = value[1];
            }
        }
        else {
            this[key] = value;
        }
    },

    /**
     * Hide the element
     */
    hide: function () {
        this.ignore = true;
        this.__zr && this.__zr.refresh();
    },

    /**
     * Show the element
     */
    show: function () {
        this.ignore = false;
        this.__zr && this.__zr.refresh();
    },

    /**
     * @param {string|Object} key
     * @param {*} value
     */
    attr: function (key, value) {
        if (typeof key === 'string') {
            this.attrKV(key, value);
        }
        else if (__WEBPACK_IMPORTED_MODULE_4__core_util__["h" /* isObject */](key)) {
            for (var name in key) {
                if (key.hasOwnProperty(name)) {
                    this.attrKV(name, key[name]);
                }
            }
        }

        this.dirty(false);

        return this;
    },

    /**
     * @param {module:zrender/graphic/Path} clipPath
     */
    setClipPath: function (clipPath) {
        var zr = this.__zr;
        if (zr) {
            clipPath.addSelfToZr(zr);
        }

        // Remove previous clip path
        if (this.clipPath && this.clipPath !== clipPath) {
            this.removeClipPath();
        }

        this.clipPath = clipPath;
        clipPath.__zr = zr;
        clipPath.__clipTarget = this;

        this.dirty(false);
    },

    /**
     */
    removeClipPath: function () {
        var clipPath = this.clipPath;
        if (clipPath) {
            if (clipPath.__zr) {
                clipPath.removeSelfFromZr(clipPath.__zr);
            }

            clipPath.__zr = null;
            clipPath.__clipTarget = null;
            this.clipPath = null;

            this.dirty(false);
        }
    },

    /**
     * Add self from zrender instance.
     * Not recursively because it will be invoked when element added to storage.
     * @param {module:zrender/ZRender} zr
     */
    addSelfToZr: function (zr) {
        this.__zr = zr;
        // 添加动画
        var animators = this.animators;
        if (animators) {
            for (var i = 0; i < animators.length; i++) {
                zr.animation.addAnimator(animators[i]);
            }
        }

        if (this.clipPath) {
            this.clipPath.addSelfToZr(zr);
        }
    },

    /**
     * Remove self from zrender instance.
     * Not recursively because it will be invoked when element added to storage.
     * @param {module:zrender/ZRender} zr
     */
    removeSelfFromZr: function (zr) {
        this.__zr = null;
        // 移除动画
        var animators = this.animators;
        if (animators) {
            for (var i = 0; i < animators.length; i++) {
                zr.animation.removeAnimator(animators[i]);
            }
        }

        if (this.clipPath) {
            this.clipPath.removeSelfFromZr(zr);
        }
    }
};

__WEBPACK_IMPORTED_MODULE_4__core_util__["d" /* mixin */](Element, __WEBPACK_IMPORTED_MODULE_3__mixin_Animatable__["a" /* default */]);
__WEBPACK_IMPORTED_MODULE_4__core_util__["d" /* mixin */](Element, __WEBPACK_IMPORTED_MODULE_2__mixin_Transformable__["a" /* default */]);
__WEBPACK_IMPORTED_MODULE_4__core_util__["d" /* mixin */](Element, __WEBPACK_IMPORTED_MODULE_1__mixin_Eventful__["a" /* default */]);

/* harmony default export */ __webpack_exports__["a"] = (Element);

/***/ }),

/***/ 358:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Clip__ = __webpack_require__(876);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__tool_color__ = __webpack_require__(897);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__core_util__ = __webpack_require__(24);
/**
 * @module echarts/animation/Animator
 */





var arraySlice = Array.prototype.slice;

function defaultGetter(target, key) {
    return target[key];
}

function defaultSetter(target, key, value) {
    target[key] = value;
}

/**
 * @param  {number} p0
 * @param  {number} p1
 * @param  {number} percent
 * @return {number}
 */
function interpolateNumber(p0, p1, percent) {
    return (p1 - p0) * percent + p0;
}

/**
 * @param  {string} p0
 * @param  {string} p1
 * @param  {number} percent
 * @return {string}
 */
function interpolateString(p0, p1, percent) {
    return percent > 0.5 ? p1 : p0;
}

/**
 * @param  {Array} p0
 * @param  {Array} p1
 * @param  {number} percent
 * @param  {Array} out
 * @param  {number} arrDim
 */
function interpolateArray(p0, p1, percent, out, arrDim) {
    var len = p0.length;
    if (arrDim == 1) {
        for (var i = 0; i < len; i++) {
            out[i] = interpolateNumber(p0[i], p1[i], percent);
        }
    }
    else {
        var len2 = len && p0[0].length;
        for (var i = 0; i < len; i++) {
            for (var j = 0; j < len2; j++) {
                out[i][j] = interpolateNumber(
                    p0[i][j], p1[i][j], percent
                );
            }
        }
    }
}

// arr0 is source array, arr1 is target array.
// Do some preprocess to avoid error happened when interpolating from arr0 to arr1
function fillArr(arr0, arr1, arrDim) {
    var arr0Len = arr0.length;
    var arr1Len = arr1.length;
    if (arr0Len !== arr1Len) {
        // FIXME Not work for TypedArray
        var isPreviousLarger = arr0Len > arr1Len;
        if (isPreviousLarger) {
            // Cut the previous
            arr0.length = arr1Len;
        }
        else {
            // Fill the previous
            for (var i = arr0Len; i < arr1Len; i++) {
                arr0.push(
                    arrDim === 1 ? arr1[i] : arraySlice.call(arr1[i])
                );
            }
        }
    }
    // Handling NaN value
    var len2 = arr0[0] && arr0[0].length;
    for (var i = 0; i < arr0.length; i++) {
        if (arrDim === 1) {
            if (isNaN(arr0[i])) {
                arr0[i] = arr1[i];
            }
        }
        else {
            for (var j = 0; j < len2; j++) {
                if (isNaN(arr0[i][j])) {
                    arr0[i][j] = arr1[i][j];
                }
            }
        }
    }
}

/**
 * @param  {Array} arr0
 * @param  {Array} arr1
 * @param  {number} arrDim
 * @return {boolean}
 */
function isArraySame(arr0, arr1, arrDim) {
    if (arr0 === arr1) {
        return true;
    }
    var len = arr0.length;
    if (len !== arr1.length) {
        return false;
    }
    if (arrDim === 1) {
        for (var i = 0; i < len; i++) {
            if (arr0[i] !== arr1[i]) {
                return false;
            }
        }
    }
    else {
        var len2 = arr0[0].length;
        for (var i = 0; i < len; i++) {
            for (var j = 0; j < len2; j++) {
                if (arr0[i][j] !== arr1[i][j]) {
                    return false;
                }
            }
        }
    }
    return true;
}

/**
 * Catmull Rom interpolate array
 * @param  {Array} p0
 * @param  {Array} p1
 * @param  {Array} p2
 * @param  {Array} p3
 * @param  {number} t
 * @param  {number} t2
 * @param  {number} t3
 * @param  {Array} out
 * @param  {number} arrDim
 */
function catmullRomInterpolateArray(
    p0, p1, p2, p3, t, t2, t3, out, arrDim
) {
    var len = p0.length;
    if (arrDim == 1) {
        for (var i = 0; i < len; i++) {
            out[i] = catmullRomInterpolate(
                p0[i], p1[i], p2[i], p3[i], t, t2, t3
            );
        }
    }
    else {
        var len2 = p0[0].length;
        for (var i = 0; i < len; i++) {
            for (var j = 0; j < len2; j++) {
                out[i][j] = catmullRomInterpolate(
                    p0[i][j], p1[i][j], p2[i][j], p3[i][j],
                    t, t2, t3
                );
            }
        }
    }
}

/**
 * Catmull Rom interpolate number
 * @param  {number} p0
 * @param  {number} p1
 * @param  {number} p2
 * @param  {number} p3
 * @param  {number} t
 * @param  {number} t2
 * @param  {number} t3
 * @return {number}
 */
function catmullRomInterpolate(p0, p1, p2, p3, t, t2, t3) {
    var v0 = (p2 - p0) * 0.5;
    var v1 = (p3 - p1) * 0.5;
    return (2 * (p1 - p2) + v0 + v1) * t3
            + (-3 * (p1 - p2) - 2 * v0 - v1) * t2
            + v0 * t + p1;
}

function cloneValue(value) {
    if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__core_util__["e" /* isArrayLike */])(value)) {
        var len = value.length;
        if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__core_util__["e" /* isArrayLike */])(value[0])) {
            var ret = [];
            for (var i = 0; i < len; i++) {
                ret.push(arraySlice.call(value[i]));
            }
            return ret;
        }

        return arraySlice.call(value);
    }

    return value;
}

function rgba2String(rgba) {
    rgba[0] = Math.floor(rgba[0]);
    rgba[1] = Math.floor(rgba[1]);
    rgba[2] = Math.floor(rgba[2]);

    return 'rgba(' + rgba.join(',') + ')';
}

function getArrayDim(keyframes) {
    var lastValue = keyframes[keyframes.length - 1].value;
    return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__core_util__["e" /* isArrayLike */])(lastValue && lastValue[0]) ? 2 : 1;
}

function createTrackClip(animator, easing, oneTrackDone, keyframes, propName, forceAnimate) {
    var getter = animator._getter;
    var setter = animator._setter;
    var useSpline = easing === 'spline';

    var trackLen = keyframes.length;
    if (!trackLen) {
        return;
    }
    // Guess data type
    var firstVal = keyframes[0].value;
    var isValueArray = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__core_util__["e" /* isArrayLike */])(firstVal);
    var isValueColor = false;
    var isValueString = false;

    // For vertices morphing
    var arrDim = isValueArray ? getArrayDim(keyframes) : 0;

    var trackMaxTime;
    // Sort keyframe as ascending
    keyframes.sort(function(a, b) {
        return a.time - b.time;
    });

    trackMaxTime = keyframes[trackLen - 1].time;
    // Percents of each keyframe
    var kfPercents = [];
    // Value of each keyframe
    var kfValues = [];
    var prevValue = keyframes[0].value;
    var isAllValueEqual = true;
    for (var i = 0; i < trackLen; i++) {
        kfPercents.push(keyframes[i].time / trackMaxTime);
        // Assume value is a color when it is a string
        var value = keyframes[i].value;

        // Check if value is equal, deep check if value is array
        if (!((isValueArray && isArraySame(value, prevValue, arrDim))
            || (!isValueArray && value === prevValue))) {
            isAllValueEqual = false;
        }
        prevValue = value;

        // Try converting a string to a color array
        if (typeof value == 'string') {
            var colorArray = __WEBPACK_IMPORTED_MODULE_1__tool_color__["a" /* parse */](value);
            if (colorArray) {
                value = colorArray;
                isValueColor = true;
            }
            else {
                isValueString = true;
            }
        }
        kfValues.push(value);
    }
    if (!forceAnimate && isAllValueEqual) {
        return;
    }

    var lastValue = kfValues[trackLen - 1];
    // Polyfill array and NaN value
    for (var i = 0; i < trackLen - 1; i++) {
        if (isValueArray) {
            fillArr(kfValues[i], lastValue, arrDim);
        }
        else {
            if (isNaN(kfValues[i]) && !isNaN(lastValue) && !isValueString && !isValueColor) {
                kfValues[i] = lastValue;
            }
        }
    }
    isValueArray && fillArr(getter(animator._target, propName), lastValue, arrDim);

    // Cache the key of last frame to speed up when
    // animation playback is sequency
    var lastFrame = 0;
    var lastFramePercent = 0;
    var start;
    var w;
    var p0;
    var p1;
    var p2;
    var p3;

    if (isValueColor) {
        var rgba = [0, 0, 0, 0];
    }

    var onframe = function (target, percent) {
        // Find the range keyframes
        // kf1-----kf2---------current--------kf3
        // find kf2 and kf3 and do interpolation
        var frame;
        // In the easing function like elasticOut, percent may less than 0
        if (percent < 0) {
            frame = 0;
        }
        else if (percent < lastFramePercent) {
            // Start from next key
            // PENDING start from lastFrame ?
            start = Math.min(lastFrame + 1, trackLen - 1);
            for (frame = start; frame >= 0; frame--) {
                if (kfPercents[frame] <= percent) {
                    break;
                }
            }
            // PENDING really need to do this ?
            frame = Math.min(frame, trackLen - 2);
        }
        else {
            for (frame = lastFrame; frame < trackLen; frame++) {
                if (kfPercents[frame] > percent) {
                    break;
                }
            }
            frame = Math.min(frame - 1, trackLen - 2);
        }
        lastFrame = frame;
        lastFramePercent = percent;

        var range = (kfPercents[frame + 1] - kfPercents[frame]);
        if (range === 0) {
            return;
        }
        else {
            w = (percent - kfPercents[frame]) / range;
        }
        if (useSpline) {
            p1 = kfValues[frame];
            p0 = kfValues[frame === 0 ? frame : frame - 1];
            p2 = kfValues[frame > trackLen - 2 ? trackLen - 1 : frame + 1];
            p3 = kfValues[frame > trackLen - 3 ? trackLen - 1 : frame + 2];
            if (isValueArray) {
                catmullRomInterpolateArray(
                    p0, p1, p2, p3, w, w * w, w * w * w,
                    getter(target, propName),
                    arrDim
                );
            }
            else {
                var value;
                if (isValueColor) {
                    value = catmullRomInterpolateArray(
                        p0, p1, p2, p3, w, w * w, w * w * w,
                        rgba, 1
                    );
                    value = rgba2String(rgba);
                }
                else if (isValueString) {
                    // String is step(0.5)
                    return interpolateString(p1, p2, w);
                }
                else {
                    value = catmullRomInterpolate(
                        p0, p1, p2, p3, w, w * w, w * w * w
                    );
                }
                setter(
                    target,
                    propName,
                    value
                );
            }
        }
        else {
            if (isValueArray) {
                interpolateArray(
                    kfValues[frame], kfValues[frame + 1], w,
                    getter(target, propName),
                    arrDim
                );
            }
            else {
                var value;
                if (isValueColor) {
                    interpolateArray(
                        kfValues[frame], kfValues[frame + 1], w,
                        rgba, 1
                    );
                    value = rgba2String(rgba);
                }
                else if (isValueString) {
                    // String is step(0.5)
                    return interpolateString(kfValues[frame], kfValues[frame + 1], w);
                }
                else {
                    value = interpolateNumber(kfValues[frame], kfValues[frame + 1], w);
                }
                setter(
                    target,
                    propName,
                    value
                );
            }
        }
    };

    var clip = new __WEBPACK_IMPORTED_MODULE_0__Clip__["a" /* default */]({
        target: animator._target,
        life: trackMaxTime,
        loop: animator._loop,
        delay: animator._delay,
        onframe: onframe,
        ondestroy: oneTrackDone
    });

    if (easing && easing !== 'spline') {
        clip.easing = easing;
    }

    return clip;
}

/**
 * @alias module:zrender/animation/Animator
 * @constructor
 * @param {Object} target
 * @param {boolean} loop
 * @param {Function} getter
 * @param {Function} setter
 */
var Animator = function(target, loop, getter, setter) {
    this._tracks = {};
    this._target = target;

    this._loop = loop || false;

    this._getter = getter || defaultGetter;
    this._setter = setter || defaultSetter;

    this._clipCount = 0;

    this._delay = 0;

    this._doneList = [];

    this._onframeList = [];

    this._clipList = [];
};

Animator.prototype = {
    /**
     * 设置动画关键帧
     * @param  {number} time 关键帧时间，单位是ms
     * @param  {Object} props 关键帧的属性值，key-value表示
     * @return {module:zrender/animation/Animator}
     */
    when: function(time /* ms */, props) {
        var tracks = this._tracks;
        for (var propName in props) {
            if (!props.hasOwnProperty(propName)) {
                continue;
            }

            if (!tracks[propName]) {
                tracks[propName] = [];
                // Invalid value
                var value = this._getter(this._target, propName);
                if (value == null) {
                    // zrLog('Invalid property ' + propName);
                    continue;
                }
                // If time is 0
                //  Then props is given initialize value
                // Else
                //  Initialize value from current prop value
                if (time !== 0) {
                    tracks[propName].push({
                        time: 0,
                        value: cloneValue(value)
                    });
                }
            }
            tracks[propName].push({
                time: time,
                value: props[propName]
            });
        }
        return this;
    },
    /**
     * 添加动画每一帧的回调函数
     * @param  {Function} callback
     * @return {module:zrender/animation/Animator}
     */
    during: function (callback) {
        this._onframeList.push(callback);
        return this;
    },

    pause: function () {
        for (var i = 0; i < this._clipList.length; i++) {
            this._clipList[i].pause();
        }
        this._paused = true;
    },

    resume: function () {
        for (var i = 0; i < this._clipList.length; i++) {
            this._clipList[i].resume();
        }
        this._paused = false;
    },

    isPaused: function () {
        return !!this._paused;
    },

    _doneCallback: function () {
        // Clear all tracks
        this._tracks = {};
        // Clear all clips
        this._clipList.length = 0;

        var doneList = this._doneList;
        var len = doneList.length;
        for (var i = 0; i < len; i++) {
            doneList[i].call(this);
        }
    },
    /**
     * 开始执行动画
     * @param  {string|Function} [easing]
     *         动画缓动函数，详见{@link module:zrender/animation/easing}
     * @param  {boolean} forceAnimate
     * @return {module:zrender/animation/Animator}
     */
    start: function (easing, forceAnimate) {

        var self = this;
        var clipCount = 0;

        var oneTrackDone = function() {
            clipCount--;
            if (!clipCount) {
                self._doneCallback();
            }
        };

        var lastClip;
        for (var propName in this._tracks) {
            if (!this._tracks.hasOwnProperty(propName)) {
                continue;
            }
            var clip = createTrackClip(
                this, easing, oneTrackDone,
                this._tracks[propName], propName, forceAnimate
            );
            if (clip) {
                this._clipList.push(clip);
                clipCount++;

                // If start after added to animation
                if (this.animation) {
                    this.animation.addClip(clip);
                }

                lastClip = clip;
            }
        }

        // Add during callback on the last clip
        if (lastClip) {
            var oldOnFrame = lastClip.onframe;
            lastClip.onframe = function (target, percent) {
                oldOnFrame(target, percent);

                for (var i = 0; i < self._onframeList.length; i++) {
                    self._onframeList[i](target, percent);
                }
            };
        }

        // This optimization will help the case that in the upper application
        // the view may be refreshed frequently, where animation will be
        // called repeatly but nothing changed.
        if (!clipCount) {
            this._doneCallback();
        }
        return this;
    },
    /**
     * 停止动画
     * @param {boolean} forwardToLast If move to last frame before stop
     */
    stop: function (forwardToLast) {
        var clipList = this._clipList;
        var animation = this.animation;
        for (var i = 0; i < clipList.length; i++) {
            var clip = clipList[i];
            if (forwardToLast) {
                // Move to last frame before stop
                clip.onframe(this._target, 1);
            }
            animation && animation.removeClip(clip);
        }
        clipList.length = 0;
    },
    /**
     * 设置动画延迟开始的时间
     * @param  {number} time 单位ms
     * @return {module:zrender/animation/Animator}
     */
    delay: function (time) {
        this._delay = time;
        return this;
    },
    /**
     * 添加动画结束的回调
     * @param  {Function} cb
     * @return {module:zrender/animation/Animator}
     */
    done: function(cb) {
        if (cb) {
            this._doneList.push(cb);
        }
        return this;
    },

    /**
     * @return {Array.<module:zrender/animation/Clip>}
     */
    getClips: function () {
        return this._clipList;
    }
};

/* harmony default export */ __webpack_exports__["a"] = (Animator);

/***/ }),

/***/ 359:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

/* harmony default export */ __webpack_exports__["a"] = ((
    typeof window !== 'undefined'
    && (
        (window.requestAnimationFrame && window.requestAnimationFrame.bind(window))
        // https://github.com/ecomfe/zrender/issues/189#issuecomment-224919809
        || (window.msRequestAnimationFrame && window.msRequestAnimationFrame.bind(window))
        || window.mozRequestAnimationFrame
        || window.webkitRequestAnimationFrame
    )
) || function (func) {
    setTimeout(func, 16);
});

/***/ }),

/***/ 360:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = normalizeRadian;

var PI2 = Math.PI * 2;

function normalizeRadian(angle) {
    angle %= PI2;
    if (angle < 0) {
        angle += PI2;
    }
    return angle;
}

/***/ }),

/***/ 361:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// Simple LRU cache use doubly linked list
// @module zrender/core/LRU

/**
 * Simple double linked list. Compared with array, it has O(1) remove operation.
 * @constructor
 */
var LinkedList = function () {

    /**
     * @type {module:zrender/core/LRU~Entry}
     */
    this.head = null;

    /**
     * @type {module:zrender/core/LRU~Entry}
     */
    this.tail = null;

    this._len = 0;
};

var linkedListProto = LinkedList.prototype;
/**
 * Insert a new value at the tail
 * @param  {} val
 * @return {module:zrender/core/LRU~Entry}
 */
linkedListProto.insert = function (val) {
    var entry = new Entry(val);
    this.insertEntry(entry);
    return entry;
};

/**
 * Insert an entry at the tail
 * @param  {module:zrender/core/LRU~Entry} entry
 */
linkedListProto.insertEntry = function (entry) {
    if (!this.head) {
        this.head = this.tail = entry;
    }
    else {
        this.tail.next = entry;
        entry.prev = this.tail;
        entry.next = null;
        this.tail = entry;
    }
    this._len++;
};

/**
 * Remove entry.
 * @param  {module:zrender/core/LRU~Entry} entry
 */
linkedListProto.remove = function (entry) {
    var prev = entry.prev;
    var next = entry.next;
    if (prev) {
        prev.next = next;
    }
    else {
        // Is head
        this.head = next;
    }
    if (next) {
        next.prev = prev;
    }
    else {
        // Is tail
        this.tail = prev;
    }
    entry.next = entry.prev = null;
    this._len--;
};

/**
 * @return {number}
 */
linkedListProto.len = function () {
    return this._len;
};

/**
 * Clear list
 */
linkedListProto.clear = function () {
    this.head = this.tail = null;
    this._len = 0;
};

/**
 * @constructor
 * @param {} val
 */
var Entry = function (val) {
    /**
     * @type {}
     */
    this.value = val;

    /**
     * @type {module:zrender/core/LRU~Entry}
     */
    this.next;

    /**
     * @type {module:zrender/core/LRU~Entry}
     */
    this.prev;
};

/**
 * LRU Cache
 * @constructor
 * @alias module:zrender/core/LRU
 */
var LRU = function (maxSize) {

    this._list = new LinkedList();

    this._map = {};

    this._maxSize = maxSize || 10;

    this._lastRemovedEntry = null;
};

var LRUProto = LRU.prototype;

/**
 * @param  {string} key
 * @param  {} value
 * @return {} Removed value
 */
LRUProto.put = function (key, value) {
    var list = this._list;
    var map = this._map;
    var removed = null;
    if (map[key] == null) {
        var len = list.len();
        // Reuse last removed entry
        var entry = this._lastRemovedEntry;

        if (len >= this._maxSize && len > 0) {
            // Remove the least recently used
            var leastUsedEntry = list.head;
            list.remove(leastUsedEntry);
            delete map[leastUsedEntry.key];

            removed = leastUsedEntry.value;
            this._lastRemovedEntry = leastUsedEntry;
        }

        if (entry) {
            entry.value = value;
        }
        else {
            entry = new Entry(value);
        }
        entry.key = key;
        list.insertEntry(entry);
        map[key] = entry;
    }

    return removed;
};

/**
 * @param  {string} key
 * @return {}
 */
LRUProto.get = function (key) {
    var entry = this._map[key];
    var list = this._list;
    if (entry != null) {
        // Put the latest used entry in the tail
        if (entry !== list.tail) {
            list.remove(entry);
            list.insertEntry(entry);
        }

        return entry.value;
    }
};

/**
 * Clear the cache
 */
LRUProto.clear = function () {
    this._list.clear();
    this._map = {};
};

/* harmony default export */ __webpack_exports__["a"] = (LRU);

/***/ }),

/***/ 362:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * zrender: 生成唯一id
 *
 * @author errorrik (errorrik@gmail.com)
 */

var idStart = 0x0907;

/* harmony default export */ __webpack_exports__["a"] = (function () {
    return idStart++;
});

/***/ }),

/***/ 363:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__config__ = __webpack_require__(144);


var log = function () {
};

if (__WEBPACK_IMPORTED_MODULE_0__config__["a" /* debugMode */] === 1) {
    log = function () {
        for (var k in arguments) {
            throw new Error(arguments[k]);
        }
    };
}
else if (__WEBPACK_IMPORTED_MODULE_0__config__["a" /* debugMode */] > 1) {
    log = function () {
        for (var k in arguments) {
            console.log(arguments[k]);
        }
    };
}

/* harmony default export */ __webpack_exports__["a"] = (log);

/***/ }),

/***/ 364:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = create;
/* harmony export (immutable) */ __webpack_exports__["d"] = identity;
/* harmony export (immutable) */ __webpack_exports__["f"] = copy;
/* harmony export (immutable) */ __webpack_exports__["e"] = mul;
/* harmony export (immutable) */ __webpack_exports__["b"] = translate;
/* harmony export (immutable) */ __webpack_exports__["h"] = rotate;
/* harmony export (immutable) */ __webpack_exports__["c"] = scale;
/* harmony export (immutable) */ __webpack_exports__["g"] = invert;
/**
 * 3x2矩阵操作类
 * @exports zrender/tool/matrix
 */

var ArrayCtor = typeof Float32Array === 'undefined'
    ? Array
   : Float32Array;

/**
 * 创建一个单位矩阵
 * @return {Float32Array|Array.<number>}
 */
function create() {
    var out = new ArrayCtor(6);
    identity(out);

    return out;
}

/**
 * 设置矩阵为单位矩阵
 * @param {Float32Array|Array.<number>} out
 */
function identity(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    out[4] = 0;
    out[5] = 0;
    return out;
}

/**
 * 复制矩阵
 * @param {Float32Array|Array.<number>} out
 * @param {Float32Array|Array.<number>} m
 */
function copy(out, m) {
    out[0] = m[0];
    out[1] = m[1];
    out[2] = m[2];
    out[3] = m[3];
    out[4] = m[4];
    out[5] = m[5];
    return out;
}

/**
 * 矩阵相乘
 * @param {Float32Array|Array.<number>} out
 * @param {Float32Array|Array.<number>} m1
 * @param {Float32Array|Array.<number>} m2
 */
function mul(out, m1, m2) {
    // Consider matrix.mul(m, m2, m);
    // where out is the same as m2.
    // So use temp variable to escape error.
    var out0 = m1[0] * m2[0] + m1[2] * m2[1];
    var out1 = m1[1] * m2[0] + m1[3] * m2[1];
    var out2 = m1[0] * m2[2] + m1[2] * m2[3];
    var out3 = m1[1] * m2[2] + m1[3] * m2[3];
    var out4 = m1[0] * m2[4] + m1[2] * m2[5] + m1[4];
    var out5 = m1[1] * m2[4] + m1[3] * m2[5] + m1[5];
    out[0] = out0;
    out[1] = out1;
    out[2] = out2;
    out[3] = out3;
    out[4] = out4;
    out[5] = out5;
    return out;
}

/**
 * 平移变换
 * @param {Float32Array|Array.<number>} out
 * @param {Float32Array|Array.<number>} a
 * @param {Float32Array|Array.<number>} v
 */
function translate(out, a, v) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4] + v[0];
    out[5] = a[5] + v[1];
    return out;
}

/**
 * 旋转变换
 * @param {Float32Array|Array.<number>} out
 * @param {Float32Array|Array.<number>} a
 * @param {number} rad
 */
function rotate(out, a, rad) {
    var aa = a[0];
    var ac = a[2];
    var atx = a[4];
    var ab = a[1];
    var ad = a[3];
    var aty = a[5];
    var st = Math.sin(rad);
    var ct = Math.cos(rad);

    out[0] = aa * ct + ab * st;
    out[1] = -aa * st + ab * ct;
    out[2] = ac * ct + ad * st;
    out[3] = -ac * st + ct * ad;
    out[4] = ct * atx + st * aty;
    out[5] = ct * aty - st * atx;
    return out;
}

/**
 * 缩放变换
 * @param {Float32Array|Array.<number>} out
 * @param {Float32Array|Array.<number>} a
 * @param {Float32Array|Array.<number>} v
 */
function scale(out, a, v) {
    var vx = v[0];
    var vy = v[1];
    out[0] = a[0] * vx;
    out[1] = a[1] * vy;
    out[2] = a[2] * vx;
    out[3] = a[3] * vy;
    out[4] = a[4] * vx;
    out[5] = a[5] * vy;
    return out;
}

/**
 * 求逆矩阵
 * @param {Float32Array|Array.<number>} out
 * @param {Float32Array|Array.<number>} a
 */
function invert(out, a) {

    var aa = a[0];
    var ac = a[2];
    var atx = a[4];
    var ab = a[1];
    var ad = a[3];
    var aty = a[5];

    var det = aa * ad - ab * ac;
    if (!det) {
        return null;
    }
    det = 1.0 / det;

    out[0] = ad * det;
    out[1] = -ab * det;
    out[2] = -ac * det;
    out[3] = aa * det;
    out[4] = (ac * aty - ad * atx) * det;
    out[5] = (ab * atx - aa * aty) * det;
    return out;
}


/***/ }),

/***/ 365:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = sort;
// https://github.com/mziccard/node-timsort
var DEFAULT_MIN_MERGE = 32;

var DEFAULT_MIN_GALLOPING = 7;

var DEFAULT_TMP_STORAGE_LENGTH = 256;

function minRunLength(n) {
    var r = 0;

    while (n >= DEFAULT_MIN_MERGE) {
        r |= n & 1;
        n >>= 1;
    }

    return n + r;
}

function makeAscendingRun(array, lo, hi, compare) {
    var runHi = lo + 1;

    if (runHi === hi) {
        return 1;
    }

    if (compare(array[runHi++], array[lo]) < 0) {
        while (runHi < hi && compare(array[runHi], array[runHi - 1]) < 0) {
            runHi++;
        }

        reverseRun(array, lo, runHi);
    }
    else {
        while (runHi < hi && compare(array[runHi], array[runHi - 1]) >= 0) {
            runHi++;
        }
    }

    return runHi - lo;
}

function reverseRun(array, lo, hi) {
    hi--;

    while (lo < hi) {
        var t = array[lo];
        array[lo++] = array[hi];
        array[hi--] = t;
    }
}

function binaryInsertionSort(array, lo, hi, start, compare) {
    if (start === lo) {
        start++;
    }

    for (; start < hi; start++) {
        var pivot = array[start];

        var left = lo;
        var right = start;
        var mid;

        while (left < right) {
            mid = left + right >>> 1;

            if (compare(pivot, array[mid]) < 0) {
                right = mid;
            }
            else {
                left = mid + 1;
            }
        }

        var n = start - left;

        switch (n) {
            case 3:
                array[left + 3] = array[left + 2];

            case 2:
                array[left + 2] = array[left + 1];

            case 1:
                array[left + 1] = array[left];
                break;
            default:
                while (n > 0) {
                    array[left + n] = array[left + n - 1];
                    n--;
                }
        }

        array[left] = pivot;
    }
}

function gallopLeft(value, array, start, length, hint, compare) {
    var lastOffset = 0;
    var maxOffset = 0;
    var offset = 1;

    if (compare(value, array[start + hint]) > 0) {
        maxOffset = length - hint;

        while (offset < maxOffset && compare(value, array[start + hint + offset]) > 0) {
            lastOffset = offset;
            offset = (offset << 1) + 1;

            if (offset <= 0) {
                offset = maxOffset;
            }
        }

        if (offset > maxOffset) {
            offset = maxOffset;
        }

        lastOffset += hint;
        offset += hint;
    }
    else {
        maxOffset = hint + 1;
        while (offset < maxOffset && compare(value, array[start + hint - offset]) <= 0) {
            lastOffset = offset;
            offset = (offset << 1) + 1;

            if (offset <= 0) {
                offset = maxOffset;
            }
        }
        if (offset > maxOffset) {
            offset = maxOffset;
        }

        var tmp = lastOffset;
        lastOffset = hint - offset;
        offset = hint - tmp;
    }

    lastOffset++;
    while (lastOffset < offset) {
        var m = lastOffset + (offset - lastOffset >>> 1);

        if (compare(value, array[start + m]) > 0) {
            lastOffset = m + 1;
        }
        else {
            offset = m;
        }
    }
    return offset;
}

function gallopRight(value, array, start, length, hint, compare) {
    var lastOffset = 0;
    var maxOffset = 0;
    var offset = 1;

    if (compare(value, array[start + hint]) < 0) {
        maxOffset = hint + 1;

        while (offset < maxOffset && compare(value, array[start + hint - offset]) < 0) {
            lastOffset = offset;
            offset = (offset << 1) + 1;

            if (offset <= 0) {
                offset = maxOffset;
            }
        }

        if (offset > maxOffset) {
            offset = maxOffset;
        }

        var tmp = lastOffset;
        lastOffset = hint - offset;
        offset = hint - tmp;
    }
    else {
        maxOffset = length - hint;

        while (offset < maxOffset && compare(value, array[start + hint + offset]) >= 0) {
            lastOffset = offset;
            offset = (offset << 1) + 1;

            if (offset <= 0) {
                offset = maxOffset;
            }
        }

        if (offset > maxOffset) {
            offset = maxOffset;
        }

        lastOffset += hint;
        offset += hint;
    }

    lastOffset++;

    while (lastOffset < offset) {
        var m = lastOffset + (offset - lastOffset >>> 1);

        if (compare(value, array[start + m]) < 0) {
            offset = m;
        }
        else {
            lastOffset = m + 1;
        }
    }

    return offset;
}

function TimSort(array, compare) {
    var minGallop = DEFAULT_MIN_GALLOPING;
    var length = 0;
    var tmpStorageLength = DEFAULT_TMP_STORAGE_LENGTH;
    var stackLength = 0;
    var runStart;
    var runLength;
    var stackSize = 0;

    length = array.length;

    if (length < 2 * DEFAULT_TMP_STORAGE_LENGTH) {
        tmpStorageLength = length >>> 1;
    }

    var tmp = [];

    stackLength = length < 120 ? 5 : length < 1542 ? 10 : length < 119151 ? 19 : 40;

    runStart = [];
    runLength = [];

    function pushRun(_runStart, _runLength) {
        runStart[stackSize] = _runStart;
        runLength[stackSize] = _runLength;
        stackSize += 1;
    }

    function mergeRuns() {
        while (stackSize > 1) {
            var n = stackSize - 2;

            if (n >= 1 && runLength[n - 1] <= runLength[n] + runLength[n + 1] || n >= 2 && runLength[n - 2] <= runLength[n] + runLength[n - 1]) {
                if (runLength[n - 1] < runLength[n + 1]) {
                    n--;
                }
            }
            else if (runLength[n] > runLength[n + 1]) {
                break;
            }
            mergeAt(n);
        }
    }

    function forceMergeRuns() {
        while (stackSize > 1) {
            var n = stackSize - 2;

            if (n > 0 && runLength[n - 1] < runLength[n + 1]) {
                n--;
            }

            mergeAt(n);
        }
    }

    function mergeAt(i) {
        var start1 = runStart[i];
        var length1 = runLength[i];
        var start2 = runStart[i + 1];
        var length2 = runLength[i + 1];

        runLength[i] = length1 + length2;

        if (i === stackSize - 3) {
            runStart[i + 1] = runStart[i + 2];
            runLength[i + 1] = runLength[i + 2];
        }

        stackSize--;

        var k = gallopRight(array[start2], array, start1, length1, 0, compare);
        start1 += k;
        length1 -= k;

        if (length1 === 0) {
            return;
        }

        length2 = gallopLeft(array[start1 + length1 - 1], array, start2, length2, length2 - 1, compare);

        if (length2 === 0) {
            return;
        }

        if (length1 <= length2) {
            mergeLow(start1, length1, start2, length2);
        }
        else {
            mergeHigh(start1, length1, start2, length2);
        }
    }

    function mergeLow(start1, length1, start2, length2) {
        var i = 0;

        for (i = 0; i < length1; i++) {
            tmp[i] = array[start1 + i];
        }

        var cursor1 = 0;
        var cursor2 = start2;
        var dest = start1;

        array[dest++] = array[cursor2++];

        if (--length2 === 0) {
            for (i = 0; i < length1; i++) {
                array[dest + i] = tmp[cursor1 + i];
            }
            return;
        }

        if (length1 === 1) {
            for (i = 0; i < length2; i++) {
                array[dest + i] = array[cursor2 + i];
            }
            array[dest + length2] = tmp[cursor1];
            return;
        }

        var _minGallop = minGallop;
        var count1, count2, exit;

        while (1) {
            count1 = 0;
            count2 = 0;
            exit = false;

            do {
                if (compare(array[cursor2], tmp[cursor1]) < 0) {
                    array[dest++] = array[cursor2++];
                    count2++;
                    count1 = 0;

                    if (--length2 === 0) {
                        exit = true;
                        break;
                    }
                }
                else {
                    array[dest++] = tmp[cursor1++];
                    count1++;
                    count2 = 0;
                    if (--length1 === 1) {
                        exit = true;
                        break;
                    }
                }
            } while ((count1 | count2) < _minGallop);

            if (exit) {
                break;
            }

            do {
                count1 = gallopRight(array[cursor2], tmp, cursor1, length1, 0, compare);

                if (count1 !== 0) {
                    for (i = 0; i < count1; i++) {
                        array[dest + i] = tmp[cursor1 + i];
                    }

                    dest += count1;
                    cursor1 += count1;
                    length1 -= count1;
                    if (length1 <= 1) {
                        exit = true;
                        break;
                    }
                }

                array[dest++] = array[cursor2++];

                if (--length2 === 0) {
                    exit = true;
                    break;
                }

                count2 = gallopLeft(tmp[cursor1], array, cursor2, length2, 0, compare);

                if (count2 !== 0) {
                    for (i = 0; i < count2; i++) {
                        array[dest + i] = array[cursor2 + i];
                    }

                    dest += count2;
                    cursor2 += count2;
                    length2 -= count2;

                    if (length2 === 0) {
                        exit = true;
                        break;
                    }
                }
                array[dest++] = tmp[cursor1++];

                if (--length1 === 1) {
                    exit = true;
                    break;
                }

                _minGallop--;
            } while (count1 >= DEFAULT_MIN_GALLOPING || count2 >= DEFAULT_MIN_GALLOPING);

            if (exit) {
                break;
            }

            if (_minGallop < 0) {
                _minGallop = 0;
            }

            _minGallop += 2;
        }

        minGallop = _minGallop;

        minGallop < 1 && (minGallop = 1);

        if (length1 === 1) {
            for (i = 0; i < length2; i++) {
                array[dest + i] = array[cursor2 + i];
            }
            array[dest + length2] = tmp[cursor1];
        }
        else if (length1 === 0) {
            throw new Error();
            // throw new Error('mergeLow preconditions were not respected');
        }
        else {
            for (i = 0; i < length1; i++) {
                array[dest + i] = tmp[cursor1 + i];
            }
        }
    }

    function mergeHigh (start1, length1, start2, length2) {
        var i = 0;

        for (i = 0; i < length2; i++) {
            tmp[i] = array[start2 + i];
        }

        var cursor1 = start1 + length1 - 1;
        var cursor2 = length2 - 1;
        var dest = start2 + length2 - 1;
        var customCursor = 0;
        var customDest = 0;

        array[dest--] = array[cursor1--];

        if (--length1 === 0) {
            customCursor = dest - (length2 - 1);

            for (i = 0; i < length2; i++) {
                array[customCursor + i] = tmp[i];
            }

            return;
        }

        if (length2 === 1) {
            dest -= length1;
            cursor1 -= length1;
            customDest = dest + 1;
            customCursor = cursor1 + 1;

            for (i = length1 - 1; i >= 0; i--) {
                array[customDest + i] = array[customCursor + i];
            }

            array[dest] = tmp[cursor2];
            return;
        }

        var _minGallop = minGallop;

        while (true) {
            var count1 = 0;
            var count2 = 0;
            var exit = false;

            do {
                if (compare(tmp[cursor2], array[cursor1]) < 0) {
                    array[dest--] = array[cursor1--];
                    count1++;
                    count2 = 0;
                    if (--length1 === 0) {
                        exit = true;
                        break;
                    }
                }
                else {
                    array[dest--] = tmp[cursor2--];
                    count2++;
                    count1 = 0;
                    if (--length2 === 1) {
                        exit = true;
                        break;
                    }
                }
            } while ((count1 | count2) < _minGallop);

            if (exit) {
                break;
            }

            do {
                count1 = length1 - gallopRight(tmp[cursor2], array, start1, length1, length1 - 1, compare);

                if (count1 !== 0) {
                    dest -= count1;
                    cursor1 -= count1;
                    length1 -= count1;
                    customDest = dest + 1;
                    customCursor = cursor1 + 1;

                    for (i = count1 - 1; i >= 0; i--) {
                        array[customDest + i] = array[customCursor + i];
                    }

                    if (length1 === 0) {
                        exit = true;
                        break;
                    }
                }

                array[dest--] = tmp[cursor2--];

                if (--length2 === 1) {
                    exit = true;
                    break;
                }

                count2 = length2 - gallopLeft(array[cursor1], tmp, 0, length2, length2 - 1, compare);

                if (count2 !== 0) {
                    dest -= count2;
                    cursor2 -= count2;
                    length2 -= count2;
                    customDest = dest + 1;
                    customCursor = cursor2 + 1;

                    for (i = 0; i < count2; i++) {
                        array[customDest + i] = tmp[customCursor + i];
                    }

                    if (length2 <= 1) {
                        exit = true;
                        break;
                    }
                }

                array[dest--] = array[cursor1--];

                if (--length1 === 0) {
                    exit = true;
                    break;
                }

                _minGallop--;
            } while (count1 >= DEFAULT_MIN_GALLOPING || count2 >= DEFAULT_MIN_GALLOPING);

            if (exit) {
                break;
            }

            if (_minGallop < 0) {
                _minGallop = 0;
            }

            _minGallop += 2;
        }

        minGallop = _minGallop;

        if (minGallop < 1) {
            minGallop = 1;
        }

        if (length2 === 1) {
            dest -= length1;
            cursor1 -= length1;
            customDest = dest + 1;
            customCursor = cursor1 + 1;

            for (i = length1 - 1; i >= 0; i--) {
                array[customDest + i] = array[customCursor + i];
            }

            array[dest] = tmp[cursor2];
        }
        else if (length2 === 0) {
            throw new Error();
            // throw new Error('mergeHigh preconditions were not respected');
        }
        else {
            customCursor = dest - (length2 - 1);
            for (i = 0; i < length2; i++) {
                array[customCursor + i] = tmp[i];
            }
        }
    }

    this.mergeRuns = mergeRuns;
    this.forceMergeRuns = forceMergeRuns;
    this.pushRun = pushRun;
}

function sort(array, compare, lo, hi) {
    if (!lo) {
        lo = 0;
    }
    if (!hi) {
        hi = array.length;
    }

    var remaining = hi - lo;

    if (remaining < 2) {
        return;
    }

    var runLength = 0;

    if (remaining < DEFAULT_MIN_MERGE) {
        runLength = makeAscendingRun(array, lo, hi, compare);
        binaryInsertionSort(array, lo, hi, lo + runLength, compare);
        return;
    }

    var ts = new TimSort(array, compare);

    var minRun = minRunLength(remaining);

    do {
        runLength = makeAscendingRun(array, lo, hi, compare);
        if (runLength < minRun) {
            var force = remaining;
            if (force > minRun) {
                force = minRun;
            }

            binaryInsertionSort(array, lo, lo + force, lo + runLength, compare);
            runLength = force;
        }

        ts.pushRun(lo, runLength);
        ts.mergeRuns();

        remaining -= runLength;
        lo += runLength;
    } while (remaining !== 0);

    ts.forceMergeRuns();
}


/***/ }),

/***/ 366:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__core_util__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Style__ = __webpack_require__(369);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Element__ = __webpack_require__(357);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__mixin_RectText__ = __webpack_require__(892);
/**
 * 可绘制的图形基类
 * Base class of all displayable graphic objects
 * @module zrender/graphic/Displayable
 */







/**
 * @alias module:zrender/graphic/Displayable
 * @extends module:zrender/Element
 * @extends module:zrender/graphic/mixin/RectText
 */
function Displayable(opts) {

    opts = opts || {};

    __WEBPACK_IMPORTED_MODULE_2__Element__["a" /* default */].call(this, opts);

    // Extend properties
    for (var name in opts) {
        if (
            opts.hasOwnProperty(name) &&
            name !== 'style'
        ) {
            this[name] = opts[name];
        }
    }

    /**
     * @type {module:zrender/graphic/Style}
     */
    this.style = new __WEBPACK_IMPORTED_MODULE_1__Style__["a" /* default */](opts.style, this);

    this._rect = null;
    // Shapes for cascade clipping.
    this.__clipPaths = [];

    // FIXME Stateful must be mixined after style is setted
    // Stateful.call(this, opts);
}

Displayable.prototype = {

    constructor: Displayable,

    type: 'displayable',

    /**
     * Displayable 是否为脏，Painter 中会根据该标记判断是否需要是否需要重新绘制
     * Dirty flag. From which painter will determine if this displayable object needs brush
     * @name module:zrender/graphic/Displayable#__dirty
     * @type {boolean}
     */
    __dirty: true,

    /**
     * 图形是否可见，为true时不绘制图形，但是仍能触发鼠标事件
     * If ignore drawing of the displayable object. Mouse event will still be triggered
     * @name module:/zrender/graphic/Displayable#invisible
     * @type {boolean}
     * @default false
     */
    invisible: false,

    /**
     * @name module:/zrender/graphic/Displayable#z
     * @type {number}
     * @default 0
     */
    z: 0,

    /**
     * @name module:/zrender/graphic/Displayable#z
     * @type {number}
     * @default 0
     */
    z2: 0,

    /**
     * z层level，决定绘画在哪层canvas中
     * @name module:/zrender/graphic/Displayable#zlevel
     * @type {number}
     * @default 0
     */
    zlevel: 0,

    /**
     * 是否可拖拽
     * @name module:/zrender/graphic/Displayable#draggable
     * @type {boolean}
     * @default false
     */
    draggable: false,

    /**
     * 是否正在拖拽
     * @name module:/zrender/graphic/Displayable#draggable
     * @type {boolean}
     * @default false
     */
    dragging: false,

    /**
     * 是否相应鼠标事件
     * @name module:/zrender/graphic/Displayable#silent
     * @type {boolean}
     * @default false
     */
    silent: false,

    /**
     * If enable culling
     * @type {boolean}
     * @default false
     */
    culling: false,

    /**
     * Mouse cursor when hovered
     * @name module:/zrender/graphic/Displayable#cursor
     * @type {string}
     */
    cursor: 'pointer',

    /**
     * If hover area is bounding rect
     * @name module:/zrender/graphic/Displayable#rectHover
     * @type {string}
     */
    rectHover: false,

    /**
     * Render the element progressively when the value >= 0,
     * usefull for large data.
     * @type {number}
     */
    progressive: -1,

    beforeBrush: function (ctx) {},

    afterBrush: function (ctx) {},

    /**
     * 图形绘制方法
     * @param {CanvasRenderingContext2D} ctx
     */
    // Interface
    brush: function (ctx, prevEl) {},

    /**
     * 获取最小包围盒
     * @return {module:zrender/core/BoundingRect}
     */
    // Interface
    getBoundingRect: function () {},

    /**
     * 判断坐标 x, y 是否在图形上
     * If displayable element contain coord x, y
     * @param  {number} x
     * @param  {number} y
     * @return {boolean}
     */
    contain: function (x, y) {
        return this.rectContain(x, y);
    },

    /**
     * @param  {Function} cb
     * @param  {}   context
     */
    traverse: function (cb, context) {
        cb.call(context, this);
    },

    /**
     * 判断坐标 x, y 是否在图形的包围盒上
     * If bounding rect of element contain coord x, y
     * @param  {number} x
     * @param  {number} y
     * @return {boolean}
     */
    rectContain: function (x, y) {
        var coord = this.transformCoordToLocal(x, y);
        var rect = this.getBoundingRect();
        return rect.contain(coord[0], coord[1]);
    },

    /**
     * 标记图形元素为脏，并且在下一帧重绘
     * Mark displayable element dirty and refresh next frame
     */
    dirty: function () {
        this.__dirty = true;

        this._rect = null;

        this.__zr && this.__zr.refresh();
    },

    /**
     * 图形是否会触发事件
     * If displayable object binded any event
     * @return {boolean}
     */
    // TODO, 通过 bind 绑定的事件
    // isSilent: function () {
    //     return !(
    //         this.hoverable || this.draggable
    //         || this.onmousemove || this.onmouseover || this.onmouseout
    //         || this.onmousedown || this.onmouseup || this.onclick
    //         || this.ondragenter || this.ondragover || this.ondragleave
    //         || this.ondrop
    //     );
    // },
    /**
     * Alias for animate('style')
     * @param {boolean} loop
     */
    animateStyle: function (loop) {
        return this.animate('style', loop);
    },

    attrKV: function (key, value) {
        if (key !== 'style') {
            __WEBPACK_IMPORTED_MODULE_2__Element__["a" /* default */].prototype.attrKV.call(this, key, value);
        }
        else {
            this.style.set(value);
        }
    },

    /**
     * @param {Object|string} key
     * @param {*} value
     */
    setStyle: function (key, value) {
        this.style.set(key, value);
        this.dirty(false);
        return this;
    },

    /**
     * Use given style object
     * @param  {Object} obj
     */
    useStyle: function (obj) {
        this.style = new __WEBPACK_IMPORTED_MODULE_1__Style__["a" /* default */](obj, this);
        this.dirty(false);
        return this;
    }
};

__WEBPACK_IMPORTED_MODULE_0__core_util__["a" /* inherits */](Displayable, __WEBPACK_IMPORTED_MODULE_2__Element__["a" /* default */]);

__WEBPACK_IMPORTED_MODULE_0__core_util__["d" /* mixin */](Displayable, __WEBPACK_IMPORTED_MODULE_3__mixin_RectText__["a" /* default */]);
// zrUtil.mixin(Displayable, Stateful);

/* harmony default export */ __webpack_exports__["a"] = (Displayable);

/***/ }),

/***/ 367:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

var Pattern = function (image, repeat) {
    // Should do nothing more in this constructor. Because gradient can be
    // declard by `color: {image: ...}`, where this constructor will not be called.

    this.image = image;
    this.repeat = repeat;

    // Can be cloned
    this.type = 'pattern';
};

Pattern.prototype.getCanvasPattern = function (ctx) {
    return ctx.createPattern(this.image, this.repeat || 'repeat');
};

/* harmony default export */ __webpack_exports__["a"] = (Pattern);

/***/ }),

/***/ 368:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__core_util__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Gradient__ = __webpack_require__(888);



/**
 * x, y, r are all percent from 0 to 1
 * @param {number} [x=0.5]
 * @param {number} [y=0.5]
 * @param {number} [r=0.5]
 * @param {Array.<Object>} [colorStops]
 * @param {boolean} [globalCoord=false]
 */
var RadialGradient = function (x, y, r, colorStops, globalCoord) {
    // Should do nothing more in this constructor. Because gradient can be
    // declard by `color: {type: 'radial', colorStops: ...}`, where
    // this constructor will not be called.

    this.x = x == null ? 0.5 : x;

    this.y = y == null ? 0.5 : y;

    this.r = r == null ? 0.5 : r;

    // Can be cloned
    this.type = 'radial';

    // If use global coord
    this.global = globalCoord || false;

    __WEBPACK_IMPORTED_MODULE_1__Gradient__["a" /* default */].call(this, colorStops);
};

RadialGradient.prototype = {

    constructor: RadialGradient
};

__WEBPACK_IMPORTED_MODULE_0__core_util__["a" /* inherits */](RadialGradient, __WEBPACK_IMPORTED_MODULE_1__Gradient__["a" /* default */]);

/* harmony default export */ __webpack_exports__["default"] = (RadialGradient);

/***/ }),

/***/ 369:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

var STYLE_COMMON_PROPS = [
    ['shadowBlur', 0], ['shadowOffsetX', 0], ['shadowOffsetY', 0], ['shadowColor', '#000'],
    ['lineCap', 'butt'], ['lineJoin', 'miter'], ['miterLimit', 10]
];

// var SHADOW_PROPS = STYLE_COMMON_PROPS.slice(0, 4);
// var LINE_PROPS = STYLE_COMMON_PROPS.slice(4);

var Style = function (opts, host) {
    this.extendFrom(opts, false);
    this.host = host;
};

function createLinearGradient(ctx, obj, rect) {
    var x = obj.x == null ? 0 : obj.x;
    var x2 = obj.x2 == null ? 1 : obj.x2;
    var y = obj.y == null ? 0 : obj.y;
    var y2 = obj.y2 == null ? 0 : obj.y2;

    if (!obj.global) {
        x = x * rect.width + rect.x;
        x2 = x2 * rect.width + rect.x;
        y = y * rect.height + rect.y;
        y2 = y2 * rect.height + rect.y;
    }

    var canvasGradient = ctx.createLinearGradient(x, y, x2, y2);

    return canvasGradient;
}

function createRadialGradient(ctx, obj, rect) {
    var width = rect.width;
    var height = rect.height;
    var min = Math.min(width, height);

    var x = obj.x == null ? 0.5 : obj.x;
    var y = obj.y == null ? 0.5 : obj.y;
    var r = obj.r == null ? 0.5 : obj.r;
    if (!obj.global) {
        x = x * width + rect.x;
        y = y * height + rect.y;
        r = r * min;
    }

    var canvasGradient = ctx.createRadialGradient(x, y, 0, x, y, r);

    return canvasGradient;
}


Style.prototype = {

    constructor: Style,

    /**
     * @type {module:zrender/graphic/Displayable}
     */
    host: null,

    /**
     * @type {string}
     */
    fill: '#000',

    /**
     * @type {string}
     */
    stroke: null,

    /**
     * @type {number}
     */
    opacity: 1,

    /**
     * @type {Array.<number>}
     */
    lineDash: null,

    /**
     * @type {number}
     */
    lineDashOffset: 0,

    /**
     * @type {number}
     */
    shadowBlur: 0,

    /**
     * @type {number}
     */
    shadowOffsetX: 0,

    /**
     * @type {number}
     */
    shadowOffsetY: 0,

    /**
     * @type {number}
     */
    lineWidth: 1,

    /**
     * If stroke ignore scale
     * @type {Boolean}
     */
    strokeNoScale: false,

    // Bounding rect text configuration
    // Not affected by element transform
    /**
     * @type {string}
     */
    text: null,

    /**
     * If `fontSize` or `fontFamily` exists, `font` will be reset by
     * `fontSize`, `fontStyle`, `fontWeight`, `fontFamily`.
     * So do not visit it directly in upper application (like echarts),
     * but use `contain/text#makeFont` instead.
     * @type {string}
     */
    font: null,

    /**
     * The same as font. Use font please.
     * @deprecated
     * @type {string}
     */
    textFont: null,

    /**
     * It helps merging respectively, rather than parsing an entire font string.
     * @type {string}
     */
    fontStyle: null,

    /**
     * It helps merging respectively, rather than parsing an entire font string.
     * @type {string}
     */
    fontWeight: null,

    /**
     * It helps merging respectively, rather than parsing an entire font string.
     * Should be 12 but not '12px'.
     * @type {number}
     */
    fontSize: null,

    /**
     * It helps merging respectively, rather than parsing an entire font string.
     * @type {string}
     */
    fontFamily: null,

    /**
     * Reserved for special functinality, like 'hr'.
     * @type {string}
     */
    textTag: null,

    /**
     * @type {string}
     */
    textFill: '#000',

    /**
     * @type {string}
     */
    textStroke: null,

    /**
     * @type {number}
     */
    textWidth: null,

    /**
     * Only for textBackground.
     * @type {number}
     */
    textHeight: null,

    /**
     * textStroke may be set as some color as a default
     * value in upper applicaion, where the default value
     * of textStrokeWidth should be 0 to make sure that
     * user can choose to do not use text stroke.
     * @type {number}
     */
    textStrokeWidth: 0,

    /**
     * @type {number}
     */
    textLineHeight: null,

    /**
     * 'inside', 'left', 'right', 'top', 'bottom'
     * [x, y]
     * Based on x, y of rect.
     * @type {string|Array.<number>}
     * @default 'inside'
     */
    textPosition: 'inside',

    /**
     * If not specified, use the boundingRect of a `displayable`.
     * @type {Object}
     */
    textRect: null,

    /**
     * [x, y]
     * @type {Array.<number>}
     */
    textOffset: null,

    /**
     * @type {string}
     */
    textAlign: null,

    /**
     * @type {string}
     */
    textVerticalAlign: null,

    /**
     * @type {number}
     */
    textDistance: 5,

    /**
     * @type {string}
     */
    textShadowColor: 'transparent',

    /**
     * @type {number}
     */
    textShadowBlur: 0,

    /**
     * @type {number}
     */
    textShadowOffsetX: 0,

    /**
     * @type {number}
     */
    textShadowOffsetY: 0,

    /**
     * @type {string}
     */
    textBoxShadowColor: 'transparent',

    /**
     * @type {number}
     */
    textBoxShadowBlur: 0,

    /**
     * @type {number}
     */
    textBoxShadowOffsetX: 0,

    /**
     * @type {number}
     */
    textBoxShadowOffsetY: 0,

    /**
     * Whether transform text.
     * Only useful in Path and Image element
     * @type {boolean}
     */
    transformText: false,

    /**
     * Text rotate around position of Path or Image
     * Only useful in Path and Image element and transformText is false.
     */
    textRotation: 0,

    /**
     * Text origin of text rotation, like [10, 40].
     * Based on x, y of rect.
     * Useful in label rotation of circular symbol.
     * By default, this origin is textPosition.
     * Can be 'center'.
     * @type {string|Array.<number>}
     */
    textOrigin: null,

    /**
     * @type {string}
     */
    textBackgroundColor: null,

    /**
     * @type {string}
     */
    textBorderColor: null,

    /**
     * @type {number}
     */
    textBorderWidth: 0,

    /**
     * @type {number}
     */
    textBorderRadius: 0,

    /**
     * Can be `2` or `[2, 4]` or `[2, 3, 4, 5]`
     * @type {number|Array.<number>}
     */
    textPadding: null,

    /**
     * Text styles for rich text.
     * @type {Object}
     */
    rich: null,

    /**
     * {outerWidth, outerHeight, ellipsis, placeholder}
     * @type {Object}
     */
    truncate: null,

    /**
     * https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation
     * @type {string}
     */
    blend: null,

    /**
     * @param {CanvasRenderingContext2D} ctx
     */
    bind: function (ctx, el, prevEl) {
        var style = this;
        var prevStyle = prevEl && prevEl.style;
        var firstDraw = !prevStyle;

        for (var i = 0; i < STYLE_COMMON_PROPS.length; i++) {
            var prop = STYLE_COMMON_PROPS[i];
            var styleName = prop[0];

            if (firstDraw || style[styleName] !== prevStyle[styleName]) {
                // FIXME Invalid property value will cause style leak from previous element.
                ctx[styleName] = style[styleName] || prop[1];
            }
        }

        if ((firstDraw || style.fill !== prevStyle.fill)) {
            ctx.fillStyle = style.fill;
        }
        if ((firstDraw || style.stroke !== prevStyle.stroke)) {
            ctx.strokeStyle = style.stroke;
        }
        if ((firstDraw || style.opacity !== prevStyle.opacity)) {
            ctx.globalAlpha = style.opacity == null ? 1 : style.opacity;
        }

        if ((firstDraw || style.blend !== prevStyle.blend)) {
            ctx.globalCompositeOperation = style.blend || 'source-over';
        }
        if (this.hasStroke()) {
            var lineWidth = style.lineWidth;
            ctx.lineWidth = lineWidth / (
                (this.strokeNoScale && el && el.getLineScale) ? el.getLineScale() : 1
            );
        }
    },

    hasFill: function () {
        var fill = this.fill;
        return fill != null && fill !== 'none';
    },

    hasStroke: function () {
        var stroke = this.stroke;
        return stroke != null && stroke !== 'none' && this.lineWidth > 0;
    },

    /**
     * Extend from other style
     * @param {zrender/graphic/Style} otherStyle
     * @param {boolean} overwrite true: overwrirte any way.
     *                            false: overwrite only when !target.hasOwnProperty
     *                            others: overwrite when property is not null/undefined.
     */
    extendFrom: function (otherStyle, overwrite) {
        if (otherStyle) {
            for (var name in otherStyle) {
                if (otherStyle.hasOwnProperty(name)
                    && (overwrite === true
                        || (
                            overwrite === false
                                ? !this.hasOwnProperty(name)
                                : otherStyle[name] != null
                        )
                    )
                ) {
                    this[name] = otherStyle[name];
                }
            }
        }
    },

    /**
     * Batch setting style with a given object
     * @param {Object|string} obj
     * @param {*} [obj]
     */
    set: function (obj, value) {
        if (typeof obj === 'string') {
            this[obj] = value;
        }
        else {
            this.extendFrom(obj, true);
        }
    },

    /**
     * Clone
     * @return {zrender/graphic/Style} [description]
     */
    clone: function () {
        var newStyle = new this.constructor();
        newStyle.extendFrom(this, true);
        return newStyle;
    },

    getGradient: function (ctx, obj, rect) {
        var method = obj.type === 'radial' ? createRadialGradient : createLinearGradient;
        var canvasGradient = method(ctx, obj, rect);
        var colorStops = obj.colorStops;
        for (var i = 0; i < colorStops.length; i++) {
            canvasGradient.addColorStop(
                colorStops[i].offset, colorStops[i].color
            );
        }
        return canvasGradient;
    }

};

var styleProto = Style.prototype;
for (var i = 0; i < STYLE_COMMON_PROPS.length; i++) {
    var prop = STYLE_COMMON_PROPS[i];
    if (!(prop[0] in styleProto)) {
        styleProto[prop[0]] = prop[1];
    }
}

// Provide for others
Style.getGradient = styleProto.getGradient;

/* harmony default export */ __webpack_exports__["a"] = (Style);

/***/ }),

/***/ 370:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Path__ = __webpack_require__(213);
/**
 * 圆形
 * @module zrender/shape/Circle
 */



/* harmony default export */ __webpack_exports__["default"] = (__WEBPACK_IMPORTED_MODULE_0__Path__["a" /* default */].extend({

    type: 'circle',

    shape: {
        cx: 0,
        cy: 0,
        r: 0
    },


    buildPath : function (ctx, shape, inBundle) {
        // Better stroking in ShapeBundle
        // Always do it may have performence issue ( fill may be 2x more cost)
        if (inBundle) {
            ctx.moveTo(shape.cx + shape.r, shape.cy);
        }
        // else {
        //     if (ctx.allocate && !ctx.data.length) {
        //         ctx.allocate(ctx.CMD_MEM_SIZE.A);
        //     }
        // }
        // Better stroking in ShapeBundle
        // ctx.moveTo(shape.cx + shape.r, shape.cy);
        ctx.arc(shape.cx, shape.cy, shape.r, 0, Math.PI * 2, true);
    }
}));

/***/ }),

/***/ 371:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Attack = __webpack_require__(378);

var _Attack2 = _interopRequireDefault(_Attack);

var _Detector = __webpack_require__(384);

var _Detector2 = _interopRequireDefault(_Detector);

var _Globe = __webpack_require__(379);

var _Globe2 = _interopRequireDefault(_Globe);

var _InfoContainer = __webpack_require__(376);

var _InfoContainer2 = _interopRequireDefault(_InfoContainer);

var _InfoPanel = __webpack_require__(377);

var _InfoPanel2 = _interopRequireDefault(_InfoPanel);

var _socket = __webpack_require__(811);

var _socket2 = _interopRequireDefault(_socket);

var _react = __webpack_require__(45);

var _react2 = _interopRequireDefault(_react);

__webpack_require__(696);

__webpack_require__(699);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var App = function (_Component) {
    _inherits(App, _Component);

    function App(props) {
        _classCallCheck(this, App);

        var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));

        _this.state = {
            nodes: {},
            edges: [],
            flight: [],
            origins: [], //攻击源
            types: [], //攻击类型
            targets: [], //攻击目标
            attacks: [], //实时信息
            data: {
                info: {
                    origin: {},
                    target: {},
                    type: {},
                    live: {}
                }
            }
        };
        return _this;
    }

    _createClass(App, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
            // add SocketIO.
            var socket = (0, _socket2.default)('http://localhost:4000');
            window.webSocket = socket; // 存入全局变量.

            socket.on('connect', function (c) {
                console.log("连接成功..." + new Date().getTime());
                socket.emit('hello', 'hello world!');
            });

            socket.on('disconnect', function () {
                console.log('you have been disconnected.');
            });

            socket.on('reconnect', function () {
                console.log('you have been reconnected');
            });

            socket.on('reconnect_error', function () {
                console.log('attempt to reconnect has failed');
            });
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            var _this2 = this;

            window.webSocket.on('link', function (data) {
                var _JSON$parse = JSON.parse(data.info),
                    origin = _JSON$parse.origin,
                    target = _JSON$parse.target,
                    type = _JSON$parse.type,
                    live = _JSON$parse.live;

                var _state = _this2.state,
                    origins = _state.origins,
                    targets = _state.targets,
                    types = _state.types,
                    attacks = _state.attacks;


                origins.push(origin);
                targets.push(target);
                types.push(type);
                attacks.push(live);

                [origins, targets, types, attacks].forEach(function (a) {
                    if (a.length >= 8) {
                        a.shift();
                    }
                });

                _this2.setState({
                    'origins': origins,
                    'targets': targets,
                    'types': types,
                    'attacks': attacks
                });
            });
        }
    }, {
        key: 'componentWillUnMount',
        value: function componentWillUnMount() {
            if (window.webSocket) {
                delete window.webSocket;
            }
        }
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'div',
                { className: 'app' },
                _react2.default.createElement(_Attack2.default, null),
                _react2.default.createElement(
                    _InfoContainer2.default,
                    null,
                    _react2.default.createElement(_InfoPanel2.default, { items: this.state.origins, title: 'ATTACK ORIGINS' }),
                    _react2.default.createElement(_InfoPanel2.default, { items: this.state.types, title: 'ATTACK TYPES' }),
                    _react2.default.createElement(_InfoPanel2.default, { items: this.state.targets, title: 'ATTACK TARGETS' }),
                    _react2.default.createElement(_InfoPanel2.default, { items: this.state.attacks, title: 'LIVE ATTACKS' }),
                    _Detector2.default.webgl ? _react2.default.createElement(_Globe2.default, { data: this.state.flight }) : null
                )
            );
        }
    }]);

    return App;
}(_react.Component);

exports.default = App;

/***/ }),

/***/ 373:
/***/ (function(module, exports) {

module.exports = after

function after(count, callback, err_cb) {
    var bail = false
    err_cb = err_cb || noop
    proxy.count = count

    return (count === 0) ? callback() : proxy

    function proxy(err, result) {
        if (proxy.count <= 0) {
            throw new Error('after called too many times')
        }
        --proxy.count

        // after first error, rest are passed to err_cb
        if (err) {
            bail = true
            callback(err)
            // future error callbacks will go to error handler
            callback = err_cb
        } else if (proxy.count === 0 && !bail) {
            callback(null, result)
        }
    }
}

function noop() {}


/***/ }),

/***/ 374:
/***/ (function(module, exports) {

/**
 * An abstraction for slicing an arraybuffer even when
 * ArrayBuffer.prototype.slice is not supported
 *
 * @api public
 */

module.exports = function(arraybuffer, start, end) {
  var bytes = arraybuffer.byteLength;
  start = start || 0;
  end = end || bytes;

  if (arraybuffer.slice) { return arraybuffer.slice(start, end); }

  if (start < 0) { start += bytes; }
  if (end < 0) { end += bytes; }
  if (end > bytes) { end = bytes; }

  if (start >= bytes || start >= end || bytes === 0) {
    return new ArrayBuffer(0);
  }

  var abv = new Uint8Array(arraybuffer);
  var result = new Uint8Array(end - start);
  for (var i = start, ii = 0; i < end; i++, ii++) {
    result[ii] = abv[i];
  }
  return result.buffer;
};


/***/ }),

/***/ 375:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _app = __webpack_require__(371);

var _app2 = _interopRequireDefault(_app);

var _reactDom = __webpack_require__(150);

var _reactDom2 = _interopRequireDefault(_reactDom);

var _react = __webpack_require__(45);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_reactDom2.default.render(_react2.default.createElement(_app2.default, null), document.getElementById('app'));

/***/ }),

/***/ 376:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(45);

var _react2 = _interopRequireDefault(_react);

__webpack_require__(697);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var InfoContainer = function (_PureComponent) {
    _inherits(InfoContainer, _PureComponent);

    function InfoContainer(props) {
        _classCallCheck(this, InfoContainer);

        return _possibleConstructorReturn(this, (InfoContainer.__proto__ || Object.getPrototypeOf(InfoContainer)).call(this, props));
    }

    _createClass(InfoContainer, [{
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'div',
                { className: 'container' },
                this.props.children
            );
        }
    }]);

    return InfoContainer;
}(_react.PureComponent);

exports.default = InfoContainer;

/***/ }),

/***/ 377:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(45);

var _react2 = _interopRequireDefault(_react);

__webpack_require__(698);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var InfoPanel = function (_Component) {
    _inherits(InfoPanel, _Component);

    function InfoPanel(props) {
        _classCallCheck(this, InfoPanel);

        return _possibleConstructorReturn(this, (InfoPanel.__proto__ || Object.getPrototypeOf(InfoPanel)).call(this, props));
    }

    _createClass(InfoPanel, [{
        key: 'render',
        value: function render() {
            var _this2 = this;

            // let cols = (this.props.items && this.props.items.length > 0)
            //     ? Object.keys(this.props.items[0]).length : 0;

            return _react2.default.createElement(
                'div',
                { className: 'infoPanel', style: { width: this.props.width, height: this.props.height } },
                _react2.default.createElement(
                    'div',
                    { className: 'title' },
                    this.props.title
                ),
                _react2.default.createElement(
                    'div',
                    { className: 'items' },
                    this.props.items.map(function (d, i) {
                        return _react2.default.createElement(
                            'div',
                            { key: '' + i, className: 'row' },
                            Object.keys(_this2.props.items[0]).map(function (k, i) {
                                return _react2.default.createElement(
                                    'div',
                                    { key: '' + i, className: 'item' },
                                    d[k]
                                );
                            })
                        );
                    })
                )
            );
        }
    }]);

    return InfoPanel;
}(_react.Component);

exports.default = InfoPanel;

/***/ }),

/***/ 378:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _jquery = __webpack_require__(149);

var _jquery2 = _interopRequireDefault(_jquery);

var _AnimatePoint = __webpack_require__(380);

var _AnimatePoint2 = _interopRequireDefault(_AnimatePoint);

var _AttackLine = __webpack_require__(381);

var _AttackLine2 = _interopRequireDefault(_AttackLine);

var _Config = __webpack_require__(83);

var _Config2 = _interopRequireDefault(_Config);

var _Link = __webpack_require__(217);

var _Link2 = _interopRequireDefault(_Link);

var _map = __webpack_require__(383);

var _map2 = _interopRequireDefault(_map);

var _Symbol2 = __webpack_require__(382);

var _Symbol3 = _interopRequireDefault(_Symbol2);

var _Tail = __webpack_require__(218);

var _Tail2 = _interopRequireDefault(_Tail);

var _querystring = __webpack_require__(724);

var _querystring2 = _interopRequireDefault(_querystring);

var _zrender = __webpack_require__(900);

var zrender = _interopRequireWildcard(_zrender);

var _RadialGradient = __webpack_require__(368);

var _RadialGradient2 = _interopRequireDefault(_RadialGradient);

var _react = __webpack_require__(45);

var _react2 = _interopRequireDefault(_react);

__webpack_require__(700);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var App = function (_PureComponent) {
    _inherits(App, _PureComponent);

    function App(props) {
        _classCallCheck(this, App);

        var _this2 = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));

        _this2.zr = null;
        _this2.map = null;

        _this2._drawMap = _this2._drawMap.bind(_this2);
        _this2._drawAttack = _this2._drawAttack.bind(_this2);
        _this2._receiveData = _this2._receiveData.bind(_this2);
        _this2._windowResize = _this2._windowResize.bind(_this2);
        return _this2;
    }

    _createClass(App, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            this._drawMap();

            var attack = getComputedStyle(this.refs.attack);

            this.zr = zrender.init(this.refs.attack, {
                width: attack['width'],
                height: attack['height']
            });

            // this._drawAttack();
            this._receiveData();

            window.addEventListener('resize', this._windowResize);
        }
    }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate(prevProps, prevState) {}
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            window.removeEventListener('resize', this._windowResize);
        }
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'div',
                { ref: 'map', className: 'map' },
                _react2.default.createElement('div', { ref: 'attack', className: 'attack' })
            );
        }

        /**
         * 绘制地图.
         */

    }, {
        key: '_drawMap',
        value: function _drawMap() {
            var _this3 = this;

            // 地图瓦片风格
            var tileLayer = {
                'baidu': 'http://online{s}.map.bdimg.com/tile/?qt=tile&x={x}&y={y}&z={z}&styles=pl&udt=20170624&scaler=2',
                'Google Satellite': 'http://mt2.google.cn/vt/lyrs=y@258000000&hl=zh-CN&gl=CN&src=app&x={x}&y={y}&z={z}&s=Ga',
                'Mapbox Dark': 'https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoid2luZHloIiwiYSI6ImNpbHdiazZyazAxcTV2Z2tzbnNwcG1xbTMifQ.jz162pjSUZ957Vv_wP6i1A',
                'Mapbox Traffic Day': 'https://api.mapbox.com/styles/v1/mapbox/traffic-day-v2/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoid2luZHloIiwiYSI6ImNpbHdiazZyazAxcTV2Z2tzbnNwcG1xbTMifQ.jz162pjSUZ957Vv_wP6i1A',
                'Mapbox Light': 'https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoid2luZHloIiwiYSI6ImNpbHdiazZyazAxcTV2Z2tzbnNwcG1xbTMifQ.jz162pjSUZ957Vv_wP6i1A',
                'Mapbox Traffic Night': 'https://api.mapbox.com/styles/v1/mapbox/traffic-night-v2/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoid2luZHloIiwiYSI6ImNpbHdiazZyazAxcTV2Z2tzbnNwcG1xbTMifQ.jz162pjSUZ957Vv_wP6i1A',
                'Mapbox Outdoors': 'https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoid2luZHloIiwiYSI6ImNpbHdiazZyazAxcTV2Z2tzbnNwcG1xbTMifQ.jz162pjSUZ957Vv_wP6i1A'
            };

            this.map = new _map2.default({
                dom: this.refs.map,
                mapType: 'Mapbox Dark',
                // tileLayer: tileLayer['Google Satellite']
                tileLayer: tileLayer['Mapbox Dark']
            }).render();

            this.map.on('move', function (event) {
                if (_this3.zr) {
                    //每次重绘  清空界面.
                    _this3.zr.clear();
                }

                // this._drawAttack();
            });

            this.map.on('click', function (e) {
                console.log(e);
            });
        }

        /**
         * 绘制attack
         */

    }, {
        key: '_drawAttack',
        value: function _drawAttack() {
            var pixel = [0, 0];
            var node = [];

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = Object.keys(this.props.nodes)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var k = _step.value;

                    pixel = this.map.latLngToContainerPoint([this.props.nodes[k]['lat'], this.props.nodes[k]['lng']]);
                    node.push({
                        x: pixel.x,
                        y: pixel.y,
                        r: this.props.nodes[k]['count'] / 5
                    });
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            for (var i = 0; i < node.length; i++) {
                var points = new _AnimatePoint2.default({
                    r: node[i].r,
                    x: node[i].x,
                    y: node[i].y,
                    lineWidth: 1,
                    fill: _Config2.default.gradient,
                    loop: true
                }).render();

                this.zr.add(points);
            }

            var links = [];

            // 生成连接，目的是为飞线生成飞行路径.
            for (var _i = 0; _i < this.props.edges.length; _i++) {
                var fromPixel = this.map.latLngToContainerPoint([this.props.edges[_i]['from'].lat, this.props.edges[_i]['from'].lng]);
                var toPixel = this.map.latLngToContainerPoint([this.props.edges[_i]['to'].lat, this.props.edges[_i]['to'].lng]);

                var link = new _Link2.default({
                    from: {
                        x: fromPixel.x,
                        y: fromPixel.y
                    },
                    to: {
                        x: toPixel.x,
                        y: toPixel.y
                    },
                    stroke: 'rgba(0, 0, 0, 0)'
                }).render();

                // 若是闭环的点, 那么就不加上去.
                if (link.shape.x1 == link.shape.x2 && link.shape.y1 == link.shape.y2) {
                    continue;
                }

                links.push(link);
                this.zr.add(link);
            }

            // 生成尾焰
            for (var index = 0; index < links.length; index++) {
                var _link = links[index];
                // let tail = new Tail({
                //     link: link,
                //     size: 3,
                // }).render();

                var attackLine = new _AttackLine2.default({
                    link: _link,
                    size: 3,
                    loop: true
                });

                var line = attackLine.render();
                this.zr.add(line);
            }

            // 生成symbol.
            // for (let index = 0; index < links.length; index++) {
            //     let link = links[index];
            //     let path = 'M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z';

            //     let symbol = new Symbol({
            //         path: path,
            //         scale: [0.02, 0.02],
            //         link: link,
            //         fill: 'rgba(255, 255, 0, 1)',
            //         loop: true
            //     }).render();

            //     this.zr.add(symbol);
            // }
        }

        /**
         * websocket.
         */

    }, {
        key: '_receiveData',
        value: function _receiveData() {
            var _this = this;

            if (window.webSocket) {
                //后台触发link事件,传送关联信息.
                window.webSocket.on('link', function (data) {
                    if (!data) {
                        return;
                    }

                    var _JSON$parse = JSON.parse(data.info),
                        from = _JSON$parse.from,
                        to = _JSON$parse.to,
                        origin = _JSON$parse.origin,
                        target = _JSON$parse.target,
                        type = _JSON$parse.type,
                        live = _JSON$parse.live;

                    var fpoint = _this.map.latLngToContainerPoint([from.lat, from.lng]);
                    var tpoint = _this.map.latLngToContainerPoint([to.lat, to.lng]);

                    var fp = new _AnimatePoint2.default({
                        r: Math.random() * 10 + 10,
                        x: fpoint.x,
                        y: fpoint.y,
                        lineWidth: 1,
                        fill: _Config2.default.gradient,
                        loop: false,
                        callback: function callback() {
                            _this.zr.remove(fp);
                        }
                    }).render();

                    var tp = new _AnimatePoint2.default({
                        r: Math.random() * 10 + 10,
                        x: tpoint.x,
                        y: tpoint.y,
                        lineWidth: 1,
                        fill: _Config2.default.gradient,
                        loop: false,
                        callback: function callback() {
                            _this.zr.remove(tp);
                        }
                    }).render();

                    var link = new _Link2.default({
                        from: {
                            x: fpoint.x,
                            y: fpoint.y
                        },
                        to: {
                            x: tpoint.x,
                            y: tpoint.y
                        },
                        stroke: 'rgba(0, 0, 0, 0)'
                    }).render();

                    var flightLine = null;
                    var attackLine = new _AttackLine2.default({
                        link: link,
                        size: 3,
                        loop: false,
                        callback: function callback() {
                            _this.zr.remove(link);
                            _this.zr.remove(flightLine);
                        }
                    });

                    flightLine = attackLine.render();
                    _this.zr.add(flightLine);
                    _this.zr.add(fp);
                    _this.zr.add(tp);
                });
            }
        }

        /**
         * 窗口大小改变, 重置zr大小.
         */

    }, {
        key: '_windowResize',
        value: function _windowResize() {
            var _window = window,
                innerHeight = _window.innerHeight,
                innerWidth = _window.innerWidth;


            if (this.zr) {
                this.zr.resize({
                    width: innerWidth,
                    height: innerHeight
                });
            }
        }
    }]);

    return App;
}(_react.PureComponent);

exports.default = App;

/***/ }),

/***/ 379:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _jquery = __webpack_require__(149);

var _jquery2 = _interopRequireDefault(_jquery);

var _echarts = __webpack_require__(148);

var _echarts2 = _interopRequireDefault(_echarts);

var _echartsGl = __webpack_require__(215);

var _echartsGl2 = _interopRequireDefault(_echartsGl);

var _react = __webpack_require__(45);

var _react2 = _interopRequireDefault(_react);

__webpack_require__(701);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Globe = function (_PureComponent) {
    _inherits(Globe, _PureComponent);

    function Globe(props) {
        _classCallCheck(this, Globe);

        return _possibleConstructorReturn(this, (Globe.__proto__ || Object.getPrototypeOf(Globe)).call(this, props));

        // this.state={
        //     width: null,
        //     height: null
        // };

        // this._fullScreenClick = this._fullScreenClick.bind(this);
    }

    _createClass(Globe, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            _echarts2.default - _echartsGl2.default;
            var series = {
                type: 'lines3D',
                name: 'airlineName',

                effect: {
                    show: true,
                    trailWidth: 5,
                    trailLength: 0.4,
                    trailOpacity: 0.6,
                    trailColor: 'rgb(30, 30, 60)'
                },

                lineStyle: {
                    width: 3,
                    color: 'rgb(50, 50, 150)',
                    // color: 'rgb(118, 233, 241)',
                    opacity: 0.1
                },
                blendMode: 'lighter',

                distanceToGlobe: 4,

                data: [[[117, 39], // 起点的经纬度坐标
                [117, 10]] // 终点的经纬度坐标
                ]
            };

            var chart = _echarts2.default.init(this.refs.globe);

            chart.setOption({
                backgroundColor: '#000',
                globe: {
                    baseTexture: "../../../data/world.topo.bathy.200401.jpg",
                    displacementScale: 0.04,
                    shading: 'realistic',
                    realisticMaterial: {
                        roughness: 0.9
                    },
                    postEffect: {
                        enable: true
                    },
                    light: {
                        main: {
                            intensity: 5,
                            shadow: true
                        },
                        ambientCubemap: {
                            diffuseIntensity: 0.2
                        }
                    }
                },
                series: series
            });

            window.onresize = chart.resize;

            window.addEventListener('keydown', function () {
                chart.dispatchAction({
                    type: 'lines3DToggleEffect',
                    seriesIndex: 0
                });
            });
        }
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement('div', { ref: 'globe', className: 'globe' })
            );
        }

        // _fullScreenClick(){
        //     // console.log("=============")
        //     let {innerWidth, innerHeight}= window
        //     console.log(innerHeight, innerWidth)
        //     this.setState({
        //         width: innerWidth,
        //         height: innerHeight
        //     });
        // }

    }]);

    return Globe;
}(_react.PureComponent);

exports.default = Globe;

/***/ }),

/***/ 380:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
   value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Config = __webpack_require__(83);

var _Config2 = _interopRequireDefault(_Config);

var _Circle = __webpack_require__(370);

var _Circle2 = _interopRequireDefault(_Circle);

var _Group = __webpack_require__(106);

var _Group2 = _interopRequireDefault(_Group);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AnimatePoint = function () {
   function AnimatePoint(opts) {
      _classCallCheck(this, AnimatePoint);

      this.r = opts['r'] || 0;
      this.x = opts['x'] || 0;
      this.y = opts['y'] || 0;
      this.fill = opts['fill'] || 'rgba(255, 255, 0, 1)';
      this.lineWidth = opts['lineWidth'] || 2;
      this.during = opts['during'] || _Config2.default.pointAnimateDuring;
      this.loop = opts['loop'];
      this.callback = opts['callback'] || function () {};
   }

   _createClass(AnimatePoint, [{
      key: 'render',
      value: function render() {
         var outterCircleNum = 3; // 动态环的个数
         var maxRaduis = this.r * 3; //外环最大半径
         var g = new _Group2.default();

         // for(let index = 0; index < outterCircleNum; index++) {
         // let centerPoint = new Circle({
         //     shape: {
         //         cx: this.x,
         //         cy: this.y,
         //         // r: this.r
         //         r: 0
         //     },
         //     style: {
         //         fill: this.fill,
         //         stroke: 'none'
         //     }
         // });

         // centerPoint.animateShape(this.loop)
         //     .delay(index / outterCircleNum * this.during)
         //     .when(this.during, {
         //         r: this.r
         //     })
         //     .start(Config.animationEasing)
         //     .done(this.callback);

         // centerPoint.animateStyle(this.loop)
         //     .delay(index / outterCircleNum * this.during)
         //     .when(this.during - 200, {
         //         opacity: 1
         //     })
         //     .when(this.during, {
         //         opacity: 0
         //     })
         //     .start(Config.animationEasing)
         //     .done(this.callback);

         // g.add(centerPoint);
         // }

         // 生成环
         for (var index = 0; index < outterCircleNum; index++) {
            var circleShape = new _Circle2.default({
               shape: {
                  cx: this.x,
                  cy: this.y,
                  r: this.r
               },
               style: {
                  fill: 'none',
                  stroke: this.fill,
                  lineWidth: this.lineWidth
               },
               hoverable: false
            });

            circleShape.animateShape(this.loop).when(this.during, {
               r: maxRaduis
            }).delay(this.during / outterCircleNum * index).start(_Config2.default.animationEasing).done(this.callback);

            circleShape.animateStyle(this.loop).when(this.during, {
               opacity: 0,
               lineWidth: 3
            }).delay(this.during / outterCircleNum * index).start(_Config2.default.animationEasing).done(this.callback);

            g.add(circleShape);
         }

         return g;
      }
   }]);

   return AnimatePoint;
}();

exports.default = AnimatePoint;

/***/ }),

/***/ 381:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _Tail2 = __webpack_require__(218);

var _Tail3 = _interopRequireDefault(_Tail2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AttackLine = function (_Tail) {
    _inherits(AttackLine, _Tail);

    function AttackLine(opts) {
        _classCallCheck(this, AttackLine);

        var _this = _possibleConstructorReturn(this, (AttackLine.__proto__ || Object.getPrototypeOf(AttackLine)).call(this, opts));

        _this.displayName = 'AttackLine';
        return _this;
    }

    return AttackLine;
}(_Tail3.default);

exports.default = AttackLine;

/***/ }),

/***/ 382:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
   value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Config = __webpack_require__(83);

var _Config2 = _interopRequireDefault(_Config);

var _Group = __webpack_require__(106);

var _Group2 = _interopRequireDefault(_Group);

var _path = __webpack_require__(898);

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _Symbol = function () {
   function _Symbol(opts) {
      _classCallCheck(this, _Symbol);

      this.path = opts['path'] || '';
      this.scale = opts['scale'] || [1, 1];
      this.lineWidth = opts['lineWidth'] || 1;
      this.stroke = opts['stroke'] || 'rgba(255, 255, 0, 1)';
      this.fill = opts['fill'] || 'rgba(255, 255, 0, 0.3)';
      this.link = opts['link'] || null; // null的时候仅生成symbol.
      this.during = opts['during'] || _Config2.default.animationDefaultDuring;
      this.loop = opts['loop'];
      this.callback = opts['callback'];
   }

   _createClass(_Symbol, [{
      key: 'render',
      value: function render() {
         var _this = this;

         var symbol = _path2.default.createFromString(this.path, {
            style: {
               lineWidth: this.lineWidth,
               stroke: this.stroke,
               fill: this.fill
            },
            scale: this.scale
         });

         var _symbol$getBoundingRe = symbol.getBoundingRect(),
             x = _symbol$getBoundingRe.x,
             y = _symbol$getBoundingRe.y,
             width = _symbol$getBoundingRe.width,
             height = _symbol$getBoundingRe.height;

         symbol.position = [-x * this.scale[0] - width * this.scale[0] / 2, -y * this.scale[1] - height * this.scale[1] / 2];
         var g = new _Group2.default();
         g.add(symbol);

         if (this.link) {
            g.animate('', this.loop).when(this.during, {
               position: [1, 0]
            }).during(function (i, t) {
               var pos = _this.link.pointAt(t);
               var tangent = _this.link.tangentAt(t);

               g.position = pos;
               g.rotation = -Math.PI / 2 - Math.atan2(tangent[1], tangent[0]);
            }).start(_Config2.default.animationEasing).done(this.callback);
         }

         return g;
      }
   }]);

   return _Symbol;
}();

exports.default = _Symbol;

/***/ }),

/***/ 383:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
// import Proj4Leaflet from 'proj4leaflet';


var _leaflet = __webpack_require__(216);

var _leaflet2 = _interopRequireDefault(_leaflet);

__webpack_require__(695);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Map = function () {
    function Map(opts) {
        _classCallCheck(this, Map);

        this.dom = opts.dom;
        this.mapType = opts.mapType || 'osm'; //默认是osm
        this.tileLayer = opts.tileLayer || 'http://mt2.google.cn/vt/lyrs=y@258000000&hl=zh-CN&gl=CN&src=app&x={x}&y={y}&z={z}&s=Ga'; //默认google卫星地图
    }

    _createClass(Map, [{
        key: 'render',
        value: function render() {
            var _getComputedStyle = getComputedStyle(this.dom),
                width = _getComputedStyle.width,
                height = _getComputedStyle.height;

            var map = null;
            // 百度地图
            if (this.mapType == 'baidu') {
                var crs = new _leaflet2.default.Proj.CRS('EPSG:3395', '+proj=merc +lon_0=0 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs', {
                    resolutions: function () {
                        var level = 19;
                        var res = [];
                        res[0] = Math.pow(2, 18);

                        for (var i = 1; i < level; i++) {
                            res[i] = Math.pow(2, 18 - i);
                        }

                        return res;
                    }(),
                    origin: [0, 0],
                    bounds: _leaflet2.default.bounds([0, 20037508.342789244], [20037508.342789244, 0])
                });

                map = _leaflet2.default.map(this.dom, {
                    renderer: 'canvas',
                    minZoom: 2,
                    crs: crs
                }).setView([39.91349, 116.407945], 3);

                _leaflet2.default.tileLayer(this.tileLayer, {
                    attribution: '&copy; 百度地图',
                    maxZoom: 18,
                    minZoom: 3,
                    subdomains: '1234',
                    tms: true
                }).addTo(map);
            } else {
                map = _leaflet2.default.map(this.dom, {
                    renderer: 'canvas',
                    minZoom: 2
                }).setView([39.91349, 116.407945], 3);

                _leaflet2.default.tileLayer(this.tileLayer, {
                    maxZoom: 18,
                    minZoom: 3
                }).addTo(map);
            }

            map.invalidateSize(true);

            return map;
        }
    }]);

    return Map;
}();

exports.default = Map;

/***/ }),

/***/ 384:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(module) {

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * if or not web browser support webgl. Code from Three.js.
 */

var Detector = {

    canvas: !!window.CanvasRenderingContext2D,
    webgl: function () {

        try {

            var canvas = document.createElement('canvas');return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
        } catch (e) {

            return false;
        }
    }(),
    workers: !!window.Worker,
    fileapi: window.File && window.FileReader && window.FileList && window.Blob,

    getWebGLErrorMessage: function getWebGLErrorMessage() {

        var element = document.createElement('div');
        element.id = 'webgl-error-message';
        element.style.fontFamily = 'monospace';
        element.style.fontSize = '13px';
        element.style.fontWeight = 'normal';
        element.style.textAlign = 'center';
        element.style.background = '#fff';
        element.style.color = '#000';
        element.style.padding = '1.5em';
        element.style.width = '400px';
        element.style.margin = '5em auto 0';

        if (!this.webgl) {

            element.innerHTML = window.WebGLRenderingContext ? ['Your graphics card does not seem to support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation" style="color:#000">WebGL</a>.<br />', 'Find out how to get it <a href="http://get.webgl.org/" style="color:#000">here</a>.'].join('\n') : ['Your browser does not seem to support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation" style="color:#000">WebGL</a>.<br/>', 'Find out how to get it <a href="http://get.webgl.org/" style="color:#000">here</a>.'].join('\n');
        }

        return element;
    },

    addGetWebGLMessage: function addGetWebGLMessage(parameters) {

        var parent, id, element;

        parameters = parameters || {};

        parent = parameters.parent !== undefined ? parameters.parent : document.body;
        id = parameters.id !== undefined ? parameters.id : 'oldie';

        element = Detector.getWebGLErrorMessage();
        element.id = id;

        parent.appendChild(element);
    }

};

// browserify support
if (( false ? 'undefined' : _typeof(module)) === 'object') {

    module.exports = Detector;
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(818)(module)))

/***/ }),

/***/ 385:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
   value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MathUtil = function () {
   function MathUtil() {
      _classCallCheck(this, MathUtil);
   }

   /**
    * @param curveness > 0 and < 1;
    */


   _createClass(MathUtil, null, [{
      key: "getCurvenessPoint",
      value: function getCurvenessPoint(from, to) {
         var median = {
            x: (from.x + to.x) / 2,
            y: (from.y + to.y) / 2
         };

         var d = Math.sqrt(Math.pow(from.x - to.x, 2) + Math.pow(from.y - to.y, 2));
         d = from.y > to.y ? -d : d;
         var k = -(from.x - to.x) / (from.y - to.y); // slope.

         // Calculate control point.
         var x = median.x + d / 4 * Math.cos(Math.atan(k));
         var y = median.y + d / 4 * Math.sin(Math.atan(k));

         return {
            x: x,
            y: y
         };
      }
   }]);

   return MathUtil;
}();

exports.default = MathUtil;

/***/ }),

/***/ 386:
/***/ (function(module, exports) {


/**
 * Expose `Backoff`.
 */

module.exports = Backoff;

/**
 * Initialize backoff timer with `opts`.
 *
 * - `min` initial timeout in milliseconds [100]
 * - `max` max timeout [10000]
 * - `jitter` [0]
 * - `factor` [2]
 *
 * @param {Object} opts
 * @api public
 */

function Backoff(opts) {
  opts = opts || {};
  this.ms = opts.min || 100;
  this.max = opts.max || 10000;
  this.factor = opts.factor || 2;
  this.jitter = opts.jitter > 0 && opts.jitter <= 1 ? opts.jitter : 0;
  this.attempts = 0;
}

/**
 * Return the backoff duration.
 *
 * @return {Number}
 * @api public
 */

Backoff.prototype.duration = function(){
  var ms = this.ms * Math.pow(this.factor, this.attempts++);
  if (this.jitter) {
    var rand =  Math.random();
    var deviation = Math.floor(rand * this.jitter * ms);
    ms = (Math.floor(rand * 10) & 1) == 0  ? ms - deviation : ms + deviation;
  }
  return Math.min(ms, this.max) | 0;
};

/**
 * Reset the number of attempts.
 *
 * @api public
 */

Backoff.prototype.reset = function(){
  this.attempts = 0;
};

/**
 * Set the minimum duration
 *
 * @api public
 */

Backoff.prototype.setMin = function(min){
  this.ms = min;
};

/**
 * Set the maximum duration
 *
 * @api public
 */

Backoff.prototype.setMax = function(max){
  this.max = max;
};

/**
 * Set the jitter
 *
 * @api public
 */

Backoff.prototype.setJitter = function(jitter){
  this.jitter = jitter;
};



/***/ }),

/***/ 387:
/***/ (function(module, exports) {

/*
 * base64-arraybuffer
 * https://github.com/niklasvh/base64-arraybuffer
 *
 * Copyright (c) 2012 Niklas von Hertzen
 * Licensed under the MIT license.
 */
(function(){
  "use strict";

  var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

  // Use a lookup table to find the index.
  var lookup = new Uint8Array(256);
  for (var i = 0; i < chars.length; i++) {
    lookup[chars.charCodeAt(i)] = i;
  }

  exports.encode = function(arraybuffer) {
    var bytes = new Uint8Array(arraybuffer),
    i, len = bytes.length, base64 = "";

    for (i = 0; i < len; i+=3) {
      base64 += chars[bytes[i] >> 2];
      base64 += chars[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)];
      base64 += chars[((bytes[i + 1] & 15) << 2) | (bytes[i + 2] >> 6)];
      base64 += chars[bytes[i + 2] & 63];
    }

    if ((len % 3) === 2) {
      base64 = base64.substring(0, base64.length - 1) + "=";
    } else if (len % 3 === 1) {
      base64 = base64.substring(0, base64.length - 2) + "==";
    }

    return base64;
  };

  exports.decode =  function(base64) {
    var bufferLength = base64.length * 0.75,
    len = base64.length, i, p = 0,
    encoded1, encoded2, encoded3, encoded4;

    if (base64[base64.length - 1] === "=") {
      bufferLength--;
      if (base64[base64.length - 2] === "=") {
        bufferLength--;
      }
    }

    var arraybuffer = new ArrayBuffer(bufferLength),
    bytes = new Uint8Array(arraybuffer);

    for (i = 0; i < len; i+=4) {
      encoded1 = lookup[base64.charCodeAt(i)];
      encoded2 = lookup[base64.charCodeAt(i+1)];
      encoded3 = lookup[base64.charCodeAt(i+2)];
      encoded4 = lookup[base64.charCodeAt(i+3)];

      bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
      bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
      bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
    }

    return arraybuffer;
  };
})();


/***/ }),

/***/ 388:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  for (var i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(
      uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)
    ))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}


/***/ }),

/***/ 389:
/***/ (function(module, exports) {

/**
 * Create a blob builder even when vendor prefixes exist
 */

var BlobBuilder = typeof BlobBuilder !== 'undefined' ? BlobBuilder :
  typeof WebKitBlobBuilder !== 'undefined' ? WebKitBlobBuilder :
  typeof MSBlobBuilder !== 'undefined' ? MSBlobBuilder :
  typeof MozBlobBuilder !== 'undefined' ? MozBlobBuilder : 
  false;

/**
 * Check if Blob constructor is supported
 */

var blobSupported = (function() {
  try {
    var a = new Blob(['hi']);
    return a.size === 2;
  } catch(e) {
    return false;
  }
})();

/**
 * Check if Blob constructor supports ArrayBufferViews
 * Fails in Safari 6, so we need to map to ArrayBuffers there.
 */

var blobSupportsArrayBufferView = blobSupported && (function() {
  try {
    var b = new Blob([new Uint8Array([1,2])]);
    return b.size === 2;
  } catch(e) {
    return false;
  }
})();

/**
 * Check if BlobBuilder is supported
 */

var blobBuilderSupported = BlobBuilder
  && BlobBuilder.prototype.append
  && BlobBuilder.prototype.getBlob;

/**
 * Helper function that maps ArrayBufferViews to ArrayBuffers
 * Used by BlobBuilder constructor and old browsers that didn't
 * support it in the Blob constructor.
 */

function mapArrayBufferViews(ary) {
  return ary.map(function(chunk) {
    if (chunk.buffer instanceof ArrayBuffer) {
      var buf = chunk.buffer;

      // if this is a subarray, make a copy so we only
      // include the subarray region from the underlying buffer
      if (chunk.byteLength !== buf.byteLength) {
        var copy = new Uint8Array(chunk.byteLength);
        copy.set(new Uint8Array(buf, chunk.byteOffset, chunk.byteLength));
        buf = copy.buffer;
      }

      return buf;
    }

    return chunk;
  });
}

function BlobBuilderConstructor(ary, options) {
  options = options || {};

  var bb = new BlobBuilder();
  mapArrayBufferViews(ary).forEach(function(part) {
    bb.append(part);
  });

  return (options.type) ? bb.getBlob(options.type) : bb.getBlob();
};

function BlobConstructor(ary, options) {
  return new Blob(mapArrayBufferViews(ary), options || {});
};

if (typeof Blob !== 'undefined') {
  BlobBuilderConstructor.prototype = Blob.prototype;
  BlobConstructor.prototype = Blob.prototype;
}

module.exports = (function() {
  if (blobSupported) {
    return blobSupportsArrayBufferView ? Blob : BlobConstructor;
  } else if (blobBuilderSupported) {
    return BlobBuilderConstructor;
  } else {
    return undefined;
  }
})();


/***/ }),

/***/ 50:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["c"] = create;
/* unused harmony export copy */
/* unused harmony export clone */
/* unused harmony export set */
/* unused harmony export add */
/* unused harmony export scaleAndAdd */
/* unused harmony export sub */
/* unused harmony export len */
/* unused harmony export length */
/* unused harmony export lenSquare */
/* unused harmony export lengthSquare */
/* unused harmony export mul */
/* unused harmony export div */
/* unused harmony export dot */
/* unused harmony export scale */
/* harmony export (immutable) */ __webpack_exports__["g"] = normalize;
/* unused harmony export distance */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return dist; });
/* unused harmony export distanceSquare */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return distSquare; });
/* unused harmony export negate */
/* unused harmony export lerp */
/* harmony export (immutable) */ __webpack_exports__["b"] = applyTransform;
/* harmony export (immutable) */ __webpack_exports__["e"] = min;
/* harmony export (immutable) */ __webpack_exports__["f"] = max;

var ArrayCtor = typeof Float32Array === 'undefined'
    ? Array
    : Float32Array;

/**
 * 创建一个向量
 * @param {number} [x=0]
 * @param {number} [y=0]
 * @return {Vector2}
 */
function create(x, y) {
    var out = new ArrayCtor(2);
    if (x == null) {
        x = 0;
    }
    if (y == null) {
        y = 0;
    }
    out[0] = x;
    out[1] = y;
    return out;
}

/**
 * 复制向量数据
 * @param {Vector2} out
 * @param {Vector2} v
 * @return {Vector2}
 */
function copy(out, v) {
    out[0] = v[0];
    out[1] = v[1];
    return out;
}

/**
 * 克隆一个向量
 * @param {Vector2} v
 * @return {Vector2}
 */
function clone(v) {
    var out = new ArrayCtor(2);
    out[0] = v[0];
    out[1] = v[1];
    return out;
}

/**
 * 设置向量的两个项
 * @param {Vector2} out
 * @param {number} a
 * @param {number} b
 * @return {Vector2} 结果
 */
function set(out, a, b) {
    out[0] = a;
    out[1] = b;
    return out;
}

/**
 * 向量相加
 * @param {Vector2} out
 * @param {Vector2} v1
 * @param {Vector2} v2
 */
function add(out, v1, v2) {
    out[0] = v1[0] + v2[0];
    out[1] = v1[1] + v2[1];
    return out;
}

/**
 * 向量缩放后相加
 * @param {Vector2} out
 * @param {Vector2} v1
 * @param {Vector2} v2
 * @param {number} a
 */
function scaleAndAdd(out, v1, v2, a) {
    out[0] = v1[0] + v2[0] * a;
    out[1] = v1[1] + v2[1] * a;
    return out;
}

/**
 * 向量相减
 * @param {Vector2} out
 * @param {Vector2} v1
 * @param {Vector2} v2
 */
function sub(out, v1, v2) {
    out[0] = v1[0] - v2[0];
    out[1] = v1[1] - v2[1];
    return out;
}

/**
 * 向量长度
 * @param {Vector2} v
 * @return {number}
 */
function len(v) {
    return Math.sqrt(lenSquare(v));
}
var length = len; // jshint ignore:line

/**
 * 向量长度平方
 * @param {Vector2} v
 * @return {number}
 */
function lenSquare(v) {
    return v[0] * v[0] + v[1] * v[1];
}
var lengthSquare = lenSquare;

/**
 * 向量乘法
 * @param {Vector2} out
 * @param {Vector2} v1
 * @param {Vector2} v2
 */
function mul(out, v1, v2) {
    out[0] = v1[0] * v2[0];
    out[1] = v1[1] * v2[1];
    return out;
}

/**
 * 向量除法
 * @param {Vector2} out
 * @param {Vector2} v1
 * @param {Vector2} v2
 */
function div(out, v1, v2) {
    out[0] = v1[0] / v2[0];
    out[1] = v1[1] / v2[1];
    return out;
}

/**
 * 向量点乘
 * @param {Vector2} v1
 * @param {Vector2} v2
 * @return {number}
 */
function dot(v1, v2) {
    return v1[0] * v2[0] + v1[1] * v2[1];
}

/**
 * 向量缩放
 * @param {Vector2} out
 * @param {Vector2} v
 * @param {number} s
 */
function scale(out, v, s) {
    out[0] = v[0] * s;
    out[1] = v[1] * s;
    return out;
}

/**
 * 向量归一化
 * @param {Vector2} out
 * @param {Vector2} v
 */
function normalize(out, v) {
    var d = len(v);
    if (d === 0) {
        out[0] = 0;
        out[1] = 0;
    }
    else {
        out[0] = v[0] / d;
        out[1] = v[1] / d;
    }
    return out;
}

/**
 * 计算向量间距离
 * @param {Vector2} v1
 * @param {Vector2} v2
 * @return {number}
 */
function distance(v1, v2) {
    return Math.sqrt(
        (v1[0] - v2[0]) * (v1[0] - v2[0])
        + (v1[1] - v2[1]) * (v1[1] - v2[1])
    );
}
var dist = distance;

/**
 * 向量距离平方
 * @param {Vector2} v1
 * @param {Vector2} v2
 * @return {number}
 */
function distanceSquare(v1, v2) {
    return (v1[0] - v2[0]) * (v1[0] - v2[0])
        + (v1[1] - v2[1]) * (v1[1] - v2[1]);
}
var distSquare = distanceSquare;

/**
 * 求负向量
 * @param {Vector2} out
 * @param {Vector2} v
 */
function negate(out, v) {
    out[0] = -v[0];
    out[1] = -v[1];
    return out;
}

/**
 * 插值两个点
 * @param {Vector2} out
 * @param {Vector2} v1
 * @param {Vector2} v2
 * @param {number} t
 */
function lerp(out, v1, v2, t) {
    out[0] = v1[0] + t * (v2[0] - v1[0]);
    out[1] = v1[1] + t * (v2[1] - v1[1]);
    return out;
}

/**
 * 矩阵左乘向量
 * @param {Vector2} out
 * @param {Vector2} v
 * @param {Vector2} m
 */
function applyTransform(out, v, m) {
    var x = v[0];
    var y = v[1];
    out[0] = m[0] * x + m[2] * y + m[4];
    out[1] = m[1] * x + m[3] * y + m[5];
    return out;
}

/**
 * 求两个向量最小值
 * @param  {Vector2} out
 * @param  {Vector2} v1
 * @param  {Vector2} v2
 */
function min(out, v1, v2) {
    out[0] = Math.min(v1[0], v2[0]);
    out[1] = Math.min(v1[1], v2[1]);
    return out;
}

/**
 * 求两个向量最大值
 * @param  {Vector2} out
 * @param  {Vector2} v1
 * @param  {Vector2} v2
 */
function max(out, v1, v2) {
    out[0] = Math.max(v1[0], v2[0]);
    out[1] = Math.max(v1[1], v2[1]);
    return out;
}


/***/ }),

/***/ 65:
/***/ (function(module, exports, __webpack_require__) {


/**
 * Expose `Emitter`.
 */

if (true) {
  module.exports = Emitter;
}

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  function on() {
    this.off(event, on);
    fn.apply(this, arguments);
  }

  on.fn = fn;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks['$' + event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks['$' + event];
    return this;
  }

  // remove specific handler
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks['$' + event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks['$' + event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};


/***/ }),

/***/ 687:
/***/ (function(module, exports, __webpack_require__) {


module.exports = __webpack_require__(688);

/**
 * Exports parser
 *
 * @api public
 *
 */
module.exports.parser = __webpack_require__(74);


/***/ }),

/***/ 688:
/***/ (function(module, exports, __webpack_require__) {

/**
 * Module dependencies.
 */

var transports = __webpack_require__(300);
var Emitter = __webpack_require__(65);
var debug = __webpack_require__(127)('engine.io-client:socket');
var index = __webpack_require__(306);
var parser = __webpack_require__(74);
var parseuri = __webpack_require__(307);
var parseqs = __webpack_require__(129);

/**
 * Module exports.
 */

module.exports = Socket;

/**
 * Socket constructor.
 *
 * @param {String|Object} uri or options
 * @param {Object} options
 * @api public
 */

function Socket (uri, opts) {
  if (!(this instanceof Socket)) return new Socket(uri, opts);

  opts = opts || {};

  if (uri && 'object' === typeof uri) {
    opts = uri;
    uri = null;
  }

  if (uri) {
    uri = parseuri(uri);
    opts.hostname = uri.host;
    opts.secure = uri.protocol === 'https' || uri.protocol === 'wss';
    opts.port = uri.port;
    if (uri.query) opts.query = uri.query;
  } else if (opts.host) {
    opts.hostname = parseuri(opts.host).host;
  }

  this.secure = null != opts.secure ? opts.secure
    : (typeof location !== 'undefined' && 'https:' === location.protocol);

  if (opts.hostname && !opts.port) {
    // if no port is specified manually, use the protocol default
    opts.port = this.secure ? '443' : '80';
  }

  this.agent = opts.agent || false;
  this.hostname = opts.hostname ||
    (typeof location !== 'undefined' ? location.hostname : 'localhost');
  this.port = opts.port || (typeof location !== 'undefined' && location.port
      ? location.port
      : (this.secure ? 443 : 80));
  this.query = opts.query || {};
  if ('string' === typeof this.query) this.query = parseqs.decode(this.query);
  this.upgrade = false !== opts.upgrade;
  this.path = (opts.path || '/engine.io').replace(/\/$/, '') + '/';
  this.forceJSONP = !!opts.forceJSONP;
  this.jsonp = false !== opts.jsonp;
  this.forceBase64 = !!opts.forceBase64;
  this.enablesXDR = !!opts.enablesXDR;
  this.timestampParam = opts.timestampParam || 't';
  this.timestampRequests = opts.timestampRequests;
  this.transports = opts.transports || ['polling', 'websocket'];
  this.transportOptions = opts.transportOptions || {};
  this.readyState = '';
  this.writeBuffer = [];
  this.prevBufferLen = 0;
  this.policyPort = opts.policyPort || 843;
  this.rememberUpgrade = opts.rememberUpgrade || false;
  this.binaryType = null;
  this.onlyBinaryUpgrades = opts.onlyBinaryUpgrades;
  this.perMessageDeflate = false !== opts.perMessageDeflate ? (opts.perMessageDeflate || {}) : false;

  if (true === this.perMessageDeflate) this.perMessageDeflate = {};
  if (this.perMessageDeflate && null == this.perMessageDeflate.threshold) {
    this.perMessageDeflate.threshold = 1024;
  }

  // SSL options for Node.js client
  this.pfx = opts.pfx || null;
  this.key = opts.key || null;
  this.passphrase = opts.passphrase || null;
  this.cert = opts.cert || null;
  this.ca = opts.ca || null;
  this.ciphers = opts.ciphers || null;
  this.rejectUnauthorized = opts.rejectUnauthorized === undefined ? true : opts.rejectUnauthorized;
  this.forceNode = !!opts.forceNode;

  // detect ReactNative environment
  this.isReactNative = (typeof navigator !== 'undefined' && typeof navigator.product === 'string' && navigator.product.toLowerCase() === 'reactnative');

  // other options for Node.js or ReactNative client
  if (typeof self === 'undefined' || this.isReactNative) {
    if (opts.extraHeaders && Object.keys(opts.extraHeaders).length > 0) {
      this.extraHeaders = opts.extraHeaders;
    }

    if (opts.localAddress) {
      this.localAddress = opts.localAddress;
    }
  }

  // set on handshake
  this.id = null;
  this.upgrades = null;
  this.pingInterval = null;
  this.pingTimeout = null;

  // set on heartbeat
  this.pingIntervalTimer = null;
  this.pingTimeoutTimer = null;

  this.open();
}

Socket.priorWebsocketSuccess = false;

/**
 * Mix in `Emitter`.
 */

Emitter(Socket.prototype);

/**
 * Protocol version.
 *
 * @api public
 */

Socket.protocol = parser.protocol; // this is an int

/**
 * Expose deps for legacy compatibility
 * and standalone browser access.
 */

Socket.Socket = Socket;
Socket.Transport = __webpack_require__(182);
Socket.transports = __webpack_require__(300);
Socket.parser = __webpack_require__(74);

/**
 * Creates transport of the given type.
 *
 * @param {String} transport name
 * @return {Transport}
 * @api private
 */

Socket.prototype.createTransport = function (name) {
  debug('creating transport "%s"', name);
  var query = clone(this.query);

  // append engine.io protocol identifier
  query.EIO = parser.protocol;

  // transport name
  query.transport = name;

  // per-transport options
  var options = this.transportOptions[name] || {};

  // session id if we already have one
  if (this.id) query.sid = this.id;

  var transport = new transports[name]({
    query: query,
    socket: this,
    agent: options.agent || this.agent,
    hostname: options.hostname || this.hostname,
    port: options.port || this.port,
    secure: options.secure || this.secure,
    path: options.path || this.path,
    forceJSONP: options.forceJSONP || this.forceJSONP,
    jsonp: options.jsonp || this.jsonp,
    forceBase64: options.forceBase64 || this.forceBase64,
    enablesXDR: options.enablesXDR || this.enablesXDR,
    timestampRequests: options.timestampRequests || this.timestampRequests,
    timestampParam: options.timestampParam || this.timestampParam,
    policyPort: options.policyPort || this.policyPort,
    pfx: options.pfx || this.pfx,
    key: options.key || this.key,
    passphrase: options.passphrase || this.passphrase,
    cert: options.cert || this.cert,
    ca: options.ca || this.ca,
    ciphers: options.ciphers || this.ciphers,
    rejectUnauthorized: options.rejectUnauthorized || this.rejectUnauthorized,
    perMessageDeflate: options.perMessageDeflate || this.perMessageDeflate,
    extraHeaders: options.extraHeaders || this.extraHeaders,
    forceNode: options.forceNode || this.forceNode,
    localAddress: options.localAddress || this.localAddress,
    requestTimeout: options.requestTimeout || this.requestTimeout,
    protocols: options.protocols || void (0),
    isReactNative: this.isReactNative
  });

  return transport;
};

function clone (obj) {
  var o = {};
  for (var i in obj) {
    if (obj.hasOwnProperty(i)) {
      o[i] = obj[i];
    }
  }
  return o;
}

/**
 * Initializes transport to use and starts probe.
 *
 * @api private
 */
Socket.prototype.open = function () {
  var transport;
  if (this.rememberUpgrade && Socket.priorWebsocketSuccess && this.transports.indexOf('websocket') !== -1) {
    transport = 'websocket';
  } else if (0 === this.transports.length) {
    // Emit error on next tick so it can be listened to
    var self = this;
    setTimeout(function () {
      self.emit('error', 'No transports available');
    }, 0);
    return;
  } else {
    transport = this.transports[0];
  }
  this.readyState = 'opening';

  // Retry with the next transport if the transport is disabled (jsonp: false)
  try {
    transport = this.createTransport(transport);
  } catch (e) {
    this.transports.shift();
    this.open();
    return;
  }

  transport.open();
  this.setTransport(transport);
};

/**
 * Sets the current transport. Disables the existing one (if any).
 *
 * @api private
 */

Socket.prototype.setTransport = function (transport) {
  debug('setting transport %s', transport.name);
  var self = this;

  if (this.transport) {
    debug('clearing existing transport %s', this.transport.name);
    this.transport.removeAllListeners();
  }

  // set up transport
  this.transport = transport;

  // set up transport listeners
  transport
  .on('drain', function () {
    self.onDrain();
  })
  .on('packet', function (packet) {
    self.onPacket(packet);
  })
  .on('error', function (e) {
    self.onError(e);
  })
  .on('close', function () {
    self.onClose('transport close');
  });
};

/**
 * Probes a transport.
 *
 * @param {String} transport name
 * @api private
 */

Socket.prototype.probe = function (name) {
  debug('probing transport "%s"', name);
  var transport = this.createTransport(name, { probe: 1 });
  var failed = false;
  var self = this;

  Socket.priorWebsocketSuccess = false;

  function onTransportOpen () {
    if (self.onlyBinaryUpgrades) {
      var upgradeLosesBinary = !this.supportsBinary && self.transport.supportsBinary;
      failed = failed || upgradeLosesBinary;
    }
    if (failed) return;

    debug('probe transport "%s" opened', name);
    transport.send([{ type: 'ping', data: 'probe' }]);
    transport.once('packet', function (msg) {
      if (failed) return;
      if ('pong' === msg.type && 'probe' === msg.data) {
        debug('probe transport "%s" pong', name);
        self.upgrading = true;
        self.emit('upgrading', transport);
        if (!transport) return;
        Socket.priorWebsocketSuccess = 'websocket' === transport.name;

        debug('pausing current transport "%s"', self.transport.name);
        self.transport.pause(function () {
          if (failed) return;
          if ('closed' === self.readyState) return;
          debug('changing transport and sending upgrade packet');

          cleanup();

          self.setTransport(transport);
          transport.send([{ type: 'upgrade' }]);
          self.emit('upgrade', transport);
          transport = null;
          self.upgrading = false;
          self.flush();
        });
      } else {
        debug('probe transport "%s" failed', name);
        var err = new Error('probe error');
        err.transport = transport.name;
        self.emit('upgradeError', err);
      }
    });
  }

  function freezeTransport () {
    if (failed) return;

    // Any callback called by transport should be ignored since now
    failed = true;

    cleanup();

    transport.close();
    transport = null;
  }

  // Handle any error that happens while probing
  function onerror (err) {
    var error = new Error('probe error: ' + err);
    error.transport = transport.name;

    freezeTransport();

    debug('probe transport "%s" failed because of error: %s', name, err);

    self.emit('upgradeError', error);
  }

  function onTransportClose () {
    onerror('transport closed');
  }

  // When the socket is closed while we're probing
  function onclose () {
    onerror('socket closed');
  }

  // When the socket is upgraded while we're probing
  function onupgrade (to) {
    if (transport && to.name !== transport.name) {
      debug('"%s" works - aborting "%s"', to.name, transport.name);
      freezeTransport();
    }
  }

  // Remove all listeners on the transport and on self
  function cleanup () {
    transport.removeListener('open', onTransportOpen);
    transport.removeListener('error', onerror);
    transport.removeListener('close', onTransportClose);
    self.removeListener('close', onclose);
    self.removeListener('upgrading', onupgrade);
  }

  transport.once('open', onTransportOpen);
  transport.once('error', onerror);
  transport.once('close', onTransportClose);

  this.once('close', onclose);
  this.once('upgrading', onupgrade);

  transport.open();
};

/**
 * Called when connection is deemed open.
 *
 * @api public
 */

Socket.prototype.onOpen = function () {
  debug('socket open');
  this.readyState = 'open';
  Socket.priorWebsocketSuccess = 'websocket' === this.transport.name;
  this.emit('open');
  this.flush();

  // we check for `readyState` in case an `open`
  // listener already closed the socket
  if ('open' === this.readyState && this.upgrade && this.transport.pause) {
    debug('starting upgrade probes');
    for (var i = 0, l = this.upgrades.length; i < l; i++) {
      this.probe(this.upgrades[i]);
    }
  }
};

/**
 * Handles a packet.
 *
 * @api private
 */

Socket.prototype.onPacket = function (packet) {
  if ('opening' === this.readyState || 'open' === this.readyState ||
      'closing' === this.readyState) {
    debug('socket receive: type "%s", data "%s"', packet.type, packet.data);

    this.emit('packet', packet);

    // Socket is live - any packet counts
    this.emit('heartbeat');

    switch (packet.type) {
      case 'open':
        this.onHandshake(JSON.parse(packet.data));
        break;

      case 'pong':
        this.setPing();
        this.emit('pong');
        break;

      case 'error':
        var err = new Error('server error');
        err.code = packet.data;
        this.onError(err);
        break;

      case 'message':
        this.emit('data', packet.data);
        this.emit('message', packet.data);
        break;
    }
  } else {
    debug('packet received with socket readyState "%s"', this.readyState);
  }
};

/**
 * Called upon handshake completion.
 *
 * @param {Object} handshake obj
 * @api private
 */

Socket.prototype.onHandshake = function (data) {
  this.emit('handshake', data);
  this.id = data.sid;
  this.transport.query.sid = data.sid;
  this.upgrades = this.filterUpgrades(data.upgrades);
  this.pingInterval = data.pingInterval;
  this.pingTimeout = data.pingTimeout;
  this.onOpen();
  // In case open handler closes socket
  if ('closed' === this.readyState) return;
  this.setPing();

  // Prolong liveness of socket on heartbeat
  this.removeListener('heartbeat', this.onHeartbeat);
  this.on('heartbeat', this.onHeartbeat);
};

/**
 * Resets ping timeout.
 *
 * @api private
 */

Socket.prototype.onHeartbeat = function (timeout) {
  clearTimeout(this.pingTimeoutTimer);
  var self = this;
  self.pingTimeoutTimer = setTimeout(function () {
    if ('closed' === self.readyState) return;
    self.onClose('ping timeout');
  }, timeout || (self.pingInterval + self.pingTimeout));
};

/**
 * Pings server every `this.pingInterval` and expects response
 * within `this.pingTimeout` or closes connection.
 *
 * @api private
 */

Socket.prototype.setPing = function () {
  var self = this;
  clearTimeout(self.pingIntervalTimer);
  self.pingIntervalTimer = setTimeout(function () {
    debug('writing ping packet - expecting pong within %sms', self.pingTimeout);
    self.ping();
    self.onHeartbeat(self.pingTimeout);
  }, self.pingInterval);
};

/**
* Sends a ping packet.
*
* @api private
*/

Socket.prototype.ping = function () {
  var self = this;
  this.sendPacket('ping', function () {
    self.emit('ping');
  });
};

/**
 * Called on `drain` event
 *
 * @api private
 */

Socket.prototype.onDrain = function () {
  this.writeBuffer.splice(0, this.prevBufferLen);

  // setting prevBufferLen = 0 is very important
  // for example, when upgrading, upgrade packet is sent over,
  // and a nonzero prevBufferLen could cause problems on `drain`
  this.prevBufferLen = 0;

  if (0 === this.writeBuffer.length) {
    this.emit('drain');
  } else {
    this.flush();
  }
};

/**
 * Flush write buffers.
 *
 * @api private
 */

Socket.prototype.flush = function () {
  if ('closed' !== this.readyState && this.transport.writable &&
    !this.upgrading && this.writeBuffer.length) {
    debug('flushing %d packets in socket', this.writeBuffer.length);
    this.transport.send(this.writeBuffer);
    // keep track of current length of writeBuffer
    // splice writeBuffer and callbackBuffer on `drain`
    this.prevBufferLen = this.writeBuffer.length;
    this.emit('flush');
  }
};

/**
 * Sends a message.
 *
 * @param {String} message.
 * @param {Function} callback function.
 * @param {Object} options.
 * @return {Socket} for chaining.
 * @api public
 */

Socket.prototype.write =
Socket.prototype.send = function (msg, options, fn) {
  this.sendPacket('message', msg, options, fn);
  return this;
};

/**
 * Sends a packet.
 *
 * @param {String} packet type.
 * @param {String} data.
 * @param {Object} options.
 * @param {Function} callback function.
 * @api private
 */

Socket.prototype.sendPacket = function (type, data, options, fn) {
  if ('function' === typeof data) {
    fn = data;
    data = undefined;
  }

  if ('function' === typeof options) {
    fn = options;
    options = null;
  }

  if ('closing' === this.readyState || 'closed' === this.readyState) {
    return;
  }

  options = options || {};
  options.compress = false !== options.compress;

  var packet = {
    type: type,
    data: data,
    options: options
  };
  this.emit('packetCreate', packet);
  this.writeBuffer.push(packet);
  if (fn) this.once('flush', fn);
  this.flush();
};

/**
 * Closes the connection.
 *
 * @api private
 */

Socket.prototype.close = function () {
  if ('opening' === this.readyState || 'open' === this.readyState) {
    this.readyState = 'closing';

    var self = this;

    if (this.writeBuffer.length) {
      this.once('drain', function () {
        if (this.upgrading) {
          waitForUpgrade();
        } else {
          close();
        }
      });
    } else if (this.upgrading) {
      waitForUpgrade();
    } else {
      close();
    }
  }

  function close () {
    self.onClose('forced close');
    debug('socket closing - telling transport to close');
    self.transport.close();
  }

  function cleanupAndClose () {
    self.removeListener('upgrade', cleanupAndClose);
    self.removeListener('upgradeError', cleanupAndClose);
    close();
  }

  function waitForUpgrade () {
    // wait for upgrade to finish since we can't send packets while pausing a transport
    self.once('upgrade', cleanupAndClose);
    self.once('upgradeError', cleanupAndClose);
  }

  return this;
};

/**
 * Called upon transport error
 *
 * @api private
 */

Socket.prototype.onError = function (err) {
  debug('socket error %j', err);
  Socket.priorWebsocketSuccess = false;
  this.emit('error', err);
  this.onClose('transport error', err);
};

/**
 * Called upon transport close.
 *
 * @api private
 */

Socket.prototype.onClose = function (reason, desc) {
  if ('opening' === this.readyState || 'open' === this.readyState || 'closing' === this.readyState) {
    debug('socket close with reason: "%s"', reason);
    var self = this;

    // clear timers
    clearTimeout(this.pingIntervalTimer);
    clearTimeout(this.pingTimeoutTimer);

    // stop event from firing again for transport
    this.transport.removeAllListeners('close');

    // ensure transport won't stay open
    this.transport.close();

    // ignore further transport communication
    this.transport.removeAllListeners();

    // set ready state
    this.readyState = 'closed';

    // clear session id
    this.id = null;

    // emit close event
    this.emit('close', reason, desc);

    // clean buffers after, so users can still
    // grab the buffers on `close` event
    self.writeBuffer = [];
    self.prevBufferLen = 0;
  }
};

/**
 * Filters upgrades, returning only those matching client transports.
 *
 * @param {Array} server upgrades
 * @api private
 *
 */

Socket.prototype.filterUpgrades = function (upgrades) {
  var filteredUpgrades = [];
  for (var i = 0, j = upgrades.length; i < j; i++) {
    if (~index(this.transports, upgrades[i])) filteredUpgrades.push(upgrades[i]);
  }
  return filteredUpgrades;
};


/***/ }),

/***/ 689:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/**
 * Module requirements.
 */

var Polling = __webpack_require__(301);
var inherit = __webpack_require__(107);

/**
 * Module exports.
 */

module.exports = JSONPPolling;

/**
 * Cached regular expressions.
 */

var rNewline = /\n/g;
var rEscapedNewline = /\\n/g;

/**
 * Global JSONP callbacks.
 */

var callbacks;

/**
 * Noop.
 */

function empty () { }

/**
 * Until https://github.com/tc39/proposal-global is shipped.
 */
function glob () {
  return typeof self !== 'undefined' ? self
      : typeof window !== 'undefined' ? window
      : typeof global !== 'undefined' ? global : {};
}

/**
 * JSONP Polling constructor.
 *
 * @param {Object} opts.
 * @api public
 */

function JSONPPolling (opts) {
  Polling.call(this, opts);

  this.query = this.query || {};

  // define global callbacks array if not present
  // we do this here (lazily) to avoid unneeded global pollution
  if (!callbacks) {
    // we need to consider multiple engines in the same page
    var global = glob();
    callbacks = global.___eio = (global.___eio || []);
  }

  // callback identifier
  this.index = callbacks.length;

  // add callback to jsonp global
  var self = this;
  callbacks.push(function (msg) {
    self.onData(msg);
  });

  // append to query string
  this.query.j = this.index;

  // prevent spurious errors from being emitted when the window is unloaded
  if (typeof addEventListener === 'function') {
    addEventListener('beforeunload', function () {
      if (self.script) self.script.onerror = empty;
    }, false);
  }
}

/**
 * Inherits from Polling.
 */

inherit(JSONPPolling, Polling);

/*
 * JSONP only supports binary as base64 encoded strings
 */

JSONPPolling.prototype.supportsBinary = false;

/**
 * Closes the socket.
 *
 * @api private
 */

JSONPPolling.prototype.doClose = function () {
  if (this.script) {
    this.script.parentNode.removeChild(this.script);
    this.script = null;
  }

  if (this.form) {
    this.form.parentNode.removeChild(this.form);
    this.form = null;
    this.iframe = null;
  }

  Polling.prototype.doClose.call(this);
};

/**
 * Starts a poll cycle.
 *
 * @api private
 */

JSONPPolling.prototype.doPoll = function () {
  var self = this;
  var script = document.createElement('script');

  if (this.script) {
    this.script.parentNode.removeChild(this.script);
    this.script = null;
  }

  script.async = true;
  script.src = this.uri();
  script.onerror = function (e) {
    self.onError('jsonp poll error', e);
  };

  var insertAt = document.getElementsByTagName('script')[0];
  if (insertAt) {
    insertAt.parentNode.insertBefore(script, insertAt);
  } else {
    (document.head || document.body).appendChild(script);
  }
  this.script = script;

  var isUAgecko = 'undefined' !== typeof navigator && /gecko/i.test(navigator.userAgent);

  if (isUAgecko) {
    setTimeout(function () {
      var iframe = document.createElement('iframe');
      document.body.appendChild(iframe);
      document.body.removeChild(iframe);
    }, 100);
  }
};

/**
 * Writes with a hidden iframe.
 *
 * @param {String} data to send
 * @param {Function} called upon flush.
 * @api private
 */

JSONPPolling.prototype.doWrite = function (data, fn) {
  var self = this;

  if (!this.form) {
    var form = document.createElement('form');
    var area = document.createElement('textarea');
    var id = this.iframeId = 'eio_iframe_' + this.index;
    var iframe;

    form.className = 'socketio';
    form.style.position = 'absolute';
    form.style.top = '-1000px';
    form.style.left = '-1000px';
    form.target = id;
    form.method = 'POST';
    form.setAttribute('accept-charset', 'utf-8');
    area.name = 'd';
    form.appendChild(area);
    document.body.appendChild(form);

    this.form = form;
    this.area = area;
  }

  this.form.action = this.uri();

  function complete () {
    initIframe();
    fn();
  }

  function initIframe () {
    if (self.iframe) {
      try {
        self.form.removeChild(self.iframe);
      } catch (e) {
        self.onError('jsonp polling iframe removal error', e);
      }
    }

    try {
      // ie6 dynamic iframes with target="" support (thanks Chris Lambacher)
      var html = '<iframe src="javascript:0" name="' + self.iframeId + '">';
      iframe = document.createElement(html);
    } catch (e) {
      iframe = document.createElement('iframe');
      iframe.name = self.iframeId;
      iframe.src = 'javascript:0';
    }

    iframe.id = self.iframeId;

    self.form.appendChild(iframe);
    self.iframe = iframe;
  }

  initIframe();

  // escape \n to prevent it from being converted into \r\n by some UAs
  // double escaping is required for escaped new lines because unescaping of new lines can be done safely on server-side
  data = data.replace(rEscapedNewline, '\\\n');
  this.area.value = data.replace(rNewline, '\\n');

  try {
    this.form.submit();
  } catch (e) {}

  if (this.iframe.attachEvent) {
    this.iframe.onreadystatechange = function () {
      if (self.iframe.readyState === 'complete') {
        complete();
      }
    };
  } else {
    this.iframe.onload = complete;
  }
};

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(203)))

/***/ }),

/***/ 690:
/***/ (function(module, exports, __webpack_require__) {

/* global attachEvent */

/**
 * Module requirements.
 */

var XMLHttpRequest = __webpack_require__(183);
var Polling = __webpack_require__(301);
var Emitter = __webpack_require__(65);
var inherit = __webpack_require__(107);
var debug = __webpack_require__(127)('engine.io-client:polling-xhr');

/**
 * Module exports.
 */

module.exports = XHR;
module.exports.Request = Request;

/**
 * Empty function
 */

function empty () {}

/**
 * XHR Polling constructor.
 *
 * @param {Object} opts
 * @api public
 */

function XHR (opts) {
  Polling.call(this, opts);
  this.requestTimeout = opts.requestTimeout;
  this.extraHeaders = opts.extraHeaders;

  if (typeof location !== 'undefined') {
    var isSSL = 'https:' === location.protocol;
    var port = location.port;

    // some user agents have empty `location.port`
    if (!port) {
      port = isSSL ? 443 : 80;
    }

    this.xd = (typeof location !== 'undefined' && opts.hostname !== location.hostname) ||
      port !== opts.port;
    this.xs = opts.secure !== isSSL;
  }
}

/**
 * Inherits from Polling.
 */

inherit(XHR, Polling);

/**
 * XHR supports binary
 */

XHR.prototype.supportsBinary = true;

/**
 * Creates a request.
 *
 * @param {String} method
 * @api private
 */

XHR.prototype.request = function (opts) {
  opts = opts || {};
  opts.uri = this.uri();
  opts.xd = this.xd;
  opts.xs = this.xs;
  opts.agent = this.agent || false;
  opts.supportsBinary = this.supportsBinary;
  opts.enablesXDR = this.enablesXDR;

  // SSL options for Node.js client
  opts.pfx = this.pfx;
  opts.key = this.key;
  opts.passphrase = this.passphrase;
  opts.cert = this.cert;
  opts.ca = this.ca;
  opts.ciphers = this.ciphers;
  opts.rejectUnauthorized = this.rejectUnauthorized;
  opts.requestTimeout = this.requestTimeout;

  // other options for Node.js client
  opts.extraHeaders = this.extraHeaders;

  return new Request(opts);
};

/**
 * Sends data.
 *
 * @param {String} data to send.
 * @param {Function} called upon flush.
 * @api private
 */

XHR.prototype.doWrite = function (data, fn) {
  var isBinary = typeof data !== 'string' && data !== undefined;
  var req = this.request({ method: 'POST', data: data, isBinary: isBinary });
  var self = this;
  req.on('success', fn);
  req.on('error', function (err) {
    self.onError('xhr post error', err);
  });
  this.sendXhr = req;
};

/**
 * Starts a poll cycle.
 *
 * @api private
 */

XHR.prototype.doPoll = function () {
  debug('xhr poll');
  var req = this.request();
  var self = this;
  req.on('data', function (data) {
    self.onData(data);
  });
  req.on('error', function (err) {
    self.onError('xhr poll error', err);
  });
  this.pollXhr = req;
};

/**
 * Request constructor
 *
 * @param {Object} options
 * @api public
 */

function Request (opts) {
  this.method = opts.method || 'GET';
  this.uri = opts.uri;
  this.xd = !!opts.xd;
  this.xs = !!opts.xs;
  this.async = false !== opts.async;
  this.data = undefined !== opts.data ? opts.data : null;
  this.agent = opts.agent;
  this.isBinary = opts.isBinary;
  this.supportsBinary = opts.supportsBinary;
  this.enablesXDR = opts.enablesXDR;
  this.requestTimeout = opts.requestTimeout;

  // SSL options for Node.js client
  this.pfx = opts.pfx;
  this.key = opts.key;
  this.passphrase = opts.passphrase;
  this.cert = opts.cert;
  this.ca = opts.ca;
  this.ciphers = opts.ciphers;
  this.rejectUnauthorized = opts.rejectUnauthorized;

  // other options for Node.js client
  this.extraHeaders = opts.extraHeaders;

  this.create();
}

/**
 * Mix in `Emitter`.
 */

Emitter(Request.prototype);

/**
 * Creates the XHR object and sends the request.
 *
 * @api private
 */

Request.prototype.create = function () {
  var opts = { agent: this.agent, xdomain: this.xd, xscheme: this.xs, enablesXDR: this.enablesXDR };

  // SSL options for Node.js client
  opts.pfx = this.pfx;
  opts.key = this.key;
  opts.passphrase = this.passphrase;
  opts.cert = this.cert;
  opts.ca = this.ca;
  opts.ciphers = this.ciphers;
  opts.rejectUnauthorized = this.rejectUnauthorized;

  var xhr = this.xhr = new XMLHttpRequest(opts);
  var self = this;

  try {
    debug('xhr open %s: %s', this.method, this.uri);
    xhr.open(this.method, this.uri, this.async);
    try {
      if (this.extraHeaders) {
        xhr.setDisableHeaderCheck && xhr.setDisableHeaderCheck(true);
        for (var i in this.extraHeaders) {
          if (this.extraHeaders.hasOwnProperty(i)) {
            xhr.setRequestHeader(i, this.extraHeaders[i]);
          }
        }
      }
    } catch (e) {}

    if ('POST' === this.method) {
      try {
        if (this.isBinary) {
          xhr.setRequestHeader('Content-type', 'application/octet-stream');
        } else {
          xhr.setRequestHeader('Content-type', 'text/plain;charset=UTF-8');
        }
      } catch (e) {}
    }

    try {
      xhr.setRequestHeader('Accept', '*/*');
    } catch (e) {}

    // ie6 check
    if ('withCredentials' in xhr) {
      xhr.withCredentials = true;
    }

    if (this.requestTimeout) {
      xhr.timeout = this.requestTimeout;
    }

    if (this.hasXDR()) {
      xhr.onload = function () {
        self.onLoad();
      };
      xhr.onerror = function () {
        self.onError(xhr.responseText);
      };
    } else {
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 2) {
          try {
            var contentType = xhr.getResponseHeader('Content-Type');
            if (self.supportsBinary && contentType === 'application/octet-stream') {
              xhr.responseType = 'arraybuffer';
            }
          } catch (e) {}
        }
        if (4 !== xhr.readyState) return;
        if (200 === xhr.status || 1223 === xhr.status) {
          self.onLoad();
        } else {
          // make sure the `error` event handler that's user-set
          // does not throw in the same tick and gets caught here
          setTimeout(function () {
            self.onError(xhr.status);
          }, 0);
        }
      };
    }

    debug('xhr data %s', this.data);
    xhr.send(this.data);
  } catch (e) {
    // Need to defer since .create() is called directly fhrom the constructor
    // and thus the 'error' event can only be only bound *after* this exception
    // occurs.  Therefore, also, we cannot throw here at all.
    setTimeout(function () {
      self.onError(e);
    }, 0);
    return;
  }

  if (typeof document !== 'undefined') {
    this.index = Request.requestsCount++;
    Request.requests[this.index] = this;
  }
};

/**
 * Called upon successful response.
 *
 * @api private
 */

Request.prototype.onSuccess = function () {
  this.emit('success');
  this.cleanup();
};

/**
 * Called if we have data.
 *
 * @api private
 */

Request.prototype.onData = function (data) {
  this.emit('data', data);
  this.onSuccess();
};

/**
 * Called upon error.
 *
 * @api private
 */

Request.prototype.onError = function (err) {
  this.emit('error', err);
  this.cleanup(true);
};

/**
 * Cleans up house.
 *
 * @api private
 */

Request.prototype.cleanup = function (fromError) {
  if ('undefined' === typeof this.xhr || null === this.xhr) {
    return;
  }
  // xmlhttprequest
  if (this.hasXDR()) {
    this.xhr.onload = this.xhr.onerror = empty;
  } else {
    this.xhr.onreadystatechange = empty;
  }

  if (fromError) {
    try {
      this.xhr.abort();
    } catch (e) {}
  }

  if (typeof document !== 'undefined') {
    delete Request.requests[this.index];
  }

  this.xhr = null;
};

/**
 * Called upon load.
 *
 * @api private
 */

Request.prototype.onLoad = function () {
  var data;
  try {
    var contentType;
    try {
      contentType = this.xhr.getResponseHeader('Content-Type');
    } catch (e) {}
    if (contentType === 'application/octet-stream') {
      data = this.xhr.response || this.xhr.responseText;
    } else {
      data = this.xhr.responseText;
    }
  } catch (e) {
    this.onError(e);
  }
  if (null != data) {
    this.onData(data);
  }
};

/**
 * Check if it has XDomainRequest.
 *
 * @api private
 */

Request.prototype.hasXDR = function () {
  return typeof XDomainRequest !== 'undefined' && !this.xs && this.enablesXDR;
};

/**
 * Aborts the request.
 *
 * @api public
 */

Request.prototype.abort = function () {
  this.cleanup();
};

/**
 * Aborts pending requests when unloading the window. This is needed to prevent
 * memory leaks (e.g. when using IE) and to ensure that no spurious error is
 * emitted.
 */

Request.requestsCount = 0;
Request.requests = {};

if (typeof document !== 'undefined') {
  if (typeof attachEvent === 'function') {
    attachEvent('onunload', unloadHandler);
  } else if (typeof addEventListener === 'function') {
    var terminationEvent = 'onpagehide' in self ? 'pagehide' : 'unload';
    addEventListener(terminationEvent, unloadHandler, false);
  }
}

function unloadHandler () {
  for (var i in Request.requests) {
    if (Request.requests.hasOwnProperty(i)) {
      Request.requests[i].abort();
    }
  }
}


/***/ }),

/***/ 691:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Buffer) {/**
 * Module dependencies.
 */

var Transport = __webpack_require__(182);
var parser = __webpack_require__(74);
var parseqs = __webpack_require__(129);
var inherit = __webpack_require__(107);
var yeast = __webpack_require__(342);
var debug = __webpack_require__(127)('engine.io-client:websocket');

var BrowserWebSocket, NodeWebSocket;

if (typeof WebSocket !== 'undefined') {
  BrowserWebSocket = WebSocket;
} else if (typeof self !== 'undefined') {
  BrowserWebSocket = self.WebSocket || self.MozWebSocket;
} else {
  try {
    NodeWebSocket = __webpack_require__(901);
  } catch (e) { }
}

/**
 * Get either the `WebSocket` or `MozWebSocket` globals
 * in the browser or try to resolve WebSocket-compatible
 * interface exposed by `ws` for Node-like environment.
 */

var WebSocketImpl = BrowserWebSocket || NodeWebSocket;

/**
 * Module exports.
 */

module.exports = WS;

/**
 * WebSocket transport constructor.
 *
 * @api {Object} connection options
 * @api public
 */

function WS (opts) {
  var forceBase64 = (opts && opts.forceBase64);
  if (forceBase64) {
    this.supportsBinary = false;
  }
  this.perMessageDeflate = opts.perMessageDeflate;
  this.usingBrowserWebSocket = BrowserWebSocket && !opts.forceNode;
  this.protocols = opts.protocols;
  if (!this.usingBrowserWebSocket) {
    WebSocketImpl = NodeWebSocket;
  }
  Transport.call(this, opts);
}

/**
 * Inherits from Transport.
 */

inherit(WS, Transport);

/**
 * Transport name.
 *
 * @api public
 */

WS.prototype.name = 'websocket';

/*
 * WebSockets support binary
 */

WS.prototype.supportsBinary = true;

/**
 * Opens socket.
 *
 * @api private
 */

WS.prototype.doOpen = function () {
  if (!this.check()) {
    // let probe timeout
    return;
  }

  var uri = this.uri();
  var protocols = this.protocols;
  var opts = {
    agent: this.agent,
    perMessageDeflate: this.perMessageDeflate
  };

  // SSL options for Node.js client
  opts.pfx = this.pfx;
  opts.key = this.key;
  opts.passphrase = this.passphrase;
  opts.cert = this.cert;
  opts.ca = this.ca;
  opts.ciphers = this.ciphers;
  opts.rejectUnauthorized = this.rejectUnauthorized;
  if (this.extraHeaders) {
    opts.headers = this.extraHeaders;
  }
  if (this.localAddress) {
    opts.localAddress = this.localAddress;
  }

  try {
    this.ws =
      this.usingBrowserWebSocket && !this.isReactNative
        ? protocols
          ? new WebSocketImpl(uri, protocols)
          : new WebSocketImpl(uri)
        : new WebSocketImpl(uri, protocols, opts);
  } catch (err) {
    return this.emit('error', err);
  }

  if (this.ws.binaryType === undefined) {
    this.supportsBinary = false;
  }

  if (this.ws.supports && this.ws.supports.binary) {
    this.supportsBinary = true;
    this.ws.binaryType = 'nodebuffer';
  } else {
    this.ws.binaryType = 'arraybuffer';
  }

  this.addEventListeners();
};

/**
 * Adds event listeners to the socket
 *
 * @api private
 */

WS.prototype.addEventListeners = function () {
  var self = this;

  this.ws.onopen = function () {
    self.onOpen();
  };
  this.ws.onclose = function () {
    self.onClose();
  };
  this.ws.onmessage = function (ev) {
    self.onData(ev.data);
  };
  this.ws.onerror = function (e) {
    self.onError('websocket error', e);
  };
};

/**
 * Writes data to socket.
 *
 * @param {Array} array of packets.
 * @api private
 */

WS.prototype.write = function (packets) {
  var self = this;
  this.writable = false;

  // encodePacket efficient as it uses WS framing
  // no need for encodePayload
  var total = packets.length;
  for (var i = 0, l = total; i < l; i++) {
    (function (packet) {
      parser.encodePacket(packet, self.supportsBinary, function (data) {
        if (!self.usingBrowserWebSocket) {
          // always create a new object (GH-437)
          var opts = {};
          if (packet.options) {
            opts.compress = packet.options.compress;
          }

          if (self.perMessageDeflate) {
            var len = 'string' === typeof data ? Buffer.byteLength(data) : data.length;
            if (len < self.perMessageDeflate.threshold) {
              opts.compress = false;
            }
          }
        }

        // Sometimes the websocket has already been closed but the browser didn't
        // have a chance of informing us about it yet, in that case send will
        // throw an error
        try {
          if (self.usingBrowserWebSocket) {
            // TypeError is thrown when passing the second argument on Safari
            self.ws.send(data);
          } else {
            self.ws.send(data, opts);
          }
        } catch (e) {
          debug('websocket closed before onclose event');
        }

        --total || done();
      });
    })(packets[i]);
  }

  function done () {
    self.emit('flush');

    // fake drain
    // defer to next tick to allow Socket to clear writeBuffer
    setTimeout(function () {
      self.writable = true;
      self.emit('drain');
    }, 0);
  }
};

/**
 * Called upon close
 *
 * @api private
 */

WS.prototype.onClose = function () {
  Transport.prototype.onClose.call(this);
};

/**
 * Closes socket.
 *
 * @api private
 */

WS.prototype.doClose = function () {
  if (typeof this.ws !== 'undefined') {
    this.ws.close();
  }
};

/**
 * Generates uri for connection.
 *
 * @api private
 */

WS.prototype.uri = function () {
  var query = this.query || {};
  var schema = this.secure ? 'wss' : 'ws';
  var port = '';

  // avoid port if default for schema
  if (this.port && (('wss' === schema && Number(this.port) !== 443) ||
    ('ws' === schema && Number(this.port) !== 80))) {
    port = ':' + this.port;
  }

  // append timestamp to URI
  if (this.timestampRequests) {
    query[this.timestampParam] = yeast();
  }

  // communicate binary support capabilities
  if (!this.supportsBinary) {
    query.b64 = 1;
  }

  query = parseqs.encode(query);

  // prepend ? to query
  if (query.length) {
    query = '?' + query;
  }

  var ipv6 = this.hostname.indexOf(':') !== -1;
  return schema + '://' + (ipv6 ? '[' + this.hostname + ']' : this.hostname) + port + this.path + query;
};

/**
 * Feature detection for WebSocket.
 *
 * @return {Boolean} whether this transport is available.
 * @api public
 */

WS.prototype.check = function () {
  return !!WebSocketImpl && !('__initialize' in WebSocketImpl && this.name === WS.prototype.name);
};

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(151).Buffer))

/***/ }),

/***/ 692:
/***/ (function(module, exports, __webpack_require__) {


/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = createDebug.debug = createDebug['default'] = createDebug;
exports.coerce = coerce;
exports.disable = disable;
exports.enable = enable;
exports.enabled = enabled;
exports.humanize = __webpack_require__(185);

/**
 * Active `debug` instances.
 */
exports.instances = [];

/**
 * The currently active debug mode names, and names to skip.
 */

exports.names = [];
exports.skips = [];

/**
 * Map of special "%n" handling functions, for the debug "format" argument.
 *
 * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
 */

exports.formatters = {};

/**
 * Select a color.
 * @param {String} namespace
 * @return {Number}
 * @api private
 */

function selectColor(namespace) {
  var hash = 0, i;

  for (i in namespace) {
    hash  = ((hash << 5) - hash) + namespace.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }

  return exports.colors[Math.abs(hash) % exports.colors.length];
}

/**
 * Create a debugger with the given `namespace`.
 *
 * @param {String} namespace
 * @return {Function}
 * @api public
 */

function createDebug(namespace) {

  var prevTime;

  function debug() {
    // disabled?
    if (!debug.enabled) return;

    var self = debug;

    // set `diff` timestamp
    var curr = +new Date();
    var ms = curr - (prevTime || curr);
    self.diff = ms;
    self.prev = prevTime;
    self.curr = curr;
    prevTime = curr;

    // turn the `arguments` into a proper Array
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }

    args[0] = exports.coerce(args[0]);

    if ('string' !== typeof args[0]) {
      // anything else let's inspect with %O
      args.unshift('%O');
    }

    // apply any `formatters` transformations
    var index = 0;
    args[0] = args[0].replace(/%([a-zA-Z%])/g, function(match, format) {
      // if we encounter an escaped % then don't increase the array index
      if (match === '%%') return match;
      index++;
      var formatter = exports.formatters[format];
      if ('function' === typeof formatter) {
        var val = args[index];
        match = formatter.call(self, val);

        // now we need to remove `args[index]` since it's inlined in the `format`
        args.splice(index, 1);
        index--;
      }
      return match;
    });

    // apply env-specific formatting (colors, etc.)
    exports.formatArgs.call(self, args);

    var logFn = debug.log || exports.log || console.log.bind(console);
    logFn.apply(self, args);
  }

  debug.namespace = namespace;
  debug.enabled = exports.enabled(namespace);
  debug.useColors = exports.useColors();
  debug.color = selectColor(namespace);
  debug.destroy = destroy;

  // env-specific initialization logic for debug instances
  if ('function' === typeof exports.init) {
    exports.init(debug);
  }

  exports.instances.push(debug);

  return debug;
}

function destroy () {
  var index = exports.instances.indexOf(this);
  if (index !== -1) {
    exports.instances.splice(index, 1);
    return true;
  } else {
    return false;
  }
}

/**
 * Enables a debug mode by namespaces. This can include modes
 * separated by a colon and wildcards.
 *
 * @param {String} namespaces
 * @api public
 */

function enable(namespaces) {
  exports.save(namespaces);

  exports.names = [];
  exports.skips = [];

  var i;
  var split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
  var len = split.length;

  for (i = 0; i < len; i++) {
    if (!split[i]) continue; // ignore empty strings
    namespaces = split[i].replace(/\*/g, '.*?');
    if (namespaces[0] === '-') {
      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
    } else {
      exports.names.push(new RegExp('^' + namespaces + '$'));
    }
  }

  for (i = 0; i < exports.instances.length; i++) {
    var instance = exports.instances[i];
    instance.enabled = exports.enabled(instance.namespace);
  }
}

/**
 * Disable debug output.
 *
 * @api public
 */

function disable() {
  exports.enable('');
}

/**
 * Returns true if the given mode name is enabled, false otherwise.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

function enabled(name) {
  if (name[name.length - 1] === '*') {
    return true;
  }
  var i, len;
  for (i = 0, len = exports.skips.length; i < len; i++) {
    if (exports.skips[i].test(name)) {
      return false;
    }
  }
  for (i = 0, len = exports.names.length; i < len; i++) {
    if (exports.names[i].test(name)) {
      return true;
    }
  }
  return false;
}

/**
 * Coerce `val`.
 *
 * @param {Mixed} val
 * @return {Mixed}
 * @api private
 */

function coerce(val) {
  if (val instanceof Error) return val.stack || val.message;
  return val;
}


/***/ }),

/***/ 693:
/***/ (function(module, exports) {


/**
 * Gets the keys for an object.
 *
 * @return {Array} keys
 * @api private
 */

module.exports = Object.keys || function keys (obj){
  var arr = [];
  var has = Object.prototype.hasOwnProperty;

  for (var i in obj) {
    if (has.call(obj, i)) {
      arr.push(i);
    }
  }
  return arr;
};


/***/ }),

/***/ 694:
/***/ (function(module, exports) {

/*! https://mths.be/utf8js v2.1.2 by @mathias */

var stringFromCharCode = String.fromCharCode;

// Taken from https://mths.be/punycode
function ucs2decode(string) {
	var output = [];
	var counter = 0;
	var length = string.length;
	var value;
	var extra;
	while (counter < length) {
		value = string.charCodeAt(counter++);
		if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
			// high surrogate, and there is a next character
			extra = string.charCodeAt(counter++);
			if ((extra & 0xFC00) == 0xDC00) { // low surrogate
				output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
			} else {
				// unmatched surrogate; only append this code unit, in case the next
				// code unit is the high surrogate of a surrogate pair
				output.push(value);
				counter--;
			}
		} else {
			output.push(value);
		}
	}
	return output;
}

// Taken from https://mths.be/punycode
function ucs2encode(array) {
	var length = array.length;
	var index = -1;
	var value;
	var output = '';
	while (++index < length) {
		value = array[index];
		if (value > 0xFFFF) {
			value -= 0x10000;
			output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
			value = 0xDC00 | value & 0x3FF;
		}
		output += stringFromCharCode(value);
	}
	return output;
}

function checkScalarValue(codePoint, strict) {
	if (codePoint >= 0xD800 && codePoint <= 0xDFFF) {
		if (strict) {
			throw Error(
				'Lone surrogate U+' + codePoint.toString(16).toUpperCase() +
				' is not a scalar value'
			);
		}
		return false;
	}
	return true;
}
/*--------------------------------------------------------------------------*/

function createByte(codePoint, shift) {
	return stringFromCharCode(((codePoint >> shift) & 0x3F) | 0x80);
}

function encodeCodePoint(codePoint, strict) {
	if ((codePoint & 0xFFFFFF80) == 0) { // 1-byte sequence
		return stringFromCharCode(codePoint);
	}
	var symbol = '';
	if ((codePoint & 0xFFFFF800) == 0) { // 2-byte sequence
		symbol = stringFromCharCode(((codePoint >> 6) & 0x1F) | 0xC0);
	}
	else if ((codePoint & 0xFFFF0000) == 0) { // 3-byte sequence
		if (!checkScalarValue(codePoint, strict)) {
			codePoint = 0xFFFD;
		}
		symbol = stringFromCharCode(((codePoint >> 12) & 0x0F) | 0xE0);
		symbol += createByte(codePoint, 6);
	}
	else if ((codePoint & 0xFFE00000) == 0) { // 4-byte sequence
		symbol = stringFromCharCode(((codePoint >> 18) & 0x07) | 0xF0);
		symbol += createByte(codePoint, 12);
		symbol += createByte(codePoint, 6);
	}
	symbol += stringFromCharCode((codePoint & 0x3F) | 0x80);
	return symbol;
}

function utf8encode(string, opts) {
	opts = opts || {};
	var strict = false !== opts.strict;

	var codePoints = ucs2decode(string);
	var length = codePoints.length;
	var index = -1;
	var codePoint;
	var byteString = '';
	while (++index < length) {
		codePoint = codePoints[index];
		byteString += encodeCodePoint(codePoint, strict);
	}
	return byteString;
}

/*--------------------------------------------------------------------------*/

function readContinuationByte() {
	if (byteIndex >= byteCount) {
		throw Error('Invalid byte index');
	}

	var continuationByte = byteArray[byteIndex] & 0xFF;
	byteIndex++;

	if ((continuationByte & 0xC0) == 0x80) {
		return continuationByte & 0x3F;
	}

	// If we end up here, it’s not a continuation byte
	throw Error('Invalid continuation byte');
}

function decodeSymbol(strict) {
	var byte1;
	var byte2;
	var byte3;
	var byte4;
	var codePoint;

	if (byteIndex > byteCount) {
		throw Error('Invalid byte index');
	}

	if (byteIndex == byteCount) {
		return false;
	}

	// Read first byte
	byte1 = byteArray[byteIndex] & 0xFF;
	byteIndex++;

	// 1-byte sequence (no continuation bytes)
	if ((byte1 & 0x80) == 0) {
		return byte1;
	}

	// 2-byte sequence
	if ((byte1 & 0xE0) == 0xC0) {
		byte2 = readContinuationByte();
		codePoint = ((byte1 & 0x1F) << 6) | byte2;
		if (codePoint >= 0x80) {
			return codePoint;
		} else {
			throw Error('Invalid continuation byte');
		}
	}

	// 3-byte sequence (may include unpaired surrogates)
	if ((byte1 & 0xF0) == 0xE0) {
		byte2 = readContinuationByte();
		byte3 = readContinuationByte();
		codePoint = ((byte1 & 0x0F) << 12) | (byte2 << 6) | byte3;
		if (codePoint >= 0x0800) {
			return checkScalarValue(codePoint, strict) ? codePoint : 0xFFFD;
		} else {
			throw Error('Invalid continuation byte');
		}
	}

	// 4-byte sequence
	if ((byte1 & 0xF8) == 0xF0) {
		byte2 = readContinuationByte();
		byte3 = readContinuationByte();
		byte4 = readContinuationByte();
		codePoint = ((byte1 & 0x07) << 0x12) | (byte2 << 0x0C) |
			(byte3 << 0x06) | byte4;
		if (codePoint >= 0x010000 && codePoint <= 0x10FFFF) {
			return codePoint;
		}
	}

	throw Error('Invalid UTF-8 detected');
}

var byteArray;
var byteCount;
var byteIndex;
function utf8decode(byteString, opts) {
	opts = opts || {};
	var strict = false !== opts.strict;

	byteArray = ucs2decode(byteString);
	byteCount = byteArray.length;
	byteIndex = 0;
	var codePoints = [];
	var tmp;
	while ((tmp = decodeSymbol(strict)) !== false) {
		codePoints.push(tmp);
	}
	return ucs2encode(codePoints);
}

module.exports = {
	version: '2.1.2',
	encode: utf8encode,
	decode: utf8decode
};


/***/ }),

/***/ 695:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 696:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 697:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 698:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 699:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 700:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 701:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 716:
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};


/***/ }),

/***/ 717:
/***/ (function(module, exports) {


/**
 * Module exports.
 *
 * Logic borrowed from Modernizr:
 *
 *   - https://github.com/Modernizr/Modernizr/blob/master/feature-detects/cors.js
 */

try {
  module.exports = typeof XMLHttpRequest !== 'undefined' &&
    'withCredentials' in new XMLHttpRequest();
} catch (err) {
  // if XMLHttp support is disabled in IE then it will throw
  // when trying to create
  module.exports = false;
}


/***/ }),

/***/ 718:
/***/ (function(module, exports) {

exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}


/***/ }),

/***/ 719:
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};


/***/ }),

/***/ 722:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};


/***/ }),

/***/ 723:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};


/***/ }),

/***/ 724:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.decode = exports.parse = __webpack_require__(722);
exports.encode = exports.stringify = __webpack_require__(723);


/***/ }),

/***/ 74:
/***/ (function(module, exports, __webpack_require__) {

/**
 * Module dependencies.
 */

var keys = __webpack_require__(693);
var hasBinary = __webpack_require__(305);
var sliceBuffer = __webpack_require__(374);
var after = __webpack_require__(373);
var utf8 = __webpack_require__(694);

var base64encoder;
if (typeof ArrayBuffer !== 'undefined') {
  base64encoder = __webpack_require__(387);
}

/**
 * Check if we are running an android browser. That requires us to use
 * ArrayBuffer with polling transports...
 *
 * http://ghinda.net/jpeg-blob-ajax-android/
 */

var isAndroid = typeof navigator !== 'undefined' && /Android/i.test(navigator.userAgent);

/**
 * Check if we are running in PhantomJS.
 * Uploading a Blob with PhantomJS does not work correctly, as reported here:
 * https://github.com/ariya/phantomjs/issues/11395
 * @type boolean
 */
var isPhantomJS = typeof navigator !== 'undefined' && /PhantomJS/i.test(navigator.userAgent);

/**
 * When true, avoids using Blobs to encode payloads.
 * @type boolean
 */
var dontSendBlobs = isAndroid || isPhantomJS;

/**
 * Current protocol version.
 */

exports.protocol = 3;

/**
 * Packet types.
 */

var packets = exports.packets = {
    open:     0    // non-ws
  , close:    1    // non-ws
  , ping:     2
  , pong:     3
  , message:  4
  , upgrade:  5
  , noop:     6
};

var packetslist = keys(packets);

/**
 * Premade error packet.
 */

var err = { type: 'error', data: 'parser error' };

/**
 * Create a blob api even for blob builder when vendor prefixes exist
 */

var Blob = __webpack_require__(389);

/**
 * Encodes a packet.
 *
 *     <packet type id> [ <data> ]
 *
 * Example:
 *
 *     5hello world
 *     3
 *     4
 *
 * Binary is encoded in an identical principle
 *
 * @api private
 */

exports.encodePacket = function (packet, supportsBinary, utf8encode, callback) {
  if (typeof supportsBinary === 'function') {
    callback = supportsBinary;
    supportsBinary = false;
  }

  if (typeof utf8encode === 'function') {
    callback = utf8encode;
    utf8encode = null;
  }

  var data = (packet.data === undefined)
    ? undefined
    : packet.data.buffer || packet.data;

  if (typeof ArrayBuffer !== 'undefined' && data instanceof ArrayBuffer) {
    return encodeArrayBuffer(packet, supportsBinary, callback);
  } else if (typeof Blob !== 'undefined' && data instanceof Blob) {
    return encodeBlob(packet, supportsBinary, callback);
  }

  // might be an object with { base64: true, data: dataAsBase64String }
  if (data && data.base64) {
    return encodeBase64Object(packet, callback);
  }

  // Sending data as a utf-8 string
  var encoded = packets[packet.type];

  // data fragment is optional
  if (undefined !== packet.data) {
    encoded += utf8encode ? utf8.encode(String(packet.data), { strict: false }) : String(packet.data);
  }

  return callback('' + encoded);

};

function encodeBase64Object(packet, callback) {
  // packet data is an object { base64: true, data: dataAsBase64String }
  var message = 'b' + exports.packets[packet.type] + packet.data.data;
  return callback(message);
}

/**
 * Encode packet helpers for binary types
 */

function encodeArrayBuffer(packet, supportsBinary, callback) {
  if (!supportsBinary) {
    return exports.encodeBase64Packet(packet, callback);
  }

  var data = packet.data;
  var contentArray = new Uint8Array(data);
  var resultBuffer = new Uint8Array(1 + data.byteLength);

  resultBuffer[0] = packets[packet.type];
  for (var i = 0; i < contentArray.length; i++) {
    resultBuffer[i+1] = contentArray[i];
  }

  return callback(resultBuffer.buffer);
}

function encodeBlobAsArrayBuffer(packet, supportsBinary, callback) {
  if (!supportsBinary) {
    return exports.encodeBase64Packet(packet, callback);
  }

  var fr = new FileReader();
  fr.onload = function() {
    exports.encodePacket({ type: packet.type, data: fr.result }, supportsBinary, true, callback);
  };
  return fr.readAsArrayBuffer(packet.data);
}

function encodeBlob(packet, supportsBinary, callback) {
  if (!supportsBinary) {
    return exports.encodeBase64Packet(packet, callback);
  }

  if (dontSendBlobs) {
    return encodeBlobAsArrayBuffer(packet, supportsBinary, callback);
  }

  var length = new Uint8Array(1);
  length[0] = packets[packet.type];
  var blob = new Blob([length.buffer, packet.data]);

  return callback(blob);
}

/**
 * Encodes a packet with binary data in a base64 string
 *
 * @param {Object} packet, has `type` and `data`
 * @return {String} base64 encoded message
 */

exports.encodeBase64Packet = function(packet, callback) {
  var message = 'b' + exports.packets[packet.type];
  if (typeof Blob !== 'undefined' && packet.data instanceof Blob) {
    var fr = new FileReader();
    fr.onload = function() {
      var b64 = fr.result.split(',')[1];
      callback(message + b64);
    };
    return fr.readAsDataURL(packet.data);
  }

  var b64data;
  try {
    b64data = String.fromCharCode.apply(null, new Uint8Array(packet.data));
  } catch (e) {
    // iPhone Safari doesn't let you apply with typed arrays
    var typed = new Uint8Array(packet.data);
    var basic = new Array(typed.length);
    for (var i = 0; i < typed.length; i++) {
      basic[i] = typed[i];
    }
    b64data = String.fromCharCode.apply(null, basic);
  }
  message += btoa(b64data);
  return callback(message);
};

/**
 * Decodes a packet. Changes format to Blob if requested.
 *
 * @return {Object} with `type` and `data` (if any)
 * @api private
 */

exports.decodePacket = function (data, binaryType, utf8decode) {
  if (data === undefined) {
    return err;
  }
  // String data
  if (typeof data === 'string') {
    if (data.charAt(0) === 'b') {
      return exports.decodeBase64Packet(data.substr(1), binaryType);
    }

    if (utf8decode) {
      data = tryDecode(data);
      if (data === false) {
        return err;
      }
    }
    var type = data.charAt(0);

    if (Number(type) != type || !packetslist[type]) {
      return err;
    }

    if (data.length > 1) {
      return { type: packetslist[type], data: data.substring(1) };
    } else {
      return { type: packetslist[type] };
    }
  }

  var asArray = new Uint8Array(data);
  var type = asArray[0];
  var rest = sliceBuffer(data, 1);
  if (Blob && binaryType === 'blob') {
    rest = new Blob([rest]);
  }
  return { type: packetslist[type], data: rest };
};

function tryDecode(data) {
  try {
    data = utf8.decode(data, { strict: false });
  } catch (e) {
    return false;
  }
  return data;
}

/**
 * Decodes a packet encoded in a base64 string
 *
 * @param {String} base64 encoded message
 * @return {Object} with `type` and `data` (if any)
 */

exports.decodeBase64Packet = function(msg, binaryType) {
  var type = packetslist[msg.charAt(0)];
  if (!base64encoder) {
    return { type: type, data: { base64: true, data: msg.substr(1) } };
  }

  var data = base64encoder.decode(msg.substr(1));

  if (binaryType === 'blob' && Blob) {
    data = new Blob([data]);
  }

  return { type: type, data: data };
};

/**
 * Encodes multiple messages (payload).
 *
 *     <length>:data
 *
 * Example:
 *
 *     11:hello world2:hi
 *
 * If any contents are binary, they will be encoded as base64 strings. Base64
 * encoded strings are marked with a b before the length specifier
 *
 * @param {Array} packets
 * @api private
 */

exports.encodePayload = function (packets, supportsBinary, callback) {
  if (typeof supportsBinary === 'function') {
    callback = supportsBinary;
    supportsBinary = null;
  }

  var isBinary = hasBinary(packets);

  if (supportsBinary && isBinary) {
    if (Blob && !dontSendBlobs) {
      return exports.encodePayloadAsBlob(packets, callback);
    }

    return exports.encodePayloadAsArrayBuffer(packets, callback);
  }

  if (!packets.length) {
    return callback('0:');
  }

  function setLengthHeader(message) {
    return message.length + ':' + message;
  }

  function encodeOne(packet, doneCallback) {
    exports.encodePacket(packet, !isBinary ? false : supportsBinary, false, function(message) {
      doneCallback(null, setLengthHeader(message));
    });
  }

  map(packets, encodeOne, function(err, results) {
    return callback(results.join(''));
  });
};

/**
 * Async array map using after
 */

function map(ary, each, done) {
  var result = new Array(ary.length);
  var next = after(ary.length, done);

  var eachWithIndex = function(i, el, cb) {
    each(el, function(error, msg) {
      result[i] = msg;
      cb(error, result);
    });
  };

  for (var i = 0; i < ary.length; i++) {
    eachWithIndex(i, ary[i], next);
  }
}

/*
 * Decodes data when a payload is maybe expected. Possible binary contents are
 * decoded from their base64 representation
 *
 * @param {String} data, callback method
 * @api public
 */

exports.decodePayload = function (data, binaryType, callback) {
  if (typeof data !== 'string') {
    return exports.decodePayloadAsBinary(data, binaryType, callback);
  }

  if (typeof binaryType === 'function') {
    callback = binaryType;
    binaryType = null;
  }

  var packet;
  if (data === '') {
    // parser error - ignoring payload
    return callback(err, 0, 1);
  }

  var length = '', n, msg;

  for (var i = 0, l = data.length; i < l; i++) {
    var chr = data.charAt(i);

    if (chr !== ':') {
      length += chr;
      continue;
    }

    if (length === '' || (length != (n = Number(length)))) {
      // parser error - ignoring payload
      return callback(err, 0, 1);
    }

    msg = data.substr(i + 1, n);

    if (length != msg.length) {
      // parser error - ignoring payload
      return callback(err, 0, 1);
    }

    if (msg.length) {
      packet = exports.decodePacket(msg, binaryType, false);

      if (err.type === packet.type && err.data === packet.data) {
        // parser error in individual packet - ignoring payload
        return callback(err, 0, 1);
      }

      var ret = callback(packet, i + n, l);
      if (false === ret) return;
    }

    // advance cursor
    i += n;
    length = '';
  }

  if (length !== '') {
    // parser error - ignoring payload
    return callback(err, 0, 1);
  }

};

/**
 * Encodes multiple messages (payload) as binary.
 *
 * <1 = binary, 0 = string><number from 0-9><number from 0-9>[...]<number
 * 255><data>
 *
 * Example:
 * 1 3 255 1 2 3, if the binary contents are interpreted as 8 bit integers
 *
 * @param {Array} packets
 * @return {ArrayBuffer} encoded payload
 * @api private
 */

exports.encodePayloadAsArrayBuffer = function(packets, callback) {
  if (!packets.length) {
    return callback(new ArrayBuffer(0));
  }

  function encodeOne(packet, doneCallback) {
    exports.encodePacket(packet, true, true, function(data) {
      return doneCallback(null, data);
    });
  }

  map(packets, encodeOne, function(err, encodedPackets) {
    var totalLength = encodedPackets.reduce(function(acc, p) {
      var len;
      if (typeof p === 'string'){
        len = p.length;
      } else {
        len = p.byteLength;
      }
      return acc + len.toString().length + len + 2; // string/binary identifier + separator = 2
    }, 0);

    var resultArray = new Uint8Array(totalLength);

    var bufferIndex = 0;
    encodedPackets.forEach(function(p) {
      var isString = typeof p === 'string';
      var ab = p;
      if (isString) {
        var view = new Uint8Array(p.length);
        for (var i = 0; i < p.length; i++) {
          view[i] = p.charCodeAt(i);
        }
        ab = view.buffer;
      }

      if (isString) { // not true binary
        resultArray[bufferIndex++] = 0;
      } else { // true binary
        resultArray[bufferIndex++] = 1;
      }

      var lenStr = ab.byteLength.toString();
      for (var i = 0; i < lenStr.length; i++) {
        resultArray[bufferIndex++] = parseInt(lenStr[i]);
      }
      resultArray[bufferIndex++] = 255;

      var view = new Uint8Array(ab);
      for (var i = 0; i < view.length; i++) {
        resultArray[bufferIndex++] = view[i];
      }
    });

    return callback(resultArray.buffer);
  });
};

/**
 * Encode as Blob
 */

exports.encodePayloadAsBlob = function(packets, callback) {
  function encodeOne(packet, doneCallback) {
    exports.encodePacket(packet, true, true, function(encoded) {
      var binaryIdentifier = new Uint8Array(1);
      binaryIdentifier[0] = 1;
      if (typeof encoded === 'string') {
        var view = new Uint8Array(encoded.length);
        for (var i = 0; i < encoded.length; i++) {
          view[i] = encoded.charCodeAt(i);
        }
        encoded = view.buffer;
        binaryIdentifier[0] = 0;
      }

      var len = (encoded instanceof ArrayBuffer)
        ? encoded.byteLength
        : encoded.size;

      var lenStr = len.toString();
      var lengthAry = new Uint8Array(lenStr.length + 1);
      for (var i = 0; i < lenStr.length; i++) {
        lengthAry[i] = parseInt(lenStr[i]);
      }
      lengthAry[lenStr.length] = 255;

      if (Blob) {
        var blob = new Blob([binaryIdentifier.buffer, lengthAry.buffer, encoded]);
        doneCallback(null, blob);
      }
    });
  }

  map(packets, encodeOne, function(err, results) {
    return callback(new Blob(results));
  });
};

/*
 * Decodes data when a payload is maybe expected. Strings are decoded by
 * interpreting each byte as a key code for entries marked to start with 0. See
 * description of encodePayloadAsBinary
 *
 * @param {ArrayBuffer} data, callback method
 * @api public
 */

exports.decodePayloadAsBinary = function (data, binaryType, callback) {
  if (typeof binaryType === 'function') {
    callback = binaryType;
    binaryType = null;
  }

  var bufferTail = data;
  var buffers = [];

  while (bufferTail.byteLength > 0) {
    var tailArray = new Uint8Array(bufferTail);
    var isString = tailArray[0] === 0;
    var msgLength = '';

    for (var i = 1; ; i++) {
      if (tailArray[i] === 255) break;

      // 310 = char length of Number.MAX_VALUE
      if (msgLength.length > 310) {
        return callback(err, 0, 1);
      }

      msgLength += tailArray[i];
    }

    bufferTail = sliceBuffer(bufferTail, 2 + msgLength.length);
    msgLength = parseInt(msgLength);

    var msg = sliceBuffer(bufferTail, 0, msgLength);
    if (isString) {
      try {
        msg = String.fromCharCode.apply(null, new Uint8Array(msg));
      } catch (e) {
        // iPhone Safari doesn't let you apply to typed arrays
        var typed = new Uint8Array(msg);
        msg = '';
        for (var i = 0; i < typed.length; i++) {
          msg += String.fromCharCode(typed[i]);
        }
      }
    }

    buffers.push(msg);
    bufferTail = sliceBuffer(bufferTail, msgLength);
  }

  var total = buffers.length;
  buffers.forEach(function(buffer, i) {
    callback(exports.decodePacket(buffer, binaryType, true), i, total);
  });
};


/***/ }),

/***/ 81:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__vector__ = __webpack_require__(50);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__matrix__ = __webpack_require__(364);
/**
 * @module echarts/core/BoundingRect
 */




var v2ApplyTransform = __WEBPACK_IMPORTED_MODULE_0__vector__["b" /* applyTransform */];
var mathMin = Math.min;
var mathMax = Math.max;

/**
 * @alias module:echarts/core/BoundingRect
 */
function BoundingRect(x, y, width, height) {

    if (width < 0) {
        x = x + width;
        width = -width;
    }
    if (height < 0) {
        y = y + height;
        height = -height;
    }

    /**
     * @type {number}
     */
    this.x = x;
    /**
     * @type {number}
     */
    this.y = y;
    /**
     * @type {number}
     */
    this.width = width;
    /**
     * @type {number}
     */
    this.height = height;
}

BoundingRect.prototype = {

    constructor: BoundingRect,

    /**
     * @param {module:echarts/core/BoundingRect} other
     */
    union: function (other) {
        var x = mathMin(other.x, this.x);
        var y = mathMin(other.y, this.y);

        this.width = mathMax(
                other.x + other.width,
                this.x + this.width
            ) - x;
        this.height = mathMax(
                other.y + other.height,
                this.y + this.height
            ) - y;
        this.x = x;
        this.y = y;
    },

    /**
     * @param {Array.<number>} m
     * @methods
     */
    applyTransform: (function () {
        var lt = [];
        var rb = [];
        var lb = [];
        var rt = [];
        return function (m) {
            // In case usage like this
            // el.getBoundingRect().applyTransform(el.transform)
            // And element has no transform
            if (!m) {
                return;
            }
            lt[0] = lb[0] = this.x;
            lt[1] = rt[1] = this.y;
            rb[0] = rt[0] = this.x + this.width;
            rb[1] = lb[1] = this.y + this.height;

            v2ApplyTransform(lt, lt, m);
            v2ApplyTransform(rb, rb, m);
            v2ApplyTransform(lb, lb, m);
            v2ApplyTransform(rt, rt, m);

            this.x = mathMin(lt[0], rb[0], lb[0], rt[0]);
            this.y = mathMin(lt[1], rb[1], lb[1], rt[1]);
            var maxX = mathMax(lt[0], rb[0], lb[0], rt[0]);
            var maxY = mathMax(lt[1], rb[1], lb[1], rt[1]);
            this.width = maxX - this.x;
            this.height = maxY - this.y;
        };
    })(),

    /**
     * Calculate matrix of transforming from self to target rect
     * @param  {module:zrender/core/BoundingRect} b
     * @return {Array.<number>}
     */
    calculateTransform: function (b) {
        var a = this;
        var sx = b.width / a.width;
        var sy = b.height / a.height;

        var m = __WEBPACK_IMPORTED_MODULE_1__matrix__["a" /* create */]();

        // 矩阵右乘
        __WEBPACK_IMPORTED_MODULE_1__matrix__["b" /* translate */](m, m, [-a.x, -a.y]);
        __WEBPACK_IMPORTED_MODULE_1__matrix__["c" /* scale */](m, m, [sx, sy]);
        __WEBPACK_IMPORTED_MODULE_1__matrix__["b" /* translate */](m, m, [b.x, b.y]);

        return m;
    },

    /**
     * @param {(module:echarts/core/BoundingRect|Object)} b
     * @return {boolean}
     */
    intersect: function (b) {
        if (!b) {
            return false;
        }

        if (!(b instanceof BoundingRect)) {
            // Normalize negative width/height.
            b = BoundingRect.create(b);
        }

        var a = this;
        var ax0 = a.x;
        var ax1 = a.x + a.width;
        var ay0 = a.y;
        var ay1 = a.y + a.height;

        var bx0 = b.x;
        var bx1 = b.x + b.width;
        var by0 = b.y;
        var by1 = b.y + b.height;

        return ! (ax1 < bx0 || bx1 < ax0 || ay1 < by0 || by1 < ay0);
    },

    contain: function (x, y) {
        var rect = this;
        return x >= rect.x
            && x <= (rect.x + rect.width)
            && y >= rect.y
            && y <= (rect.y + rect.height);
    },

    /**
     * @return {module:echarts/core/BoundingRect}
     */
    clone: function () {
        return new BoundingRect(this.x, this.y, this.width, this.height);
    },

    /**
     * Copy from another rect
     */
    copy: function (other) {
        this.x = other.x;
        this.y = other.y;
        this.width = other.width;
        this.height = other.height;
    },

    plain: function () {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
};

/**
 * @param {Object|module:zrender/core/BoundingRect} rect
 * @param {number} rect.x
 * @param {number} rect.y
 * @param {number} rect.width
 * @param {number} rect.height
 * @return {module:zrender/core/BoundingRect}
 */
BoundingRect.create = function (rect) {
    return new BoundingRect(rect.x, rect.y, rect.width, rect.height);
};

/* harmony default export */ __webpack_exports__["a"] = (BoundingRect);

/***/ }),

/***/ 811:
/***/ (function(module, exports, __webpack_require__) {


/**
 * Module dependencies.
 */

var url = __webpack_require__(812);
var parser = __webpack_require__(202);
var Manager = __webpack_require__(337);
var debug = __webpack_require__(137)('socket.io-client');

/**
 * Module exports.
 */

module.exports = exports = lookup;

/**
 * Managers cache.
 */

var cache = exports.managers = {};

/**
 * Looks up an existing `Manager` for multiplexing.
 * If the user summons:
 *
 *   `io('http://localhost/a');`
 *   `io('http://localhost/b');`
 *
 * We reuse the existing instance based on same scheme/port/host,
 * and we initialize sockets for each namespace.
 *
 * @api public
 */

function lookup (uri, opts) {
  if (typeof uri === 'object') {
    opts = uri;
    uri = undefined;
  }

  opts = opts || {};

  var parsed = url(uri);
  var source = parsed.source;
  var id = parsed.id;
  var path = parsed.path;
  var sameNamespace = cache[id] && path in cache[id].nsps;
  var newConnection = opts.forceNew || opts['force new connection'] ||
                      false === opts.multiplex || sameNamespace;

  var io;

  if (newConnection) {
    debug('ignoring socket cache for %s', source);
    io = Manager(source, opts);
  } else {
    if (!cache[id]) {
      debug('new io instance for %s', source);
      cache[id] = Manager(source, opts);
    }
    io = cache[id];
  }
  if (parsed.query && !opts.query) {
    opts.query = parsed.query;
  }
  return io.socket(parsed.path, opts);
}

/**
 * Protocol version.
 *
 * @api public
 */

exports.protocol = parser.protocol;

/**
 * `connect`.
 *
 * @param {String} uri
 * @api public
 */

exports.connect = lookup;

/**
 * Expose constructors for standalone build.
 *
 * @api public
 */

exports.Manager = __webpack_require__(337);
exports.Socket = __webpack_require__(339);


/***/ }),

/***/ 812:
/***/ (function(module, exports, __webpack_require__) {


/**
 * Module dependencies.
 */

var parseuri = __webpack_require__(307);
var debug = __webpack_require__(137)('socket.io-client:url');

/**
 * Module exports.
 */

module.exports = url;

/**
 * URL parser.
 *
 * @param {String} url
 * @param {Object} An object meant to mimic window.location.
 *                 Defaults to window.location.
 * @api public
 */

function url (uri, loc) {
  var obj = uri;

  // default to window.location
  loc = loc || (typeof location !== 'undefined' && location);
  if (null == uri) uri = loc.protocol + '//' + loc.host;

  // relative path support
  if ('string' === typeof uri) {
    if ('/' === uri.charAt(0)) {
      if ('/' === uri.charAt(1)) {
        uri = loc.protocol + uri;
      } else {
        uri = loc.host + uri;
      }
    }

    if (!/^(https?|wss?):\/\//.test(uri)) {
      debug('protocol-less url %s', uri);
      if ('undefined' !== typeof loc) {
        uri = loc.protocol + '//' + uri;
      } else {
        uri = 'https://' + uri;
      }
    }

    // parse
    debug('parse %s', uri);
    obj = parseuri(uri);
  }

  // make sure we treat `localhost:80` and `localhost` equally
  if (!obj.port) {
    if (/^(http|ws)$/.test(obj.protocol)) {
      obj.port = '80';
    } else if (/^(http|ws)s$/.test(obj.protocol)) {
      obj.port = '443';
    }
  }

  obj.path = obj.path || '/';

  var ipv6 = obj.host.indexOf(':') !== -1;
  var host = ipv6 ? '[' + obj.host + ']' : obj.host;

  // define unique id
  obj.id = obj.protocol + '://' + host + ':' + obj.port;
  // define href
  obj.href = obj.protocol + '://' + host + (loc && loc.port === obj.port ? '' : (':' + obj.port));

  return obj;
}


/***/ }),

/***/ 813:
/***/ (function(module, exports, __webpack_require__) {


/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = createDebug.debug = createDebug['default'] = createDebug;
exports.coerce = coerce;
exports.disable = disable;
exports.enable = enable;
exports.enabled = enabled;
exports.humanize = __webpack_require__(185);

/**
 * Active `debug` instances.
 */
exports.instances = [];

/**
 * The currently active debug mode names, and names to skip.
 */

exports.names = [];
exports.skips = [];

/**
 * Map of special "%n" handling functions, for the debug "format" argument.
 *
 * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
 */

exports.formatters = {};

/**
 * Select a color.
 * @param {String} namespace
 * @return {Number}
 * @api private
 */

function selectColor(namespace) {
  var hash = 0, i;

  for (i in namespace) {
    hash  = ((hash << 5) - hash) + namespace.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }

  return exports.colors[Math.abs(hash) % exports.colors.length];
}

/**
 * Create a debugger with the given `namespace`.
 *
 * @param {String} namespace
 * @return {Function}
 * @api public
 */

function createDebug(namespace) {

  var prevTime;

  function debug() {
    // disabled?
    if (!debug.enabled) return;

    var self = debug;

    // set `diff` timestamp
    var curr = +new Date();
    var ms = curr - (prevTime || curr);
    self.diff = ms;
    self.prev = prevTime;
    self.curr = curr;
    prevTime = curr;

    // turn the `arguments` into a proper Array
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }

    args[0] = exports.coerce(args[0]);

    if ('string' !== typeof args[0]) {
      // anything else let's inspect with %O
      args.unshift('%O');
    }

    // apply any `formatters` transformations
    var index = 0;
    args[0] = args[0].replace(/%([a-zA-Z%])/g, function(match, format) {
      // if we encounter an escaped % then don't increase the array index
      if (match === '%%') return match;
      index++;
      var formatter = exports.formatters[format];
      if ('function' === typeof formatter) {
        var val = args[index];
        match = formatter.call(self, val);

        // now we need to remove `args[index]` since it's inlined in the `format`
        args.splice(index, 1);
        index--;
      }
      return match;
    });

    // apply env-specific formatting (colors, etc.)
    exports.formatArgs.call(self, args);

    var logFn = debug.log || exports.log || console.log.bind(console);
    logFn.apply(self, args);
  }

  debug.namespace = namespace;
  debug.enabled = exports.enabled(namespace);
  debug.useColors = exports.useColors();
  debug.color = selectColor(namespace);
  debug.destroy = destroy;

  // env-specific initialization logic for debug instances
  if ('function' === typeof exports.init) {
    exports.init(debug);
  }

  exports.instances.push(debug);

  return debug;
}

function destroy () {
  var index = exports.instances.indexOf(this);
  if (index !== -1) {
    exports.instances.splice(index, 1);
    return true;
  } else {
    return false;
  }
}

/**
 * Enables a debug mode by namespaces. This can include modes
 * separated by a colon and wildcards.
 *
 * @param {String} namespaces
 * @api public
 */

function enable(namespaces) {
  exports.save(namespaces);

  exports.names = [];
  exports.skips = [];

  var i;
  var split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
  var len = split.length;

  for (i = 0; i < len; i++) {
    if (!split[i]) continue; // ignore empty strings
    namespaces = split[i].replace(/\*/g, '.*?');
    if (namespaces[0] === '-') {
      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
    } else {
      exports.names.push(new RegExp('^' + namespaces + '$'));
    }
  }

  for (i = 0; i < exports.instances.length; i++) {
    var instance = exports.instances[i];
    instance.enabled = exports.enabled(instance.namespace);
  }
}

/**
 * Disable debug output.
 *
 * @api public
 */

function disable() {
  exports.enable('');
}

/**
 * Returns true if the given mode name is enabled, false otherwise.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

function enabled(name) {
  if (name[name.length - 1] === '*') {
    return true;
  }
  var i, len;
  for (i = 0, len = exports.skips.length; i < len; i++) {
    if (exports.skips[i].test(name)) {
      return false;
    }
  }
  for (i = 0, len = exports.names.length; i < len; i++) {
    if (exports.names[i].test(name)) {
      return true;
    }
  }
  return false;
}

/**
 * Coerce `val`.
 *
 * @param {Mixed} val
 * @return {Mixed}
 * @api private
 */

function coerce(val) {
  if (val instanceof Error) return val.stack || val.message;
  return val;
}


/***/ }),

/***/ 814:
/***/ (function(module, exports, __webpack_require__) {

/*global Blob,File*/

/**
 * Module requirements
 */

var isArray = __webpack_require__(341);
var isBuf = __webpack_require__(340);
var toString = Object.prototype.toString;
var withNativeBlob = typeof Blob === 'function' || (typeof Blob !== 'undefined' && toString.call(Blob) === '[object BlobConstructor]');
var withNativeFile = typeof File === 'function' || (typeof File !== 'undefined' && toString.call(File) === '[object FileConstructor]');

/**
 * Replaces every Buffer | ArrayBuffer in packet with a numbered placeholder.
 * Anything with blobs or files should be fed through removeBlobs before coming
 * here.
 *
 * @param {Object} packet - socket.io event packet
 * @return {Object} with deconstructed packet and list of buffers
 * @api public
 */

exports.deconstructPacket = function(packet) {
  var buffers = [];
  var packetData = packet.data;
  var pack = packet;
  pack.data = _deconstructPacket(packetData, buffers);
  pack.attachments = buffers.length; // number of binary 'attachments'
  return {packet: pack, buffers: buffers};
};

function _deconstructPacket(data, buffers) {
  if (!data) return data;

  if (isBuf(data)) {
    var placeholder = { _placeholder: true, num: buffers.length };
    buffers.push(data);
    return placeholder;
  } else if (isArray(data)) {
    var newData = new Array(data.length);
    for (var i = 0; i < data.length; i++) {
      newData[i] = _deconstructPacket(data[i], buffers);
    }
    return newData;
  } else if (typeof data === 'object' && !(data instanceof Date)) {
    var newData = {};
    for (var key in data) {
      newData[key] = _deconstructPacket(data[key], buffers);
    }
    return newData;
  }
  return data;
}

/**
 * Reconstructs a binary packet from its placeholder packet and buffers
 *
 * @param {Object} packet - event packet with placeholders
 * @param {Array} buffers - binary buffers to put in placeholder positions
 * @return {Object} reconstructed packet
 * @api public
 */

exports.reconstructPacket = function(packet, buffers) {
  packet.data = _reconstructPacket(packet.data, buffers);
  packet.attachments = undefined; // no longer useful
  return packet;
};

function _reconstructPacket(data, buffers) {
  if (!data) return data;

  if (data && data._placeholder) {
    return buffers[data.num]; // appropriate buffer (should be natural order anyway)
  } else if (isArray(data)) {
    for (var i = 0; i < data.length; i++) {
      data[i] = _reconstructPacket(data[i], buffers);
    }
  } else if (typeof data === 'object') {
    for (var key in data) {
      data[key] = _reconstructPacket(data[key], buffers);
    }
  }

  return data;
}

/**
 * Asynchronously removes Blobs or Files from data via
 * FileReader's readAsArrayBuffer method. Used before encoding
 * data as msgpack. Calls callback with the blobless data.
 *
 * @param {Object} data
 * @param {Function} callback
 * @api private
 */

exports.removeBlobs = function(data, callback) {
  function _removeBlobs(obj, curKey, containingObject) {
    if (!obj) return obj;

    // convert any blob
    if ((withNativeBlob && obj instanceof Blob) ||
        (withNativeFile && obj instanceof File)) {
      pendingBlobs++;

      // async filereader
      var fileReader = new FileReader();
      fileReader.onload = function() { // this.result == arraybuffer
        if (containingObject) {
          containingObject[curKey] = this.result;
        }
        else {
          bloblessData = this.result;
        }

        // if nothing pending its callback time
        if(! --pendingBlobs) {
          callback(bloblessData);
        }
      };

      fileReader.readAsArrayBuffer(obj); // blob -> arraybuffer
    } else if (isArray(obj)) { // handle array
      for (var i = 0; i < obj.length; i++) {
        _removeBlobs(obj[i], i, obj);
      }
    } else if (typeof obj === 'object' && !isBuf(obj)) { // and object
      for (var key in obj) {
        _removeBlobs(obj[key], key, obj);
      }
    }
  }

  var pendingBlobs = 0;
  var bloblessData = data;
  _removeBlobs(bloblessData);
  if (!pendingBlobs) {
    callback(bloblessData);
  }
};


/***/ }),

/***/ 815:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {/**
 * This is the web browser implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = __webpack_require__(816);
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = 'undefined' != typeof chrome
               && 'undefined' != typeof chrome.storage
                  ? chrome.storage.local
                  : localstorage();

/**
 * Colors.
 */

exports.colors = [
  '#0000CC', '#0000FF', '#0033CC', '#0033FF', '#0066CC', '#0066FF', '#0099CC',
  '#0099FF', '#00CC00', '#00CC33', '#00CC66', '#00CC99', '#00CCCC', '#00CCFF',
  '#3300CC', '#3300FF', '#3333CC', '#3333FF', '#3366CC', '#3366FF', '#3399CC',
  '#3399FF', '#33CC00', '#33CC33', '#33CC66', '#33CC99', '#33CCCC', '#33CCFF',
  '#6600CC', '#6600FF', '#6633CC', '#6633FF', '#66CC00', '#66CC33', '#9900CC',
  '#9900FF', '#9933CC', '#9933FF', '#99CC00', '#99CC33', '#CC0000', '#CC0033',
  '#CC0066', '#CC0099', '#CC00CC', '#CC00FF', '#CC3300', '#CC3333', '#CC3366',
  '#CC3399', '#CC33CC', '#CC33FF', '#CC6600', '#CC6633', '#CC9900', '#CC9933',
  '#CCCC00', '#CCCC33', '#FF0000', '#FF0033', '#FF0066', '#FF0099', '#FF00CC',
  '#FF00FF', '#FF3300', '#FF3333', '#FF3366', '#FF3399', '#FF33CC', '#FF33FF',
  '#FF6600', '#FF6633', '#FF9900', '#FF9933', '#FFCC00', '#FFCC33'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

function useColors() {
  // NB: In an Electron preload script, document will be defined but not fully
  // initialized. Since we know we're in Chrome, we'll just detect this case
  // explicitly
  if (typeof window !== 'undefined' && window.process && window.process.type === 'renderer') {
    return true;
  }

  // Internet Explorer and Edge do not support colors.
  if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
    return false;
  }

  // is webkit? http://stackoverflow.com/a/16459606/376773
  // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
  return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
    // is firebug? http://stackoverflow.com/a/398120/376773
    (typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
    // is firefox >= v31?
    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
    // double check webkit in userAgent just in case we are in a worker
    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
}

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

exports.formatters.j = function(v) {
  try {
    return JSON.stringify(v);
  } catch (err) {
    return '[UnexpectedJSONParseError]: ' + err.message;
  }
};


/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs(args) {
  var useColors = this.useColors;

  args[0] = (useColors ? '%c' : '')
    + this.namespace
    + (useColors ? ' %c' : ' ')
    + args[0]
    + (useColors ? '%c ' : ' ')
    + '+' + exports.humanize(this.diff);

  if (!useColors) return;

  var c = 'color: ' + this.color;
  args.splice(1, 0, c, 'color: inherit')

  // the final "%c" is somewhat tricky, because there could be other
  // arguments passed either before or after the %c, so we need to
  // figure out the correct index to insert the CSS into
  var index = 0;
  var lastC = 0;
  args[0].replace(/%[a-zA-Z%]/g, function(match) {
    if ('%%' === match) return;
    index++;
    if ('%c' === match) {
      // we only are interested in the *last* %c
      // (the user may have provided their own)
      lastC = index;
    }
  });

  args.splice(lastC, 0, c);
}

/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */

function log() {
  // this hackery is required for IE8/9, where
  // the `console.log` function doesn't have 'apply'
  return 'object' === typeof console
    && console.log
    && Function.prototype.apply.call(console.log, console, arguments);
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */

function save(namespaces) {
  try {
    if (null == namespaces) {
      exports.storage.removeItem('debug');
    } else {
      exports.storage.debug = namespaces;
    }
  } catch(e) {}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
  var r;
  try {
    r = exports.storage.debug;
  } catch(e) {}

  // If debug isn't set in LS, and we're in Electron, try to load $DEBUG
  if (!r && typeof process !== 'undefined' && 'env' in process) {
    r = process.env.DEBUG;
  }

  return r;
}

/**
 * Enable namespaces listed in `localStorage.debug` initially.
 */

exports.enable(load());

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage() {
  try {
    return window.localStorage;
  } catch (e) {}
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ }),

/***/ 816:
/***/ (function(module, exports, __webpack_require__) {


/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = createDebug.debug = createDebug['default'] = createDebug;
exports.coerce = coerce;
exports.disable = disable;
exports.enable = enable;
exports.enabled = enabled;
exports.humanize = __webpack_require__(185);

/**
 * Active `debug` instances.
 */
exports.instances = [];

/**
 * The currently active debug mode names, and names to skip.
 */

exports.names = [];
exports.skips = [];

/**
 * Map of special "%n" handling functions, for the debug "format" argument.
 *
 * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
 */

exports.formatters = {};

/**
 * Select a color.
 * @param {String} namespace
 * @return {Number}
 * @api private
 */

function selectColor(namespace) {
  var hash = 0, i;

  for (i in namespace) {
    hash  = ((hash << 5) - hash) + namespace.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }

  return exports.colors[Math.abs(hash) % exports.colors.length];
}

/**
 * Create a debugger with the given `namespace`.
 *
 * @param {String} namespace
 * @return {Function}
 * @api public
 */

function createDebug(namespace) {

  var prevTime;

  function debug() {
    // disabled?
    if (!debug.enabled) return;

    var self = debug;

    // set `diff` timestamp
    var curr = +new Date();
    var ms = curr - (prevTime || curr);
    self.diff = ms;
    self.prev = prevTime;
    self.curr = curr;
    prevTime = curr;

    // turn the `arguments` into a proper Array
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }

    args[0] = exports.coerce(args[0]);

    if ('string' !== typeof args[0]) {
      // anything else let's inspect with %O
      args.unshift('%O');
    }

    // apply any `formatters` transformations
    var index = 0;
    args[0] = args[0].replace(/%([a-zA-Z%])/g, function(match, format) {
      // if we encounter an escaped % then don't increase the array index
      if (match === '%%') return match;
      index++;
      var formatter = exports.formatters[format];
      if ('function' === typeof formatter) {
        var val = args[index];
        match = formatter.call(self, val);

        // now we need to remove `args[index]` since it's inlined in the `format`
        args.splice(index, 1);
        index--;
      }
      return match;
    });

    // apply env-specific formatting (colors, etc.)
    exports.formatArgs.call(self, args);

    var logFn = debug.log || exports.log || console.log.bind(console);
    logFn.apply(self, args);
  }

  debug.namespace = namespace;
  debug.enabled = exports.enabled(namespace);
  debug.useColors = exports.useColors();
  debug.color = selectColor(namespace);
  debug.destroy = destroy;

  // env-specific initialization logic for debug instances
  if ('function' === typeof exports.init) {
    exports.init(debug);
  }

  exports.instances.push(debug);

  return debug;
}

function destroy () {
  var index = exports.instances.indexOf(this);
  if (index !== -1) {
    exports.instances.splice(index, 1);
    return true;
  } else {
    return false;
  }
}

/**
 * Enables a debug mode by namespaces. This can include modes
 * separated by a colon and wildcards.
 *
 * @param {String} namespaces
 * @api public
 */

function enable(namespaces) {
  exports.save(namespaces);

  exports.names = [];
  exports.skips = [];

  var i;
  var split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
  var len = split.length;

  for (i = 0; i < len; i++) {
    if (!split[i]) continue; // ignore empty strings
    namespaces = split[i].replace(/\*/g, '.*?');
    if (namespaces[0] === '-') {
      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
    } else {
      exports.names.push(new RegExp('^' + namespaces + '$'));
    }
  }

  for (i = 0; i < exports.instances.length; i++) {
    var instance = exports.instances[i];
    instance.enabled = exports.enabled(instance.namespace);
  }
}

/**
 * Disable debug output.
 *
 * @api public
 */

function disable() {
  exports.enable('');
}

/**
 * Returns true if the given mode name is enabled, false otherwise.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

function enabled(name) {
  if (name[name.length - 1] === '*') {
    return true;
  }
  var i, len;
  for (i = 0, len = exports.skips.length; i < len; i++) {
    if (exports.skips[i].test(name)) {
      return false;
    }
  }
  for (i = 0, len = exports.names.length; i < len; i++) {
    if (exports.names[i].test(name)) {
      return true;
    }
  }
  return false;
}

/**
 * Coerce `val`.
 *
 * @param {Mixed} val
 * @return {Mixed}
 * @api private
 */

function coerce(val) {
  if (val instanceof Error) return val.stack || val.message;
  return val;
}


/***/ }),

/***/ 817:
/***/ (function(module, exports) {

module.exports = toArray

function toArray(list, index) {
    var array = []

    index = index || 0

    for (var i = index || 0; i < list.length; i++) {
        array[i - index] = list[i]
    }

    return array
}


/***/ }),

/***/ 818:
/***/ (function(module, exports) {

module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),

/***/ 82:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = cubicAt;
/* harmony export (immutable) */ __webpack_exports__["i"] = cubicDerivativeAt;
/* harmony export (immutable) */ __webpack_exports__["a"] = cubicRootAt;
/* harmony export (immutable) */ __webpack_exports__["c"] = cubicExtrema;
/* harmony export (immutable) */ __webpack_exports__["l"] = cubicSubdivide;
/* harmony export (immutable) */ __webpack_exports__["h"] = cubicProjectPoint;
/* harmony export (immutable) */ __webpack_exports__["f"] = quadraticAt;
/* harmony export (immutable) */ __webpack_exports__["j"] = quadraticDerivativeAt;
/* harmony export (immutable) */ __webpack_exports__["d"] = quadraticRootAt;
/* harmony export (immutable) */ __webpack_exports__["e"] = quadraticExtremum;
/* harmony export (immutable) */ __webpack_exports__["k"] = quadraticSubdivide;
/* harmony export (immutable) */ __webpack_exports__["g"] = quadraticProjectPoint;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__vector__ = __webpack_require__(50);
/**
 * 曲线辅助模块
 * @module zrender/core/curve
 * @author pissang(https://www.github.com/pissang)
 */



var mathPow = Math.pow;
var mathSqrt = Math.sqrt;

var EPSILON = 1e-8;
var EPSILON_NUMERIC = 1e-4;

var THREE_SQRT = mathSqrt(3);
var ONE_THIRD = 1 / 3;

// 临时变量
var _v0 = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__vector__["c" /* create */])();
var _v1 = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__vector__["c" /* create */])();
var _v2 = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__vector__["c" /* create */])();

function isAroundZero(val) {
    return val > -EPSILON && val < EPSILON;
}
function isNotAroundZero(val) {
    return val > EPSILON || val < -EPSILON;
}
/**
 * 计算三次贝塞尔值
 * @memberOf module:zrender/core/curve
 * @param  {number} p0
 * @param  {number} p1
 * @param  {number} p2
 * @param  {number} p3
 * @param  {number} t
 * @return {number}
 */
function cubicAt(p0, p1, p2, p3, t) {
    var onet = 1 - t;
    return onet * onet * (onet * p0 + 3 * t * p1)
            + t * t * (t * p3 + 3 * onet * p2);
}

/**
 * 计算三次贝塞尔导数值
 * @memberOf module:zrender/core/curve
 * @param  {number} p0
 * @param  {number} p1
 * @param  {number} p2
 * @param  {number} p3
 * @param  {number} t
 * @return {number}
 */
function cubicDerivativeAt(p0, p1, p2, p3, t) {
    var onet = 1 - t;
    return 3 * (
        ((p1 - p0) * onet + 2 * (p2 - p1) * t) * onet
        + (p3 - p2) * t * t
    );
}

/**
 * 计算三次贝塞尔方程根，使用盛金公式
 * @memberOf module:zrender/core/curve
 * @param  {number} p0
 * @param  {number} p1
 * @param  {number} p2
 * @param  {number} p3
 * @param  {number} val
 * @param  {Array.<number>} roots
 * @return {number} 有效根数目
 */
function cubicRootAt(p0, p1, p2, p3, val, roots) {
    // Evaluate roots of cubic functions
    var a = p3 + 3 * (p1 - p2) - p0;
    var b = 3 * (p2 - p1 * 2 + p0);
    var c = 3 * (p1  - p0);
    var d = p0 - val;

    var A = b * b - 3 * a * c;
    var B = b * c - 9 * a * d;
    var C = c * c - 3 * b * d;

    var n = 0;

    if (isAroundZero(A) && isAroundZero(B)) {
        if (isAroundZero(b)) {
            roots[0] = 0;
        }
        else {
            var t1 = -c / b;  //t1, t2, t3, b is not zero
            if (t1 >= 0 && t1 <= 1) {
                roots[n++] = t1;
            }
        }
    }
    else {
        var disc = B * B - 4 * A * C;

        if (isAroundZero(disc)) {
            var K = B / A;
            var t1 = -b / a + K;  // t1, a is not zero
            var t2 = -K / 2;  // t2, t3
            if (t1 >= 0 && t1 <= 1) {
                roots[n++] = t1;
            }
            if (t2 >= 0 && t2 <= 1) {
                roots[n++] = t2;
            }
        }
        else if (disc > 0) {
            var discSqrt = mathSqrt(disc);
            var Y1 = A * b + 1.5 * a * (-B + discSqrt);
            var Y2 = A * b + 1.5 * a * (-B - discSqrt);
            if (Y1 < 0) {
                Y1 = -mathPow(-Y1, ONE_THIRD);
            }
            else {
                Y1 = mathPow(Y1, ONE_THIRD);
            }
            if (Y2 < 0) {
                Y2 = -mathPow(-Y2, ONE_THIRD);
            }
            else {
                Y2 = mathPow(Y2, ONE_THIRD);
            }
            var t1 = (-b - (Y1 + Y2)) / (3 * a);
            if (t1 >= 0 && t1 <= 1) {
                roots[n++] = t1;
            }
        }
        else {
            var T = (2 * A * b - 3 * a * B) / (2 * mathSqrt(A * A * A));
            var theta = Math.acos(T) / 3;
            var ASqrt = mathSqrt(A);
            var tmp = Math.cos(theta);

            var t1 = (-b - 2 * ASqrt * tmp) / (3 * a);
            var t2 = (-b + ASqrt * (tmp + THREE_SQRT * Math.sin(theta))) / (3 * a);
            var t3 = (-b + ASqrt * (tmp - THREE_SQRT * Math.sin(theta))) / (3 * a);
            if (t1 >= 0 && t1 <= 1) {
                roots[n++] = t1;
            }
            if (t2 >= 0 && t2 <= 1) {
                roots[n++] = t2;
            }
            if (t3 >= 0 && t3 <= 1) {
                roots[n++] = t3;
            }
        }
    }
    return n;
}

/**
 * 计算三次贝塞尔方程极限值的位置
 * @memberOf module:zrender/core/curve
 * @param  {number} p0
 * @param  {number} p1
 * @param  {number} p2
 * @param  {number} p3
 * @param  {Array.<number>} extrema
 * @return {number} 有效数目
 */
function cubicExtrema(p0, p1, p2, p3, extrema) {
    var b = 6 * p2 - 12 * p1 + 6 * p0;
    var a = 9 * p1 + 3 * p3 - 3 * p0 - 9 * p2;
    var c = 3 * p1 - 3 * p0;

    var n = 0;
    if (isAroundZero(a)) {
        if (isNotAroundZero(b)) {
            var t1 = -c / b;
            if (t1 >= 0 && t1 <=1) {
                extrema[n++] = t1;
            }
        }
    }
    else {
        var disc = b * b - 4 * a * c;
        if (isAroundZero(disc)) {
            extrema[0] = -b / (2 * a);
        }
        else if (disc > 0) {
            var discSqrt = mathSqrt(disc);
            var t1 = (-b + discSqrt) / (2 * a);
            var t2 = (-b - discSqrt) / (2 * a);
            if (t1 >= 0 && t1 <= 1) {
                extrema[n++] = t1;
            }
            if (t2 >= 0 && t2 <= 1) {
                extrema[n++] = t2;
            }
        }
    }
    return n;
}

/**
 * 细分三次贝塞尔曲线
 * @memberOf module:zrender/core/curve
 * @param  {number} p0
 * @param  {number} p1
 * @param  {number} p2
 * @param  {number} p3
 * @param  {number} t
 * @param  {Array.<number>} out
 */
function cubicSubdivide(p0, p1, p2, p3, t, out) {
    var p01 = (p1 - p0) * t + p0;
    var p12 = (p2 - p1) * t + p1;
    var p23 = (p3 - p2) * t + p2;

    var p012 = (p12 - p01) * t + p01;
    var p123 = (p23 - p12) * t + p12;

    var p0123 = (p123 - p012) * t + p012;
    // Seg0
    out[0] = p0;
    out[1] = p01;
    out[2] = p012;
    out[3] = p0123;
    // Seg1
    out[4] = p0123;
    out[5] = p123;
    out[6] = p23;
    out[7] = p3;
}

/**
 * 投射点到三次贝塞尔曲线上，返回投射距离。
 * 投射点有可能会有一个或者多个，这里只返回其中距离最短的一个。
 * @param {number} x0
 * @param {number} y0
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @param {number} x3
 * @param {number} y3
 * @param {number} x
 * @param {number} y
 * @param {Array.<number>} [out] 投射点
 * @return {number}
 */
function cubicProjectPoint(
    x0, y0, x1, y1, x2, y2, x3, y3,
    x, y, out
) {
    // http://pomax.github.io/bezierinfo/#projections
    var t;
    var interval = 0.005;
    var d = Infinity;
    var prev;
    var next;
    var d1;
    var d2;

    _v0[0] = x;
    _v0[1] = y;

    // 先粗略估计一下可能的最小距离的 t 值
    // PENDING
    for (var _t = 0; _t < 1; _t += 0.05) {
        _v1[0] = cubicAt(x0, x1, x2, x3, _t);
        _v1[1] = cubicAt(y0, y1, y2, y3, _t);
        d1 = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__vector__["d" /* distSquare */])(_v0, _v1);
        if (d1 < d) {
            t = _t;
            d = d1;
        }
    }
    d = Infinity;

    // At most 32 iteration
    for (var i = 0; i < 32; i++) {
        if (interval < EPSILON_NUMERIC) {
            break;
        }
        prev = t - interval;
        next = t + interval;
        // t - interval
        _v1[0] = cubicAt(x0, x1, x2, x3, prev);
        _v1[1] = cubicAt(y0, y1, y2, y3, prev);

        d1 = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__vector__["d" /* distSquare */])(_v1, _v0);

        if (prev >= 0 && d1 < d) {
            t = prev;
            d = d1;
        }
        else {
            // t + interval
            _v2[0] = cubicAt(x0, x1, x2, x3, next);
            _v2[1] = cubicAt(y0, y1, y2, y3, next);
            d2 = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__vector__["d" /* distSquare */])(_v2, _v0);

            if (next <= 1 && d2 < d) {
                t = next;
                d = d2;
            }
            else {
                interval *= 0.5;
            }
        }
    }
    // t
    if (out) {
        out[0] = cubicAt(x0, x1, x2, x3, t);
        out[1] = cubicAt(y0, y1, y2, y3, t);
    }
    // console.log(interval, i);
    return mathSqrt(d);
}

/**
 * 计算二次方贝塞尔值
 * @param  {number} p0
 * @param  {number} p1
 * @param  {number} p2
 * @param  {number} t
 * @return {number}
 */
function quadraticAt(p0, p1, p2, t) {
    var onet = 1 - t;
    return onet * (onet * p0 + 2 * t * p1) + t * t * p2;
}

/**
 * 计算二次方贝塞尔导数值
 * @param  {number} p0
 * @param  {number} p1
 * @param  {number} p2
 * @param  {number} t
 * @return {number}
 */
function quadraticDerivativeAt(p0, p1, p2, t) {
    return 2 * ((1 - t) * (p1 - p0) + t * (p2 - p1));
}

/**
 * 计算二次方贝塞尔方程根
 * @param  {number} p0
 * @param  {number} p1
 * @param  {number} p2
 * @param  {number} t
 * @param  {Array.<number>} roots
 * @return {number} 有效根数目
 */
function quadraticRootAt(p0, p1, p2, val, roots) {
    var a = p0 - 2 * p1 + p2;
    var b = 2 * (p1 - p0);
    var c = p0 - val;

    var n = 0;
    if (isAroundZero(a)) {
        if (isNotAroundZero(b)) {
            var t1 = -c / b;
            if (t1 >= 0 && t1 <= 1) {
                roots[n++] = t1;
            }
        }
    }
    else {
        var disc = b * b - 4 * a * c;
        if (isAroundZero(disc)) {
            var t1 = -b / (2 * a);
            if (t1 >= 0 && t1 <= 1) {
                roots[n++] = t1;
            }
        }
        else if (disc > 0) {
            var discSqrt = mathSqrt(disc);
            var t1 = (-b + discSqrt) / (2 * a);
            var t2 = (-b - discSqrt) / (2 * a);
            if (t1 >= 0 && t1 <= 1) {
                roots[n++] = t1;
            }
            if (t2 >= 0 && t2 <= 1) {
                roots[n++] = t2;
            }
        }
    }
    return n;
}

/**
 * 计算二次贝塞尔方程极限值
 * @memberOf module:zrender/core/curve
 * @param  {number} p0
 * @param  {number} p1
 * @param  {number} p2
 * @return {number}
 */
function quadraticExtremum(p0, p1, p2) {
    var divider = p0 + p2 - 2 * p1;
    if (divider === 0) {
        // p1 is center of p0 and p2
        return 0.5;
    }
    else {
        return (p0 - p1) / divider;
    }
}

/**
 * 细分二次贝塞尔曲线
 * @memberOf module:zrender/core/curve
 * @param  {number} p0
 * @param  {number} p1
 * @param  {number} p2
 * @param  {number} t
 * @param  {Array.<number>} out
 */
function quadraticSubdivide(p0, p1, p2, t, out) {
    var p01 = (p1 - p0) * t + p0;
    var p12 = (p2 - p1) * t + p1;
    var p012 = (p12 - p01) * t + p01;

    // Seg0
    out[0] = p0;
    out[1] = p01;
    out[2] = p012;

    // Seg1
    out[3] = p012;
    out[4] = p12;
    out[5] = p2;
}

/**
 * 投射点到二次贝塞尔曲线上，返回投射距离。
 * 投射点有可能会有一个或者多个，这里只返回其中距离最短的一个。
 * @param {number} x0
 * @param {number} y0
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @param {number} x
 * @param {number} y
 * @param {Array.<number>} out 投射点
 * @return {number}
 */
function quadraticProjectPoint(
    x0, y0, x1, y1, x2, y2,
    x, y, out
) {
    // http://pomax.github.io/bezierinfo/#projections
    var t;
    var interval = 0.005;
    var d = Infinity;

    _v0[0] = x;
    _v0[1] = y;

    // 先粗略估计一下可能的最小距离的 t 值
    // PENDING
    for (var _t = 0; _t < 1; _t += 0.05) {
        _v1[0] = quadraticAt(x0, x1, x2, _t);
        _v1[1] = quadraticAt(y0, y1, y2, _t);
        var d1 = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__vector__["d" /* distSquare */])(_v0, _v1);
        if (d1 < d) {
            t = _t;
            d = d1;
        }
    }
    d = Infinity;

    // At most 32 iteration
    for (var i = 0; i < 32; i++) {
        if (interval < EPSILON_NUMERIC) {
            break;
        }
        var prev = t - interval;
        var next = t + interval;
        // t - interval
        _v1[0] = quadraticAt(x0, x1, x2, prev);
        _v1[1] = quadraticAt(y0, y1, y2, prev);

        var d1 = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__vector__["d" /* distSquare */])(_v1, _v0);

        if (prev >= 0 && d1 < d) {
            t = prev;
            d = d1;
        }
        else {
            // t + interval
            _v2[0] = quadraticAt(x0, x1, x2, next);
            _v2[1] = quadraticAt(y0, y1, y2, next);
            var d2 = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__vector__["d" /* distSquare */])(_v2, _v0);
            if (next <= 1 && d2 < d) {
                t = next;
                d = d2;
            }
            else {
                interval *= 0.5;
            }
        }
    }
    // t
    if (out) {
        out[0] = quadraticAt(x0, x1, x2, t);
        out[1] = quadraticAt(y0, y1, y2, t);
    }
    // console.log(interval, i);
    return mathSqrt(d);
}


/***/ }),

/***/ 83:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _RadialGradient = __webpack_require__(368);

var _RadialGradient2 = _interopRequireDefault(_RadialGradient);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Config = function Config() {
    _classCallCheck(this, Config);
};

Config.animationDefaultDuring = 3000;
Config.animationEasing = 'linear';
Config.pointAnimateDuring = 3000;
Config.wsServer = 'ws://localhost:9000';
Config.gradient = new _RadialGradient2.default(0.5, 0.5, 0.5, [{
    offset: 0,
    color: 'rgba(255, 255, 0, 0)'
}, {
    offset: 0.65,
    color: 'rgba(255, 255, 0, 0)'
}, {
    offset: 0.65,
    color: 'rgba(255, 255, 0, 0)'
}, {
    offset: 1,
    color: 'rgba(255, 255, 0, 1)'
}]);
exports.default = Config;

/***/ }),

/***/ 871:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__core_util__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_vector__ = __webpack_require__(50);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__mixin_Draggable__ = __webpack_require__(895);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__mixin_Eventful__ = __webpack_require__(147);
/**
 * Handler
 * @module zrender/Handler
 * @author Kener (@Kener-林峰, kener.linfeng@gmail.com)
 *         errorrik (errorrik@gmail.com)
 *         pissang (shenyi.914@gmail.com)
 */






var SILENT = 'silent';

function makeEventPacket(eveType, targetInfo, event) {
    return {
        type: eveType,
        event: event,
        // target can only be an element that is not silent.
        target: targetInfo.target,
        // topTarget can be a silent element.
        topTarget: targetInfo.topTarget,
        cancelBubble: false,
        offsetX: event.zrX,
        offsetY: event.zrY,
        gestureEvent: event.gestureEvent,
        pinchX: event.pinchX,
        pinchY: event.pinchY,
        pinchScale: event.pinchScale,
        wheelDelta: event.zrDelta,
        zrByTouch: event.zrByTouch,
        which: event.which
    };
}

function EmptyProxy () {}
EmptyProxy.prototype.dispose = function () {};

var handlerNames = [
    'click', 'dblclick', 'mousewheel', 'mouseout',
    'mouseup', 'mousedown', 'mousemove', 'contextmenu'
];
/**
 * @alias module:zrender/Handler
 * @constructor
 * @extends module:zrender/mixin/Eventful
 * @param {module:zrender/Storage} storage Storage instance.
 * @param {module:zrender/Painter} painter Painter instance.
 * @param {module:zrender/dom/HandlerProxy} proxy HandlerProxy instance.
 * @param {HTMLElement} painterRoot painter.root (not painter.getViewportRoot()).
 */
var Handler = function(storage, painter, proxy, painterRoot) {
    __WEBPACK_IMPORTED_MODULE_3__mixin_Eventful__["a" /* default */].call(this);

    this.storage = storage;

    this.painter = painter;

    this.painterRoot = painterRoot;

    proxy = proxy || new EmptyProxy();

    /**
     * Proxy of event. can be Dom, WebGLSurface, etc.
     */
    this.proxy = proxy;

    // Attach handler
    proxy.handler = this;

    /**
     * {target, topTarget, x, y}
     * @private
     * @type {Object}
     */
    this._hovered = {};

    /**
     * @private
     * @type {Date}
     */
    this._lastTouchMoment;

    /**
     * @private
     * @type {number}
     */
    this._lastX;

    /**
     * @private
     * @type {number}
     */
    this._lastY;


    __WEBPACK_IMPORTED_MODULE_2__mixin_Draggable__["a" /* default */].call(this);

    __WEBPACK_IMPORTED_MODULE_0__core_util__["f" /* each */](handlerNames, function (name) {
        proxy.on && proxy.on(name, this[name], this);
    }, this);
};

Handler.prototype = {

    constructor: Handler,

    mousemove: function (event) {
        var x = event.zrX;
        var y = event.zrY;

        var lastHovered = this._hovered;
        var lastHoveredTarget = lastHovered.target;

        // If lastHoveredTarget is removed from zr (detected by '__zr') by some API call
        // (like 'setOption' or 'dispatchAction') in event handlers, we should find
        // lastHovered again here. Otherwise 'mouseout' can not be triggered normally.
        // See #6198.
        if (lastHoveredTarget && !lastHoveredTarget.__zr) {
            lastHovered = this.findHover(lastHovered.x, lastHovered.y);
            lastHoveredTarget = lastHovered.target;
        }

        var hovered = this._hovered = this.findHover(x, y);
        var hoveredTarget = hovered.target;

        var proxy = this.proxy;
        proxy.setCursor && proxy.setCursor(hoveredTarget ? hoveredTarget.cursor : 'default');

        // Mouse out on previous hovered element
        if (lastHoveredTarget && hoveredTarget !== lastHoveredTarget) {
            this.dispatchToElement(lastHovered, 'mouseout', event);
        }

        // Mouse moving on one element
        this.dispatchToElement(hovered, 'mousemove', event);

        // Mouse over on a new element
        if (hoveredTarget && hoveredTarget !== lastHoveredTarget) {
            this.dispatchToElement(hovered, 'mouseover', event);
        }
    },

    mouseout: function (event) {
        this.dispatchToElement(this._hovered, 'mouseout', event);

        // There might be some doms created by upper layer application
        // at the same level of painter.getViewportRoot() (e.g., tooltip
        // dom created by echarts), where 'globalout' event should not
        // be triggered when mouse enters these doms. (But 'mouseout'
        // should be triggered at the original hovered element as usual).
        var element = event.toElement || event.relatedTarget;
        var innerDom;
        do {
            element = element && element.parentNode;
        }
        while (element && element.nodeType != 9 && !(
            innerDom = element === this.painterRoot
        ));

        !innerDom && this.trigger('globalout', {event: event});
    },

    /**
     * Resize
     */
    resize: function (event) {
        this._hovered = {};
    },

    /**
     * Dispatch event
     * @param {string} eventName
     * @param {event=} eventArgs
     */
    dispatch: function (eventName, eventArgs) {
        var handler = this[eventName];
        handler && handler.call(this, eventArgs);
    },

    /**
     * Dispose
     */
    dispose: function () {

        this.proxy.dispose();

        this.storage =
        this.proxy =
        this.painter = null;
    },

    /**
     * 设置默认的cursor style
     * @param {string} [cursorStyle='default'] 例如 crosshair
     */
    setCursorStyle: function (cursorStyle) {
        var proxy = this.proxy;
        proxy.setCursor && proxy.setCursor(cursorStyle);
    },

    /**
     * 事件分发代理
     *
     * @private
     * @param {Object} targetInfo {target, topTarget} 目标图形元素
     * @param {string} eventName 事件名称
     * @param {Object} event 事件对象
     */
    dispatchToElement: function (targetInfo, eventName, event) {
        targetInfo = targetInfo || {};
        var el = targetInfo.target;
        if (el && el.silent) {
            return;
        }
        var eventHandler = 'on' + eventName;
        var eventPacket = makeEventPacket(eventName, targetInfo, event);

        while (el) {
            el[eventHandler]
                && (eventPacket.cancelBubble = el[eventHandler].call(el, eventPacket));

            el.trigger(eventName, eventPacket);

            el = el.parent;

            if (eventPacket.cancelBubble) {
                break;
            }
        }

        if (!eventPacket.cancelBubble) {
            // 冒泡到顶级 zrender 对象
            this.trigger(eventName, eventPacket);
            // 分发事件到用户自定义层
            // 用户有可能在全局 click 事件中 dispose，所以需要判断下 painter 是否存在
            this.painter && this.painter.eachOtherLayer(function (layer) {
                if (typeof(layer[eventHandler]) == 'function') {
                    layer[eventHandler].call(layer, eventPacket);
                }
                if (layer.trigger) {
                    layer.trigger(eventName, eventPacket);
                }
            });
        }
    },

    /**
     * @private
     * @param {number} x
     * @param {number} y
     * @param {module:zrender/graphic/Displayable} exclude
     * @return {model:zrender/Element}
     * @method
     */
    findHover: function(x, y, exclude) {
        var list = this.storage.getDisplayList();
        var out = {x: x, y: y};

        for (var i = list.length - 1; i >= 0 ; i--) {
            var hoverCheckResult;
            if (list[i] !== exclude
                // getDisplayList may include ignored item in VML mode
                && !list[i].ignore
                && (hoverCheckResult = isHover(list[i], x, y))
            ) {
                !out.topTarget && (out.topTarget = list[i]);
                if (hoverCheckResult !== SILENT) {
                    out.target = list[i];
                    break;
                }
            }
        }

        return out;
    }
};

// Common handlers
__WEBPACK_IMPORTED_MODULE_0__core_util__["f" /* each */](['click', 'mousedown', 'mouseup', 'mousewheel', 'dblclick', 'contextmenu'], function (name) {
    Handler.prototype[name] = function (event) {
        // Find hover again to avoid click event is dispatched manually. Or click is triggered without mouseover
        var hovered = this.findHover(event.zrX, event.zrY);
        var hoveredTarget = hovered.target;

        if (name === 'mousedown') {
            this._downEl = hoveredTarget;
            this._downPoint = [event.zrX, event.zrY];
            // In case click triggered before mouseup
            this._upEl = hoveredTarget;
        }
        else if (name === 'mosueup') {
            this._upEl = hoveredTarget;
        }
        else if (name === 'click') {
            if (this._downEl !== this._upEl
                // Original click event is triggered on the whole canvas element,
                // including the case that `mousedown` - `mousemove` - `mouseup`,
                // which should be filtered, otherwise it will bring trouble to
                // pan and zoom.
                || !this._downPoint
                // Arbitrary value
                || __WEBPACK_IMPORTED_MODULE_1__core_vector__["a" /* dist */](this._downPoint, [event.zrX, event.zrY]) > 4
            ) {
                return;
            }
            this._downPoint = null;
        }

        this.dispatchToElement(hovered, name, event);
    };
});

function isHover(displayable, x, y) {
    if (displayable[displayable.rectHover ? 'rectContain' : 'contain'](x, y)) {
        var el = displayable;
        var isSilent;
        while (el) {
            // If clipped by ancestor.
            // FIXME: If clipPath has neither stroke nor fill,
            // el.clipPath.contain(x, y) will always return false.
            if (el.clipPath && !el.clipPath.contain(x, y))  {
                return false;
            }
            if (el.silent) {
                isSilent = true;
            }
            el = el.parent;
        }
        return isSilent ? SILENT : true;
    }

    return false;
}

__WEBPACK_IMPORTED_MODULE_0__core_util__["d" /* mixin */](Handler, __WEBPACK_IMPORTED_MODULE_3__mixin_Eventful__["a" /* default */]);
__WEBPACK_IMPORTED_MODULE_0__core_util__["d" /* mixin */](Handler, __WEBPACK_IMPORTED_MODULE_2__mixin_Draggable__["a" /* default */]);

/* harmony default export */ __webpack_exports__["a"] = (Handler);

/***/ }),

/***/ 872:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__core_util__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__config__ = __webpack_require__(144);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__graphic_Style__ = __webpack_require__(369);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__graphic_Pattern__ = __webpack_require__(367);
/**
 * @module zrender/Layer
 * @author pissang(https://www.github.com/pissang)
 */






function returnFalse() {
    return false;
}

/**
 * 创建dom
 *
 * @inner
 * @param {string} id dom id 待用
 * @param {Painter} painter painter instance
 * @param {number} number
 */
function createDom(id, painter, dpr) {
    var newDom = __WEBPACK_IMPORTED_MODULE_0__core_util__["q" /* createCanvas */]();
    var width = painter.getWidth();
    var height = painter.getHeight();

    var newDomStyle = newDom.style;
    // 没append呢，请原谅我这样写，清晰~
    newDomStyle.position = 'absolute';
    newDomStyle.left = 0;
    newDomStyle.top = 0;
    newDomStyle.width = width + 'px';
    newDomStyle.height = height + 'px';
    newDom.width = width * dpr;
    newDom.height = height * dpr;

    // id不作为索引用，避免可能造成的重名，定义为私有属性
    newDom.setAttribute('data-zr-dom-id', id);
    return newDom;
}

/**
 * @alias module:zrender/Layer
 * @constructor
 * @extends module:zrender/mixin/Transformable
 * @param {string} id
 * @param {module:zrender/Painter} painter
 * @param {number} [dpr]
 */
var Layer = function(id, painter, dpr) {
    var dom;
    dpr = dpr || __WEBPACK_IMPORTED_MODULE_1__config__["b" /* devicePixelRatio */];
    if (typeof id === 'string') {
        dom = createDom(id, painter, dpr);
    }
    // Not using isDom because in node it will return false
    else if (__WEBPACK_IMPORTED_MODULE_0__core_util__["h" /* isObject */](id)) {
        dom = id;
        id = dom.id;
    }
    this.id = id;
    this.dom = dom;

    var domStyle = dom.style;
    if (domStyle) { // Not in node
        dom.onselectstart = returnFalse; // 避免页面选中的尴尬
        domStyle['-webkit-user-select'] = 'none';
        domStyle['user-select'] = 'none';
        domStyle['-webkit-touch-callout'] = 'none';
        domStyle['-webkit-tap-highlight-color'] = 'rgba(0,0,0,0)';
        domStyle['padding'] = 0;
        domStyle['margin'] = 0;
        domStyle['border-width'] = 0;
    }

    this.domBack = null;
    this.ctxBack = null;

    this.painter = painter;

    this.config = null;

    // Configs
    /**
     * 每次清空画布的颜色
     * @type {string}
     * @default 0
     */
    this.clearColor = 0;
    /**
     * 是否开启动态模糊
     * @type {boolean}
     * @default false
     */
    this.motionBlur = false;
    /**
     * 在开启动态模糊的时候使用，与上一帧混合的alpha值，值越大尾迹越明显
     * @type {number}
     * @default 0.7
     */
    this.lastFrameAlpha = 0.7;

    /**
     * Layer dpr
     * @type {number}
     */
    this.dpr = dpr;
};

Layer.prototype = {

    constructor: Layer,

    elCount: 0,

    __dirty: true,

    initContext: function () {
        this.ctx = this.dom.getContext('2d');
        this.ctx.__currentValues = {};
        this.ctx.dpr = this.dpr;
    },

    createBackBuffer: function () {
        var dpr = this.dpr;

        this.domBack = createDom('back-' + this.id, this.painter, dpr);
        this.ctxBack = this.domBack.getContext('2d');
        this.ctxBack.__currentValues = {};

        if (dpr != 1) {
            this.ctxBack.scale(dpr, dpr);
        }
    },

    /**
     * @param  {number} width
     * @param  {number} height
     */
    resize: function (width, height) {
        var dpr = this.dpr;

        var dom = this.dom;
        var domStyle = dom.style;
        var domBack = this.domBack;

        domStyle.width = width + 'px';
        domStyle.height = height + 'px';

        dom.width = width * dpr;
        dom.height = height * dpr;

        if (domBack) {
            domBack.width = width * dpr;
            domBack.height = height * dpr;

            if (dpr != 1) {
                this.ctxBack.scale(dpr, dpr);
            }
        }
    },

    /**
     * 清空该层画布
     * @param {boolean} clearAll Clear all with out motion blur
     */
    clear: function (clearAll) {
        var dom = this.dom;
        var ctx = this.ctx;
        var width = dom.width;
        var height = dom.height;

        var clearColor = this.clearColor;
        var haveMotionBLur = this.motionBlur && !clearAll;
        var lastFrameAlpha = this.lastFrameAlpha;

        var dpr = this.dpr;

        if (haveMotionBLur) {
            if (!this.domBack) {
                this.createBackBuffer();
            }

            this.ctxBack.globalCompositeOperation = 'copy';
            this.ctxBack.drawImage(
                dom, 0, 0,
                width / dpr,
                height / dpr
            );
        }

        ctx.clearRect(0, 0, width, height);
        if (clearColor) {
            var clearColorGradientOrPattern;
            // Gradient
            if (clearColor.colorStops) {
                // Cache canvas gradient
                clearColorGradientOrPattern = clearColor.__canvasGradient || __WEBPACK_IMPORTED_MODULE_2__graphic_Style__["a" /* default */].getGradient(ctx, clearColor, {
                    x: 0,
                    y: 0,
                    width: width,
                    height: height
                });

                clearColor.__canvasGradient = clearColorGradientOrPattern;
            }
            // Pattern
            else if (clearColor.image) {
                clearColorGradientOrPattern = __WEBPACK_IMPORTED_MODULE_3__graphic_Pattern__["a" /* default */].prototype.getCanvasPattern.call(clearColor, ctx);
            }
            ctx.save();
            ctx.fillStyle = clearColorGradientOrPattern || clearColor;
            ctx.fillRect(0, 0, width, height);
            ctx.restore();
        }

        if (haveMotionBLur) {
            var domBack = this.domBack;
            ctx.save();
            ctx.globalAlpha = lastFrameAlpha;
            ctx.drawImage(domBack, 0, 0, width, height);
            ctx.restore();
        }
    }
};

/* harmony default export */ __webpack_exports__["a"] = (Layer);

/***/ }),

/***/ 873:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__config__ = __webpack_require__(144);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_util__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__core_log__ = __webpack_require__(363);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__core_BoundingRect__ = __webpack_require__(81);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__core_timsort__ = __webpack_require__(365);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__Layer__ = __webpack_require__(872);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__animation_requestAnimationFrame__ = __webpack_require__(359);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__graphic_Image__ = __webpack_require__(889);
/**
 * Default canvas painter
 * @module zrender/Painter
 * @author Kener (@Kener-林峰, kener.linfeng@gmail.com)
 *         errorrik (errorrik@gmail.com)
 *         pissang (https://www.github.com/pissang)
 */










// PENDIGN
// Layer exceeds MAX_PROGRESSIVE_LAYER_NUMBER may have some problem when flush directly second time.
//
// Maximum progressive layer. When exceeding this number. All elements will be drawed in the last layer.
var MAX_PROGRESSIVE_LAYER_NUMBER = 5;

function parseInt10(val) {
    return parseInt(val, 10);
}

function isLayerValid(layer) {
    if (!layer) {
        return false;
    }

    if (layer.__builtin__) {
        return true;
    }

    if (typeof(layer.resize) !== 'function'
        || typeof(layer.refresh) !== 'function'
    ) {
        return false;
    }

    return true;
}

function preProcessLayer(layer) {
    layer.__unusedCount++;
}

function postProcessLayer(layer) {
    if (layer.__unusedCount == 1) {
        layer.clear();
    }
}

var tmpRect = new __WEBPACK_IMPORTED_MODULE_3__core_BoundingRect__["a" /* default */](0, 0, 0, 0);
var viewRect = new __WEBPACK_IMPORTED_MODULE_3__core_BoundingRect__["a" /* default */](0, 0, 0, 0);
function isDisplayableCulled(el, width, height) {
    tmpRect.copy(el.getBoundingRect());
    if (el.transform) {
        tmpRect.applyTransform(el.transform);
    }
    viewRect.width = width;
    viewRect.height = height;
    return !tmpRect.intersect(viewRect);
}

function isClipPathChanged(clipPaths, prevClipPaths) {
    if (clipPaths == prevClipPaths) { // Can both be null or undefined
        return false;
    }

    if (!clipPaths || !prevClipPaths || (clipPaths.length !== prevClipPaths.length)) {
        return true;
    }
    for (var i = 0; i < clipPaths.length; i++) {
        if (clipPaths[i] !== prevClipPaths[i]) {
            return true;
        }
    }
}

function doClip(clipPaths, ctx) {
    for (var i = 0; i < clipPaths.length; i++) {
        var clipPath = clipPaths[i];

        clipPath.setTransform(ctx);
        ctx.beginPath();
        clipPath.buildPath(ctx, clipPath.shape);
        ctx.clip();
        // Transform back
        clipPath.restoreTransform(ctx);
    }
}

function createRoot(width, height) {
    var domRoot = document.createElement('div');

    // domRoot.onselectstart = returnFalse; // 避免页面选中的尴尬
    domRoot.style.cssText = [
        'position:relative',
        'overflow:hidden',
        'width:' + width + 'px',
        'height:' + height + 'px',
        'padding:0',
        'margin:0',
        'border-width:0'
    ].join(';') + ';';

    return domRoot;
}

/**
 * @alias module:zrender/Painter
 * @constructor
 * @param {HTMLElement} root 绘图容器
 * @param {module:zrender/Storage} storage
 * @param {Object} opts
 */
var Painter = function (root, storage, opts) {

    this.type = 'canvas';

    // In node environment using node-canvas
    var singleCanvas = !root.nodeName // In node ?
        || root.nodeName.toUpperCase() === 'CANVAS';

    this._opts = opts = __WEBPACK_IMPORTED_MODULE_1__core_util__["k" /* extend */]({}, opts || {});

    /**
     * @type {number}
     */
    this.dpr = opts.devicePixelRatio || __WEBPACK_IMPORTED_MODULE_0__config__["b" /* devicePixelRatio */];
    /**
     * @type {boolean}
     * @private
     */
    this._singleCanvas = singleCanvas;
    /**
     * 绘图容器
     * @type {HTMLElement}
     */
    this.root = root;

    var rootStyle = root.style;

    if (rootStyle) {
        rootStyle['-webkit-tap-highlight-color'] = 'transparent';
        rootStyle['-webkit-user-select'] =
        rootStyle['user-select'] =
        rootStyle['-webkit-touch-callout'] = 'none';

        root.innerHTML = '';
    }

    /**
     * @type {module:zrender/Storage}
     */
    this.storage = storage;

    /**
     * @type {Array.<number>}
     * @private
     */
    var zlevelList = this._zlevelList = [];

    /**
     * @type {Object.<string, module:zrender/Layer>}
     * @private
     */
    var layers = this._layers = {};

    /**
     * @type {Object.<string, Object>}
     * @type {private}
     */
    this._layerConfig = {};

    if (!singleCanvas) {
        this._width = this._getSize(0);
        this._height = this._getSize(1);

        var domRoot = this._domRoot = createRoot(
            this._width, this._height
        );
        root.appendChild(domRoot);
    }
    else {
        if (opts.width != null) {
            root.width = opts.width;
        }
        if (opts.height != null) {
            root.height = opts.height;
        }
        // Use canvas width and height directly
        var width = root.width;
        var height = root.height;
        this._width = width;
        this._height = height;

        // Create layer if only one given canvas
        // Device pixel ratio is fixed to 1 because given canvas has its specified width and height
        var mainLayer = new __WEBPACK_IMPORTED_MODULE_5__Layer__["a" /* default */](root, this, 1);
        mainLayer.initContext();
        // FIXME Use canvas width and height
        // mainLayer.resize(width, height);
        layers[0] = mainLayer;
        zlevelList.push(0);

        this._domRoot = root;
    }

    // Layers for progressive rendering
    this._progressiveLayers = [];

    /**
     * @type {module:zrender/Layer}
     * @private
     */
    this._hoverlayer;

    this._hoverElements = [];
};

Painter.prototype = {

    constructor: Painter,

    getType: function () {
        return 'canvas';
    },

    /**
     * If painter use a single canvas
     * @return {boolean}
     */
    isSingleCanvas: function () {
        return this._singleCanvas;
    },
    /**
     * @return {HTMLDivElement}
     */
    getViewportRoot: function () {
        return this._domRoot;
    },

    getViewportRootOffset: function () {
        var viewportRoot = this.getViewportRoot();
        if (viewportRoot) {
            return {
                offsetLeft: viewportRoot.offsetLeft || 0,
                offsetTop: viewportRoot.offsetTop || 0
            };
        }
    },

    /**
     * 刷新
     * @param {boolean} [paintAll=false] 强制绘制所有displayable
     */
    refresh: function (paintAll) {

        var list = this.storage.getDisplayList(true);

        var zlevelList = this._zlevelList;

        this._paintList(list, paintAll);

        // Paint custum layers
        for (var i = 0; i < zlevelList.length; i++) {
            var z = zlevelList[i];
            var layer = this._layers[z];
            if (!layer.__builtin__ && layer.refresh) {
                layer.refresh();
            }
        }

        this.refreshHover();

        if (this._progressiveLayers.length) {
            this._startProgessive();
        }

        return this;
    },

    addHover: function (el, hoverStyle) {
        if (el.__hoverMir) {
            return;
        }
        var elMirror = new el.constructor({
            style: el.style,
            shape: el.shape
        });
        elMirror.__from = el;
        el.__hoverMir = elMirror;
        elMirror.setStyle(hoverStyle);
        this._hoverElements.push(elMirror);
    },

    removeHover: function (el) {
        var elMirror = el.__hoverMir;
        var hoverElements = this._hoverElements;
        var idx = __WEBPACK_IMPORTED_MODULE_1__core_util__["c" /* indexOf */](hoverElements, elMirror);
        if (idx >= 0) {
            hoverElements.splice(idx, 1);
        }
        el.__hoverMir = null;
    },

    clearHover: function (el) {
        var hoverElements = this._hoverElements;
        for (var i = 0; i < hoverElements.length; i++) {
            var from = hoverElements[i].__from;
            if (from) {
                from.__hoverMir = null;
            }
        }
        hoverElements.length = 0;
    },

    refreshHover: function () {
        var hoverElements = this._hoverElements;
        var len = hoverElements.length;
        var hoverLayer = this._hoverlayer;
        hoverLayer && hoverLayer.clear();

        if (!len) {
            return;
        }
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__core_timsort__["a" /* default */])(hoverElements, this.storage.displayableSortFunc);

        // Use a extream large zlevel
        // FIXME?
        if (!hoverLayer) {
            hoverLayer = this._hoverlayer = this.getLayer(1e5);
        }

        var scope = {};
        hoverLayer.ctx.save();
        for (var i = 0; i < len;) {
            var el = hoverElements[i];
            var originalEl = el.__from;
            // Original el is removed
            // PENDING
            if (!(originalEl && originalEl.__zr)) {
                hoverElements.splice(i, 1);
                originalEl.__hoverMir = null;
                len--;
                continue;
            }
            i++;

            // Use transform
            // FIXME style and shape ?
            if (!originalEl.invisible) {
                el.transform = originalEl.transform;
                el.invTransform = originalEl.invTransform;
                el.__clipPaths = originalEl.__clipPaths;
                // el.
                this._doPaintEl(el, hoverLayer, true, scope);
            }
        }
        hoverLayer.ctx.restore();
    },

    _startProgessive: function () {
        var self = this;

        if (!self._furtherProgressive) {
            return;
        }

        // Use a token to stop progress steps triggered by
        // previous zr.refresh calling.
        var token = self._progressiveToken = +new Date();

        self._progress++;
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__animation_requestAnimationFrame__["a" /* default */])(step);

        function step() {
            // In case refreshed or disposed
            if (token === self._progressiveToken && self.storage) {

                self._doPaintList(self.storage.getDisplayList());

                if (self._furtherProgressive) {
                    self._progress++;
                    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__animation_requestAnimationFrame__["a" /* default */])(step);
                }
                else {
                    self._progressiveToken = -1;
                }
            }
        }
    },

    _clearProgressive: function () {
        this._progressiveToken = -1;
        this._progress = 0;
        __WEBPACK_IMPORTED_MODULE_1__core_util__["f" /* each */](this._progressiveLayers, function (layer) {
            layer.__dirty && layer.clear();
        });
    },

    _paintList: function (list, paintAll) {

        if (paintAll == null) {
            paintAll = false;
        }

        this._updateLayerStatus(list);

        this._clearProgressive();

        this.eachBuiltinLayer(preProcessLayer);

        this._doPaintList(list, paintAll);

        this.eachBuiltinLayer(postProcessLayer);
    },

    _doPaintList: function (list, paintAll) {
        var currentLayer;
        var currentZLevel;
        var ctx;

        // var invTransform = [];
        var scope;

        var progressiveLayerIdx = 0;
        var currentProgressiveLayer;

        var width = this._width;
        var height = this._height;
        var layerProgress;
        var frame = this._progress;
        function flushProgressiveLayer(layer) {
            var dpr = ctx.dpr || 1;
            ctx.save();
            ctx.globalAlpha = 1;
            ctx.shadowBlur = 0;
            // Avoid layer don't clear in next progressive frame
            currentLayer.__dirty = true;
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.drawImage(layer.dom, 0, 0, width * dpr, height * dpr);
            ctx.restore();
        }

        for (var i = 0, l = list.length; i < l; i++) {
            var el = list[i];
            var elZLevel = this._singleCanvas ? 0 : el.zlevel;

            var elFrame = el.__frame;

            // Flush at current context
            // PENDING
            if (elFrame < 0 && currentProgressiveLayer) {
                flushProgressiveLayer(currentProgressiveLayer);
                currentProgressiveLayer = null;
            }

            // Change draw layer
            if (currentZLevel !== elZLevel) {
                if (ctx) {
                    ctx.restore();
                }

                // Reset scope
                scope = {};

                // Only 0 zlevel if only has one canvas
                currentZLevel = elZLevel;
                currentLayer = this.getLayer(currentZLevel);

                if (!currentLayer.__builtin__) {
                    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__core_log__["a" /* default */])(
                        'ZLevel ' + currentZLevel
                        + ' has been used by unkown layer ' + currentLayer.id
                    );
                }

                ctx = currentLayer.ctx;
                ctx.save();

                // Reset the count
                currentLayer.__unusedCount = 0;

                if (currentLayer.__dirty || paintAll) {
                    currentLayer.clear();
                }
            }

            if (!(currentLayer.__dirty || paintAll)) {
                continue;
            }

            if (elFrame >= 0) {
                // Progressive layer changed
                if (!currentProgressiveLayer) {
                    currentProgressiveLayer = this._progressiveLayers[
                        Math.min(progressiveLayerIdx++, MAX_PROGRESSIVE_LAYER_NUMBER - 1)
                    ];

                    currentProgressiveLayer.ctx.save();
                    currentProgressiveLayer.renderScope = {};

                    if (currentProgressiveLayer
                        && (currentProgressiveLayer.__progress > currentProgressiveLayer.__maxProgress)
                    ) {
                        // flushProgressiveLayer(currentProgressiveLayer);
                        // Quick jump all progressive elements
                        // All progressive element are not dirty, jump over and flush directly
                        i = currentProgressiveLayer.__nextIdxNotProg - 1;
                        // currentProgressiveLayer = null;
                        continue;
                    }

                    layerProgress = currentProgressiveLayer.__progress;

                    if (!currentProgressiveLayer.__dirty) {
                        // Keep rendering
                        frame = layerProgress;
                    }

                    currentProgressiveLayer.__progress = frame + 1;
                }

                if (elFrame === frame) {
                    this._doPaintEl(el, currentProgressiveLayer, true, currentProgressiveLayer.renderScope);
                }
            }
            else {
                this._doPaintEl(el, currentLayer, paintAll, scope);
            }

            el.__dirty = false;
        }

        if (currentProgressiveLayer) {
            flushProgressiveLayer(currentProgressiveLayer);
        }

        // Restore the lastLayer ctx
        ctx && ctx.restore();
        // If still has clipping state
        // if (scope.prevElClipPaths) {
        //     ctx.restore();
        // }

        this._furtherProgressive = false;
        __WEBPACK_IMPORTED_MODULE_1__core_util__["f" /* each */](this._progressiveLayers, function (layer) {
            if (layer.__maxProgress >= layer.__progress) {
                this._furtherProgressive = true;
            }
        }, this);
    },

    _doPaintEl: function (el, currentLayer, forcePaint, scope) {
        var ctx = currentLayer.ctx;
        var m = el.transform;
        if (
            (currentLayer.__dirty || forcePaint)
            // Ignore invisible element
            && !el.invisible
            // Ignore transparent element
            && el.style.opacity !== 0
            // Ignore scale 0 element, in some environment like node-canvas
            // Draw a scale 0 element can cause all following draw wrong
            // And setTransform with scale 0 will cause set back transform failed.
            && !(m && !m[0] && !m[3])
            // Ignore culled element
            && !(el.culling && isDisplayableCulled(el, this._width, this._height))
        ) {

            var clipPaths = el.__clipPaths;

            // Optimize when clipping on group with several elements
            if (scope.prevClipLayer !== currentLayer
                || isClipPathChanged(clipPaths, scope.prevElClipPaths)
            ) {
                // If has previous clipping state, restore from it
                if (scope.prevElClipPaths) {
                    scope.prevClipLayer.ctx.restore();
                    scope.prevClipLayer = scope.prevElClipPaths = null;

                    // Reset prevEl since context has been restored
                    scope.prevEl = null;
                }
                // New clipping state
                if (clipPaths) {
                    ctx.save();
                    doClip(clipPaths, ctx);
                    scope.prevClipLayer = currentLayer;
                    scope.prevElClipPaths = clipPaths;
                }
            }
            el.beforeBrush && el.beforeBrush(ctx);

            el.brush(ctx, scope.prevEl || null);
            scope.prevEl = el;

            el.afterBrush && el.afterBrush(ctx);
        }
    },

    /**
     * 获取 zlevel 所在层，如果不存在则会创建一个新的层
     * @param {number} zlevel
     * @return {module:zrender/Layer}
     */
    getLayer: function (zlevel) {
        if (this._singleCanvas) {
            return this._layers[0];
        }

        var layer = this._layers[zlevel];
        if (!layer) {
            // Create a new layer
            layer = new __WEBPACK_IMPORTED_MODULE_5__Layer__["a" /* default */]('zr_' + zlevel, this, this.dpr);
            layer.__builtin__ = true;

            if (this._layerConfig[zlevel]) {
                __WEBPACK_IMPORTED_MODULE_1__core_util__["l" /* merge */](layer, this._layerConfig[zlevel], true);
            }

            this.insertLayer(zlevel, layer);

            // Context is created after dom inserted to document
            // Or excanvas will get 0px clientWidth and clientHeight
            layer.initContext();
        }

        return layer;
    },

    insertLayer: function (zlevel, layer) {

        var layersMap = this._layers;
        var zlevelList = this._zlevelList;
        var len = zlevelList.length;
        var prevLayer = null;
        var i = -1;
        var domRoot = this._domRoot;

        if (layersMap[zlevel]) {
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__core_log__["a" /* default */])('ZLevel ' + zlevel + ' has been used already');
            return;
        }
        // Check if is a valid layer
        if (!isLayerValid(layer)) {
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__core_log__["a" /* default */])('Layer of zlevel ' + zlevel + ' is not valid');
            return;
        }

        if (len > 0 && zlevel > zlevelList[0]) {
            for (i = 0; i < len - 1; i++) {
                if (
                    zlevelList[i] < zlevel
                    && zlevelList[i + 1] > zlevel
                ) {
                    break;
                }
            }
            prevLayer = layersMap[zlevelList[i]];
        }
        zlevelList.splice(i + 1, 0, zlevel);

        layersMap[zlevel] = layer;

        // Vitual layer will not directly show on the screen.
        // (It can be a WebGL layer and assigned to a ZImage element)
        // But it still under management of zrender.
        if (!layer.virtual) {
            if (prevLayer) {
                var prevDom = prevLayer.dom;
                if (prevDom.nextSibling) {
                    domRoot.insertBefore(
                        layer.dom,
                        prevDom.nextSibling
                    );
                }
                else {
                    domRoot.appendChild(layer.dom);
                }
            }
            else {
                if (domRoot.firstChild) {
                    domRoot.insertBefore(layer.dom, domRoot.firstChild);
                }
                else {
                    domRoot.appendChild(layer.dom);
                }
            }
        }
    },

    // Iterate each layer
    eachLayer: function (cb, context) {
        var zlevelList = this._zlevelList;
        var z;
        var i;
        for (i = 0; i < zlevelList.length; i++) {
            z = zlevelList[i];
            cb.call(context, this._layers[z], z);
        }
    },

    // Iterate each buildin layer
    eachBuiltinLayer: function (cb, context) {
        var zlevelList = this._zlevelList;
        var layer;
        var z;
        var i;
        for (i = 0; i < zlevelList.length; i++) {
            z = zlevelList[i];
            layer = this._layers[z];
            if (layer.__builtin__) {
                cb.call(context, layer, z);
            }
        }
    },

    // Iterate each other layer except buildin layer
    eachOtherLayer: function (cb, context) {
        var zlevelList = this._zlevelList;
        var layer;
        var z;
        var i;
        for (i = 0; i < zlevelList.length; i++) {
            z = zlevelList[i];
            layer = this._layers[z];
            if (!layer.__builtin__) {
                cb.call(context, layer, z);
            }
        }
    },

    /**
     * 获取所有已创建的层
     * @param {Array.<module:zrender/Layer>} [prevLayer]
     */
    getLayers: function () {
        return this._layers;
    },

    _updateLayerStatus: function (list) {

        var layers = this._layers;
        var progressiveLayers = this._progressiveLayers;

        var elCountsLastFrame = {};
        var progressiveElCountsLastFrame = {};

        this.eachBuiltinLayer(function (layer, z) {
            elCountsLastFrame[z] = layer.elCount;
            layer.elCount = 0;
            layer.__dirty = false;
        });

        __WEBPACK_IMPORTED_MODULE_1__core_util__["f" /* each */](progressiveLayers, function (layer, idx) {
            progressiveElCountsLastFrame[idx] = layer.elCount;
            layer.elCount = 0;
            layer.__dirty = false;
        });

        var progressiveLayerCount = 0;
        var currentProgressiveLayer;
        var lastProgressiveKey;
        var frameCount = 0;
        for (var i = 0, l = list.length; i < l; i++) {
            var el = list[i];
            var zlevel = this._singleCanvas ? 0 : el.zlevel;
            var layer = layers[zlevel];
            var elProgress = el.progressive;
            if (layer) {
                layer.elCount++;
                layer.__dirty = layer.__dirty || el.__dirty;
            }

            /////// Update progressive
            if (elProgress >= 0) {
                // Fix wrong progressive sequence problem.
                if (lastProgressiveKey !== elProgress) {
                    lastProgressiveKey = elProgress;
                    frameCount++;
                }
                var elFrame = el.__frame = frameCount - 1;
                if (!currentProgressiveLayer) {
                    var idx = Math.min(progressiveLayerCount, MAX_PROGRESSIVE_LAYER_NUMBER - 1);
                    currentProgressiveLayer = progressiveLayers[idx];
                    if (!currentProgressiveLayer) {
                        currentProgressiveLayer = progressiveLayers[idx] = new __WEBPACK_IMPORTED_MODULE_5__Layer__["a" /* default */](
                            'progressive', this, this.dpr
                        );
                        currentProgressiveLayer.initContext();
                    }
                    currentProgressiveLayer.__maxProgress = 0;
                }
                currentProgressiveLayer.__dirty = currentProgressiveLayer.__dirty || el.__dirty;
                currentProgressiveLayer.elCount++;

                currentProgressiveLayer.__maxProgress = Math.max(
                    currentProgressiveLayer.__maxProgress, elFrame
                );

                if (currentProgressiveLayer.__maxProgress >= currentProgressiveLayer.__progress) {
                    // Should keep rendering this  layer because progressive rendering is not finished yet
                    layer.__dirty = true;
                }
            }
            else {
                el.__frame = -1;

                if (currentProgressiveLayer) {
                    currentProgressiveLayer.__nextIdxNotProg = i;
                    progressiveLayerCount++;
                    currentProgressiveLayer = null;
                }
            }
        }

        if (currentProgressiveLayer) {
            progressiveLayerCount++;
            currentProgressiveLayer.__nextIdxNotProg = i;
        }

        // 层中的元素数量有发生变化
        this.eachBuiltinLayer(function (layer, z) {
            if (elCountsLastFrame[z] !== layer.elCount) {
                layer.__dirty = true;
            }
        });

        progressiveLayers.length = Math.min(progressiveLayerCount, MAX_PROGRESSIVE_LAYER_NUMBER);
        __WEBPACK_IMPORTED_MODULE_1__core_util__["f" /* each */](progressiveLayers, function (layer, idx) {
            if (progressiveElCountsLastFrame[idx] !== layer.elCount) {
                el.__dirty = true;
            }
            if (layer.__dirty) {
                layer.__progress = 0;
            }
        });
    },

    /**
     * 清除hover层外所有内容
     */
    clear: function () {
        this.eachBuiltinLayer(this._clearLayer);
        return this;
    },

    _clearLayer: function (layer) {
        layer.clear();
    },

    /**
     * 修改指定zlevel的绘制参数
     *
     * @param {string} zlevel
     * @param {Object} config 配置对象
     * @param {string} [config.clearColor=0] 每次清空画布的颜色
     * @param {string} [config.motionBlur=false] 是否开启动态模糊
     * @param {number} [config.lastFrameAlpha=0.7]
     *                 在开启动态模糊的时候使用，与上一帧混合的alpha值，值越大尾迹越明显
     */
    configLayer: function (zlevel, config) {
        if (config) {
            var layerConfig = this._layerConfig;
            if (!layerConfig[zlevel]) {
                layerConfig[zlevel] = config;
            }
            else {
                __WEBPACK_IMPORTED_MODULE_1__core_util__["l" /* merge */](layerConfig[zlevel], config, true);
            }

            var layer = this._layers[zlevel];

            if (layer) {
                __WEBPACK_IMPORTED_MODULE_1__core_util__["l" /* merge */](layer, layerConfig[zlevel], true);
            }
        }
    },

    /**
     * 删除指定层
     * @param {number} zlevel 层所在的zlevel
     */
    delLayer: function (zlevel) {
        var layers = this._layers;
        var zlevelList = this._zlevelList;
        var layer = layers[zlevel];
        if (!layer) {
            return;
        }
        layer.dom.parentNode.removeChild(layer.dom);
        delete layers[zlevel];

        zlevelList.splice(__WEBPACK_IMPORTED_MODULE_1__core_util__["c" /* indexOf */](zlevelList, zlevel), 1);
    },

    /**
     * 区域大小变化后重绘
     */
    resize: function (width, height) {
        var domRoot = this._domRoot;
        // FIXME Why ?
        domRoot.style.display = 'none';

        // Save input w/h
        var opts = this._opts;
        width != null && (opts.width = width);
        height != null && (opts.height = height);

        width = this._getSize(0);
        height = this._getSize(1);

        domRoot.style.display = '';

        // 优化没有实际改变的resize
        if (this._width != width || height != this._height) {
            domRoot.style.width = width + 'px';
            domRoot.style.height = height + 'px';

            for (var id in this._layers) {
                if (this._layers.hasOwnProperty(id)) {
                    this._layers[id].resize(width, height);
                }
            }
            __WEBPACK_IMPORTED_MODULE_1__core_util__["f" /* each */](this._progressiveLayers, function (layer) {
                layer.resize(width, height);
            });

            this.refresh(true);
        }

        this._width = width;
        this._height = height;

        return this;
    },

    /**
     * 清除单独的一个层
     * @param {number} zlevel
     */
    clearLayer: function (zlevel) {
        var layer = this._layers[zlevel];
        if (layer) {
            layer.clear();
        }
    },

    /**
     * 释放
     */
    dispose: function () {
        this.root.innerHTML = '';

        this.root =
        this.storage =

        this._domRoot =
        this._layers = null;
    },

    /**
     * Get canvas which has all thing rendered
     * @param {Object} opts
     * @param {string} [opts.backgroundColor]
     * @param {number} [opts.pixelRatio]
     */
    getRenderedCanvas: function (opts) {
        opts = opts || {};
        if (this._singleCanvas) {
            return this._layers[0].dom;
        }

        var imageLayer = new __WEBPACK_IMPORTED_MODULE_5__Layer__["a" /* default */]('image', this, opts.pixelRatio || this.dpr);
        imageLayer.initContext();

        imageLayer.clearColor = opts.backgroundColor;
        imageLayer.clear();

        var displayList = this.storage.getDisplayList(true);

        var scope = {};
        var zlevel;

        var self = this;
        function findAndDrawOtherLayer(smaller, larger) {
            var zlevelList = self._zlevelList;
            if (smaller == null) {
                smaller = -Infinity;
            }
            var intermediateLayer;
            for (var i = 0; i < zlevelList.length; i++) {
                var z = zlevelList[i];
                var layer = self._layers[z];
                if (!layer.__builtin__ && z > smaller && z < larger) {
                    intermediateLayer = layer;
                    break;
                }
            }
            if (intermediateLayer && intermediateLayer.renderToCanvas) {
                imageLayer.ctx.save();
                intermediateLayer.renderToCanvas(imageLayer.ctx);
                imageLayer.ctx.restore();
            }
        }
        for (var i = 0; i < displayList.length; i++) {
            var el = displayList[i];

            if (el.zlevel !== zlevel) {
                findAndDrawOtherLayer(zlevel, el.zlevel);
                zlevel = el.zlevel;
            }
            this._doPaintEl(el, imageLayer, true, scope);
        }

        findAndDrawOtherLayer(zlevel, Infinity);

        return imageLayer.dom;
    },
    /**
     * 获取绘图区域宽度
     */
    getWidth: function () {
        return this._width;
    },

    /**
     * 获取绘图区域高度
     */
    getHeight: function () {
        return this._height;
    },

    _getSize: function (whIdx) {
        var opts = this._opts;
        var wh = ['width', 'height'][whIdx];
        var cwh = ['clientWidth', 'clientHeight'][whIdx];
        var plt = ['paddingLeft', 'paddingTop'][whIdx];
        var prb = ['paddingRight', 'paddingBottom'][whIdx];

        if (opts[wh] != null && opts[wh] !== 'auto') {
            return parseFloat(opts[wh]);
        }

        var root = this.root;
        // IE8 does not support getComputedStyle, but it use VML.
        var stl = document.defaultView.getComputedStyle(root);

        return (
            (root[cwh] || parseInt10(stl[wh]) || parseInt10(root.style[wh]))
            - (parseInt10(stl[plt]) || 0)
            - (parseInt10(stl[prb]) || 0)
        ) | 0;
    },

    pathToImage: function (path, dpr) {
        dpr = dpr || this.dpr;

        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        var rect = path.getBoundingRect();
        var style = path.style;
        var shadowBlurSize = style.shadowBlur;
        var shadowOffsetX = style.shadowOffsetX;
        var shadowOffsetY = style.shadowOffsetY;
        var lineWidth = style.hasStroke() ? style.lineWidth : 0;

        var leftMargin = Math.max(lineWidth / 2, -shadowOffsetX + shadowBlurSize);
        var rightMargin = Math.max(lineWidth / 2, shadowOffsetX + shadowBlurSize);
        var topMargin = Math.max(lineWidth / 2, -shadowOffsetY + shadowBlurSize);
        var bottomMargin = Math.max(lineWidth / 2, shadowOffsetY + shadowBlurSize);
        var width = rect.width + leftMargin + rightMargin;
        var height = rect.height + topMargin + bottomMargin;

        canvas.width = width * dpr;
        canvas.height = height * dpr;

        ctx.scale(dpr, dpr);
        ctx.clearRect(0, 0, width, height);
        ctx.dpr = dpr;

        var pathTransform = {
            position: path.position,
            rotation: path.rotation,
            scale: path.scale
        };
        path.position = [leftMargin - rect.x, topMargin - rect.y];
        path.rotation = 0;
        path.scale = [1, 1];
        path.updateTransform();
        if (path) {
            path.brush(ctx);
        }

        var ImageShape = __WEBPACK_IMPORTED_MODULE_7__graphic_Image__["a" /* default */];
        var imgShape = new ImageShape({
            style: {
                x: 0,
                y: 0,
                image: canvas
            }
        });

        if (pathTransform.position != null) {
            imgShape.position = path.position = pathTransform.position;
        }

        if (pathTransform.rotation != null) {
            imgShape.rotation = path.rotation = pathTransform.rotation;
        }

        if (pathTransform.scale != null) {
            imgShape.scale = path.scale = pathTransform.scale;
        }

        return imgShape;
    }
};

/* harmony default export */ __webpack_exports__["a"] = (Painter);

/***/ }),

/***/ 874:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__core_util__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_env__ = __webpack_require__(146);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__container_Group__ = __webpack_require__(106);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__core_timsort__ = __webpack_require__(365);
/**
 * Storage内容仓库模块
 * @module zrender/Storage
 * @author Kener (@Kener-林峰, kener.linfeng@gmail.com)
 * @author errorrik (errorrik@gmail.com)
 * @author pissang (https://github.com/pissang/)
 */





// Use timsort because in most case elements are partially sorted
// https://jsfiddle.net/pissang/jr4x7mdm/8/


function shapeCompareFunc(a, b) {
    if (a.zlevel === b.zlevel) {
        if (a.z === b.z) {
            // if (a.z2 === b.z2) {
            //     // FIXME Slow has renderidx compare
            //     // http://stackoverflow.com/questions/20883421/sorting-in-javascript-should-every-compare-function-have-a-return-0-statement
            //     // https://github.com/v8/v8/blob/47cce544a31ed5577ffe2963f67acb4144ee0232/src/js/array.js#L1012
            //     return a.__renderidx - b.__renderidx;
            // }
            return a.z2 - b.z2;
        }
        return a.z - b.z;
    }
    return a.zlevel - b.zlevel;
}
/**
 * 内容仓库 (M)
 * @alias module:zrender/Storage
 * @constructor
 */
var Storage = function () { // jshint ignore:line
    this._roots = [];

    this._displayList = [];

    this._displayListLen = 0;
};

Storage.prototype = {

    constructor: Storage,

    /**
     * @param  {Function} cb
     *
     */
    traverse: function (cb, context) {
        for (var i = 0; i < this._roots.length; i++) {
            this._roots[i].traverse(cb, context);
        }
    },

    /**
     * 返回所有图形的绘制队列
     * @param {boolean} [update=false] 是否在返回前更新该数组
     * @param {boolean} [includeIgnore=false] 是否包含 ignore 的数组, 在 update 为 true 的时候有效
     *
     * 详见{@link module:zrender/graphic/Displayable.prototype.updateDisplayList}
     * @return {Array.<module:zrender/graphic/Displayable>}
     */
    getDisplayList: function (update, includeIgnore) {
        includeIgnore = includeIgnore || false;
        if (update) {
            this.updateDisplayList(includeIgnore);
        }
        return this._displayList;
    },

    /**
     * 更新图形的绘制队列。
     * 每次绘制前都会调用，该方法会先深度优先遍历整个树，更新所有Group和Shape的变换并且把所有可见的Shape保存到数组中，
     * 最后根据绘制的优先级（zlevel > z > 插入顺序）排序得到绘制队列
     * @param {boolean} [includeIgnore=false] 是否包含 ignore 的数组
     */
    updateDisplayList: function (includeIgnore) {
        this._displayListLen = 0;
        var roots = this._roots;
        var displayList = this._displayList;
        for (var i = 0, len = roots.length; i < len; i++) {
            this._updateAndAddDisplayable(roots[i], null, includeIgnore);
        }
        displayList.length = this._displayListLen;

        // for (var i = 0, len = displayList.length; i < len; i++) {
        //     displayList[i].__renderidx = i;
        // }

        // displayList.sort(shapeCompareFunc);
        __WEBPACK_IMPORTED_MODULE_1__core_env__["a" /* default */].canvasSupported && __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__core_timsort__["a" /* default */])(displayList, shapeCompareFunc);
    },

    _updateAndAddDisplayable: function (el, clipPaths, includeIgnore) {

        if (el.ignore && !includeIgnore) {
            return;
        }

        el.beforeUpdate();

        if (el.__dirty) {

            el.update();

        }

        el.afterUpdate();

        var userSetClipPath = el.clipPath;
        if (userSetClipPath) {

            // FIXME 效率影响
            if (clipPaths) {
                clipPaths = clipPaths.slice();
            }
            else {
                clipPaths = [];
            }

            var currentClipPath = userSetClipPath;
            var parentClipPath = el;
            // Recursively add clip path
            while (currentClipPath) {
                // clipPath 的变换是基于使用这个 clipPath 的元素
                currentClipPath.parent = parentClipPath;
                currentClipPath.updateTransform();

                clipPaths.push(currentClipPath);

                parentClipPath = currentClipPath;
                currentClipPath = currentClipPath.clipPath;
            }
        }

        if (el.isGroup) {
            var children = el._children;

            for (var i = 0; i < children.length; i++) {
                var child = children[i];

                // Force to mark as dirty if group is dirty
                // FIXME __dirtyPath ?
                if (el.__dirty) {
                    child.__dirty = true;
                }

                this._updateAndAddDisplayable(child, clipPaths, includeIgnore);
            }

            // Mark group clean here
            el.__dirty = false;

        }
        else {
            el.__clipPaths = clipPaths;

            this._displayList[this._displayListLen++] = el;
        }
    },

    /**
     * 添加图形(Shape)或者组(Group)到根节点
     * @param {module:zrender/Element} el
     */
    addRoot: function (el) {
        if (el.__storage === this) {
            return;
        }

        if (el instanceof __WEBPACK_IMPORTED_MODULE_2__container_Group__["default"]) {
            el.addChildrenToStorage(this);
        }

        this.addToStorage(el);
        this._roots.push(el);
    },

    /**
     * 删除指定的图形(Shape)或者组(Group)
     * @param {string|Array.<string>} [el] 如果为空清空整个Storage
     */
    delRoot: function (el) {
        if (el == null) {
            // 不指定el清空
            for (var i = 0; i < this._roots.length; i++) {
                var root = this._roots[i];
                if (root instanceof __WEBPACK_IMPORTED_MODULE_2__container_Group__["default"]) {
                    root.delChildrenFromStorage(this);
                }
            }

            this._roots = [];
            this._displayList = [];
            this._displayListLen = 0;

            return;
        }

        if (el instanceof Array) {
            for (var i = 0, l = el.length; i < l; i++) {
                this.delRoot(el[i]);
            }
            return;
        }


        var idx = __WEBPACK_IMPORTED_MODULE_0__core_util__["c" /* indexOf */](this._roots, el);
        if (idx >= 0) {
            this.delFromStorage(el);
            this._roots.splice(idx, 1);
            if (el instanceof __WEBPACK_IMPORTED_MODULE_2__container_Group__["default"]) {
                el.delChildrenFromStorage(this);
            }
        }
    },

    addToStorage: function (el) {
        el.__storage = this;
        el.dirty(false);

        return this;
    },

    delFromStorage: function (el) {
        if (el) {
            el.__storage = null;
        }

        return this;
    },

    /**
     * 清空并且释放Storage
     */
    dispose: function () {
        this._renderList =
        this._roots = null;
    },

    displayableSortFunc: shapeCompareFunc
};

/* harmony default export */ __webpack_exports__["a"] = (Storage);

/***/ }),

/***/ 875:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__core_util__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_event__ = __webpack_require__(212);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__requestAnimationFrame__ = __webpack_require__(359);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Animator__ = __webpack_require__(358);
/**
 * 动画主类, 调度和管理所有动画控制器
 *
 * @module zrender/animation/Animation
 * @author pissang(https://github.com/pissang)
 */
// TODO Additive animation
// http://iosoteric.com/additive-animations-animatewithduration-in-ios-8/
// https://developer.apple.com/videos/wwdc2014/#236






/**
 * @typedef {Object} IZRenderStage
 * @property {Function} update
 */

/**
 * @alias module:zrender/animation/Animation
 * @constructor
 * @param {Object} [options]
 * @param {Function} [options.onframe]
 * @param {IZRenderStage} [options.stage]
 * @example
 *     var animation = new Animation();
 *     var obj = {
 *         x: 100,
 *         y: 100
 *     };
 *     animation.animate(node.position)
 *         .when(1000, {
 *             x: 500,
 *             y: 500
 *         })
 *         .when(2000, {
 *             x: 100,
 *             y: 100
 *         })
 *         .start('spline');
 */
var Animation = function (options) {

    options = options || {};

    this.stage = options.stage || {};

    this.onframe = options.onframe || function() {};

    // private properties
    this._clips = [];

    this._running = false;

    this._time;

    this._pausedTime;

    this._pauseStart;

    this._paused = false;

    __WEBPACK_IMPORTED_MODULE_1__core_event__["a" /* Dispatcher */].call(this);
};

Animation.prototype = {

    constructor: Animation,
    /**
     * 添加 clip
     * @param {module:zrender/animation/Clip} clip
     */
    addClip: function (clip) {
        this._clips.push(clip);
    },
    /**
     * 添加 animator
     * @param {module:zrender/animation/Animator} animator
     */
    addAnimator: function (animator) {
        animator.animation = this;
        var clips = animator.getClips();
        for (var i = 0; i < clips.length; i++) {
            this.addClip(clips[i]);
        }
    },
    /**
     * 删除动画片段
     * @param {module:zrender/animation/Clip} clip
     */
    removeClip: function(clip) {
        var idx = __WEBPACK_IMPORTED_MODULE_0__core_util__["c" /* indexOf */](this._clips, clip);
        if (idx >= 0) {
            this._clips.splice(idx, 1);
        }
    },

    /**
     * 删除动画片段
     * @param {module:zrender/animation/Animator} animator
     */
    removeAnimator: function (animator) {
        var clips = animator.getClips();
        for (var i = 0; i < clips.length; i++) {
            this.removeClip(clips[i]);
        }
        animator.animation = null;
    },

    _update: function() {

        var time = new Date().getTime() - this._pausedTime;
        var delta = time - this._time;
        var clips = this._clips;
        var len = clips.length;

        var deferredEvents = [];
        var deferredClips = [];
        for (var i = 0; i < len; i++) {
            var clip = clips[i];
            var e = clip.step(time, delta);
            // Throw out the events need to be called after
            // stage.update, like destroy
            if (e) {
                deferredEvents.push(e);
                deferredClips.push(clip);
            }
        }

        // Remove the finished clip
        for (var i = 0; i < len;) {
            if (clips[i]._needsRemove) {
                clips[i] = clips[len - 1];
                clips.pop();
                len--;
            }
            else {
                i++;
            }
        }

        len = deferredEvents.length;
        for (var i = 0; i < len; i++) {
            deferredClips[i].fire(deferredEvents[i]);
        }

        this._time = time;

        this.onframe(delta);

        this.trigger('frame', delta);

        if (this.stage.update) {
            this.stage.update();
        }
    },

    _startLoop: function () {
        var self = this;

        this._running = true;

        function step() {
            if (self._running) {

                __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__requestAnimationFrame__["a" /* default */])(step);

                !self._paused && self._update();
            }
        }

        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__requestAnimationFrame__["a" /* default */])(step);
    },

    /**
     * 开始运行动画
     */
    start: function () {

        this._time = new Date().getTime();
        this._pausedTime = 0;

        this._startLoop();
    },
    /**
     * 停止运行动画
     */
    stop: function () {
        this._running = false;
    },

    /**
     * Pause
     */
    pause: function () {
        if (!this._paused) {
            this._pauseStart = new Date().getTime();
            this._paused = true;
        }
    },

    /**
     * Resume
     */
    resume: function () {
        if (this._paused) {
            this._pausedTime += (new Date().getTime()) - this._pauseStart;
            this._paused = false;
        }
    },

    /**
     * 清除所有动画片段
     */
    clear: function () {
        this._clips = [];
    },
    /**
     * 对一个目标创建一个animator对象，可以指定目标中的属性使用动画
     * @param  {Object} target
     * @param  {Object} options
     * @param  {boolean} [options.loop=false] 是否循环播放动画
     * @param  {Function} [options.getter=null]
     *         如果指定getter函数，会通过getter函数取属性值
     * @param  {Function} [options.setter=null]
     *         如果指定setter函数，会通过setter函数设置属性值
     * @return {module:zrender/animation/Animation~Animator}
     */
    // TODO Gap
    animate: function (target, options) {
        options = options || {};

        var animator = new __WEBPACK_IMPORTED_MODULE_3__Animator__["a" /* default */](
            target,
            options.loop,
            options.getter,
            options.setter
        );

        this.addAnimator(animator);

        return animator;
    }
};

__WEBPACK_IMPORTED_MODULE_0__core_util__["d" /* mixin */](Animation, __WEBPACK_IMPORTED_MODULE_1__core_event__["a" /* Dispatcher */]);

/* harmony default export */ __webpack_exports__["a"] = (Animation);

/***/ }),

/***/ 876:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__easing__ = __webpack_require__(877);
/**
 * 动画主控制器
 * @config target 动画对象，可以是数组，如果是数组的话会批量分发onframe等事件
 * @config life(1000) 动画时长
 * @config delay(0) 动画延迟时间
 * @config loop(true)
 * @config gap(0) 循环的间隔时间
 * @config onframe
 * @config easing(optional)
 * @config ondestroy(optional)
 * @config onrestart(optional)
 *
 * TODO pause
 */



function Clip(options) {

    this._target = options.target;

    // 生命周期
    this._life = options.life || 1000;
    // 延时
    this._delay = options.delay || 0;
    // 开始时间
    // this._startTime = new Date().getTime() + this._delay;// 单位毫秒
    this._initialized = false;

    // 是否循环
    this.loop = options.loop == null ? false : options.loop;

    this.gap = options.gap || 0;

    this.easing = options.easing || 'Linear';

    this.onframe = options.onframe;
    this.ondestroy = options.ondestroy;
    this.onrestart = options.onrestart;

    this._pausedTime = 0;
    this._paused = false;
}

Clip.prototype = {

    constructor: Clip,

    step: function (globalTime, deltaTime) {
        // Set startTime on first step, or _startTime may has milleseconds different between clips
        // PENDING
        if (!this._initialized) {
            this._startTime = globalTime + this._delay;
            this._initialized = true;
        }

        if (this._paused) {
            this._pausedTime += deltaTime;
            return;
        }

        var percent = (globalTime - this._startTime - this._pausedTime) / this._life;

        // 还没开始
        if (percent < 0) {
            return;
        }

        percent = Math.min(percent, 1);

        var easing = this.easing;
        var easingFunc = typeof easing == 'string' ? __WEBPACK_IMPORTED_MODULE_0__easing__["a" /* default */][easing] : easing;
        var schedule = typeof easingFunc === 'function'
            ? easingFunc(percent)
            : percent;

        this.fire('frame', schedule);

        // 结束
        if (percent == 1) {
            if (this.loop) {
                this.restart (globalTime);
                // 重新开始周期
                // 抛出而不是直接调用事件直到 stage.update 后再统一调用这些事件
                return 'restart';
            }

            // 动画完成将这个控制器标识为待删除
            // 在Animation.update中进行批量删除
            this._needsRemove = true;
            return 'destroy';
        }

        return null;
    },

    restart: function (globalTime) {
        var remainder = (globalTime - this._startTime - this._pausedTime) % this._life;
        this._startTime = globalTime - remainder + this.gap;
        this._pausedTime = 0;

        this._needsRemove = false;
    },

    fire: function (eventType, arg) {
        eventType = 'on' + eventType;
        if (this[eventType]) {
            this[eventType](this._target, arg);
        }
    },

    pause: function () {
        this._paused = true;
    },

    resume: function () {
        this._paused = false;
    }
};

/* harmony default export */ __webpack_exports__["a"] = (Clip);

/***/ }),

/***/ 877:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * 缓动代码来自 https://github.com/sole/tween.js/blob/master/src/Tween.js
 * @see http://sole.github.io/tween.js/examples/03_graphs.html
 * @exports zrender/animation/easing
 */
var easing = {
    /**
    * @param {number} k
    * @return {number}
    */
    linear: function (k) {
        return k;
    },

    /**
    * @param {number} k
    * @return {number}
    */
    quadraticIn: function (k) {
        return k * k;
    },
    /**
    * @param {number} k
    * @return {number}
    */
    quadraticOut: function (k) {
        return k * (2 - k);
    },
    /**
    * @param {number} k
    * @return {number}
    */
    quadraticInOut: function (k) {
        if ((k *= 2) < 1) {
            return 0.5 * k * k;
        }
        return -0.5 * (--k * (k - 2) - 1);
    },

    // 三次方的缓动（t^3）
    /**
    * @param {number} k
    * @return {number}
    */
    cubicIn: function (k) {
        return k * k * k;
    },
    /**
    * @param {number} k
    * @return {number}
    */
    cubicOut: function (k) {
        return --k * k * k + 1;
    },
    /**
    * @param {number} k
    * @return {number}
    */
    cubicInOut: function (k) {
        if ((k *= 2) < 1) {
            return 0.5 * k * k * k;
        }
        return 0.5 * ((k -= 2) * k * k + 2);
    },

    // 四次方的缓动（t^4）
    /**
    * @param {number} k
    * @return {number}
    */
    quarticIn: function (k) {
        return k * k * k * k;
    },
    /**
    * @param {number} k
    * @return {number}
    */
    quarticOut: function (k) {
        return 1 - (--k * k * k * k);
    },
    /**
    * @param {number} k
    * @return {number}
    */
    quarticInOut: function (k) {
        if ((k *= 2) < 1) {
            return 0.5 * k * k * k * k;
        }
        return -0.5 * ((k -= 2) * k * k * k - 2);
    },

    // 五次方的缓动（t^5）
    /**
    * @param {number} k
    * @return {number}
    */
    quinticIn: function (k) {
        return k * k * k * k * k;
    },
    /**
    * @param {number} k
    * @return {number}
    */
    quinticOut: function (k) {
        return --k * k * k * k * k + 1;
    },
    /**
    * @param {number} k
    * @return {number}
    */
    quinticInOut: function (k) {
        if ((k *= 2) < 1) {
            return 0.5 * k * k * k * k * k;
        }
        return 0.5 * ((k -= 2) * k * k * k * k + 2);
    },

    // 正弦曲线的缓动（sin(t)）
    /**
    * @param {number} k
    * @return {number}
    */
    sinusoidalIn: function (k) {
        return 1 - Math.cos(k * Math.PI / 2);
    },
    /**
    * @param {number} k
    * @return {number}
    */
    sinusoidalOut: function (k) {
        return Math.sin(k * Math.PI / 2);
    },
    /**
    * @param {number} k
    * @return {number}
    */
    sinusoidalInOut: function (k) {
        return 0.5 * (1 - Math.cos(Math.PI * k));
    },

    // 指数曲线的缓动（2^t）
    /**
    * @param {number} k
    * @return {number}
    */
    exponentialIn: function (k) {
        return k === 0 ? 0 : Math.pow(1024, k - 1);
    },
    /**
    * @param {number} k
    * @return {number}
    */
    exponentialOut: function (k) {
        return k === 1 ? 1 : 1 - Math.pow(2, -10 * k);
    },
    /**
    * @param {number} k
    * @return {number}
    */
    exponentialInOut: function (k) {
        if (k === 0) {
            return 0;
        }
        if (k === 1) {
            return 1;
        }
        if ((k *= 2) < 1) {
            return 0.5 * Math.pow(1024, k - 1);
        }
        return 0.5 * (-Math.pow(2, -10 * (k - 1)) + 2);
    },

    // 圆形曲线的缓动（sqrt(1-t^2)）
    /**
    * @param {number} k
    * @return {number}
    */
    circularIn: function (k) {
        return 1 - Math.sqrt(1 - k * k);
    },
    /**
    * @param {number} k
    * @return {number}
    */
    circularOut: function (k) {
        return Math.sqrt(1 - (--k * k));
    },
    /**
    * @param {number} k
    * @return {number}
    */
    circularInOut: function (k) {
        if ((k *= 2) < 1) {
            return -0.5 * (Math.sqrt(1 - k * k) - 1);
        }
        return 0.5 * (Math.sqrt(1 - (k -= 2) * k) + 1);
    },

    // 创建类似于弹簧在停止前来回振荡的动画
    /**
    * @param {number} k
    * @return {number}
    */
    elasticIn: function (k) {
        var s;
        var a = 0.1;
        var p = 0.4;
        if (k === 0) {
            return 0;
        }
        if (k === 1) {
            return 1;
        }
        if (!a || a < 1) {
            a = 1; s = p / 4;
        }
        else {
            s = p * Math.asin(1 / a) / (2 * Math.PI);
        }
        return -(a * Math.pow(2, 10 * (k -= 1)) *
                    Math.sin((k - s) * (2 * Math.PI) / p));
    },
    /**
    * @param {number} k
    * @return {number}
    */
    elasticOut: function (k) {
        var s;
        var a = 0.1;
        var p = 0.4;
        if (k === 0) {
            return 0;
        }
        if (k === 1) {
            return 1;
        }
        if (!a || a < 1) {
            a = 1; s = p / 4;
        }
        else {
            s = p * Math.asin(1 / a) / (2 * Math.PI);
        }
        return (a * Math.pow(2, -10 * k) *
                Math.sin((k - s) * (2 * Math.PI) / p) + 1);
    },
    /**
    * @param {number} k
    * @return {number}
    */
    elasticInOut: function (k) {
        var s;
        var a = 0.1;
        var p = 0.4;
        if (k === 0) {
            return 0;
        }
        if (k === 1) {
            return 1;
        }
        if (!a || a < 1) {
            a = 1; s = p / 4;
        }
        else {
            s = p * Math.asin(1 / a) / (2 * Math.PI);
        }
        if ((k *= 2) < 1) {
            return -0.5 * (a * Math.pow(2, 10 * (k -= 1))
                * Math.sin((k - s) * (2 * Math.PI) / p));
        }
        return a * Math.pow(2, -10 * (k -= 1))
                * Math.sin((k - s) * (2 * Math.PI) / p) * 0.5 + 1;

    },

    // 在某一动画开始沿指示的路径进行动画处理前稍稍收回该动画的移动
    /**
    * @param {number} k
    * @return {number}
    */
    backIn: function (k) {
        var s = 1.70158;
        return k * k * ((s + 1) * k - s);
    },
    /**
    * @param {number} k
    * @return {number}
    */
    backOut: function (k) {
        var s = 1.70158;
        return --k * k * ((s + 1) * k + s) + 1;
    },
    /**
    * @param {number} k
    * @return {number}
    */
    backInOut: function (k) {
        var s = 1.70158 * 1.525;
        if ((k *= 2) < 1) {
            return 0.5 * (k * k * ((s + 1) * k - s));
        }
        return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);
    },

    // 创建弹跳效果
    /**
    * @param {number} k
    * @return {number}
    */
    bounceIn: function (k) {
        return 1 - easing.bounceOut(1 - k);
    },
    /**
    * @param {number} k
    * @return {number}
    */
    bounceOut: function (k) {
        if (k < (1 / 2.75)) {
            return 7.5625 * k * k;
        }
        else if (k < (2 / 2.75)) {
            return 7.5625 * (k -= (1.5 / 2.75)) * k + 0.75;
        }
        else if (k < (2.5 / 2.75)) {
            return 7.5625 * (k -= (2.25 / 2.75)) * k + 0.9375;
        }
        else {
            return 7.5625 * (k -= (2.625 / 2.75)) * k + 0.984375;
        }
    },
    /**
    * @param {number} k
    * @return {number}
    */
    bounceInOut: function (k) {
        if (k < 0.5) {
            return easing.bounceIn(k * 2) * 0.5;
        }
        return easing.bounceOut(k * 2 - 1) * 0.5 + 0.5;
    }
};

/* harmony default export */ __webpack_exports__["a"] = (easing);

/***/ }),

/***/ 878:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = containStroke;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util__ = __webpack_require__(360);



var PI2 = Math.PI * 2;

/**
 * 圆弧描边包含判断
 * @param  {number}  cx
 * @param  {number}  cy
 * @param  {number}  r
 * @param  {number}  startAngle
 * @param  {number}  endAngle
 * @param  {boolean}  anticlockwise
 * @param  {number} lineWidth
 * @param  {number}  x
 * @param  {number}  y
 * @return {Boolean}
 */
function containStroke(
    cx, cy, r, startAngle, endAngle, anticlockwise,
    lineWidth, x, y
) {

    if (lineWidth === 0) {
        return false;
    }
    var _l = lineWidth;

    x -= cx;
    y -= cy;
    var d = Math.sqrt(x * x + y * y);

    if ((d - _l > r) || (d + _l < r)) {
        return false;
    }
    if (Math.abs(startAngle - endAngle) % PI2 < 1e-4) {
        // Is a circle
        return true;
    }
    if (anticlockwise) {
        var tmp = startAngle;
        startAngle = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util__["a" /* normalizeRadian */])(endAngle);
        endAngle = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util__["a" /* normalizeRadian */])(tmp);
    } else {
        startAngle = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util__["a" /* normalizeRadian */])(startAngle);
        endAngle = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util__["a" /* normalizeRadian */])(endAngle);
    }
    if (startAngle > endAngle) {
        endAngle += PI2;
    }

    var angle = Math.atan2(y, x);
    if (angle < 0) {
        angle += PI2;
    }
    return (angle >= startAngle && angle <= endAngle)
        || (angle + PI2 >= startAngle && angle + PI2 <= endAngle);
}

/***/ }),

/***/ 879:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = containStroke;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__core_curve__ = __webpack_require__(82);



/**
 * 三次贝塞尔曲线描边包含判断
 * @param  {number}  x0
 * @param  {number}  y0
 * @param  {number}  x1
 * @param  {number}  y1
 * @param  {number}  x2
 * @param  {number}  y2
 * @param  {number}  x3
 * @param  {number}  y3
 * @param  {number}  lineWidth
 * @param  {number}  x
 * @param  {number}  y
 * @return {boolean}
 */
function containStroke(x0, y0, x1, y1, x2, y2, x3, y3, lineWidth, x, y) {
    if (lineWidth === 0) {
        return false;
    }
    var _l = lineWidth;
    // Quick reject
    if (
        (y > y0 + _l && y > y1 + _l && y > y2 + _l && y > y3 + _l)
        || (y < y0 - _l && y < y1 - _l && y < y2 - _l && y < y3 - _l)
        || (x > x0 + _l && x > x1 + _l && x > x2 + _l && x > x3 + _l)
        || (x < x0 - _l && x < x1 - _l && x < x2 - _l && x < x3 - _l)
    ) {
        return false;
    }
    var d = __WEBPACK_IMPORTED_MODULE_0__core_curve__["h" /* cubicProjectPoint */](
        x0, y0, x1, y1, x2, y2, x3, y3,
        x, y, null
    );
    return d <= _l / 2;
}

/***/ }),

/***/ 880:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = containStroke;

/**
 * 线段包含判断
 * @param  {number}  x0
 * @param  {number}  y0
 * @param  {number}  x1
 * @param  {number}  y1
 * @param  {number}  lineWidth
 * @param  {number}  x
 * @param  {number}  y
 * @return {boolean}
 */
function containStroke(x0, y0, x1, y1, lineWidth, x, y) {
    if (lineWidth === 0) {
        return false;
    }
    var _l = lineWidth;
    var _a = 0;
    var _b = x0;
    // Quick reject
    if (
        (y > y0 + _l && y > y1 + _l)
        || (y < y0 - _l && y < y1 - _l)
        || (x > x0 + _l && x > x1 + _l)
        || (x < x0 - _l && x < x1 - _l)
    ) {
        return false;
    }

    if (x0 !== x1) {
        _a = (y0 - y1) / (x0 - x1);
        _b = (x0 * y1 - x1 * y0) / (x0 - x1) ;
    }
    else {
        return Math.abs(x - x0) <= _l / 2;
    }
    var tmp = _a * x - y + _b;
    var _s = tmp * tmp / (_a * _a + 1);
    return _s <= _l / 2 * _l / 2;
}

/***/ }),

/***/ 881:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = contain;
/* harmony export (immutable) */ __webpack_exports__["a"] = containStroke;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__core_PathProxy__ = __webpack_require__(145);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__line__ = __webpack_require__(880);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__cubic__ = __webpack_require__(879);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__quadratic__ = __webpack_require__(882);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__arc__ = __webpack_require__(878);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__util__ = __webpack_require__(360);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__core_curve__ = __webpack_require__(82);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__windingLine__ = __webpack_require__(884);









var CMD = __WEBPACK_IMPORTED_MODULE_0__core_PathProxy__["a" /* default */].CMD;
var PI2 = Math.PI * 2;

var EPSILON = 1e-4;

function isAroundEqual(a, b) {
    return Math.abs(a - b) < EPSILON;
}

// 临时数组
var roots = [-1, -1, -1];
var extrema = [-1, -1];

function swapExtrema() {
    var tmp = extrema[0];
    extrema[0] = extrema[1];
    extrema[1] = tmp;
}

function windingCubic(x0, y0, x1, y1, x2, y2, x3, y3, x, y) {
    // Quick reject
    if (
        (y > y0 && y > y1 && y > y2 && y > y3)
        || (y < y0 && y < y1 && y < y2 && y < y3)
    ) {
        return 0;
    }
    var nRoots = __WEBPACK_IMPORTED_MODULE_6__core_curve__["a" /* cubicRootAt */](y0, y1, y2, y3, y, roots);
    if (nRoots === 0) {
        return 0;
    }
    else {
        var w = 0;
        var nExtrema = -1;
        var y0_, y1_;
        for (var i = 0; i < nRoots; i++) {
            var t = roots[i];

            // Avoid winding error when intersection point is the connect point of two line of polygon
            var unit = (t === 0 || t === 1) ? 0.5 : 1;

            var x_ = __WEBPACK_IMPORTED_MODULE_6__core_curve__["b" /* cubicAt */](x0, x1, x2, x3, t);
            if (x_ < x) { // Quick reject
                continue;
            }
            if (nExtrema < 0) {
                nExtrema = __WEBPACK_IMPORTED_MODULE_6__core_curve__["c" /* cubicExtrema */](y0, y1, y2, y3, extrema);
                if (extrema[1] < extrema[0] && nExtrema > 1) {
                    swapExtrema();
                }
                y0_ = __WEBPACK_IMPORTED_MODULE_6__core_curve__["b" /* cubicAt */](y0, y1, y2, y3, extrema[0]);
                if (nExtrema > 1) {
                    y1_ = __WEBPACK_IMPORTED_MODULE_6__core_curve__["b" /* cubicAt */](y0, y1, y2, y3, extrema[1]);
                }
            }
            if (nExtrema == 2) {
                // 分成三段单调函数
                if (t < extrema[0]) {
                    w += y0_ < y0 ? unit : -unit;
                }
                else if (t < extrema[1]) {
                    w += y1_ < y0_ ? unit : -unit;
                }
                else {
                    w += y3 < y1_ ? unit : -unit;
                }
            }
            else {
                // 分成两段单调函数
                if (t < extrema[0]) {
                    w += y0_ < y0 ? unit : -unit;
                }
                else {
                    w += y3 < y0_ ? unit : -unit;
                }
            }
        }
        return w;
    }
}

function windingQuadratic(x0, y0, x1, y1, x2, y2, x, y) {
    // Quick reject
    if (
        (y > y0 && y > y1 && y > y2)
        || (y < y0 && y < y1 && y < y2)
    ) {
        return 0;
    }
    var nRoots = __WEBPACK_IMPORTED_MODULE_6__core_curve__["d" /* quadraticRootAt */](y0, y1, y2, y, roots);
    if (nRoots === 0) {
        return 0;
    }
    else {
        var t = __WEBPACK_IMPORTED_MODULE_6__core_curve__["e" /* quadraticExtremum */](y0, y1, y2);
        if (t >= 0 && t <= 1) {
            var w = 0;
            var y_ = __WEBPACK_IMPORTED_MODULE_6__core_curve__["f" /* quadraticAt */](y0, y1, y2, t);
            for (var i = 0; i < nRoots; i++) {
                // Remove one endpoint.
                var unit = (roots[i] === 0 || roots[i] === 1) ? 0.5 : 1;

                var x_ = __WEBPACK_IMPORTED_MODULE_6__core_curve__["f" /* quadraticAt */](x0, x1, x2, roots[i]);
                if (x_ < x) {   // Quick reject
                    continue;
                }
                if (roots[i] < t) {
                    w += y_ < y0 ? unit : -unit;
                }
                else {
                    w += y2 < y_ ? unit : -unit;
                }
            }
            return w;
        }
        else {
            // Remove one endpoint.
            var unit = (roots[0] === 0 || roots[0] === 1) ? 0.5 : 1;

            var x_ = __WEBPACK_IMPORTED_MODULE_6__core_curve__["f" /* quadraticAt */](x0, x1, x2, roots[0]);
            if (x_ < x) {   // Quick reject
                return 0;
            }
            return y2 < y0 ? unit : -unit;
        }
    }
}

// TODO
// Arc 旋转
function windingArc(
    cx, cy, r, startAngle, endAngle, anticlockwise, x, y
) {
    y -= cy;
    if (y > r || y < -r) {
        return 0;
    }
    var tmp = Math.sqrt(r * r - y * y);
    roots[0] = -tmp;
    roots[1] = tmp;

    var diff = Math.abs(startAngle - endAngle);
    if (diff < 1e-4) {
        return 0;
    }
    if (diff % PI2 < 1e-4) {
        // Is a circle
        startAngle = 0;
        endAngle = PI2;
        var dir = anticlockwise ? 1 : -1;
        if (x >= roots[0] + cx && x <= roots[1] + cx) {
            return dir;
        } else {
            return 0;
        }
    }

    if (anticlockwise) {
        var tmp = startAngle;
        startAngle = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5__util__["a" /* normalizeRadian */])(endAngle);
        endAngle = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5__util__["a" /* normalizeRadian */])(tmp);
    }
    else {
        startAngle = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5__util__["a" /* normalizeRadian */])(startAngle);
        endAngle = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5__util__["a" /* normalizeRadian */])(endAngle);
    }
    if (startAngle > endAngle) {
        endAngle += PI2;
    }

    var w = 0;
    for (var i = 0; i < 2; i++) {
        var x_ = roots[i];
        if (x_ + cx > x) {
            var angle = Math.atan2(y, x_);
            var dir = anticlockwise ? 1 : -1;
            if (angle < 0) {
                angle = PI2 + angle;
            }
            if (
                (angle >= startAngle && angle <= endAngle)
                || (angle + PI2 >= startAngle && angle + PI2 <= endAngle)
            ) {
                if (angle > Math.PI / 2 && angle < Math.PI * 1.5) {
                    dir = -dir;
                }
                w += dir;
            }
        }
    }
    return w;
}

function containPath(data, lineWidth, isStroke, x, y) {
    var w = 0;
    var xi = 0;
    var yi = 0;
    var x0 = 0;
    var y0 = 0;

    for (var i = 0; i < data.length;) {
        var cmd = data[i++];
        // Begin a new subpath
        if (cmd === CMD.M && i > 1) {
            // Close previous subpath
            if (!isStroke) {
                w += __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_7__windingLine__["a" /* default */])(xi, yi, x0, y0, x, y);
            }
            // 如果被任何一个 subpath 包含
            // if (w !== 0) {
            //     return true;
            // }
        }

        if (i == 1) {
            // 如果第一个命令是 L, C, Q
            // 则 previous point 同绘制命令的第一个 point
            //
            // 第一个命令为 Arc 的情况下会在后面特殊处理
            xi = data[i];
            yi = data[i + 1];

            x0 = xi;
            y0 = yi;
        }

        switch (cmd) {
            case CMD.M:
                // moveTo 命令重新创建一个新的 subpath, 并且更新新的起点
                // 在 closePath 的时候使用
                x0 = data[i++];
                y0 = data[i++];
                xi = x0;
                yi = y0;
                break;
            case CMD.L:
                if (isStroke) {
                    if (__WEBPACK_IMPORTED_MODULE_1__line__["a" /* containStroke */](xi, yi, data[i], data[i + 1], lineWidth, x, y)) {
                        return true;
                    }
                }
                else {
                    // NOTE 在第一个命令为 L, C, Q 的时候会计算出 NaN
                    w += __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_7__windingLine__["a" /* default */])(xi, yi, data[i], data[i + 1], x, y) || 0;
                }
                xi = data[i++];
                yi = data[i++];
                break;
            case CMD.C:
                if (isStroke) {
                    if (__WEBPACK_IMPORTED_MODULE_2__cubic__["a" /* containStroke */](xi, yi,
                        data[i++], data[i++], data[i++], data[i++], data[i], data[i + 1],
                        lineWidth, x, y
                    )) {
                        return true;
                    }
                }
                else {
                    w += windingCubic(
                        xi, yi,
                        data[i++], data[i++], data[i++], data[i++], data[i], data[i + 1],
                        x, y
                    ) || 0;
                }
                xi = data[i++];
                yi = data[i++];
                break;
            case CMD.Q:
                if (isStroke) {
                    if (__WEBPACK_IMPORTED_MODULE_3__quadratic__["a" /* containStroke */](xi, yi,
                        data[i++], data[i++], data[i], data[i + 1],
                        lineWidth, x, y
                    )) {
                        return true;
                    }
                }
                else {
                    w += windingQuadratic(
                        xi, yi,
                        data[i++], data[i++], data[i], data[i + 1],
                        x, y
                    ) || 0;
                }
                xi = data[i++];
                yi = data[i++];
                break;
            case CMD.A:
                // TODO Arc 判断的开销比较大
                var cx = data[i++];
                var cy = data[i++];
                var rx = data[i++];
                var ry = data[i++];
                var theta = data[i++];
                var dTheta = data[i++];
                // TODO Arc 旋转
                var psi = data[i++];
                var anticlockwise = 1 - data[i++];
                var x1 = Math.cos(theta) * rx + cx;
                var y1 = Math.sin(theta) * ry + cy;
                // 不是直接使用 arc 命令
                if (i > 1) {
                    w += __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_7__windingLine__["a" /* default */])(xi, yi, x1, y1, x, y);
                }
                else {
                    // 第一个命令起点还未定义
                    x0 = x1;
                    y0 = y1;
                }
                // zr 使用scale来模拟椭圆, 这里也对x做一定的缩放
                var _x = (x - cx) * ry / rx + cx;
                if (isStroke) {
                    if (__WEBPACK_IMPORTED_MODULE_4__arc__["a" /* containStroke */](
                        cx, cy, ry, theta, theta + dTheta, anticlockwise,
                        lineWidth, _x, y
                    )) {
                        return true;
                    }
                }
                else {
                    w += windingArc(
                        cx, cy, ry, theta, theta + dTheta, anticlockwise,
                        _x, y
                    );
                }
                xi = Math.cos(theta + dTheta) * rx + cx;
                yi = Math.sin(theta + dTheta) * ry + cy;
                break;
            case CMD.R:
                x0 = xi = data[i++];
                y0 = yi = data[i++];
                var width = data[i++];
                var height = data[i++];
                var x1 = x0 + width;
                var y1 = y0 + height;
                if (isStroke) {
                    if (__WEBPACK_IMPORTED_MODULE_1__line__["a" /* containStroke */](x0, y0, x1, y0, lineWidth, x, y)
                        || __WEBPACK_IMPORTED_MODULE_1__line__["a" /* containStroke */](x1, y0, x1, y1, lineWidth, x, y)
                        || __WEBPACK_IMPORTED_MODULE_1__line__["a" /* containStroke */](x1, y1, x0, y1, lineWidth, x, y)
                        || __WEBPACK_IMPORTED_MODULE_1__line__["a" /* containStroke */](x0, y1, x0, y0, lineWidth, x, y)
                    ) {
                        return true;
                    }
                }
                else {
                    // FIXME Clockwise ?
                    w += __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_7__windingLine__["a" /* default */])(x1, y0, x1, y1, x, y);
                    w += __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_7__windingLine__["a" /* default */])(x0, y1, x0, y0, x, y);
                }
                break;
            case CMD.Z:
                if (isStroke) {
                    if (__WEBPACK_IMPORTED_MODULE_1__line__["a" /* containStroke */](
                        xi, yi, x0, y0, lineWidth, x, y
                    )) {
                        return true;
                    }
                }
                else {
                    // Close a subpath
                    w += __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_7__windingLine__["a" /* default */])(xi, yi, x0, y0, x, y);
                    // 如果被任何一个 subpath 包含
                    // FIXME subpaths may overlap
                    // if (w !== 0) {
                    //     return true;
                    // }
                }
                xi = x0;
                yi = y0;
                break;
        }
    }
    if (!isStroke && !isAroundEqual(yi, y0)) {
        w += __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_7__windingLine__["a" /* default */])(xi, yi, x0, y0, x, y) || 0;
    }
    return w !== 0;
}

function contain(pathData, x, y) {
    return containPath(pathData, 0, false, x, y);
}

function containStroke(pathData, lineWidth, x, y) {
    return containPath(pathData, lineWidth, true, x, y);
}

/***/ }),

/***/ 882:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = containStroke;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__core_curve__ = __webpack_require__(82);


/**
 * 二次贝塞尔曲线描边包含判断
 * @param  {number}  x0
 * @param  {number}  y0
 * @param  {number}  x1
 * @param  {number}  y1
 * @param  {number}  x2
 * @param  {number}  y2
 * @param  {number}  lineWidth
 * @param  {number}  x
 * @param  {number}  y
 * @return {boolean}
 */
function containStroke(x0, y0, x1, y1, x2, y2, lineWidth, x, y) {
    if (lineWidth === 0) {
        return false;
    }
    var _l = lineWidth;
    // Quick reject
    if (
        (y > y0 + _l && y > y1 + _l && y > y2 + _l)
        || (y < y0 - _l && y < y1 - _l && y < y2 - _l)
        || (x > x0 + _l && x > x1 + _l && x > x2 + _l)
        || (x < x0 - _l && x < x1 - _l && x < x2 - _l)
    ) {
        return false;
    }
    var d = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__core_curve__["g" /* quadraticProjectPoint */])(
        x0, y0, x1, y1, x2, y2,
        x, y, null
    );
    return d <= _l / 2;
}


/***/ }),

/***/ 883:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return DEFAULT_FONT; });
/* unused harmony export $override */
/* harmony export (immutable) */ __webpack_exports__["e"] = getWidth;
/* unused harmony export getBoundingRect */
/* harmony export (immutable) */ __webpack_exports__["f"] = adjustTextX;
/* harmony export (immutable) */ __webpack_exports__["d"] = adjustTextY;
/* harmony export (immutable) */ __webpack_exports__["h"] = adjustTextPositionOnRect;
/* unused harmony export truncateText */
/* unused harmony export getLineHeight */
/* unused harmony export measureText */
/* harmony export (immutable) */ __webpack_exports__["c"] = parsePlainText;
/* harmony export (immutable) */ __webpack_exports__["g"] = parseRichText;
/* harmony export (immutable) */ __webpack_exports__["a"] = makeFont;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__core_BoundingRect__ = __webpack_require__(81);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__graphic_helper_image__ = __webpack_require__(214);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__core_util__ = __webpack_require__(24);




var textWidthCache = {};
var textWidthCacheCounter = 0;

var TEXT_CACHE_MAX = 5000;
var STYLE_REG = /\{([a-zA-Z0-9_]+)\|([^}]*)\}/g;

var DEFAULT_FONT = '12px sans-serif';

// Avoid assign to an exported variable, for transforming to cjs.
var methods = {};

function $override(name, fn) {
    methods[name] = fn;
}

/**
 * @public
 * @param {string} text
 * @param {string} font
 * @return {number} width
 */
function getWidth(text, font) {
    font = font || DEFAULT_FONT;
    var key = text + ':' + font;
    if (textWidthCache[key]) {
        return textWidthCache[key];
    }

    var textLines = (text + '').split('\n');
    var width = 0;

    for (var i = 0, l = textLines.length; i < l; i++) {
        // textContain.measureText may be overrided in SVG or VML
        width = Math.max(measureText(textLines[i], font).width, width);
    }

    if (textWidthCacheCounter > TEXT_CACHE_MAX) {
        textWidthCacheCounter = 0;
        textWidthCache = {};
    }
    textWidthCacheCounter++;
    textWidthCache[key] = width;

    return width;
}

/**
 * @public
 * @param {string} text
 * @param {string} font
 * @param {string} [textAlign='left']
 * @param {string} [textVerticalAlign='top']
 * @param {Array.<number>} [textPadding]
 * @param {Object} [rich]
 * @param {Object} [truncate]
 * @return {Object} {x, y, width, height, lineHeight}
 */
function getBoundingRect(text, font, textAlign, textVerticalAlign, textPadding, rich, truncate) {
    return rich
        ? getRichTextRect(text, font, textAlign, textVerticalAlign, textPadding, rich, truncate)
        : getPlainTextRect(text, font, textAlign, textVerticalAlign, textPadding, truncate);
}

function getPlainTextRect(text, font, textAlign, textVerticalAlign, textPadding, truncate) {
    var contentBlock = parsePlainText(text, font, textPadding, truncate);
    var outerWidth = getWidth(text, font);
    if (textPadding) {
        outerWidth += textPadding[1] + textPadding[3];
    }
    var outerHeight = contentBlock.outerHeight;

    var x = adjustTextX(0, outerWidth, textAlign);
    var y = adjustTextY(0, outerHeight, textVerticalAlign);

    var rect = new __WEBPACK_IMPORTED_MODULE_0__core_BoundingRect__["a" /* default */](x, y, outerWidth, outerHeight);
    rect.lineHeight = contentBlock.lineHeight;

    return rect;
}

function getRichTextRect(text, font, textAlign, textVerticalAlign, textPadding, rich, truncate) {
    var contentBlock = parseRichText(text, {
        rich: rich,
        truncate: truncate,
        font: font,
        textAlign: textAlign,
        textPadding: textPadding
    });
    var outerWidth = contentBlock.outerWidth;
    var outerHeight = contentBlock.outerHeight;

    var x = adjustTextX(0, outerWidth, textAlign);
    var y = adjustTextY(0, outerHeight, textVerticalAlign);

    return new __WEBPACK_IMPORTED_MODULE_0__core_BoundingRect__["a" /* default */](x, y, outerWidth, outerHeight);
}

/**
 * @public
 * @param {number} x
 * @param {number} width
 * @param {string} [textAlign='left']
 * @return {number} Adjusted x.
 */
function adjustTextX(x, width, textAlign) {
    // FIXME Right to left language
    if (textAlign === 'right') {
        x -= width;
    }
    else if (textAlign === 'center') {
        x -= width / 2;
    }
    return x;
}

/**
 * @public
 * @param {number} y
 * @param {number} height
 * @param {string} [textVerticalAlign='top']
 * @return {number} Adjusted y.
 */
function adjustTextY(y, height, textVerticalAlign) {
    if (textVerticalAlign === 'middle') {
        y -= height / 2;
    }
    else if (textVerticalAlign === 'bottom') {
        y -= height;
    }
    return y;
}

/**
 * @public
 * @param {stirng} textPosition
 * @param {Object} rect {x, y, width, height}
 * @param {number} distance
 * @return {Object} {x, y, textAlign, textVerticalAlign}
 */
function adjustTextPositionOnRect(textPosition, rect, distance) {

    var x = rect.x;
    var y = rect.y;

    var height = rect.height;
    var width = rect.width;
    var halfHeight = height / 2;

    var textAlign = 'left';
    var textVerticalAlign = 'top';

    switch (textPosition) {
        case 'left':
            x -= distance;
            y += halfHeight;
            textAlign = 'right';
            textVerticalAlign = 'middle';
            break;
        case 'right':
            x += distance + width;
            y += halfHeight;
            textVerticalAlign = 'middle';
            break;
        case 'top':
            x += width / 2;
            y -= distance;
            textAlign = 'center';
            textVerticalAlign = 'bottom';
            break;
        case 'bottom':
            x += width / 2;
            y += height + distance;
            textAlign = 'center';
            break;
        case 'inside':
            x += width / 2;
            y += halfHeight;
            textAlign = 'center';
            textVerticalAlign = 'middle';
            break;
        case 'insideLeft':
            x += distance;
            y += halfHeight;
            textVerticalAlign = 'middle';
            break;
        case 'insideRight':
            x += width - distance;
            y += halfHeight;
            textAlign = 'right';
            textVerticalAlign = 'middle';
            break;
        case 'insideTop':
            x += width / 2;
            y += distance;
            textAlign = 'center';
            break;
        case 'insideBottom':
            x += width / 2;
            y += height - distance;
            textAlign = 'center';
            textVerticalAlign = 'bottom';
            break;
        case 'insideTopLeft':
            x += distance;
            y += distance;
            break;
        case 'insideTopRight':
            x += width - distance;
            y += distance;
            textAlign = 'right';
            break;
        case 'insideBottomLeft':
            x += distance;
            y += height - distance;
            textVerticalAlign = 'bottom';
            break;
        case 'insideBottomRight':
            x += width - distance;
            y += height - distance;
            textAlign = 'right';
            textVerticalAlign = 'bottom';
            break;
    }

    return {
        x: x,
        y: y,
        textAlign: textAlign,
        textVerticalAlign: textVerticalAlign
    };
}

/**
 * Show ellipsis if overflow.
 *
 * @public
 * @param  {string} text
 * @param  {string} containerWidth
 * @param  {string} font
 * @param  {number} [ellipsis='...']
 * @param  {Object} [options]
 * @param  {number} [options.maxIterations=3]
 * @param  {number} [options.minChar=0] If truncate result are less
 *                  then minChar, ellipsis will not show, which is
 *                  better for user hint in some cases.
 * @param  {number} [options.placeholder=''] When all truncated, use the placeholder.
 * @return {string}
 */
function truncateText(text, containerWidth, font, ellipsis, options) {
    if (!containerWidth) {
        return '';
    }

    var textLines = (text + '').split('\n');
    options = prepareTruncateOptions(containerWidth, font, ellipsis, options);

    // FIXME
    // It is not appropriate that every line has '...' when truncate multiple lines.
    for (var i = 0, len = textLines.length; i < len; i++) {
        textLines[i] = truncateSingleLine(textLines[i], options);
    }

    return textLines.join('\n');
}

function prepareTruncateOptions(containerWidth, font, ellipsis, options) {
    options = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__core_util__["k" /* extend */])({}, options);

    options.font = font;
    var ellipsis = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__core_util__["o" /* retrieve2 */])(ellipsis, '...');
    options.maxIterations = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__core_util__["o" /* retrieve2 */])(options.maxIterations, 2);
    var minChar = options.minChar = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__core_util__["o" /* retrieve2 */])(options.minChar, 0);
    // FIXME
    // Other languages?
    options.cnCharWidth = getWidth('国', font);
    // FIXME
    // Consider proportional font?
    var ascCharWidth = options.ascCharWidth = getWidth('a', font);
    options.placeholder = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__core_util__["o" /* retrieve2 */])(options.placeholder, '');

    // Example 1: minChar: 3, text: 'asdfzxcv', truncate result: 'asdf', but not: 'a...'.
    // Example 2: minChar: 3, text: '维度', truncate result: '维', but not: '...'.
    var contentWidth = containerWidth = Math.max(0, containerWidth - 1); // Reserve some gap.
    for (var i = 0; i < minChar && contentWidth >= ascCharWidth; i++) {
        contentWidth -= ascCharWidth;
    }

    var ellipsisWidth = getWidth(ellipsis);
    if (ellipsisWidth > contentWidth) {
        ellipsis = '';
        ellipsisWidth = 0;
    }

    contentWidth = containerWidth - ellipsisWidth;

    options.ellipsis = ellipsis;
    options.ellipsisWidth = ellipsisWidth;
    options.contentWidth = contentWidth;
    options.containerWidth = containerWidth;

    return options;
}

function truncateSingleLine(textLine, options) {
    var containerWidth = options.containerWidth;
    var font = options.font;
    var contentWidth = options.contentWidth;

    if (!containerWidth) {
        return '';
    }

    var lineWidth = getWidth(textLine, font);

    if (lineWidth <= containerWidth) {
        return textLine;
    }

    for (var j = 0;; j++) {
        if (lineWidth <= contentWidth || j >= options.maxIterations) {
            textLine += options.ellipsis;
            break;
        }

        var subLength = j === 0
            ? estimateLength(textLine, contentWidth, options.ascCharWidth, options.cnCharWidth)
            : lineWidth > 0
            ? Math.floor(textLine.length * contentWidth / lineWidth)
            : 0;

        textLine = textLine.substr(0, subLength);
        lineWidth = getWidth(textLine, font);
    }

    if (textLine === '') {
        textLine = options.placeholder;
    }

    return textLine;
}

function estimateLength(text, contentWidth, ascCharWidth, cnCharWidth) {
    var width = 0;
    var i = 0;
    for (var len = text.length; i < len && width < contentWidth; i++) {
        var charCode = text.charCodeAt(i);
        width += (0 <= charCode && charCode <= 127) ? ascCharWidth : cnCharWidth;
    }
    return i;
}

/**
 * @public
 * @param {string} font
 * @return {number} line height
 */
function getLineHeight(font) {
    // FIXME A rough approach.
    return getWidth('国', font);
}

/**
 * @public
 * @param {string} text
 * @param {string} font
 * @return {Object} width
 */
function measureText(text, font) {
    return methods.measureText(text, font);
}

// Avoid assign to an exported variable, for transforming to cjs.
methods.measureText = function (text, font) {
    var ctx = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__core_util__["p" /* getContext */])();
    ctx.font = font || DEFAULT_FONT;
    return ctx.measureText(text);
};

/**
 * @public
 * @param {string} text
 * @param {string} font
 * @param {Object} [truncate]
 * @return {Object} block: {lineHeight, lines, height, outerHeight}
 *  Notice: for performance, do not calculate outerWidth util needed.
 */
function parsePlainText(text, font, padding, truncate) {
    text != null && (text += '');

    var lineHeight = getLineHeight(font);
    var lines = text ? text.split('\n') : [];
    var height = lines.length * lineHeight;
    var outerHeight = height;

    if (padding) {
        outerHeight += padding[0] + padding[2];
    }

    if (text && truncate) {
        var truncOuterHeight = truncate.outerHeight;
        var truncOuterWidth = truncate.outerWidth;
        if (truncOuterHeight != null && outerHeight > truncOuterHeight) {
            text = '';
            lines = [];
        }
        else if (truncOuterWidth != null) {
            var options = prepareTruncateOptions(
                truncOuterWidth - (padding ? padding[1] + padding[3] : 0),
                font,
                truncate.ellipsis,
                {minChar: truncate.minChar, placeholder: truncate.placeholder}
            );

            // FIXME
            // It is not appropriate that every line has '...' when truncate multiple lines.
            for (var i = 0, len = lines.length; i < len; i++) {
                lines[i] = truncateSingleLine(lines[i], options);
            }
        }
    }

    return {
        lines: lines,
        height: height,
        outerHeight: outerHeight,
        lineHeight: lineHeight
    };
}

/**
 * For example: 'some text {a|some text}other text{b|some text}xxx{c|}xxx'
 * Also consider 'bbbb{a|xxx\nzzz}xxxx\naaaa'.
 *
 * @public
 * @param {string} text
 * @param {Object} style
 * @return {Object} block
 * {
 *      width,
 *      height,
 *      lines: [{
 *          lineHeight,
 *          width,
 *          tokens: [[{
 *              styleName,
 *              text,
 *              width,      // include textPadding
 *              height,     // include textPadding
 *              textWidth, // pure text width
 *              textHeight, // pure text height
 *              lineHeihgt,
 *              font,
 *              textAlign,
 *              textVerticalAlign
 *          }], [...], ...]
 *      }, ...]
 * }
 * If styleName is undefined, it is plain text.
 */
function parseRichText(text, style) {
    var contentBlock = {lines: [], width: 0, height: 0};

    text != null && (text += '');
    if (!text) {
        return contentBlock;
    }

    var lastIndex = STYLE_REG.lastIndex = 0;
    var result;
    while ((result = STYLE_REG.exec(text)) != null) {
        var matchedIndex = result.index;
        if (matchedIndex > lastIndex) {
            pushTokens(contentBlock, text.substring(lastIndex, matchedIndex));
        }
        pushTokens(contentBlock, result[2], result[1]);
        lastIndex = STYLE_REG.lastIndex;
    }

    if (lastIndex < text.length) {
        pushTokens(contentBlock, text.substring(lastIndex, text.length));
    }

    var lines = contentBlock.lines;
    var contentHeight = 0;
    var contentWidth = 0;
    // For `textWidth: 100%`
    var pendingList = [];

    var stlPadding = style.textPadding;

    var truncate = style.truncate;
    var truncateWidth = truncate && truncate.outerWidth;
    var truncateHeight = truncate && truncate.outerHeight;
    if (stlPadding) {
        truncateWidth != null && (truncateWidth -= stlPadding[1] + stlPadding[3]);
        truncateHeight != null && (truncateHeight -= stlPadding[0] + stlPadding[2]);
    }

    // Calculate layout info of tokens.
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        var lineHeight = 0;
        var lineWidth = 0;

        for (var j = 0; j < line.tokens.length; j++) {
            var token = line.tokens[j];
            var tokenStyle = token.styleName && style.rich[token.styleName] || {};
            // textPadding should not inherit from style.
            var textPadding = token.textPadding = tokenStyle.textPadding;

            // textFont has been asigned to font by `normalizeStyle`.
            var font = token.font = tokenStyle.font || style.font;

            // textHeight can be used when textVerticalAlign is specified in token.
            var tokenHeight = token.textHeight = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__core_util__["o" /* retrieve2 */])(
                // textHeight should not be inherited, consider it can be specified
                // as box height of the block.
                tokenStyle.textHeight, getLineHeight(font)
            );
            textPadding && (tokenHeight += textPadding[0] + textPadding[2]);
            token.height = tokenHeight;
            token.lineHeight = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__core_util__["n" /* retrieve3 */])(
                tokenStyle.textLineHeight, style.textLineHeight, tokenHeight
            );

            token.textAlign = tokenStyle && tokenStyle.textAlign || style.textAlign;
            token.textVerticalAlign = tokenStyle && tokenStyle.textVerticalAlign || 'middle';

            if (truncateHeight != null && contentHeight + token.lineHeight > truncateHeight) {
                return {lines: [], width: 0, height: 0};
            }

            token.textWidth = getWidth(token.text, font);
            var tokenWidth = tokenStyle.textWidth;
            var tokenWidthNotSpecified = tokenWidth == null || tokenWidth === 'auto';

            // Percent width, can be `100%`, can be used in drawing separate
            // line when box width is needed to be auto.
            if (typeof tokenWidth === 'string' && tokenWidth.charAt(tokenWidth.length - 1) === '%') {
                token.percentWidth = tokenWidth;
                pendingList.push(token);
                tokenWidth = 0;
                // Do not truncate in this case, because there is no user case
                // and it is too complicated.
            }
            else {
                if (tokenWidthNotSpecified) {
                    tokenWidth = token.textWidth;

                    // FIXME: If image is not loaded and textWidth is not specified, calling
                    // `getBoundingRect()` will not get correct result.
                    var textBackgroundColor = tokenStyle.textBackgroundColor;
                    var bgImg = textBackgroundColor && textBackgroundColor.image;

                    // Use cases:
                    // (1) If image is not loaded, it will be loaded at render phase and call
                    // `dirty()` and `textBackgroundColor.image` will be replaced with the loaded
                    // image, and then the right size will be calculated here at the next tick.
                    // See `graphic/helper/text.js`.
                    // (2) If image loaded, and `textBackgroundColor.image` is image src string,
                    // use `imageHelper.findExistImage` to find cached image.
                    // `imageHelper.findExistImage` will always be called here before
                    // `imageHelper.createOrUpdateImage` in `graphic/helper/text.js#renderRichText`
                    // which ensures that image will not be rendered before correct size calcualted.
                    if (bgImg) {
                        bgImg = __WEBPACK_IMPORTED_MODULE_1__graphic_helper_image__["c" /* findExistImage */](bgImg);
                        if (__WEBPACK_IMPORTED_MODULE_1__graphic_helper_image__["b" /* isImageReady */](bgImg)) {
                            tokenWidth = Math.max(tokenWidth, bgImg.width * tokenHeight / bgImg.height);
                        }
                    }
                }

                var paddingW = textPadding ? textPadding[1] + textPadding[3] : 0;
                tokenWidth += paddingW;

                var remianTruncWidth = truncateWidth != null ? truncateWidth - lineWidth : null;

                if (remianTruncWidth != null && remianTruncWidth < tokenWidth) {
                    if (!tokenWidthNotSpecified || remianTruncWidth < paddingW) {
                        token.text = '';
                        token.textWidth = tokenWidth = 0;
                    }
                    else {
                        token.text = truncateText(
                            token.text, remianTruncWidth - paddingW, font, truncate.ellipsis,
                            {minChar: truncate.minChar}
                        );
                        token.textWidth = getWidth(token.text, font);
                        tokenWidth = token.textWidth + paddingW;
                    }
                }
            }

            lineWidth += (token.width = tokenWidth);
            tokenStyle && (lineHeight = Math.max(lineHeight, token.lineHeight));
        }

        line.width = lineWidth;
        line.lineHeight = lineHeight;
        contentHeight += lineHeight;
        contentWidth = Math.max(contentWidth, lineWidth);
    }

    contentBlock.outerWidth = contentBlock.width = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__core_util__["o" /* retrieve2 */])(style.textWidth, contentWidth);
    contentBlock.outerHeight = contentBlock.height = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__core_util__["o" /* retrieve2 */])(style.textHeight, contentHeight);

    if (stlPadding) {
        contentBlock.outerWidth += stlPadding[1] + stlPadding[3];
        contentBlock.outerHeight += stlPadding[0] + stlPadding[2];
    }

    for (var i = 0; i < pendingList.length; i++) {
        var token = pendingList[i];
        var percentWidth = token.percentWidth;
        // Should not base on outerWidth, because token can not be placed out of padding.
        token.width = parseInt(percentWidth, 10) / 100 * contentWidth;
    }

    return contentBlock;
}

function pushTokens(block, str, styleName) {
    var isEmptyStr = str === '';
    var strs = str.split('\n');
    var lines = block.lines;

    for (var i = 0; i < strs.length; i++) {
        var text = strs[i];
        var token = {
            styleName: styleName,
            text: text,
            isLineHolder: !text && !isEmptyStr
        };

        // The first token should be appended to the last line.
        if (!i) {
            var tokens = (lines[lines.length - 1] || (lines[0] = {tokens: []})).tokens;

            // Consider cases:
            // (1) ''.split('\n') => ['', '\n', ''], the '' at the first item
            // (which is a placeholder) should be replaced by new token.
            // (2) A image backage, where token likes {a|}.
            // (3) A redundant '' will affect textAlign in line.
            // (4) tokens with the same tplName should not be merged, because
            // they should be displayed in different box (with border and padding).
            var tokensLen = tokens.length;
            (tokensLen === 1 && tokens[0].isLineHolder)
                ? (tokens[0] = token)
                // Consider text is '', only insert when it is the "lineHolder" or
                // "emptyStr". Otherwise a redundant '' will affect textAlign in line.
                : ((text || !tokensLen || isEmptyStr) && tokens.push(token));
        }
        // Other tokens always start a new line.
        else {
            // If there is '', insert it as a placeholder.
            lines.push({tokens: [token]});
        }
    }
}

function makeFont(style) {
    // FIXME in node-canvas fontWeight is before fontStyle
    // Use `fontSize` `fontFamily` to check whether font properties are defined.
    return (style.fontSize || style.fontFamily) && [
        style.fontStyle,
        style.fontWeight,
        (style.fontSize || 12) + 'px',
        // If font properties are defined, `fontFamily` should not be ignored.
        style.fontFamily || 'sans-serif'
    ].join(' ') || style.textFont || style.font;
}


/***/ }),

/***/ 884:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = windingLine;

function windingLine(x0, y0, x1, y1, x, y) {
    if ((y > y0 && y > y1) || (y < y0 && y < y1)) {
        return 0;
    }
    // Ignore horizontal line
    if (y1 === y0) {
        return 0;
    }
    var dir = y1 < y0 ? 1 : -1;
    var t = (y - y0) / (y1 - y0);

    // Avoid winding error when intersection point is the connect point of two line of polygon
    if (t === 1 || t === 0) {
        dir = y1 < y0 ? 0.5 : -0.5;
    }

    var x_ = t * (x1 - x0) + x0;

    return x_ > x ? dir : 0;
}

/***/ }),

/***/ 885:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__event__ = __webpack_require__(212);
/**
 * Only implements needed gestures for mobile.
 */



var GestureMgr = function () {

    /**
     * @private
     * @type {Array.<Object>}
     */
    this._track = [];
};

GestureMgr.prototype = {

    constructor: GestureMgr,

    recognize: function (event, target, root) {
        this._doTrack(event, target, root);
        return this._recognize(event);
    },

    clear: function () {
        this._track.length = 0;
        return this;
    },

    _doTrack: function (event, target, root) {
        var touches = event.touches;

        if (!touches) {
            return;
        }

        var trackItem = {
            points: [],
            touches: [],
            target: target,
            event: event
        };

        for (var i = 0, len = touches.length; i < len; i++) {
            var touch = touches[i];
            var pos = __WEBPACK_IMPORTED_MODULE_0__event__["e" /* clientToLocal */](root, touch, {});
            trackItem.points.push([pos.zrX, pos.zrY]);
            trackItem.touches.push(touch);
        }

        this._track.push(trackItem);
    },

    _recognize: function (event) {
        for (var eventName in recognizers) {
            if (recognizers.hasOwnProperty(eventName)) {
                var gestureInfo = recognizers[eventName](this._track, event);
                if (gestureInfo) {
                    return gestureInfo;
                }
            }
        }
    }
};

function dist(pointPair) {
    var dx = pointPair[1][0] - pointPair[0][0];
    var dy = pointPair[1][1] - pointPair[0][1];

    return Math.sqrt(dx * dx + dy * dy);
}

function center(pointPair) {
    return [
        (pointPair[0][0] + pointPair[1][0]) / 2,
        (pointPair[0][1] + pointPair[1][1]) / 2
    ];
}

var recognizers = {

    pinch: function (track, event) {
        var trackLen = track.length;

        if (!trackLen) {
            return;
        }

        var pinchEnd = (track[trackLen - 1] || {}).points;
        var pinchPre = (track[trackLen - 2] || {}).points || pinchEnd;

        if (pinchPre
            && pinchPre.length > 1
            && pinchEnd
            && pinchEnd.length > 1
        ) {
            var pinchScale = dist(pinchEnd) / dist(pinchPre);
            !isFinite(pinchScale) && (pinchScale = 1);

            event.pinchScale = pinchScale;

            var pinchCenter = center(pinchEnd);
            event.pinchX = pinchCenter[0];
            event.pinchY = pinchCenter[1];

            return {
                type: 'pinch',
                target: track[0].target,
                event: event
            };
        }
    }

    // Only pinch currently.
};

/* harmony default export */ __webpack_exports__["a"] = (GestureMgr);

/***/ }),

/***/ 886:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export fromPoints */
/* harmony export (immutable) */ __webpack_exports__["a"] = fromLine;
/* harmony export (immutable) */ __webpack_exports__["b"] = fromCubic;
/* harmony export (immutable) */ __webpack_exports__["c"] = fromQuadratic;
/* harmony export (immutable) */ __webpack_exports__["d"] = fromArc;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__vector__ = __webpack_require__(50);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__curve__ = __webpack_require__(82);
/**
 * @author Yi Shen(https://github.com/pissang)
 */




var mathMin = Math.min;
var mathMax = Math.max;
var mathSin = Math.sin;
var mathCos = Math.cos;
var PI2 = Math.PI * 2;

var start = __WEBPACK_IMPORTED_MODULE_0__vector__["c" /* create */]();
var end = __WEBPACK_IMPORTED_MODULE_0__vector__["c" /* create */]();
var extremity = __WEBPACK_IMPORTED_MODULE_0__vector__["c" /* create */]();

/**
 * 从顶点数组中计算出最小包围盒，写入`min`和`max`中
 * @module zrender/core/bbox
 * @param {Array<Object>} points 顶点数组
 * @param {number} min
 * @param {number} max
 */
function fromPoints(points, min, max) {
    if (points.length === 0) {
        return;
    }
    var p = points[0];
    var left = p[0];
    var right = p[0];
    var top = p[1];
    var bottom = p[1];
    var i;

    for (i = 1; i < points.length; i++) {
        p = points[i];
        left = mathMin(left, p[0]);
        right = mathMax(right, p[0]);
        top = mathMin(top, p[1]);
        bottom = mathMax(bottom, p[1]);
    }

    min[0] = left;
    min[1] = top;
    max[0] = right;
    max[1] = bottom;
}

/**
 * @memberOf module:zrender/core/bbox
 * @param {number} x0
 * @param {number} y0
 * @param {number} x1
 * @param {number} y1
 * @param {Array.<number>} min
 * @param {Array.<number>} max
 */
function fromLine(x0, y0, x1, y1, min, max) {
    min[0] = mathMin(x0, x1);
    min[1] = mathMin(y0, y1);
    max[0] = mathMax(x0, x1);
    max[1] = mathMax(y0, y1);
}

var xDim = [];
var yDim = [];
/**
 * 从三阶贝塞尔曲线(p0, p1, p2, p3)中计算出最小包围盒，写入`min`和`max`中
 * @memberOf module:zrender/core/bbox
 * @param {number} x0
 * @param {number} y0
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @param {number} x3
 * @param {number} y3
 * @param {Array.<number>} min
 * @param {Array.<number>} max
 */
function fromCubic(
    x0, y0, x1, y1, x2, y2, x3, y3, min, max
) {
    var cubicExtrema = __WEBPACK_IMPORTED_MODULE_1__curve__["c" /* cubicExtrema */];
    var cubicAt = __WEBPACK_IMPORTED_MODULE_1__curve__["b" /* cubicAt */];
    var i;
    var n = cubicExtrema(x0, x1, x2, x3, xDim);
    min[0] = Infinity;
    min[1] = Infinity;
    max[0] = -Infinity;
    max[1] = -Infinity;

    for (i = 0; i < n; i++) {
        var x = cubicAt(x0, x1, x2, x3, xDim[i]);
        min[0] = mathMin(x, min[0]);
        max[0] = mathMax(x, max[0]);
    }
    n = cubicExtrema(y0, y1, y2, y3, yDim);
    for (i = 0; i < n; i++) {
        var y = cubicAt(y0, y1, y2, y3, yDim[i]);
        min[1] = mathMin(y, min[1]);
        max[1] = mathMax(y, max[1]);
    }

    min[0] = mathMin(x0, min[0]);
    max[0] = mathMax(x0, max[0]);
    min[0] = mathMin(x3, min[0]);
    max[0] = mathMax(x3, max[0]);

    min[1] = mathMin(y0, min[1]);
    max[1] = mathMax(y0, max[1]);
    min[1] = mathMin(y3, min[1]);
    max[1] = mathMax(y3, max[1]);
}

/**
 * 从二阶贝塞尔曲线(p0, p1, p2)中计算出最小包围盒，写入`min`和`max`中
 * @memberOf module:zrender/core/bbox
 * @param {number} x0
 * @param {number} y0
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @param {Array.<number>} min
 * @param {Array.<number>} max
 */
function fromQuadratic(x0, y0, x1, y1, x2, y2, min, max) {
    var quadraticExtremum = __WEBPACK_IMPORTED_MODULE_1__curve__["e" /* quadraticExtremum */];
    var quadraticAt = __WEBPACK_IMPORTED_MODULE_1__curve__["f" /* quadraticAt */];
    // Find extremities, where derivative in x dim or y dim is zero
    var tx =
        mathMax(
            mathMin(quadraticExtremum(x0, x1, x2), 1), 0
        );
    var ty =
        mathMax(
            mathMin(quadraticExtremum(y0, y1, y2), 1), 0
        );

    var x = quadraticAt(x0, x1, x2, tx);
    var y = quadraticAt(y0, y1, y2, ty);

    min[0] = mathMin(x0, x2, x);
    min[1] = mathMin(y0, y2, y);
    max[0] = mathMax(x0, x2, x);
    max[1] = mathMax(y0, y2, y);
}

/**
 * 从圆弧中计算出最小包围盒，写入`min`和`max`中
 * @method
 * @memberOf module:zrender/core/bbox
 * @param {number} x
 * @param {number} y
 * @param {number} rx
 * @param {number} ry
 * @param {number} startAngle
 * @param {number} endAngle
 * @param {number} anticlockwise
 * @param {Array.<number>} min
 * @param {Array.<number>} max
 */
function fromArc(
    x, y, rx, ry, startAngle, endAngle, anticlockwise, min, max
) {
    var vec2Min = __WEBPACK_IMPORTED_MODULE_0__vector__["e" /* min */];
    var vec2Max = __WEBPACK_IMPORTED_MODULE_0__vector__["f" /* max */];

    var diff = Math.abs(startAngle - endAngle);


    if (diff % PI2 < 1e-4 && diff > 1e-4) {
        // Is a circle
        min[0] = x - rx;
        min[1] = y - ry;
        max[0] = x + rx;
        max[1] = y + ry;
        return;
    }

    start[0] = mathCos(startAngle) * rx + x;
    start[1] = mathSin(startAngle) * ry + y;

    end[0] = mathCos(endAngle) * rx + x;
    end[1] = mathSin(endAngle) * ry + y;

    vec2Min(min, start, end);
    vec2Max(max, start, end);

    // Thresh to [0, Math.PI * 2]
    startAngle = startAngle % (PI2);
    if (startAngle < 0) {
        startAngle = startAngle + PI2;
    }
    endAngle = endAngle % (PI2);
    if (endAngle < 0) {
        endAngle = endAngle + PI2;
    }

    if (startAngle > endAngle && !anticlockwise) {
        endAngle += PI2;
    }
    else if (startAngle < endAngle && anticlockwise) {
        startAngle += PI2;
    }
    if (anticlockwise) {
        var tmp = endAngle;
        endAngle = startAngle;
        startAngle = tmp;
    }

    // var number = 0;
    // var step = (anticlockwise ? -Math.PI : Math.PI) / 2;
    for (var angle = 0; angle < endAngle; angle += Math.PI / 2) {
        if (angle > startAngle) {
            extremity[0] = mathCos(angle) * rx + x;
            extremity[1] = mathSin(angle) * ry + y;

            vec2Min(min, extremity, min);
            vec2Max(max, extremity, max);
        }
    }
}


/***/ }),

/***/ 887:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__core_event__ = __webpack_require__(212);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_util__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__mixin_Eventful__ = __webpack_require__(147);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__core_env__ = __webpack_require__(146);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__core_GestureMgr__ = __webpack_require__(885);







var TOUCH_CLICK_DELAY = 300;

var mouseHandlerNames = [
    'click', 'dblclick', 'mousewheel', 'mouseout',
    'mouseup', 'mousedown', 'mousemove', 'contextmenu'
];

var touchHandlerNames = [
    'touchstart', 'touchend', 'touchmove'
];

var pointerEventNames = {
    pointerdown: 1, pointerup: 1, pointermove: 1, pointerout: 1
};

var pointerHandlerNames = __WEBPACK_IMPORTED_MODULE_1__core_util__["g" /* map */](mouseHandlerNames, function (name) {
    var nm = name.replace('mouse', 'pointer');
    return pointerEventNames[nm] ? nm : name;
});

function eventNameFix(name) {
    return (name === 'mousewheel' && __WEBPACK_IMPORTED_MODULE_3__core_env__["a" /* default */].browser.firefox) ? 'DOMMouseScroll' : name;
}

function processGesture(proxy, event, stage) {
    var gestureMgr = proxy._gestureMgr;

    stage === 'start' && gestureMgr.clear();

    var gestureInfo = gestureMgr.recognize(
        event,
        proxy.handler.findHover(event.zrX, event.zrY, null).target,
        proxy.dom
    );

    stage === 'end' && gestureMgr.clear();

    // Do not do any preventDefault here. Upper application do that if necessary.
    if (gestureInfo) {
        var type = gestureInfo.type;
        event.gestureEvent = type;

        proxy.handler.dispatchToElement({target: gestureInfo.target}, type, gestureInfo.event);
    }
}

// function onMSGestureChange(proxy, event) {
//     if (event.translationX || event.translationY) {
//         // mousemove is carried by MSGesture to reduce the sensitivity.
//         proxy.handler.dispatchToElement(event.target, 'mousemove', event);
//     }
//     if (event.scale !== 1) {
//         event.pinchX = event.offsetX;
//         event.pinchY = event.offsetY;
//         event.pinchScale = event.scale;
//         proxy.handler.dispatchToElement(event.target, 'pinch', event);
//     }
// }

/**
 * Prevent mouse event from being dispatched after Touch Events action
 * @see <https://github.com/deltakosh/handjs/blob/master/src/hand.base.js>
 * 1. Mobile browsers dispatch mouse events 300ms after touchend.
 * 2. Chrome for Android dispatch mousedown for long-touch about 650ms
 * Result: Blocking Mouse Events for 700ms.
 */
function setTouchTimer(instance) {
    instance._touching = true;
    clearTimeout(instance._touchTimer);
    instance._touchTimer = setTimeout(function () {
        instance._touching = false;
    }, 700);
}


var domHandlers = {
    /**
     * Mouse move handler
     * @inner
     * @param {Event} event
     */
    mousemove: function (event) {
        event = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__core_event__["b" /* normalizeEvent */])(this.dom, event);

        this.trigger('mousemove', event);
    },

    /**
     * Mouse out handler
     * @inner
     * @param {Event} event
     */
    mouseout: function (event) {
        event = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__core_event__["b" /* normalizeEvent */])(this.dom, event);

        var element = event.toElement || event.relatedTarget;
        if (element != this.dom) {
            while (element && element.nodeType != 9) {
                // 忽略包含在root中的dom引起的mouseOut
                if (element === this.dom) {
                    return;
                }

                element = element.parentNode;
            }
        }

        this.trigger('mouseout', event);
    },

    /**
     * Touch开始响应函数
     * @inner
     * @param {Event} event
     */
    touchstart: function (event) {
        // Default mouse behaviour should not be disabled here.
        // For example, page may needs to be slided.
        event = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__core_event__["b" /* normalizeEvent */])(this.dom, event);

        // Mark touch, which is useful in distinguish touch and
        // mouse event in upper applicatoin.
        event.zrByTouch = true;

        this._lastTouchMoment = new Date();

        processGesture(this, event, 'start');

        // In touch device, trigger `mousemove`(`mouseover`) should
        // be triggered, and must before `mousedown` triggered.
        domHandlers.mousemove.call(this, event);

        domHandlers.mousedown.call(this, event);

        setTouchTimer(this);
    },

    /**
     * Touch移动响应函数
     * @inner
     * @param {Event} event
     */
    touchmove: function (event) {

        event = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__core_event__["b" /* normalizeEvent */])(this.dom, event);

        // Mark touch, which is useful in distinguish touch and
        // mouse event in upper applicatoin.
        event.zrByTouch = true;

        processGesture(this, event, 'change');

        // Mouse move should always be triggered no matter whether
        // there is gestrue event, because mouse move and pinch may
        // be used at the same time.
        domHandlers.mousemove.call(this, event);

        setTouchTimer(this);
    },

    /**
     * Touch结束响应函数
     * @inner
     * @param {Event} event
     */
    touchend: function (event) {

        event = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__core_event__["b" /* normalizeEvent */])(this.dom, event);

        // Mark touch, which is useful in distinguish touch and
        // mouse event in upper applicatoin.
        event.zrByTouch = true;

        processGesture(this, event, 'end');

        domHandlers.mouseup.call(this, event);

        // Do not trigger `mouseout` here, in spite of `mousemove`(`mouseover`) is
        // triggered in `touchstart`. This seems to be illogical, but by this mechanism,
        // we can conveniently implement "hover style" in both PC and touch device just
        // by listening to `mouseover` to add "hover style" and listening to `mouseout`
        // to remove "hover style" on an element, without any additional code for
        // compatibility. (`mouseout` will not be triggered in `touchend`, so "hover
        // style" will remain for user view)

        // click event should always be triggered no matter whether
        // there is gestrue event. System click can not be prevented.
        if (+new Date() - this._lastTouchMoment < TOUCH_CLICK_DELAY) {
            domHandlers.click.call(this, event);
        }

        setTouchTimer(this);
    },

    pointerdown: function (event) {
        domHandlers.mousedown.call(this, event);

        // if (useMSGuesture(this, event)) {
        //     this._msGesture.addPointer(event.pointerId);
        // }
    },

    pointermove: function (event) {
        // FIXME
        // pointermove is so sensitive that it always triggered when
        // tap(click) on touch screen, which affect some judgement in
        // upper application. So, we dont support mousemove on MS touch
        // device yet.
        if (!isPointerFromTouch(event)) {
            domHandlers.mousemove.call(this, event);
        }
    },

    pointerup: function (event) {
        domHandlers.mouseup.call(this, event);
    },

    pointerout: function (event) {
        // pointerout will be triggered when tap on touch screen
        // (IE11+/Edge on MS Surface) after click event triggered,
        // which is inconsistent with the mousout behavior we defined
        // in touchend. So we unify them.
        // (check domHandlers.touchend for detailed explanation)
        if (!isPointerFromTouch(event)) {
            domHandlers.mouseout.call(this, event);
        }
    }
};

function isPointerFromTouch(event) {
    var pointerType = event.pointerType;
    return pointerType === 'pen' || pointerType === 'touch';
}

// function useMSGuesture(handlerProxy, event) {
//     return isPointerFromTouch(event) && !!handlerProxy._msGesture;
// }

// Common handlers
__WEBPACK_IMPORTED_MODULE_1__core_util__["f" /* each */](['click', 'mousedown', 'mouseup', 'mousewheel', 'dblclick', 'contextmenu'], function (name) {
    domHandlers[name] = function (event) {
        event = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__core_event__["b" /* normalizeEvent */])(this.dom, event);
        this.trigger(name, event);
    };
});

/**
 * 为控制类实例初始化dom 事件处理函数
 *
 * @inner
 * @param {module:zrender/Handler} instance 控制类实例
 */
function initDomHandler(instance) {
    __WEBPACK_IMPORTED_MODULE_1__core_util__["f" /* each */](touchHandlerNames, function (name) {
        instance._handlers[name] = __WEBPACK_IMPORTED_MODULE_1__core_util__["b" /* bind */](domHandlers[name], instance);
    });

    __WEBPACK_IMPORTED_MODULE_1__core_util__["f" /* each */](pointerHandlerNames, function (name) {
        instance._handlers[name] = __WEBPACK_IMPORTED_MODULE_1__core_util__["b" /* bind */](domHandlers[name], instance);
    });

    __WEBPACK_IMPORTED_MODULE_1__core_util__["f" /* each */](mouseHandlerNames, function (name) {
        instance._handlers[name] = makeMouseHandler(domHandlers[name], instance);
    });

    function makeMouseHandler(fn, instance) {
        return function () {
            if (instance._touching) {
                return;
            }
            return fn.apply(instance, arguments);
        };
    }
}


function HandlerDomProxy(dom) {
    __WEBPACK_IMPORTED_MODULE_2__mixin_Eventful__["a" /* default */].call(this);

    this.dom = dom;

    /**
     * @private
     * @type {boolean}
     */
    this._touching = false;

    /**
     * @private
     * @type {number}
     */
    this._touchTimer;

    /**
     * @private
     * @type {module:zrender/core/GestureMgr}
     */
    this._gestureMgr = new __WEBPACK_IMPORTED_MODULE_4__core_GestureMgr__["a" /* default */]();

    this._handlers = {};

    initDomHandler(this);

    if (__WEBPACK_IMPORTED_MODULE_3__core_env__["a" /* default */].pointerEventsSupported) { // Only IE11+/Edge
        // 1. On devices that both enable touch and mouse (e.g., MS Surface and lenovo X240),
        // IE11+/Edge do not trigger touch event, but trigger pointer event and mouse event
        // at the same time.
        // 2. On MS Surface, it probablely only trigger mousedown but no mouseup when tap on
        // screen, which do not occurs in pointer event.
        // So we use pointer event to both detect touch gesture and mouse behavior.
        mountHandlers(pointerHandlerNames, this);

        // FIXME
        // Note: MS Gesture require CSS touch-action set. But touch-action is not reliable,
        // which does not prevent defuault behavior occasionally (which may cause view port
        // zoomed in but use can not zoom it back). And event.preventDefault() does not work.
        // So we have to not to use MSGesture and not to support touchmove and pinch on MS
        // touch screen. And we only support click behavior on MS touch screen now.

        // MS Gesture Event is only supported on IE11+/Edge and on Windows 8+.
        // We dont support touch on IE on win7.
        // See <https://msdn.microsoft.com/en-us/library/dn433243(v=vs.85).aspx>
        // if (typeof MSGesture === 'function') {
        //     (this._msGesture = new MSGesture()).target = dom; // jshint ignore:line
        //     dom.addEventListener('MSGestureChange', onMSGestureChange);
        // }
    }
    else {
        if (__WEBPACK_IMPORTED_MODULE_3__core_env__["a" /* default */].touchEventsSupported) {
            mountHandlers(touchHandlerNames, this);
            // Handler of 'mouseout' event is needed in touch mode, which will be mounted below.
            // addEventListener(root, 'mouseout', this._mouseoutHandler);
        }

        // 1. Considering some devices that both enable touch and mouse event (like on MS Surface
        // and lenovo X240, @see #2350), we make mouse event be always listened, otherwise
        // mouse event can not be handle in those devices.
        // 2. On MS Surface, Chrome will trigger both touch event and mouse event. How to prevent
        // mouseevent after touch event triggered, see `setTouchTimer`.
        mountHandlers(mouseHandlerNames, this);
    }

    function mountHandlers(handlerNames, instance) {
        __WEBPACK_IMPORTED_MODULE_1__core_util__["f" /* each */](handlerNames, function (name) {
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__core_event__["c" /* addEventListener */])(dom, eventNameFix(name), instance._handlers[name]);
        }, instance);
    }
}

var handlerDomProxyProto = HandlerDomProxy.prototype;
handlerDomProxyProto.dispose = function () {
    var handlerNames = mouseHandlerNames.concat(touchHandlerNames);

    for (var i = 0; i < handlerNames.length; i++) {
        var name = handlerNames[i];
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__core_event__["d" /* removeEventListener */])(this.dom, eventNameFix(name), this._handlers[name]);
    }
};

handlerDomProxyProto.setCursor = function (cursorStyle) {
    this.dom.style.cursor = cursorStyle || 'default';
};

__WEBPACK_IMPORTED_MODULE_1__core_util__["d" /* mixin */](HandlerDomProxy, __WEBPACK_IMPORTED_MODULE_2__mixin_Eventful__["a" /* default */]);

/* harmony default export */ __webpack_exports__["a"] = (HandlerDomProxy);

/***/ }),

/***/ 888:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

/**
 * @param {Array.<Object>} colorStops
 */
var Gradient = function (colorStops) {

    this.colorStops = colorStops || [];

};

Gradient.prototype = {

    constructor: Gradient,

    addColorStop: function (offset, color) {
        this.colorStops.push({

            offset: offset,

            color: color
        });
    }

};

/* harmony default export */ __webpack_exports__["a"] = (Gradient);

/***/ }),

/***/ 889:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Displayable__ = __webpack_require__(366);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_BoundingRect__ = __webpack_require__(81);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__core_util__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__helper_image__ = __webpack_require__(214);





/**
 * @alias zrender/graphic/Image
 * @extends module:zrender/graphic/Displayable
 * @constructor
 * @param {Object} opts
 */
function ZImage(opts) {
    __WEBPACK_IMPORTED_MODULE_0__Displayable__["a" /* default */].call(this, opts);
}

ZImage.prototype = {

    constructor: ZImage,

    type: 'image',

    brush: function (ctx, prevEl) {
        var style = this.style;
        var src = style.image;

        // Must bind each time
        style.bind(ctx, this, prevEl);

        var image = this._image = __WEBPACK_IMPORTED_MODULE_3__helper_image__["a" /* createOrUpdateImage */](
            src,
            this._image,
            this,
            this.onload
        );

        if (!image || !__WEBPACK_IMPORTED_MODULE_3__helper_image__["b" /* isImageReady */](image)) {
            return;
        }

        // 图片已经加载完成
        // if (image.nodeName.toUpperCase() == 'IMG') {
        //     if (!image.complete) {
        //         return;
        //     }
        // }
        // Else is canvas

        var x = style.x || 0;
        var y = style.y || 0;
        var width = style.width;
        var height = style.height;
        var aspect = image.width / image.height;
        if (width == null && height != null) {
            // Keep image/height ratio
            width = height * aspect;
        }
        else if (height == null && width != null) {
            height = width / aspect;
        }
        else if (width == null && height == null) {
            width = image.width;
            height = image.height;
        }

        // 设置transform
        this.setTransform(ctx);

        if (style.sWidth && style.sHeight) {
            var sx = style.sx || 0;
            var sy = style.sy || 0;
            ctx.drawImage(
                image,
                sx, sy, style.sWidth, style.sHeight,
                x, y, width, height
            );
        }
        else if (style.sx && style.sy) {
            var sx = style.sx;
            var sy = style.sy;
            var sWidth = width - sx;
            var sHeight = height - sy;
            ctx.drawImage(
                image,
                sx, sy, sWidth, sHeight,
                x, y, width, height
            );
        }
        else {
            ctx.drawImage(image, x, y, width, height);
        }

        this.restoreTransform(ctx);

        // Draw rect text
        if (style.text != null) {
            this.drawRectText(ctx, this.getBoundingRect());
        }
    },

    getBoundingRect: function () {
        var style = this.style;
        if (! this._rect) {
            this._rect = new __WEBPACK_IMPORTED_MODULE_1__core_BoundingRect__["a" /* default */](
                style.x || 0, style.y || 0, style.width || 0, style.height || 0
            );
        }
        return this._rect;
    }
};

__WEBPACK_IMPORTED_MODULE_2__core_util__["a" /* inherits */](ZImage, __WEBPACK_IMPORTED_MODULE_0__Displayable__["a" /* default */]);

/* harmony default export */ __webpack_exports__["a"] = (ZImage);

/***/ }),

/***/ 890:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = buildPath;

function buildPath(ctx, shape) {
    var x = shape.x;
    var y = shape.y;
    var width = shape.width;
    var height = shape.height;
    var r = shape.r;
    var r1;
    var r2;
    var r3;
    var r4;

    // Convert width and height to positive for better borderRadius
    if (width < 0) {
        x = x + width;
        width = -width;
    }
    if (height < 0) {
        y = y + height;
        height = -height;
    }

    if (typeof r === 'number') {
        r1 = r2 = r3 = r4 = r;
    }
    else if (r instanceof Array) {
        if (r.length === 1) {
            r1 = r2 = r3 = r4 = r[0];
        }
        else if (r.length === 2) {
            r1 = r3 = r[0];
            r2 = r4 = r[1];
        }
        else if (r.length === 3) {
            r1 = r[0];
            r2 = r4 = r[1];
            r3 = r[2];
        }
        else {
            r1 = r[0];
            r2 = r[1];
            r3 = r[2];
            r4 = r[3];
        }
    }
    else {
        r1 = r2 = r3 = r4 = 0;
    }

    var total;
    if (r1 + r2 > width) {
        total = r1 + r2;
        r1 *= width / total;
        r2 *= width / total;
    }
    if (r3 + r4 > width) {
        total = r3 + r4;
        r3 *= width / total;
        r4 *= width / total;
    }
    if (r2 + r3 > height) {
        total = r2 + r3;
        r2 *= height / total;
        r3 *= height / total;
    }
    if (r1 + r4 > height) {
        total = r1 + r4;
        r1 *= height / total;
        r4 *= height / total;
    }
    ctx.moveTo(x + r1, y);
    ctx.lineTo(x + width - r2, y);
    r2 !== 0 && ctx.quadraticCurveTo(
        x + width, y, x + width, y + r2
    );
    ctx.lineTo(x + width, y + height - r3);
    r3 !== 0 && ctx.quadraticCurveTo(
        x + width, y + height, x + width - r3, y + height
    );
    ctx.lineTo(x + r4, y + height);
    r4 !== 0 && ctx.quadraticCurveTo(
        x, y + height, x, y + height - r4
    );
    ctx.lineTo(x, y + r1);
    r1 !== 0 && ctx.quadraticCurveTo(x, y, x + r1, y);
}


/***/ }),

/***/ 891:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = normalizeTextStyle;
/* harmony export (immutable) */ __webpack_exports__["c"] = renderText;
/* unused harmony export getStroke */
/* unused harmony export getFill */
/* harmony export (immutable) */ __webpack_exports__["b"] = needDrawText;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__core_util__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__contain_text__ = __webpack_require__(883);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__roundRect__ = __webpack_require__(890);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__image__ = __webpack_require__(214);






// TODO: Have not support 'start', 'end' yet.
var VALID_TEXT_ALIGN = {left: 1, right: 1, center: 1};
var VALID_TEXT_VERTICAL_ALIGN = {top: 1, bottom: 1, middle: 1};

/**
 * @param {module:zrender/graphic/Style} style
 * @return {module:zrender/graphic/Style} The input style.
 */
function normalizeTextStyle(style) {
    normalizeStyle(style);
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__core_util__["f" /* each */])(style.rich, normalizeStyle);
    return style;
}

function normalizeStyle(style) {
    if (style) {

        style.font = __WEBPACK_IMPORTED_MODULE_1__contain_text__["a" /* makeFont */](style);

        var textAlign = style.textAlign;
        textAlign === 'middle' && (textAlign = 'center');
        style.textAlign = (
            textAlign == null || VALID_TEXT_ALIGN[textAlign]
        ) ? textAlign : 'left';

        // Compatible with textBaseline.
        var textVerticalAlign = style.textVerticalAlign || style.textBaseline;
        textVerticalAlign === 'center' && (textVerticalAlign = 'middle');
        style.textVerticalAlign = (
            textVerticalAlign == null || VALID_TEXT_VERTICAL_ALIGN[textVerticalAlign]
        ) ? textVerticalAlign : 'top';

        var textPadding = style.textPadding;
        if (textPadding) {
            style.textPadding = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__core_util__["m" /* normalizeCssArray */])(style.textPadding);
        }
    }
}

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {string} text
 * @param {module:zrender/graphic/Style} style
 * @param {Object|boolean} [rect] {x, y, width, height}
 *                  If set false, rect text is not used.
 */
function renderText(hostEl, ctx, text, style, rect) {
    style.rich
        ? renderRichText(hostEl, ctx, text, style, rect)
        : renderPlainText(hostEl, ctx, text, style, rect);
}

function renderPlainText(hostEl, ctx, text, style, rect) {
    var font = setCtx(ctx, 'font', style.font || __WEBPACK_IMPORTED_MODULE_1__contain_text__["b" /* DEFAULT_FONT */]);

    var textPadding = style.textPadding;

    var contentBlock = hostEl.__textCotentBlock;
    if (!contentBlock || hostEl.__dirty) {
        contentBlock = hostEl.__textCotentBlock = __WEBPACK_IMPORTED_MODULE_1__contain_text__["c" /* parsePlainText */](
            text, font, textPadding, style.truncate
        );
    }

    var outerHeight = contentBlock.outerHeight;

    var textLines = contentBlock.lines;
    var lineHeight = contentBlock.lineHeight;

    var boxPos = getBoxPosition(outerHeight, style, rect);
    var baseX = boxPos.baseX;
    var baseY = boxPos.baseY;
    var textAlign = boxPos.textAlign;
    var textVerticalAlign = boxPos.textVerticalAlign;

    // Origin of textRotation should be the base point of text drawing.
    applyTextRotation(ctx, style, rect, baseX, baseY);

    var boxY = __WEBPACK_IMPORTED_MODULE_1__contain_text__["d" /* adjustTextY */](baseY, outerHeight, textVerticalAlign);
    var textX = baseX;
    var textY = boxY;

    var needDrawBg = needDrawBackground(style);
    if (needDrawBg || textPadding) {
        // Consider performance, do not call getTextWidth util necessary.
        var textWidth = __WEBPACK_IMPORTED_MODULE_1__contain_text__["e" /* getWidth */](text, font);
        var outerWidth = textWidth;
        textPadding && (outerWidth += textPadding[1] + textPadding[3]);
        var boxX = __WEBPACK_IMPORTED_MODULE_1__contain_text__["f" /* adjustTextX */](baseX, outerWidth, textAlign);

        needDrawBg && drawBackground(hostEl, ctx, style, boxX, boxY, outerWidth, outerHeight);

        if (textPadding) {
            textX = getTextXForPadding(baseX, textAlign, textPadding);
            textY += textPadding[0];
        }
    }

    setCtx(ctx, 'textAlign', textAlign || 'left');
    // Force baseline to be "middle". Otherwise, if using "top", the
    // text will offset downward a little bit in font "Microsoft YaHei".
    setCtx(ctx, 'textBaseline', 'middle');

    // Always set shadowBlur and shadowOffset to avoid leak from displayable.
    setCtx(ctx, 'shadowBlur', style.textShadowBlur || 0);
    setCtx(ctx, 'shadowColor', style.textShadowColor || 'transparent');
    setCtx(ctx, 'shadowOffsetX', style.textShadowOffsetX || 0);
    setCtx(ctx, 'shadowOffsetY', style.textShadowOffsetY || 0);

    // `textBaseline` is set as 'middle'.
    textY += lineHeight / 2;

    var textStrokeWidth = style.textStrokeWidth;
    var textStroke = getStroke(style.textStroke, textStrokeWidth);
    var textFill = getFill(style.textFill);

    if (textStroke) {
        setCtx(ctx, 'lineWidth', textStrokeWidth);
        setCtx(ctx, 'strokeStyle', textStroke);
    }
    if (textFill) {
        setCtx(ctx, 'fillStyle', textFill);
    }

    for (var i = 0; i < textLines.length; i++) {
        // Fill after stroke so the outline will not cover the main part.
        textStroke && ctx.strokeText(textLines[i], textX, textY);
        textFill && ctx.fillText(textLines[i], textX, textY);
        textY += lineHeight;
    }
}

function renderRichText(hostEl, ctx, text, style, rect) {
    var contentBlock = hostEl.__textCotentBlock;

    if (!contentBlock || hostEl.__dirty) {
        contentBlock = hostEl.__textCotentBlock = __WEBPACK_IMPORTED_MODULE_1__contain_text__["g" /* parseRichText */](text, style);
    }

    drawRichText(hostEl, ctx, contentBlock, style, rect);
}

function drawRichText(hostEl, ctx, contentBlock, style, rect) {
    var contentWidth = contentBlock.width;
    var outerWidth = contentBlock.outerWidth;
    var outerHeight = contentBlock.outerHeight;
    var textPadding = style.textPadding;

    var boxPos = getBoxPosition(outerHeight, style, rect);
    var baseX = boxPos.baseX;
    var baseY = boxPos.baseY;
    var textAlign = boxPos.textAlign;
    var textVerticalAlign = boxPos.textVerticalAlign;

    // Origin of textRotation should be the base point of text drawing.
    applyTextRotation(ctx, style, rect, baseX, baseY);

    var boxX = __WEBPACK_IMPORTED_MODULE_1__contain_text__["f" /* adjustTextX */](baseX, outerWidth, textAlign);
    var boxY = __WEBPACK_IMPORTED_MODULE_1__contain_text__["d" /* adjustTextY */](baseY, outerHeight, textVerticalAlign);
    var xLeft = boxX;
    var lineTop = boxY;
    if (textPadding) {
        xLeft += textPadding[3];
        lineTop += textPadding[0];
    }
    var xRight = xLeft + contentWidth;

    needDrawBackground(style) && drawBackground(
        hostEl, ctx, style, boxX, boxY, outerWidth, outerHeight
    );

    for (var i = 0; i < contentBlock.lines.length; i++) {
        var line = contentBlock.lines[i];
        var tokens = line.tokens;
        var tokenCount = tokens.length;
        var lineHeight = line.lineHeight;
        var usedWidth = line.width;

        var leftIndex = 0;
        var lineXLeft = xLeft;
        var lineXRight = xRight;
        var rightIndex = tokenCount - 1;
        var token;

        while (
            leftIndex < tokenCount
            && (token = tokens[leftIndex], !token.textAlign || token.textAlign === 'left')
        ) {
            placeToken(hostEl, ctx, token, style, lineHeight, lineTop, lineXLeft, 'left');
            usedWidth -= token.width;
            lineXLeft += token.width;
            leftIndex++;
        }

        while (
            rightIndex >= 0
            && (token = tokens[rightIndex], token.textAlign === 'right')
        ) {
            placeToken(hostEl, ctx, token, style, lineHeight, lineTop, lineXRight, 'right');
            usedWidth -= token.width;
            lineXRight -= token.width;
            rightIndex--;
        }

        // The other tokens are placed as textAlign 'center' if there is enough space.
        lineXLeft += (contentWidth - (lineXLeft - xLeft) - (xRight - lineXRight) - usedWidth) / 2;
        while (leftIndex <= rightIndex) {
            token = tokens[leftIndex];
            // Consider width specified by user, use 'center' rather than 'left'.
            placeToken(hostEl, ctx, token, style, lineHeight, lineTop, lineXLeft + token.width / 2, 'center');
            lineXLeft += token.width;
            leftIndex++;
        }

        lineTop += lineHeight;
    }
}

function applyTextRotation(ctx, style, rect, x, y) {
    // textRotation only apply in RectText.
    if (rect && style.textRotation) {
        var origin = style.textOrigin;
        if (origin === 'center') {
            x = rect.width / 2 + rect.x;
            y = rect.height / 2 + rect.y;
        }
        else if (origin) {
            x = origin[0] + rect.x;
            y = origin[1] + rect.y;
        }

        ctx.translate(x, y);
        // Positive: anticlockwise
        ctx.rotate(-style.textRotation);
        ctx.translate(-x, -y);
    }
}

function placeToken(hostEl, ctx, token, style, lineHeight, lineTop, x, textAlign) {
    var tokenStyle = style.rich[token.styleName] || {};

    // 'ctx.textBaseline' is always set as 'middle', for sake of
    // the bias of "Microsoft YaHei".
    var textVerticalAlign = token.textVerticalAlign;
    var y = lineTop + lineHeight / 2;
    if (textVerticalAlign === 'top') {
        y = lineTop + token.height / 2;
    }
    else if (textVerticalAlign === 'bottom') {
        y = lineTop + lineHeight - token.height / 2;
    }

    !token.isLineHolder && needDrawBackground(tokenStyle) && drawBackground(
        hostEl,
        ctx,
        tokenStyle,
        textAlign === 'right'
            ? x - token.width
            : textAlign === 'center'
            ? x - token.width / 2
            : x,
        y - token.height / 2,
        token.width,
        token.height
    );

    var textPadding = token.textPadding;
    if (textPadding) {
        x = getTextXForPadding(x, textAlign, textPadding);
        y -= token.height / 2 - textPadding[2] - token.textHeight / 2;
    }

    setCtx(ctx, 'shadowBlur', __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__core_util__["n" /* retrieve3 */])(tokenStyle.textShadowBlur, style.textShadowBlur, 0));
    setCtx(ctx, 'shadowColor', tokenStyle.textShadowColor || style.textShadowColor || 'transparent');
    setCtx(ctx, 'shadowOffsetX', __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__core_util__["n" /* retrieve3 */])(tokenStyle.textShadowOffsetX, style.textShadowOffsetX, 0));
    setCtx(ctx, 'shadowOffsetY', __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__core_util__["n" /* retrieve3 */])(tokenStyle.textShadowOffsetY, style.textShadowOffsetY, 0));

    setCtx(ctx, 'textAlign', textAlign);
    // Force baseline to be "middle". Otherwise, if using "top", the
    // text will offset downward a little bit in font "Microsoft YaHei".
    setCtx(ctx, 'textBaseline', 'middle');

    setCtx(ctx, 'font', token.font || __WEBPACK_IMPORTED_MODULE_1__contain_text__["b" /* DEFAULT_FONT */]);

    var textStroke = getStroke(tokenStyle.textStroke || style.textStroke, textStrokeWidth);
    var textFill = getFill(tokenStyle.textFill || style.textFill);
    var textStrokeWidth = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__core_util__["o" /* retrieve2 */])(tokenStyle.textStrokeWidth, style.textStrokeWidth);

    // Fill after stroke so the outline will not cover the main part.
    if (textStroke) {
        setCtx(ctx, 'lineWidth', textStrokeWidth);
        setCtx(ctx, 'strokeStyle', textStroke);
        ctx.strokeText(token.text, x, y);
    }
    if (textFill) {
        setCtx(ctx, 'fillStyle', textFill);
        ctx.fillText(token.text, x, y);
    }
}

function needDrawBackground(style) {
    return style.textBackgroundColor
        || (style.textBorderWidth && style.textBorderColor);
}

// style: {textBackgroundColor, textBorderWidth, textBorderColor, textBorderRadius}
// shape: {x, y, width, height}
function drawBackground(hostEl, ctx, style, x, y, width, height) {
    var textBackgroundColor = style.textBackgroundColor;
    var textBorderWidth = style.textBorderWidth;
    var textBorderColor = style.textBorderColor;
    var isPlainBg = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__core_util__["i" /* isString */])(textBackgroundColor);

    setCtx(ctx, 'shadowBlur', style.textBoxShadowBlur || 0);
    setCtx(ctx, 'shadowColor', style.textBoxShadowColor || 'transparent');
    setCtx(ctx, 'shadowOffsetX', style.textBoxShadowOffsetX || 0);
    setCtx(ctx, 'shadowOffsetY', style.textBoxShadowOffsetY || 0);

    if (isPlainBg || (textBorderWidth && textBorderColor)) {
        ctx.beginPath();
        var textBorderRadius = style.textBorderRadius;
        if (!textBorderRadius) {
            ctx.rect(x, y, width, height);
        }
        else {
            __WEBPACK_IMPORTED_MODULE_2__roundRect__["a" /* buildPath */](ctx, {
                x: x, y: y, width: width, height: height, r: textBorderRadius
            });
        }
        ctx.closePath();
    }

    if (isPlainBg) {
        setCtx(ctx, 'fillStyle', textBackgroundColor);
        ctx.fill();
    }
    else if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__core_util__["h" /* isObject */])(textBackgroundColor)) {
        var image = textBackgroundColor.image;

        image = __WEBPACK_IMPORTED_MODULE_3__image__["a" /* createOrUpdateImage */](
            image, null, hostEl, onBgImageLoaded, textBackgroundColor
        );
        if (image && __WEBPACK_IMPORTED_MODULE_3__image__["b" /* isImageReady */](image)) {
            ctx.drawImage(image, x, y, width, height);
        }
    }

    if (textBorderWidth && textBorderColor) {
        setCtx(ctx, 'lineWidth', textBorderWidth);
        setCtx(ctx, 'strokeStyle', textBorderColor);
        ctx.stroke();
    }
}

function onBgImageLoaded(image, textBackgroundColor) {
    // Replace image, so that `contain/text.js#parseRichText`
    // will get correct result in next tick.
    textBackgroundColor.image = image;
}

function getBoxPosition(blockHeiht, style, rect) {
    var baseX = style.x || 0;
    var baseY = style.y || 0;
    var textAlign = style.textAlign;
    var textVerticalAlign = style.textVerticalAlign;

    // Text position represented by coord
    if (rect) {
        var textPosition = style.textPosition;
        if (textPosition instanceof Array) {
            // Percent
            baseX = rect.x + parsePercent(textPosition[0], rect.width);
            baseY = rect.y + parsePercent(textPosition[1], rect.height);
        }
        else {
            var res = __WEBPACK_IMPORTED_MODULE_1__contain_text__["h" /* adjustTextPositionOnRect */](
                textPosition, rect, style.textDistance
            );
            baseX = res.x;
            baseY = res.y;
            // Default align and baseline when has textPosition
            textAlign = textAlign || res.textAlign;
            textVerticalAlign = textVerticalAlign || res.textVerticalAlign;
        }

        // textOffset is only support in RectText, otherwise
        // we have to adjust boundingRect for textOffset.
        var textOffset = style.textOffset;
        if (textOffset) {
            baseX += textOffset[0];
            baseY += textOffset[1];
        }
    }

    return {
        baseX: baseX,
        baseY: baseY,
        textAlign: textAlign,
        textVerticalAlign: textVerticalAlign
    };
}

function setCtx(ctx, prop, value) {
    // FIXME ??? performance try
    // if (ctx.__currentValues[prop] !== value) {
        // ctx[prop] = ctx.__currentValues[prop] = value;
    ctx[prop] = value;
    // }
    return ctx[prop];
}

/**
 * @param {string} [stroke] If specified, do not check style.textStroke.
 * @param {string} [lineWidth] If specified, do not check style.textStroke.
 * @param {number} style
 */
function getStroke(stroke, lineWidth) {
    return (stroke == null || lineWidth <= 0 || stroke === 'transparent' || stroke === 'none')
        ? null
        // TODO pattern and gradient?
        : (stroke.image || stroke.colorStops)
        ? '#000'
        : stroke;
}

function getFill(fill) {
    return (fill == null || fill === 'none')
        ? null
        // TODO pattern and gradient?
        : (fill.image || fill.colorStops)
        ? '#000'
        : fill;
}

function parsePercent(value, maxValue) {
    if (typeof value === 'string') {
        if (value.lastIndexOf('%') >= 0) {
            return parseFloat(value) / 100 * maxValue;
        }
        return parseFloat(value);
    }
    return value;
}

function getTextXForPadding(x, textAlign, textPadding) {
    return textAlign === 'right'
        ? (x - textPadding[1])
        : textAlign === 'center'
        ? (x + textPadding[3] / 2 - textPadding[1] / 2)
        : (x + textPadding[3]);
}

/**
 * @param {string} text
 * @param {module:zrender/Style} style
 * @return {boolean}
 */
function needDrawText(text, style) {
    return text != null
        && (text
            || style.textBackgroundColor
            || (style.textBorderWidth && style.textBorderColor)
            || style.textPadding
        );
}


/***/ }),

/***/ 892:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__helper_text__ = __webpack_require__(891);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_BoundingRect__ = __webpack_require__(81);
/**
 * Mixin for drawing text in a element bounding rect
 * @module zrender/mixin/RectText
 */




var tmpRect = new __WEBPACK_IMPORTED_MODULE_1__core_BoundingRect__["a" /* default */]();

var RectText = function () {};

RectText.prototype = {

    constructor: RectText,

    /**
     * Draw text in a rect with specified position.
     * @param  {CanvasRenderingContext2D} ctx
     * @param  {Object} rect Displayable rect
     */
    drawRectText: function (ctx, rect) {
        var style = this.style;

        rect = style.textRect || rect;

        // Optimize, avoid normalize every time.
        this.__dirty && __WEBPACK_IMPORTED_MODULE_0__helper_text__["a" /* normalizeTextStyle */](style, true);

        var text = style.text;

        // Convert to string
        text != null && (text += '');

        if (!__WEBPACK_IMPORTED_MODULE_0__helper_text__["b" /* needDrawText */](text, style)) {
            return;
        }

        // FIXME
        ctx.save();

        // Transform rect to view space
        var transform = this.transform;
        if (!style.transformText) {
            if (transform) {
                tmpRect.copy(rect);
                tmpRect.applyTransform(transform);
                rect = tmpRect;
            }
        }
        else {
            this.setTransform(ctx);
        }

        // transformText and textRotation can not be used at the same time.
        __WEBPACK_IMPORTED_MODULE_0__helper_text__["c" /* renderText */](this, ctx, text, style, rect);

        ctx.restore();
    }
};

/* harmony default export */ __webpack_exports__["a"] = (RectText);

/***/ }),

/***/ 893:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Path__ = __webpack_require__(213);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_vector__ = __webpack_require__(50);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__core_curve__ = __webpack_require__(82);
/**
 * 贝塞尔曲线
 * @module zrender/shape/BezierCurve
 */





var out = [];

function someVectorAt(shape, t, isTangent) {
    var cpx2 = shape.cpx2;
    var cpy2 = shape.cpy2;
    if (cpx2 === null || cpy2 === null) {
        return [
            (isTangent ? __WEBPACK_IMPORTED_MODULE_2__core_curve__["i" /* cubicDerivativeAt */] : __WEBPACK_IMPORTED_MODULE_2__core_curve__["b" /* cubicAt */])(shape.x1, shape.cpx1, shape.cpx2, shape.x2, t),
            (isTangent ? __WEBPACK_IMPORTED_MODULE_2__core_curve__["i" /* cubicDerivativeAt */] : __WEBPACK_IMPORTED_MODULE_2__core_curve__["b" /* cubicAt */])(shape.y1, shape.cpy1, shape.cpy2, shape.y2, t)
        ];
    }
    else {
        return [
            (isTangent ? __WEBPACK_IMPORTED_MODULE_2__core_curve__["j" /* quadraticDerivativeAt */] : __WEBPACK_IMPORTED_MODULE_2__core_curve__["f" /* quadraticAt */])(shape.x1, shape.cpx1, shape.x2, t),
            (isTangent ? __WEBPACK_IMPORTED_MODULE_2__core_curve__["j" /* quadraticDerivativeAt */] : __WEBPACK_IMPORTED_MODULE_2__core_curve__["f" /* quadraticAt */])(shape.y1, shape.cpy1, shape.y2, t)
        ];
    }
}

/* harmony default export */ __webpack_exports__["default"] = (__WEBPACK_IMPORTED_MODULE_0__Path__["a" /* default */].extend({

    type: 'bezier-curve',

    shape: {
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0,
        cpx1: 0,
        cpy1: 0,
        // cpx2: 0,
        // cpy2: 0

        // Curve show percent, for animating
        percent: 1
    },

    style: {
        stroke: '#000',
        fill: null
    },

    buildPath: function (ctx, shape) {
        var x1 = shape.x1;
        var y1 = shape.y1;
        var x2 = shape.x2;
        var y2 = shape.y2;
        var cpx1 = shape.cpx1;
        var cpy1 = shape.cpy1;
        var cpx2 = shape.cpx2;
        var cpy2 = shape.cpy2;
        var percent = shape.percent;
        if (percent === 0) {
            return;
        }

        ctx.moveTo(x1, y1);

        if (cpx2 == null || cpy2 == null) {
            if (percent < 1) {
                __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__core_curve__["k" /* quadraticSubdivide */])(
                    x1, cpx1, x2, percent, out
                );
                cpx1 = out[1];
                x2 = out[2];
                __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__core_curve__["k" /* quadraticSubdivide */])(
                    y1, cpy1, y2, percent, out
                );
                cpy1 = out[1];
                y2 = out[2];
            }

            ctx.quadraticCurveTo(
                cpx1, cpy1,
                x2, y2
            );
        }
        else {
            if (percent < 1) {
                __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__core_curve__["l" /* cubicSubdivide */])(
                    x1, cpx1, cpx2, x2, percent, out
                );
                cpx1 = out[1];
                cpx2 = out[2];
                x2 = out[3];
                __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__core_curve__["l" /* cubicSubdivide */])(
                    y1, cpy1, cpy2, y2, percent, out
                );
                cpy1 = out[1];
                cpy2 = out[2];
                y2 = out[3];
            }
            ctx.bezierCurveTo(
                cpx1, cpy1,
                cpx2, cpy2,
                x2, y2
            );
        }
    },

    /**
     * Get point at percent
     * @param  {number} t
     * @return {Array.<number>}
     */
    pointAt: function (t) {
        return someVectorAt(this.shape, t, false);
    },

    /**
     * Get tangent at percent
     * @param  {number} t
     * @return {Array.<number>}
     */
    tangentAt: function (t) {
        var p = someVectorAt(this.shape, t, true);
        return __WEBPACK_IMPORTED_MODULE_1__core_vector__["g" /* normalize */](p, p);
    }
}));

/***/ }),

/***/ 894:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__animation_Animator__ = __webpack_require__(358);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_log__ = __webpack_require__(363);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__core_util__ = __webpack_require__(24);




/**
 * @alias modue:zrender/mixin/Animatable
 * @constructor
 */
var Animatable = function () {

    /**
     * @type {Array.<module:zrender/animation/Animator>}
     * @readOnly
     */
    this.animators = [];
};

Animatable.prototype = {

    constructor: Animatable,

    /**
     * 动画
     *
     * @param {string} path The path to fetch value from object, like 'a.b.c'.
     * @param {boolean} [loop] Whether to loop animation.
     * @return {module:zrender/animation/Animator}
     * @example:
     *     el.animate('style', false)
     *         .when(1000, {x: 10} )
     *         .done(function(){ // Animation done })
     *         .start()
     */
    animate: function (path, loop) {
        var target;
        var animatingShape = false;
        var el = this;
        var zr = this.__zr;
        if (path) {
            var pathSplitted = path.split('.');
            var prop = el;
            // If animating shape
            animatingShape = pathSplitted[0] === 'shape';
            for (var i = 0, l = pathSplitted.length; i < l; i++) {
                if (!prop) {
                    continue;
                }
                prop = prop[pathSplitted[i]];
            }
            if (prop) {
                target = prop;
            }
        }
        else {
            target = el;
        }

        if (!target) {
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__core_log__["a" /* default */])(
                'Property "'
                + path
                + '" is not existed in element '
                + el.id
            );
            return;
        }

        var animators = el.animators;

        var animator = new __WEBPACK_IMPORTED_MODULE_0__animation_Animator__["a" /* default */](target, loop);

        animator.during(function (target) {
            el.dirty(animatingShape);
        })
        .done(function () {
            // FIXME Animator will not be removed if use `Animator#stop` to stop animation
            animators.splice(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__core_util__["c" /* indexOf */])(animators, animator), 1);
        });

        animators.push(animator);

        // If animate after added to the zrender
        if (zr) {
            zr.animation.addAnimator(animator);
        }

        return animator;
    },

    /**
     * 停止动画
     * @param {boolean} forwardToLast If move to last frame before stop
     */
    stopAnimation: function (forwardToLast) {
        var animators = this.animators;
        var len = animators.length;
        for (var i = 0; i < len; i++) {
            animators[i].stop(forwardToLast);
        }
        animators.length = 0;

        return this;
    },

    /**
     * Caution: this method will stop previous animation.
     * So do not use this method to one element twice before
     * animation starts, unless you know what you are doing.
     * @param {Object} target
     * @param {number} [time=500] Time in ms
     * @param {string} [easing='linear']
     * @param {number} [delay=0]
     * @param {Function} [callback]
     * @param {Function} [forceAnimate] Prevent stop animation and callback
     *        immediently when target values are the same as current values.
     *
     * @example
     *  // Animate position
     *  el.animateTo({
     *      position: [10, 10]
     *  }, function () { // done })
     *
     *  // Animate shape, style and position in 100ms, delayed 100ms, with cubicOut easing
     *  el.animateTo({
     *      shape: {
     *          width: 500
     *      },
     *      style: {
     *          fill: 'red'
     *      }
     *      position: [10, 10]
     *  }, 100, 100, 'cubicOut', function () { // done })
     */
        // TODO Return animation key
    animateTo: function (target, time, delay, easing, callback, forceAnimate) {
        // animateTo(target, time, easing, callback);
        if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__core_util__["i" /* isString */])(delay)) {
            callback = easing;
            easing = delay;
            delay = 0;
        }
        // animateTo(target, time, delay, callback);
        else if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__core_util__["j" /* isFunction */])(easing)) {
            callback = easing;
            easing = 'linear';
            delay = 0;
        }
        // animateTo(target, time, callback);
        else if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__core_util__["j" /* isFunction */])(delay)) {
            callback = delay;
            delay = 0;
        }
        // animateTo(target, callback)
        else if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__core_util__["j" /* isFunction */])(time)) {
            callback = time;
            time = 500;
        }
        // animateTo(target)
        else if (!time) {
            time = 500;
        }
        // Stop all previous animations
        this.stopAnimation();
        this._animateToShallow('', this, target, time, delay);

        // Animators may be removed immediately after start
        // if there is nothing to animate
        var animators = this.animators.slice();
        var count = animators.length;
        function done() {
            count--;
            if (!count) {
                callback && callback();
            }
        }

        // No animators. This should be checked before animators[i].start(),
        // because 'done' may be executed immediately if no need to animate.
        if (!count) {
            callback && callback();
        }
        // Start after all animators created
        // Incase any animator is done immediately when all animation properties are not changed
        for (var i = 0; i < animators.length; i++) {
            animators[i]
                .done(done)
                .start(easing, forceAnimate);
        }
    },

    /**
     * @private
     * @param {string} path=''
     * @param {Object} source=this
     * @param {Object} target
     * @param {number} [time=500]
     * @param {number} [delay=0]
     *
     * @example
     *  // Animate position
     *  el._animateToShallow({
     *      position: [10, 10]
     *  })
     *
     *  // Animate shape, style and position in 100ms, delayed 100ms
     *  el._animateToShallow({
     *      shape: {
     *          width: 500
     *      },
     *      style: {
     *          fill: 'red'
     *      }
     *      position: [10, 10]
     *  }, 100, 100)
     */
    _animateToShallow: function (path, source, target, time, delay) {
        var objShallow = {};
        var propertyCount = 0;
        for (var name in target) {
            if (!target.hasOwnProperty(name)) {
                continue;
            }

            if (source[name] != null) {
                if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__core_util__["h" /* isObject */])(target[name]) && !__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__core_util__["e" /* isArrayLike */])(target[name])) {
                    this._animateToShallow(
                        path ? path + '.' + name : name,
                        source[name],
                        target[name],
                        time,
                        delay
                    );
                }
                else {
                    objShallow[name] = target[name];
                    propertyCount++;
                }
            }
            else if (target[name] != null) {
                // Attr directly if not has property
                // FIXME, if some property not needed for element ?
                if (!path) {
                    this.attr(name, target[name]);
                }
                else {  // Shape or style
                    var props = {};
                    props[path] = {};
                    props[path][name] = target[name];
                    this.attr(props);
                }
            }
        }

        if (propertyCount > 0) {
            this.animate(path, false)
                .when(time == null ? 500 : time, objShallow)
                .delay(delay || 0);
        }

        return this;
    }
};

/* harmony default export */ __webpack_exports__["a"] = (Animatable);

/***/ }),

/***/ 895:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// TODO Draggable for group
// FIXME Draggable on element which has parent rotation or scale
function Draggable() {

    this.on('mousedown', this._dragStart, this);
    this.on('mousemove', this._drag, this);
    this.on('mouseup', this._dragEnd, this);
    this.on('globalout', this._dragEnd, this);
    // this._dropTarget = null;
    // this._draggingTarget = null;

    // this._x = 0;
    // this._y = 0;
}

Draggable.prototype = {

    constructor: Draggable,

    _dragStart: function (e) {
        var draggingTarget = e.target;
        if (draggingTarget && draggingTarget.draggable) {
            this._draggingTarget = draggingTarget;
            draggingTarget.dragging = true;
            this._x = e.offsetX;
            this._y = e.offsetY;

            this.dispatchToElement(param(draggingTarget, e), 'dragstart', e.event);
        }
    },

    _drag: function (e) {
        var draggingTarget = this._draggingTarget;
        if (draggingTarget) {

            var x = e.offsetX;
            var y = e.offsetY;

            var dx = x - this._x;
            var dy = y - this._y;
            this._x = x;
            this._y = y;

            draggingTarget.drift(dx, dy, e);
            this.dispatchToElement(param(draggingTarget, e), 'drag', e.event);

            var dropTarget = this.findHover(x, y, draggingTarget).target;
            var lastDropTarget = this._dropTarget;
            this._dropTarget = dropTarget;

            if (draggingTarget !== dropTarget) {
                if (lastDropTarget && dropTarget !== lastDropTarget) {
                    this.dispatchToElement(param(lastDropTarget, e), 'dragleave', e.event);
                }
                if (dropTarget && dropTarget !== lastDropTarget) {
                    this.dispatchToElement(param(dropTarget, e), 'dragenter', e.event);
                }
            }
        }
    },

    _dragEnd: function (e) {
        var draggingTarget = this._draggingTarget;

        if (draggingTarget) {
            draggingTarget.dragging = false;
        }

        this.dispatchToElement(param(draggingTarget, e), 'dragend', e.event);

        if (this._dropTarget) {
            this.dispatchToElement(param(this._dropTarget, e), 'drop', e.event);
        }

        this._draggingTarget = null;
        this._dropTarget = null;
    }

};

function param(target, e) {
    return {target: target, topTarget: e && e.topTarget};
}

/* harmony default export */ __webpack_exports__["a"] = (Draggable);

/***/ }),

/***/ 896:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__core_matrix__ = __webpack_require__(364);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_vector__ = __webpack_require__(50);
/**
 * 提供变换扩展
 * @module zrender/mixin/Transformable
 * @author pissang (https://www.github.com/pissang)
 */




var mIdentity = __WEBPACK_IMPORTED_MODULE_0__core_matrix__["d" /* identity */];

var EPSILON = 5e-5;

function isNotAroundZero(val) {
    return val > EPSILON || val < -EPSILON;
}

/**
 * @alias module:zrender/mixin/Transformable
 * @constructor
 */
var Transformable = function (opts) {
    opts = opts || {};
    // If there are no given position, rotation, scale
    if (!opts.position) {
        /**
         * 平移
         * @type {Array.<number>}
         * @default [0, 0]
         */
        this.position = [0, 0];
    }
    if (opts.rotation == null) {
        /**
         * 旋转
         * @type {Array.<number>}
         * @default 0
         */
        this.rotation = 0;
    }
    if (!opts.scale) {
        /**
         * 缩放
         * @type {Array.<number>}
         * @default [1, 1]
         */
        this.scale = [1, 1];
    }
    /**
     * 旋转和缩放的原点
     * @type {Array.<number>}
     * @default null
     */
    this.origin = this.origin || null;
};

var transformableProto = Transformable.prototype;
transformableProto.transform = null;

/**
 * 判断是否需要有坐标变换
 * 如果有坐标变换, 则从position, rotation, scale以及父节点的transform计算出自身的transform矩阵
 */
transformableProto.needLocalTransform = function () {
    return isNotAroundZero(this.rotation)
        || isNotAroundZero(this.position[0])
        || isNotAroundZero(this.position[1])
        || isNotAroundZero(this.scale[0] - 1)
        || isNotAroundZero(this.scale[1] - 1);
};

transformableProto.updateTransform = function () {
    var parent = this.parent;
    var parentHasTransform = parent && parent.transform;
    var needLocalTransform = this.needLocalTransform();

    var m = this.transform;
    if (!(needLocalTransform || parentHasTransform)) {
        m && mIdentity(m);
        return;
    }

    m = m || __WEBPACK_IMPORTED_MODULE_0__core_matrix__["a" /* create */]();

    if (needLocalTransform) {
        this.getLocalTransform(m);
    }
    else {
        mIdentity(m);
    }

    // 应用父节点变换
    if (parentHasTransform) {
        if (needLocalTransform) {
            __WEBPACK_IMPORTED_MODULE_0__core_matrix__["e" /* mul */](m, parent.transform, m);
        }
        else {
            __WEBPACK_IMPORTED_MODULE_0__core_matrix__["f" /* copy */](m, parent.transform);
        }
    }
    // 保存这个变换矩阵
    this.transform = m;

    this.invTransform = this.invTransform || __WEBPACK_IMPORTED_MODULE_0__core_matrix__["a" /* create */]();
    __WEBPACK_IMPORTED_MODULE_0__core_matrix__["g" /* invert */](this.invTransform, m);
};

transformableProto.getLocalTransform = function (m) {
    return Transformable.getLocalTransform(this, m);
};

/**
 * 将自己的transform应用到context上
 * @param {CanvasRenderingContext2D} ctx
 */
transformableProto.setTransform = function (ctx) {
    var m = this.transform;
    var dpr = ctx.dpr || 1;
    if (m) {
        ctx.setTransform(dpr * m[0], dpr * m[1], dpr * m[2], dpr * m[3], dpr * m[4], dpr * m[5]);
    }
    else {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
};

transformableProto.restoreTransform = function (ctx) {
    var dpr = ctx.dpr || 1;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
};

var tmpTransform = [];

/**
 * 分解`transform`矩阵到`position`, `rotation`, `scale`
 */
transformableProto.decomposeTransform = function () {
    if (!this.transform) {
        return;
    }
    var parent = this.parent;
    var m = this.transform;
    if (parent && parent.transform) {
        // Get local transform and decompose them to position, scale, rotation
        __WEBPACK_IMPORTED_MODULE_0__core_matrix__["e" /* mul */](tmpTransform, parent.invTransform, m);
        m = tmpTransform;
    }
    var sx = m[0] * m[0] + m[1] * m[1];
    var sy = m[2] * m[2] + m[3] * m[3];
    var position = this.position;
    var scale = this.scale;
    if (isNotAroundZero(sx - 1)) {
        sx = Math.sqrt(sx);
    }
    if (isNotAroundZero(sy - 1)) {
        sy = Math.sqrt(sy);
    }
    if (m[0] < 0) {
        sx = -sx;
    }
    if (m[3] < 0) {
        sy = -sy;
    }
    position[0] = m[4];
    position[1] = m[5];
    scale[0] = sx;
    scale[1] = sy;
    this.rotation = Math.atan2(-m[1] / sy, m[0] / sx);
};

/**
 * Get global scale
 * @return {Array.<number>}
 */
transformableProto.getGlobalScale = function () {
    var m = this.transform;
    if (!m) {
        return [1, 1];
    }
    var sx = Math.sqrt(m[0] * m[0] + m[1] * m[1]);
    var sy = Math.sqrt(m[2] * m[2] + m[3] * m[3]);
    if (m[0] < 0) {
        sx = -sx;
    }
    if (m[3] < 0) {
        sy = -sy;
    }
    return [sx, sy];
};
/**
 * 变换坐标位置到 shape 的局部坐标空间
 * @method
 * @param {number} x
 * @param {number} y
 * @return {Array.<number>}
 */
transformableProto.transformCoordToLocal = function (x, y) {
    var v2 = [x, y];
    var invTransform = this.invTransform;
    if (invTransform) {
        __WEBPACK_IMPORTED_MODULE_1__core_vector__["b" /* applyTransform */](v2, v2, invTransform);
    }
    return v2;
};

/**
 * 变换局部坐标位置到全局坐标空间
 * @method
 * @param {number} x
 * @param {number} y
 * @return {Array.<number>}
 */
transformableProto.transformCoordToGlobal = function (x, y) {
    var v2 = [x, y];
    var transform = this.transform;
    if (transform) {
        __WEBPACK_IMPORTED_MODULE_1__core_vector__["b" /* applyTransform */](v2, v2, transform);
    }
    return v2;
};

/**
 * @static
 * @param {Object} target
 * @param {Array.<number>} target.origin
 * @param {number} target.rotation
 * @param {Array.<number>} target.position
 * @param {Array.<number>} [m]
 */
Transformable.getLocalTransform = function (target, m) {
    m = m || [];
    mIdentity(m);

    var origin = target.origin;
    var scale = target.scale || [1, 1];
    var rotation = target.rotation || 0;
    var position = target.position || [0, 0];

    if (origin) {
        // Translate to origin
        m[4] -= origin[0];
        m[5] -= origin[1];
    }
    __WEBPACK_IMPORTED_MODULE_0__core_matrix__["c" /* scale */](m, m, scale);
    if (rotation) {
        __WEBPACK_IMPORTED_MODULE_0__core_matrix__["h" /* rotate */](m, m, rotation);
    }
    if (origin) {
        // Translate back from origin
        m[4] += origin[0];
        m[5] += origin[1];
    }

    m[4] += position[0];
    m[5] += position[1];

    return m;
};

/* harmony default export */ __webpack_exports__["a"] = (Transformable);

/***/ }),

/***/ 897:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = parse;
/* unused harmony export lift */
/* unused harmony export toHex */
/* unused harmony export fastLerp */
/* unused harmony export fastMapToColor */
/* unused harmony export lerp */
/* unused harmony export mapToColor */
/* unused harmony export modifyHSL */
/* unused harmony export modifyAlpha */
/* unused harmony export stringify */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__core_LRU__ = __webpack_require__(361);


var kCSSColorTable = {
    'transparent': [0,0,0,0], 'aliceblue': [240,248,255,1],
    'antiquewhite': [250,235,215,1], 'aqua': [0,255,255,1],
    'aquamarine': [127,255,212,1], 'azure': [240,255,255,1],
    'beige': [245,245,220,1], 'bisque': [255,228,196,1],
    'black': [0,0,0,1], 'blanchedalmond': [255,235,205,1],
    'blue': [0,0,255,1], 'blueviolet': [138,43,226,1],
    'brown': [165,42,42,1], 'burlywood': [222,184,135,1],
    'cadetblue': [95,158,160,1], 'chartreuse': [127,255,0,1],
    'chocolate': [210,105,30,1], 'coral': [255,127,80,1],
    'cornflowerblue': [100,149,237,1], 'cornsilk': [255,248,220,1],
    'crimson': [220,20,60,1], 'cyan': [0,255,255,1],
    'darkblue': [0,0,139,1], 'darkcyan': [0,139,139,1],
    'darkgoldenrod': [184,134,11,1], 'darkgray': [169,169,169,1],
    'darkgreen': [0,100,0,1], 'darkgrey': [169,169,169,1],
    'darkkhaki': [189,183,107,1], 'darkmagenta': [139,0,139,1],
    'darkolivegreen': [85,107,47,1], 'darkorange': [255,140,0,1],
    'darkorchid': [153,50,204,1], 'darkred': [139,0,0,1],
    'darksalmon': [233,150,122,1], 'darkseagreen': [143,188,143,1],
    'darkslateblue': [72,61,139,1], 'darkslategray': [47,79,79,1],
    'darkslategrey': [47,79,79,1], 'darkturquoise': [0,206,209,1],
    'darkviolet': [148,0,211,1], 'deeppink': [255,20,147,1],
    'deepskyblue': [0,191,255,1], 'dimgray': [105,105,105,1],
    'dimgrey': [105,105,105,1], 'dodgerblue': [30,144,255,1],
    'firebrick': [178,34,34,1], 'floralwhite': [255,250,240,1],
    'forestgreen': [34,139,34,1], 'fuchsia': [255,0,255,1],
    'gainsboro': [220,220,220,1], 'ghostwhite': [248,248,255,1],
    'gold': [255,215,0,1], 'goldenrod': [218,165,32,1],
    'gray': [128,128,128,1], 'green': [0,128,0,1],
    'greenyellow': [173,255,47,1], 'grey': [128,128,128,1],
    'honeydew': [240,255,240,1], 'hotpink': [255,105,180,1],
    'indianred': [205,92,92,1], 'indigo': [75,0,130,1],
    'ivory': [255,255,240,1], 'khaki': [240,230,140,1],
    'lavender': [230,230,250,1], 'lavenderblush': [255,240,245,1],
    'lawngreen': [124,252,0,1], 'lemonchiffon': [255,250,205,1],
    'lightblue': [173,216,230,1], 'lightcoral': [240,128,128,1],
    'lightcyan': [224,255,255,1], 'lightgoldenrodyellow': [250,250,210,1],
    'lightgray': [211,211,211,1], 'lightgreen': [144,238,144,1],
    'lightgrey': [211,211,211,1], 'lightpink': [255,182,193,1],
    'lightsalmon': [255,160,122,1], 'lightseagreen': [32,178,170,1],
    'lightskyblue': [135,206,250,1], 'lightslategray': [119,136,153,1],
    'lightslategrey': [119,136,153,1], 'lightsteelblue': [176,196,222,1],
    'lightyellow': [255,255,224,1], 'lime': [0,255,0,1],
    'limegreen': [50,205,50,1], 'linen': [250,240,230,1],
    'magenta': [255,0,255,1], 'maroon': [128,0,0,1],
    'mediumaquamarine': [102,205,170,1], 'mediumblue': [0,0,205,1],
    'mediumorchid': [186,85,211,1], 'mediumpurple': [147,112,219,1],
    'mediumseagreen': [60,179,113,1], 'mediumslateblue': [123,104,238,1],
    'mediumspringgreen': [0,250,154,1], 'mediumturquoise': [72,209,204,1],
    'mediumvioletred': [199,21,133,1], 'midnightblue': [25,25,112,1],
    'mintcream': [245,255,250,1], 'mistyrose': [255,228,225,1],
    'moccasin': [255,228,181,1], 'navajowhite': [255,222,173,1],
    'navy': [0,0,128,1], 'oldlace': [253,245,230,1],
    'olive': [128,128,0,1], 'olivedrab': [107,142,35,1],
    'orange': [255,165,0,1], 'orangered': [255,69,0,1],
    'orchid': [218,112,214,1], 'palegoldenrod': [238,232,170,1],
    'palegreen': [152,251,152,1], 'paleturquoise': [175,238,238,1],
    'palevioletred': [219,112,147,1], 'papayawhip': [255,239,213,1],
    'peachpuff': [255,218,185,1], 'peru': [205,133,63,1],
    'pink': [255,192,203,1], 'plum': [221,160,221,1],
    'powderblue': [176,224,230,1], 'purple': [128,0,128,1],
    'red': [255,0,0,1], 'rosybrown': [188,143,143,1],
    'royalblue': [65,105,225,1], 'saddlebrown': [139,69,19,1],
    'salmon': [250,128,114,1], 'sandybrown': [244,164,96,1],
    'seagreen': [46,139,87,1], 'seashell': [255,245,238,1],
    'sienna': [160,82,45,1], 'silver': [192,192,192,1],
    'skyblue': [135,206,235,1], 'slateblue': [106,90,205,1],
    'slategray': [112,128,144,1], 'slategrey': [112,128,144,1],
    'snow': [255,250,250,1], 'springgreen': [0,255,127,1],
    'steelblue': [70,130,180,1], 'tan': [210,180,140,1],
    'teal': [0,128,128,1], 'thistle': [216,191,216,1],
    'tomato': [255,99,71,1], 'turquoise': [64,224,208,1],
    'violet': [238,130,238,1], 'wheat': [245,222,179,1],
    'white': [255,255,255,1], 'whitesmoke': [245,245,245,1],
    'yellow': [255,255,0,1], 'yellowgreen': [154,205,50,1]
};

function clampCssByte(i) {  // Clamp to integer 0 .. 255.
    i = Math.round(i);  // Seems to be what Chrome does (vs truncation).
    return i < 0 ? 0 : i > 255 ? 255 : i;
}

function clampCssAngle(i) {  // Clamp to integer 0 .. 360.
    i = Math.round(i);  // Seems to be what Chrome does (vs truncation).
    return i < 0 ? 0 : i > 360 ? 360 : i;
}

function clampCssFloat(f) {  // Clamp to float 0.0 .. 1.0.
    return f < 0 ? 0 : f > 1 ? 1 : f;
}

function parseCssInt(str) {  // int or percentage.
    if (str.length && str.charAt(str.length - 1) === '%') {
        return clampCssByte(parseFloat(str) / 100 * 255);
    }
    return clampCssByte(parseInt(str, 10));
}

function parseCssFloat(str) {  // float or percentage.
    if (str.length && str.charAt(str.length - 1) === '%') {
        return clampCssFloat(parseFloat(str) / 100);
    }
    return clampCssFloat(parseFloat(str));
}

function cssHueToRgb(m1, m2, h) {
    if (h < 0) {
        h += 1;
    }
    else if (h > 1) {
        h -= 1;
    }

    if (h * 6 < 1) {
        return m1 + (m2 - m1) * h * 6;
    }
    if (h * 2 < 1) {
        return m2;
    }
    if (h * 3 < 2) {
        return m1 + (m2 - m1) * (2/3 - h) * 6;
    }
    return m1;
}

function lerpNumber(a, b, p) {
    return a + (b - a) * p;
}

function setRgba(out, r, g, b, a) {
    out[0] = r; out[1] = g; out[2] = b; out[3] = a;
    return out;
}
function copyRgba(out, a) {
    out[0] = a[0]; out[1] = a[1]; out[2] = a[2]; out[3] = a[3];
    return out;
}

var colorCache = new __WEBPACK_IMPORTED_MODULE_0__core_LRU__["a" /* default */](20);
var lastRemovedArr = null;

function putToCache(colorStr, rgbaArr) {
    // Reuse removed array
    if (lastRemovedArr) {
        copyRgba(lastRemovedArr, rgbaArr);
    }
    lastRemovedArr = colorCache.put(colorStr, lastRemovedArr || (rgbaArr.slice()));
}

/**
 * @param {string} colorStr
 * @param {Array.<number>} out
 * @return {Array.<number>}
 * @memberOf module:zrender/util/color
 */
function parse(colorStr, rgbaArr) {
    if (!colorStr) {
        return;
    }
    rgbaArr = rgbaArr || [];

    var cached = colorCache.get(colorStr);
    if (cached) {
        return copyRgba(rgbaArr, cached);
    }

    // colorStr may be not string
    colorStr = colorStr + '';
    // Remove all whitespace, not compliant, but should just be more accepting.
    var str = colorStr.replace(/ /g, '').toLowerCase();

    // Color keywords (and transparent) lookup.
    if (str in kCSSColorTable) {
        copyRgba(rgbaArr, kCSSColorTable[str]);
        putToCache(colorStr, rgbaArr);
        return rgbaArr;
    }

    // #abc and #abc123 syntax.
    if (str.charAt(0) === '#') {
        if (str.length === 4) {
            var iv = parseInt(str.substr(1), 16);  // TODO(deanm): Stricter parsing.
            if (!(iv >= 0 && iv <= 0xfff)) {
                setRgba(rgbaArr, 0, 0, 0, 1);
                return;  // Covers NaN.
            }
            setRgba(rgbaArr,
                ((iv & 0xf00) >> 4) | ((iv & 0xf00) >> 8),
                (iv & 0xf0) | ((iv & 0xf0) >> 4),
                (iv & 0xf) | ((iv & 0xf) << 4),
                1
            );
            putToCache(colorStr, rgbaArr);
            return rgbaArr;
        }
        else if (str.length === 7) {
            var iv = parseInt(str.substr(1), 16);  // TODO(deanm): Stricter parsing.
            if (!(iv >= 0 && iv <= 0xffffff)) {
                setRgba(rgbaArr, 0, 0, 0, 1);
                return;  // Covers NaN.
            }
            setRgba(rgbaArr,
                (iv & 0xff0000) >> 16,
                (iv & 0xff00) >> 8,
                iv & 0xff,
                1
            );
            putToCache(colorStr, rgbaArr);
            return rgbaArr;
        }

        return;
    }
    var op = str.indexOf('('), ep = str.indexOf(')');
    if (op !== -1 && ep + 1 === str.length) {
        var fname = str.substr(0, op);
        var params = str.substr(op + 1, ep - (op + 1)).split(',');
        var alpha = 1;  // To allow case fallthrough.
        switch (fname) {
            case 'rgba':
                if (params.length !== 4) {
                    setRgba(rgbaArr, 0, 0, 0, 1);
                    return;
                }
                alpha = parseCssFloat(params.pop()); // jshint ignore:line
            // Fall through.
            case 'rgb':
                if (params.length !== 3) {
                    setRgba(rgbaArr, 0, 0, 0, 1);
                    return;
                }
                setRgba(rgbaArr,
                    parseCssInt(params[0]),
                    parseCssInt(params[1]),
                    parseCssInt(params[2]),
                    alpha
                );
                putToCache(colorStr, rgbaArr);
                return rgbaArr;
            case 'hsla':
                if (params.length !== 4) {
                    setRgba(rgbaArr, 0, 0, 0, 1);
                    return;
                }
                params[3] = parseCssFloat(params[3]);
                hsla2rgba(params, rgbaArr);
                putToCache(colorStr, rgbaArr);
                return rgbaArr;
            case 'hsl':
                if (params.length !== 3) {
                    setRgba(rgbaArr, 0, 0, 0, 1);
                    return;
                }
                hsla2rgba(params, rgbaArr);
                putToCache(colorStr, rgbaArr);
                return rgbaArr;
            default:
                return;
        }
    }

    setRgba(rgbaArr, 0, 0, 0, 1);
    return;
}

/**
 * @param {Array.<number>} hsla
 * @param {Array.<number>} rgba
 * @return {Array.<number>} rgba
 */
function hsla2rgba(hsla, rgba) {
    var h = (((parseFloat(hsla[0]) % 360) + 360) % 360) / 360;  // 0 .. 1
    // NOTE(deanm): According to the CSS spec s/l should only be
    // percentages, but we don't bother and let float or percentage.
    var s = parseCssFloat(hsla[1]);
    var l = parseCssFloat(hsla[2]);
    var m2 = l <= 0.5 ? l * (s + 1) : l + s - l * s;
    var m1 = l * 2 - m2;

    rgba = rgba || [];
    setRgba(rgba,
        clampCssByte(cssHueToRgb(m1, m2, h + 1 / 3) * 255),
        clampCssByte(cssHueToRgb(m1, m2, h) * 255),
        clampCssByte(cssHueToRgb(m1, m2, h - 1 / 3) * 255),
        1
    );

    if (hsla.length === 4) {
        rgba[3] = hsla[3];
    }

    return rgba;
}

/**
 * @param {Array.<number>} rgba
 * @return {Array.<number>} hsla
 */
function rgba2hsla(rgba) {
    if (!rgba) {
        return;
    }

    // RGB from 0 to 255
    var R = rgba[0] / 255;
    var G = rgba[1] / 255;
    var B = rgba[2] / 255;

    var vMin = Math.min(R, G, B); // Min. value of RGB
    var vMax = Math.max(R, G, B); // Max. value of RGB
    var delta = vMax - vMin; // Delta RGB value

    var L = (vMax + vMin) / 2;
    var H;
    var S;
    // HSL results from 0 to 1
    if (delta === 0) {
        H = 0;
        S = 0;
    }
    else {
        if (L < 0.5) {
            S = delta / (vMax + vMin);
        }
        else {
            S = delta / (2 - vMax - vMin);
        }

        var deltaR = (((vMax - R) / 6) + (delta / 2)) / delta;
        var deltaG = (((vMax - G) / 6) + (delta / 2)) / delta;
        var deltaB = (((vMax - B) / 6) + (delta / 2)) / delta;

        if (R === vMax) {
            H = deltaB - deltaG;
        }
        else if (G === vMax) {
            H = (1 / 3) + deltaR - deltaB;
        }
        else if (B === vMax) {
            H = (2 / 3) + deltaG - deltaR;
        }

        if (H < 0) {
            H += 1;
        }

        if (H > 1) {
            H -= 1;
        }
    }

    var hsla = [H * 360, S, L];

    if (rgba[3] != null) {
        hsla.push(rgba[3]);
    }

    return hsla;
}

/**
 * @param {string} color
 * @param {number} level
 * @return {string}
 * @memberOf module:zrender/util/color
 */
function lift(color, level) {
    var colorArr = parse(color);
    if (colorArr) {
        for (var i = 0; i < 3; i++) {
            if (level < 0) {
                colorArr[i] = colorArr[i] * (1 - level) | 0;
            }
            else {
                colorArr[i] = ((255 - colorArr[i]) * level + colorArr[i]) | 0;
            }
        }
        return stringify(colorArr, colorArr.length === 4 ? 'rgba' : 'rgb');
    }
}

/**
 * @param {string} color
 * @return {string}
 * @memberOf module:zrender/util/color
 */
function toHex(color) {
    var colorArr = parse(color);
    if (colorArr) {
        return ((1 << 24) + (colorArr[0] << 16) + (colorArr[1] << 8) + (+colorArr[2])).toString(16).slice(1);
    }
}

/**
 * Map value to color. Faster than lerp methods because color is represented by rgba array.
 * @param {number} normalizedValue A float between 0 and 1.
 * @param {Array.<Array.<number>>} colors List of rgba color array
 * @param {Array.<number>} [out] Mapped gba color array
 * @return {Array.<number>} will be null/undefined if input illegal.
 */
function fastLerp(normalizedValue, colors, out) {
    if (!(colors && colors.length)
        || !(normalizedValue >= 0 && normalizedValue <= 1)
    ) {
        return;
    }

    out = out || [];

    var value = normalizedValue * (colors.length - 1);
    var leftIndex = Math.floor(value);
    var rightIndex = Math.ceil(value);
    var leftColor = colors[leftIndex];
    var rightColor = colors[rightIndex];
    var dv = value - leftIndex;
    out[0] = clampCssByte(lerpNumber(leftColor[0], rightColor[0], dv));
    out[1] = clampCssByte(lerpNumber(leftColor[1], rightColor[1], dv));
    out[2] = clampCssByte(lerpNumber(leftColor[2], rightColor[2], dv));
    out[3] = clampCssFloat(lerpNumber(leftColor[3], rightColor[3], dv));

    return out;
}

/**
 * @deprecated
 */
var fastMapToColor = fastLerp;

/**
 * @param {number} normalizedValue A float between 0 and 1.
 * @param {Array.<string>} colors Color list.
 * @param {boolean=} fullOutput Default false.
 * @return {(string|Object)} Result color. If fullOutput,
 *                           return {color: ..., leftIndex: ..., rightIndex: ..., value: ...},
 * @memberOf module:zrender/util/color
 */
function lerp(normalizedValue, colors, fullOutput) {
    if (!(colors && colors.length)
        || !(normalizedValue >= 0 && normalizedValue <= 1)
    ) {
        return;
    }

    var value = normalizedValue * (colors.length - 1);
    var leftIndex = Math.floor(value);
    var rightIndex = Math.ceil(value);
    var leftColor = parse(colors[leftIndex]);
    var rightColor = parse(colors[rightIndex]);
    var dv = value - leftIndex;

    var color = stringify(
        [
            clampCssByte(lerpNumber(leftColor[0], rightColor[0], dv)),
            clampCssByte(lerpNumber(leftColor[1], rightColor[1], dv)),
            clampCssByte(lerpNumber(leftColor[2], rightColor[2], dv)),
            clampCssFloat(lerpNumber(leftColor[3], rightColor[3], dv))
        ],
        'rgba'
    );

    return fullOutput
        ? {
            color: color,
            leftIndex: leftIndex,
            rightIndex: rightIndex,
            value: value
        }
        : color;
}

/**
 * @deprecated
 */
var mapToColor = lerp;

/**
 * @param {string} color
 * @param {number=} h 0 ~ 360, ignore when null.
 * @param {number=} s 0 ~ 1, ignore when null.
 * @param {number=} l 0 ~ 1, ignore when null.
 * @return {string} Color string in rgba format.
 * @memberOf module:zrender/util/color
 */
function modifyHSL(color, h, s, l) {
    color = parse(color);

    if (color) {
        color = rgba2hsla(color);
        h != null && (color[0] = clampCssAngle(h));
        s != null && (color[1] = parseCssFloat(s));
        l != null && (color[2] = parseCssFloat(l));

        return stringify(hsla2rgba(color), 'rgba');
    }
}

/**
 * @param {string} color
 * @param {number=} alpha 0 ~ 1
 * @return {string} Color string in rgba format.
 * @memberOf module:zrender/util/color
 */
function modifyAlpha(color, alpha) {
    color = parse(color);

    if (color && alpha != null) {
        color[3] = clampCssFloat(alpha);
        return stringify(color, 'rgba');
    }
}

/**
 * @param {Array.<number>} arrColor like [12,33,44,0.4]
 * @param {string} type 'rgba', 'hsva', ...
 * @return {string} Result color. (If input illegal, return undefined).
 */
function stringify(arrColor, type) {
    if (!arrColor || !arrColor.length) {
        return;
    }
    var colorStr = arrColor[0] + ',' + arrColor[1] + ',' + arrColor[2];
    if (type === 'rgba' || type === 'hsva' || type === 'hsla') {
        colorStr += ',' + arrColor[3];
    }
    return type + '(' + colorStr + ')';
}


/***/ }),

/***/ 898:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["createFromString"] = createFromString;
/* harmony export (immutable) */ __webpack_exports__["extendFromString"] = extendFromString;
/* harmony export (immutable) */ __webpack_exports__["mergePath"] = mergePath;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__graphic_Path__ = __webpack_require__(213);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_PathProxy__ = __webpack_require__(145);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__transformPath__ = __webpack_require__(899);




// command chars
var cc = [
    'm', 'M', 'l', 'L', 'v', 'V', 'h', 'H', 'z', 'Z',
    'c', 'C', 'q', 'Q', 't', 'T', 's', 'S', 'a', 'A'
];

var mathSqrt = Math.sqrt;
var mathSin = Math.sin;
var mathCos = Math.cos;
var PI = Math.PI;

var vMag = function(v) {
    return Math.sqrt(v[0] * v[0] + v[1] * v[1]);
};
var vRatio = function(u, v) {
    return (u[0] * v[0] + u[1] * v[1]) / (vMag(u) * vMag(v));
};
var vAngle = function(u, v) {
    return (u[0] * v[1] < u[1] * v[0] ? -1 : 1)
            * Math.acos(vRatio(u, v));
};

function processArc(x1, y1, x2, y2, fa, fs, rx, ry, psiDeg, cmd, path) {
    var psi = psiDeg * (PI / 180.0);
    var xp = mathCos(psi) * (x1 - x2) / 2.0
                + mathSin(psi) * (y1 - y2) / 2.0;
    var yp = -1 * mathSin(psi) * (x1 - x2) / 2.0
                + mathCos(psi) * (y1 - y2) / 2.0;

    var lambda = (xp * xp) / (rx * rx) + (yp * yp) / (ry * ry);

    if (lambda > 1) {
        rx *= mathSqrt(lambda);
        ry *= mathSqrt(lambda);
    }

    var f = (fa === fs ? -1 : 1)
        * mathSqrt((((rx * rx) * (ry * ry))
                - ((rx * rx) * (yp * yp))
                - ((ry * ry) * (xp * xp))) / ((rx * rx) * (yp * yp)
                + (ry * ry) * (xp * xp))
            ) || 0;

    var cxp = f * rx * yp / ry;
    var cyp = f * -ry * xp / rx;

    var cx = (x1 + x2) / 2.0
                + mathCos(psi) * cxp
                - mathSin(psi) * cyp;
    var cy = (y1 + y2) / 2.0
            + mathSin(psi) * cxp
            + mathCos(psi) * cyp;

    var theta = vAngle([ 1, 0 ], [ (xp - cxp) / rx, (yp - cyp) / ry ]);
    var u = [ (xp - cxp) / rx, (yp - cyp) / ry ];
    var v = [ (-1 * xp - cxp) / rx, (-1 * yp - cyp) / ry ];
    var dTheta = vAngle(u, v);

    if (vRatio(u, v) <= -1) {
        dTheta = PI;
    }
    if (vRatio(u, v) >= 1) {
        dTheta = 0;
    }
    if (fs === 0 && dTheta > 0) {
        dTheta = dTheta - 2 * PI;
    }
    if (fs === 1 && dTheta < 0) {
        dTheta = dTheta + 2 * PI;
    }

    path.addData(cmd, cx, cy, rx, ry, theta, dTheta, psi, fs);
}

function createPathProxyFromString(data) {
    if (!data) {
        return [];
    }

    // command string
    var cs = data.replace(/-/g, ' -')
        .replace(/  /g, ' ')
        .replace(/ /g, ',')
        .replace(/,,/g, ',');

    var n;
    // create pipes so that we can split the data
    for (n = 0; n < cc.length; n++) {
        cs = cs.replace(new RegExp(cc[n], 'g'), '|' + cc[n]);
    }

    // create array
    var arr = cs.split('|');
    // init context point
    var cpx = 0;
    var cpy = 0;

    var path = new __WEBPACK_IMPORTED_MODULE_1__core_PathProxy__["a" /* default */]();
    var CMD = __WEBPACK_IMPORTED_MODULE_1__core_PathProxy__["a" /* default */].CMD;

    var prevCmd;
    for (n = 1; n < arr.length; n++) {
        var str = arr[n];
        var c = str.charAt(0);
        var off = 0;
        var p = str.slice(1).replace(/e,-/g, 'e-').split(',');
        var cmd;

        if (p.length > 0 && p[0] === '') {
            p.shift();
        }

        for (var i = 0; i < p.length; i++) {
            p[i] = parseFloat(p[i]);
        }
        while (off < p.length && !isNaN(p[off])) {
            if (isNaN(p[0])) {
                break;
            }
            var ctlPtx;
            var ctlPty;

            var rx;
            var ry;
            var psi;
            var fa;
            var fs;

            var x1 = cpx;
            var y1 = cpy;

            // convert l, H, h, V, and v to L
            switch (c) {
                case 'l':
                    cpx += p[off++];
                    cpy += p[off++];
                    cmd = CMD.L;
                    path.addData(cmd, cpx, cpy);
                    break;
                case 'L':
                    cpx = p[off++];
                    cpy = p[off++];
                    cmd = CMD.L;
                    path.addData(cmd, cpx, cpy);
                    break;
                case 'm':
                    cpx += p[off++];
                    cpy += p[off++];
                    cmd = CMD.M;
                    path.addData(cmd, cpx, cpy);
                    c = 'l';
                    break;
                case 'M':
                    cpx = p[off++];
                    cpy = p[off++];
                    cmd = CMD.M;
                    path.addData(cmd, cpx, cpy);
                    c = 'L';
                    break;
                case 'h':
                    cpx += p[off++];
                    cmd = CMD.L;
                    path.addData(cmd, cpx, cpy);
                    break;
                case 'H':
                    cpx = p[off++];
                    cmd = CMD.L;
                    path.addData(cmd, cpx, cpy);
                    break;
                case 'v':
                    cpy += p[off++];
                    cmd = CMD.L;
                    path.addData(cmd, cpx, cpy);
                    break;
                case 'V':
                    cpy = p[off++];
                    cmd = CMD.L;
                    path.addData(cmd, cpx, cpy);
                    break;
                case 'C':
                    cmd = CMD.C;
                    path.addData(
                        cmd, p[off++], p[off++], p[off++], p[off++], p[off++], p[off++]
                    );
                    cpx = p[off - 2];
                    cpy = p[off - 1];
                    break;
                case 'c':
                    cmd = CMD.C;
                    path.addData(
                        cmd,
                        p[off++] + cpx, p[off++] + cpy,
                        p[off++] + cpx, p[off++] + cpy,
                        p[off++] + cpx, p[off++] + cpy
                    );
                    cpx += p[off - 2];
                    cpy += p[off - 1];
                    break;
                case 'S':
                    ctlPtx = cpx;
                    ctlPty = cpy;
                    var len = path.len();
                    var pathData = path.data;
                    if (prevCmd === CMD.C) {
                        ctlPtx += cpx - pathData[len - 4];
                        ctlPty += cpy - pathData[len - 3];
                    }
                    cmd = CMD.C;
                    x1 = p[off++];
                    y1 = p[off++];
                    cpx = p[off++];
                    cpy = p[off++];
                    path.addData(cmd, ctlPtx, ctlPty, x1, y1, cpx, cpy);
                    break;
                case 's':
                    ctlPtx = cpx;
                    ctlPty = cpy;
                    var len = path.len();
                    var pathData = path.data;
                    if (prevCmd === CMD.C) {
                        ctlPtx += cpx - pathData[len - 4];
                        ctlPty += cpy - pathData[len - 3];
                    }
                    cmd = CMD.C;
                    x1 = cpx + p[off++];
                    y1 = cpy + p[off++];
                    cpx += p[off++];
                    cpy += p[off++];
                    path.addData(cmd, ctlPtx, ctlPty, x1, y1, cpx, cpy);
                    break;
                case 'Q':
                    x1 = p[off++];
                    y1 = p[off++];
                    cpx = p[off++];
                    cpy = p[off++];
                    cmd = CMD.Q;
                    path.addData(cmd, x1, y1, cpx, cpy);
                    break;
                case 'q':
                    x1 = p[off++] + cpx;
                    y1 = p[off++] + cpy;
                    cpx += p[off++];
                    cpy += p[off++];
                    cmd = CMD.Q;
                    path.addData(cmd, x1, y1, cpx, cpy);
                    break;
                case 'T':
                    ctlPtx = cpx;
                    ctlPty = cpy;
                    var len = path.len();
                    var pathData = path.data;
                    if (prevCmd === CMD.Q) {
                        ctlPtx += cpx - pathData[len - 4];
                        ctlPty += cpy - pathData[len - 3];
                    }
                    cpx = p[off++];
                    cpy = p[off++];
                    cmd = CMD.Q;
                    path.addData(cmd, ctlPtx, ctlPty, cpx, cpy);
                    break;
                case 't':
                    ctlPtx = cpx;
                    ctlPty = cpy;
                    var len = path.len();
                    var pathData = path.data;
                    if (prevCmd === CMD.Q) {
                        ctlPtx += cpx - pathData[len - 4];
                        ctlPty += cpy - pathData[len - 3];
                    }
                    cpx += p[off++];
                    cpy += p[off++];
                    cmd = CMD.Q;
                    path.addData(cmd, ctlPtx, ctlPty, cpx, cpy);
                    break;
                case 'A':
                    rx = p[off++];
                    ry = p[off++];
                    psi = p[off++];
                    fa = p[off++];
                    fs = p[off++];

                    x1 = cpx, y1 = cpy;
                    cpx = p[off++];
                    cpy = p[off++];
                    cmd = CMD.A;
                    processArc(
                        x1, y1, cpx, cpy, fa, fs, rx, ry, psi, cmd, path
                    );
                    break;
                case 'a':
                    rx = p[off++];
                    ry = p[off++];
                    psi = p[off++];
                    fa = p[off++];
                    fs = p[off++];

                    x1 = cpx, y1 = cpy;
                    cpx += p[off++];
                    cpy += p[off++];
                    cmd = CMD.A;
                    processArc(
                        x1, y1, cpx, cpy, fa, fs, rx, ry, psi, cmd, path
                    );
                    break;
            }
        }

        if (c === 'z' || c === 'Z') {
            cmd = CMD.Z;
            path.addData(cmd);
        }

        prevCmd = cmd;
    }

    path.toStatic();

    return path;
}

// TODO Optimize double memory cost problem
function createPathOptions(str, opts) {
    var pathProxy = createPathProxyFromString(str);
    opts = opts || {};
    opts.buildPath = function (path) {
        if (path.setData) {
            path.setData(pathProxy.data);
            // Svg and vml renderer don't have context
            var ctx = path.getContext();
            if (ctx) {
                path.rebuildPath(ctx);
            }
        }
        else {
            var ctx = path;
            pathProxy.rebuildPath(ctx);
        }
    };

    opts.applyTransform = function (m) {
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__transformPath__["a" /* default */])(pathProxy, m);

        this.dirty(true);
    };

    return opts;
}

/**
 * Create a Path object from path string data
 * http://www.w3.org/TR/SVG/paths.html#PathData
 * @param  {Object} opts Other options
 */
function createFromString(str, opts) {
    return new __WEBPACK_IMPORTED_MODULE_0__graphic_Path__["a" /* default */](createPathOptions(str, opts));
}

/**
 * Create a Path class from path string data
 * @param  {string} str
 * @param  {Object} opts Other options
 */
function extendFromString(str, opts) {
    return __WEBPACK_IMPORTED_MODULE_0__graphic_Path__["a" /* default */].extend(createPathOptions(str, opts));
}

/**
 * Merge multiple paths
 */
// TODO Apply transform
// TODO stroke dash
// TODO Optimize double memory cost problem
function mergePath(pathEls, opts) {
    var pathList = [];
    var len = pathEls.length;
    for (var i = 0; i < len; i++) {
        var pathEl = pathEls[i];
        if (!pathEl.path) {
            pathEl.createPathProxy();
        }
        if (pathEl.__dirtyPath) {
            pathEl.buildPath(pathEl.path, pathEl.shape, true);
        }
        pathList.push(pathEl.path);
    }

    var pathBundle = new __WEBPACK_IMPORTED_MODULE_0__graphic_Path__["a" /* default */](opts);
    // Need path proxy.
    pathBundle.createPathProxy();
    pathBundle.buildPath = function (path) {
        path.appendPath(pathList);
        // Svg and vml renderer don't have context
        var ctx = path.getContext();
        if (ctx) {
            path.rebuildPath(ctx);
        }
    };

    return pathBundle;
}

/***/ }),

/***/ 899:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__core_PathProxy__ = __webpack_require__(145);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_vector__ = __webpack_require__(50);



var CMD = __WEBPACK_IMPORTED_MODULE_0__core_PathProxy__["a" /* default */].CMD;

var points = [[], [], []];
var mathSqrt = Math.sqrt;
var mathAtan2 = Math.atan2;

/* harmony default export */ __webpack_exports__["a"] = (function (path, m) {
    var data = path.data;
    var cmd;
    var nPoint;
    var i;
    var j;
    var k;
    var p;

    var M = CMD.M;
    var C = CMD.C;
    var L = CMD.L;
    var R = CMD.R;
    var A = CMD.A;
    var Q = CMD.Q;

    for (i = 0, j = 0; i < data.length;) {
        cmd = data[i++];
        j = i;
        nPoint = 0;

        switch (cmd) {
            case M:
                nPoint = 1;
                break;
            case L:
                nPoint = 1;
                break;
            case C:
                nPoint = 3;
                break;
            case Q:
                nPoint = 2;
                break;
            case A:
                var x = m[4];
                var y = m[5];
                var sx = mathSqrt(m[0] * m[0] + m[1] * m[1]);
                var sy = mathSqrt(m[2] * m[2] + m[3] * m[3]);
                var angle = mathAtan2(-m[1] / sy, m[0] / sx);
                // cx
                data[i] *= sx;
                data[i++] += x;
                // cy
                data[i] *= sy;
                data[i++] += y;
                // Scale rx and ry
                // FIXME Assume psi is 0 here
                data[i++] *= sx;
                data[i++] *= sy;

                // Start angle
                data[i++] += angle;
                // end angle
                data[i++] += angle;
                // FIXME psi
                i += 2;
                j = i;
                break;
            case R:
                // x0, y0
                p[0] = data[i++];
                p[1] = data[i++];
                __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__core_vector__["b" /* applyTransform */])(p, p, m);
                data[j++] = p[0];
                data[j++] = p[1];
                // x1, y1
                p[0] += data[i++];
                p[1] += data[i++];
                __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__core_vector__["b" /* applyTransform */])(p, p, m);
                data[j++] = p[0];
                data[j++] = p[1];
        }

        for (k = 0; k < nPoint; k++) {
            var p = points[k];
            p[0] = data[i++];
            p[1] = data[i++];

            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__core_vector__["b" /* applyTransform */])(p, p, m);
            // Write back
            data[j++] = p[0];
            data[j++] = p[1];
        }
    }
});


/***/ }),

/***/ 900:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "version", function() { return version; });
/* harmony export (immutable) */ __webpack_exports__["init"] = init;
/* harmony export (immutable) */ __webpack_exports__["dispose"] = dispose;
/* harmony export (immutable) */ __webpack_exports__["getInstance"] = getInstance;
/* harmony export (immutable) */ __webpack_exports__["registerPainter"] = registerPainter;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__core_guid__ = __webpack_require__(362);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_env__ = __webpack_require__(146);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__core_util__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Handler__ = __webpack_require__(871);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__Storage__ = __webpack_require__(874);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__Painter__ = __webpack_require__(873);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__animation_Animation__ = __webpack_require__(875);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__dom_HandlerProxy__ = __webpack_require__(887);
/*!
* ZRender, a high performance 2d drawing library.
*
* Copyright (c) 2013, Baidu Inc.
* All rights reserved.
*
* LICENSE
* https://github.com/ecomfe/zrender/blob/master/LICENSE.txt
*/










var useVML = !__WEBPACK_IMPORTED_MODULE_1__core_env__["a" /* default */].canvasSupported;

var painterCtors = {
    canvas: __WEBPACK_IMPORTED_MODULE_5__Painter__["a" /* default */]
};

var instances = {};    // ZRender实例map索引

/**
 * @type {string}
 */
var version = '3.7.4';

/**
 * Initializing a zrender instance
 * @param {HTMLElement} dom
 * @param {Object} opts
 * @param {string} [opts.renderer='canvas'] 'canvas' or 'svg'
 * @param {number} [opts.devicePixelRatio]
 * @param {number|string} [opts.width] Can be 'auto' (the same as null/undefined)
 * @param {number|string} [opts.height] Can be 'auto' (the same as null/undefined)
 * @return {module:zrender/ZRender}
 */
function init(dom, opts) {
    var zr = new ZRender(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__core_guid__["a" /* default */])(), dom, opts);
    instances[zr.id] = zr;
    return zr;
}

/**
 * Dispose zrender instance
 * @param {module:zrender/ZRender} zr
 */
function dispose(zr) {
    if (zr) {
        zr.dispose();
    }
    else {
        for (var key in instances) {
            if (instances.hasOwnProperty(key)) {
                instances[key].dispose();
            }
        }
        instances = {};
    }

    return this;
}

/**
 * Get zrender instance by id
 * @param {string} id zrender instance id
 * @return {module:zrender/ZRender}
 */
function getInstance(id) {
    return instances[id];
}

function registerPainter(name, Ctor) {
    painterCtors[name] = Ctor;
}

function delInstance(id) {
    delete instances[id];
}

/**
 * @module zrender/ZRender
 */
/**
 * @constructor
 * @alias module:zrender/ZRender
 * @param {string} id
 * @param {HTMLElement} dom
 * @param {Object} opts
 * @param {string} [opts.renderer='canvas'] 'canvas' or 'svg'
 * @param {number} [opts.devicePixelRatio]
 * @param {number} [opts.width] Can be 'auto' (the same as null/undefined)
 * @param {number} [opts.height] Can be 'auto' (the same as null/undefined)
 */
var ZRender = function (id, dom, opts) {

    opts = opts || {};

    /**
     * @type {HTMLDomElement}
     */
    this.dom = dom;

    /**
     * @type {string}
     */
    this.id = id;

    var self = this;
    var storage = new __WEBPACK_IMPORTED_MODULE_4__Storage__["a" /* default */]();

    var rendererType = opts.renderer;
    // TODO WebGL
    if (useVML) {
        if (!painterCtors.vml) {
            throw new Error('You need to require \'zrender/vml/vml\' to support IE8');
        }
        rendererType = 'vml';
    }
    else if (!rendererType || !painterCtors[rendererType]) {
        rendererType = 'canvas';
    }
    var painter = new painterCtors[rendererType](dom, storage, opts);

    this.storage = storage;
    this.painter = painter;

    var handerProxy = !__WEBPACK_IMPORTED_MODULE_1__core_env__["a" /* default */].node ? new __WEBPACK_IMPORTED_MODULE_7__dom_HandlerProxy__["a" /* default */](painter.getViewportRoot()) : null;
    this.handler = new __WEBPACK_IMPORTED_MODULE_3__Handler__["a" /* default */](storage, painter, handerProxy, painter.root);

    /**
     * @type {module:zrender/animation/Animation}
     */
    this.animation = new __WEBPACK_IMPORTED_MODULE_6__animation_Animation__["a" /* default */]({
        stage: {
            update: __WEBPACK_IMPORTED_MODULE_2__core_util__["b" /* bind */](this.flush, this)
        }
    });
    this.animation.start();

    /**
     * @type {boolean}
     * @private
     */
    this._needsRefresh;

    // 修改 storage.delFromStorage, 每次删除元素之前删除动画
    // FIXME 有点ugly
    var oldDelFromStorage = storage.delFromStorage;
    var oldAddToStorage = storage.addToStorage;

    storage.delFromStorage = function (el) {
        oldDelFromStorage.call(storage, el);

        el && el.removeSelfFromZr(self);
    };

    storage.addToStorage = function (el) {
        oldAddToStorage.call(storage, el);

        el.addSelfToZr(self);
    };
};

ZRender.prototype = {

    constructor: ZRender,
    /**
     * 获取实例唯一标识
     * @return {string}
     */
    getId: function () {
        return this.id;
    },

    /**
     * 添加元素
     * @param  {module:zrender/Element} el
     */
    add: function (el) {
        this.storage.addRoot(el);
        this._needsRefresh = true;
    },

    /**
     * 删除元素
     * @param  {module:zrender/Element} el
     */
    remove: function (el) {
        this.storage.delRoot(el);
        this._needsRefresh = true;
    },

    /**
     * Change configuration of layer
     * @param {string} zLevel
     * @param {Object} config
     * @param {string} [config.clearColor=0] Clear color
     * @param {string} [config.motionBlur=false] If enable motion blur
     * @param {number} [config.lastFrameAlpha=0.7] Motion blur factor. Larger value cause longer trailer
    */
    configLayer: function (zLevel, config) {
        this.painter.configLayer(zLevel, config);
        this._needsRefresh = true;
    },

    /**
     * Repaint the canvas immediately
     */
    refreshImmediately: function () {
        // var start = new Date();
        // Clear needsRefresh ahead to avoid something wrong happens in refresh
        // Or it will cause zrender refreshes again and again.
        this._needsRefresh = false;
        this.painter.refresh();
        /**
         * Avoid trigger zr.refresh in Element#beforeUpdate hook
         */
        this._needsRefresh = false;
        // var end = new Date();

        // var log = document.getElementById('log');
        // if (log) {
        //     log.innerHTML = log.innerHTML + '<br>' + (end - start);
        // }
    },

    /**
     * Mark and repaint the canvas in the next frame of browser
     */
    refresh: function() {
        this._needsRefresh = true;
    },

    /**
     * Perform all refresh
     */
    flush: function () {
        if (this._needsRefresh) {
            this.refreshImmediately();
        }
        if (this._needsRefreshHover) {
            this.refreshHoverImmediately();
        }
    },

    /**
     * Add element to hover layer
     * @param  {module:zrender/Element} el
     * @param {Object} style
     */
    addHover: function (el, style) {
        if (this.painter.addHover) {
            this.painter.addHover(el, style);
            this.refreshHover();
        }
    },

    /**
     * Add element from hover layer
     * @param  {module:zrender/Element} el
     */
    removeHover: function (el) {
        if (this.painter.removeHover) {
            this.painter.removeHover(el);
            this.refreshHover();
        }
    },

    /**
     * Clear all hover elements in hover layer
     * @param  {module:zrender/Element} el
     */
    clearHover: function () {
        if (this.painter.clearHover) {
            this.painter.clearHover();
            this.refreshHover();
        }
    },

    /**
     * Refresh hover in next frame
     */
    refreshHover: function () {
        this._needsRefreshHover = true;
    },

    /**
     * Refresh hover immediately
     */
    refreshHoverImmediately: function () {
        this._needsRefreshHover = false;
        this.painter.refreshHover && this.painter.refreshHover();
    },

    /**
     * Resize the canvas.
     * Should be invoked when container size is changed
     * @param {Object} [opts]
     * @param {number|string} [opts.width] Can be 'auto' (the same as null/undefined)
     * @param {number|string} [opts.height] Can be 'auto' (the same as null/undefined)
     */
    resize: function(opts) {
        opts = opts || {};
        this.painter.resize(opts.width, opts.height);
        this.handler.resize();
    },

    /**
     * Stop and clear all animation immediately
     */
    clearAnimation: function () {
        this.animation.clear();
    },

    /**
     * Get container width
     */
    getWidth: function() {
        return this.painter.getWidth();
    },

    /**
     * Get container height
     */
    getHeight: function() {
        return this.painter.getHeight();
    },

    /**
     * Export the canvas as Base64 URL
     * @param {string} type
     * @param {string} [backgroundColor='#fff']
     * @return {string} Base64 URL
     */
    // toDataURL: function(type, backgroundColor) {
    //     return this.painter.getRenderedCanvas({
    //         backgroundColor: backgroundColor
    //     }).toDataURL(type);
    // },

    /**
     * Converting a path to image.
     * It has much better performance of drawing image rather than drawing a vector path.
     * @param {module:zrender/graphic/Path} e
     * @param {number} width
     * @param {number} height
     */
    pathToImage: function(e, dpr) {
        return this.painter.pathToImage(e, dpr);
    },

    /**
     * Set default cursor
     * @param {string} [cursorStyle='default'] 例如 crosshair
     */
    setCursorStyle: function (cursorStyle) {
        this.handler.setCursorStyle(cursorStyle);
    },

    /**
     * Find hovered element
     * @param {number} x
     * @param {number} y
     * @return {Object} {target, topTarget}
     */
    findHover: function (x, y) {
        return this.handler.findHover(x, y);
    },

    /**
     * Bind event
     *
     * @param {string} eventName Event name
     * @param {Function} eventHandler Handler function
     * @param {Object} [context] Context object
     */
    on: function(eventName, eventHandler, context) {
        this.handler.on(eventName, eventHandler, context);
    },

    /**
     * Unbind event
     * @param {string} eventName Event name
     * @param {Function} [eventHandler] Handler function
     */
    off: function(eventName, eventHandler) {
        this.handler.off(eventName, eventHandler);
    },

    /**
     * Trigger event manually
     *
     * @param {string} eventName Event name
     * @param {event=} event Event object
     */
    trigger: function (eventName, event) {
        this.handler.trigger(eventName, event);
    },


    /**
     * Clear all objects and the canvas.
     */
    clear: function () {
        this.storage.delRoot();
        this.painter.clear();
    },

    /**
     * Dispose self.
     */
    dispose: function () {
        this.animation.stop();

        this.clear();
        this.storage.dispose();
        this.painter.dispose();
        this.handler.dispose();

        this.animation =
        this.storage =
        this.painter =
        this.handler = null;

        delInstance(this.id);
    }
};



/***/ }),

/***/ 901:
/***/ (function(module, exports) {

/* (ignored) */

/***/ })

},[375]);