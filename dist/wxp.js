(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./src/core.js
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Tencent is pleased to support the open source community by making WePY available.
 * Copyright (C) 2017 THL A29 Limited, a Tencent company. All rights reserved.
 * 
 * Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
 * http://opensource.org/licenses/MIT
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

var core_native = {};
var RequestMQ = {
    map: {},
    mq: [],
    running: [],
    MAX_REQUEST: 10,
    push: function push(param) {
        param.t = +new Date();
        while (this.mq.indexOf(param.t) > -1 || this.running.indexOf(param.t) > -1) {
            param.t += Math.random() * 10 >> 0;
        }
        this.mq.push(param.t);
        this.map[param.t] = param;
    },
    next: function next() {
        var me = this;

        if (this.mq.length === 0) return;

        if (this.running.length < this.MAX_REQUEST - 1) {
            var newone = this.mq.shift();
            var obj = this.map[newone];
            var oldComplete = obj.complete;
            obj.complete = function () {
                for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                    args[_key] = arguments[_key];
                }

                me.running.splice(me.running.indexOf(obj.t), 1);
                delete me.map[obj.t];
                oldComplete && oldComplete.apply(obj, args);
                me.next();
            };
            this.running.push(obj.t);
            return wx.request(obj);
        }
    },
    request: function request(obj) {

        obj = obj || {};
        obj = typeof obj === 'string' ? { url: obj } : obj;

        this.push(obj);

        return this.next();
    }
};

var CoreClass = function () {
    function CoreClass() {
        _classCallCheck(this, CoreClass);

        this.$addons = {};

        this.$interceptors = {};
    }

    _createClass(CoreClass, [{
        key: '$init',
        value: function $init(wepy) {
            var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            this.$initAPI(wepy, config.noPromiseAPI);
        }
    }, {
        key: 'use',
        value: function use(addon) {
            for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                args[_key2 - 1] = arguments[_key2];
            }

            if (typeof addon === 'string' && this[addon]) {
                this.$addons[addon] = 1;
                this[addon](args);
            } else {
                this.$addons[addon.name] = new addon(args);
            }
        }
    }, {
        key: 'intercept',
        value: function intercept(api, provider) {
            this.$interceptors[api] = provider;
        }
    }, {
        key: 'promisify',
        value: function promisify() {
            console.log('promise已经启用');
        }
    }, {
        key: 'requestfix',
        value: function requestfix() {
            console.log('requestfix启用');
        }
    }, {
        key: '$initAPI',
        value: function $initAPI(wepy, noPromiseAPI) {
            var self = this;
            var noPromiseMethods = {
                // 媒体
                stopRecord: true,
                getRecorderManager: true,
                pauseVoice: true,
                stopVoice: true,
                pauseBackgroundAudio: true,
                stopBackgroundAudio: true,
                getBackgroundAudioManager: true,
                createAudioContext: true,
                createInnerAudioContext: true,
                createVideoContext: true,
                createCameraContext: true,

                // 位置
                createMapContext: true,

                // 设备
                canIUse: true,
                startAccelerometer: true,
                stopAccelerometer: true,
                startCompass: true,
                stopCompass: true,
                onBLECharacteristicValueChange: true,
                onBLEConnectionStateChange: true,

                // 界面
                hideToast: true,
                hideLoading: true,
                showNavigationBarLoading: true,
                hideNavigationBarLoading: true,
                navigateBack: true,
                createAnimation: true,
                pageScrollTo: true,
                createSelectorQuery: true,
                createCanvasContext: true,
                createContext: true,
                drawCanvas: true,
                hideKeyboard: true,
                stopPullDownRefresh: true,

                // 拓展接口
                arrayBufferToBase64: true,
                base64ToArrayBuffer: true
            };
            if (noPromiseAPI) {
                if (Array.isArray(noPromiseAPI)) {
                    noPromiseAPI.forEach(function (v) {
                        return noPromiseMethods[v] = true;
                    });
                } else {
                    for (var k in noPromiseAPI) {
                        noPromiseMethods[k] = noPromiseAPI[k];
                    }
                }
            }
            Object.keys(wx).forEach(function (key) {
                if (!noPromiseMethods[key] && key.substr(0, 2) !== 'on' && !/\w+Sync$/.test(key)) {
                    Object.defineProperty(core_native, key, {
                        get: function get() {
                            return function (obj) {
                                obj = obj || {};
                                if (self.$interceptors[key] && self.$interceptors[key].config) {
                                    var rst = self.$interceptors[key].config.call(self, obj);
                                    if (rst === false) {
                                        if (self.$addons.promisify) {
                                            return Promise.reject('aborted by interceptor');
                                        } else {
                                            obj.fail && obj.fail('aborted by interceptor');
                                            return;
                                        }
                                    }
                                    obj = rst;
                                }
                                if (key === 'request') {
                                    obj = typeof obj === 'string' ? { url: obj } : obj;
                                }
                                if (typeof obj === 'string') {
                                    return wx[key](obj);
                                }
                                if (self.$addons.promisify) {
                                    var task = void 0;
                                    var p = new Promise(function (resolve, reject) {
                                        var bak = {};
                                        ['fail', 'success', 'complete'].forEach(function (k) {
                                            bak[k] = obj[k];
                                            obj[k] = function (res) {
                                                if (self.$interceptors[key] && self.$interceptors[key][k]) {
                                                    res = self.$interceptors[key][k].call(self, res);
                                                }
                                                if (k === 'success') resolve(res);else if (k === 'fail') reject(res);
                                            };
                                        });
                                        if (self.$addons.requestfix && key === 'request') {
                                            RequestMQ.request(obj);
                                        } else {
                                            task = wx[key](obj);
                                        }
                                    });
                                    if (key === 'uploadFile' || key === 'downloadFile') {
                                        p.progress = function (cb) {
                                            task.onProgressUpdate(cb);
                                            return p;
                                        };
                                        p.abort = function (cb) {
                                            cb && cb();
                                            task.abort();
                                            return p;
                                        };
                                    }
                                    return p;
                                } else {
                                    var bak = {};
                                    ['fail', 'success', 'complete'].forEach(function (k) {
                                        bak[k] = obj[k];
                                        obj[k] = function (res) {
                                            if (self.$interceptors[key] && self.$interceptors[key][k]) {
                                                res = self.$interceptors[key][k].call(self, res);
                                            }
                                            bak[k] && bak[k].call(self, res);
                                        };
                                    });
                                    if (self.$addons.requestfix && key === 'request') {
                                        RequestMQ.request(obj);
                                    } else {
                                        return wx[key](obj);
                                    }
                                }
                            };
                        }
                    });
                    wepy[key] = core_native[key];
                } else {
                    Object.defineProperty(core_native, key, {
                        get: function get() {
                            return function () {
                                for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                                    args[_key3] = arguments[_key3];
                                }

                                return wx[key].apply(wx, args);
                            };
                        }
                    });
                    wepy[key] = core_native[key];
                }
            });
        }
    }]);

    return CoreClass;
}();

/* harmony default export */ var core = (CoreClass);
// CONCATENATED MODULE: ./src/wxp.js

var wxp_wxp = new core();
wxp_wxp.$init(wxp_wxp);
wxp_wxp.use('promisify');
wxp_wxp.use('requestfix');
/* harmony default export */ var src_wxp = __webpack_exports__["default"] = (wxp_wxp);

/***/ })
/******/ ]);
});