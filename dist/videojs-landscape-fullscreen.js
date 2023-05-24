/*! @name videojs-landscape-fullscreen @version 11.1111.0 @license ISC */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('!video.js')) :
  typeof define === 'function' && define.amd ? define(['!video.js'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.videojsLandscapeFullscreen = factory(global.videojs));
})(this, (function (videojs) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var videojs__default = /*#__PURE__*/_interopDefaultLegacy(videojs);

  var version = "11.1111.0";

  // Default options for the plugin.
  var defaults = {
    fullscreen: {
      enterOnRotate: true,
      exitOnRotate: true,
      alwaysInLandscapeMode: true,
      iOS: true
    }
  };
  var screen = window.screen || {};

  /* eslint-disable no-console */
  screen.lockOrientationUniversal = function (mode) {
    return screen.orientation && screen.orientation.lock(mode).then(function () {}, function (err) {
      return console.log(err);
    }) || screen.mozLockOrientation && screen.mozLockOrientation(mode) || screen.msLockOrientation && screen.msLockOrientation(mode);
  };
  var angle = function angle() {
    // iOS
    if (typeof window.orientation === 'number') {
      return window.orientation;
    }
    // Android
    if (screen && screen.orientation && screen.orientation.angle) {
      return window.orientation;
    }
    videojs__default["default"].log('angle unknown');
    return 0;
  };

  // Cross-compatibility for Video.js 5 and 6.
  var registerPlugin = videojs__default["default"].registerPlugin || videojs__default["default"].plugin;
  // const dom = videojs.dom || videojs;

  /**
   * Function to invoke when the player is ready.
   *
   * This is a great place for your plugin to initialize itself. When this
   * function is called, the player will have its DOM and child components
   * in place.
   *
   * @function onPlayerReady
   * @param    {Player} player
   *           A Video.js player object.
   *
   * @param    {Object} [options={}]
   *           A plain object containing options for the plugin.
   */
  var onPlayerReady = function onPlayerReady(player, options) {
    player.addClass('vjs-landscape-fullscreen');
    if (options.fullscreen.iOS && videojs__default["default"].browser.IS_IOS && videojs__default["default"].browser.IOS_VERSION > 9 && !player.el_.ownerDocument.querySelector('.bc-iframe')) {
      player.tech_.el_.setAttribute('playsinline', 'playsinline');
      player.tech_.supportsFullScreen = function () {
        return false;
      };
    }
    var rotationHandler = function rotationHandler() {
      var currentAngle = angle();
      if (currentAngle === 90 || currentAngle === 270 || currentAngle === -90) {
        if (options.fullscreen.enterOnRotate && player.paused() === false) {
          player.requestFullscreen();
          screen.lockOrientationUniversal('landscape');
        }
      }
      if (currentAngle === 0 || currentAngle === 180) {
        if (options.fullscreen.exitOnRotate && player.isFullscreen()) {
          player.exitFullscreen();
        }
      }
    };
    if (videojs__default["default"].browser.IS_IOS) {
      window.addEventListener('orientationchange', rotationHandler);
    } else if (screen && screen.orientation) {
      // addEventListener('orientationchange') is not a user interaction on Android
      screen.orientation.onchange = rotationHandler;
    }
    player.on('fullscreenchange', function (e) {
      if (videojs__default["default"].browser.IS_ANDROID || videojs__default["default"].browser.IS_IOS) {
        if (!angle() && player.isFullscreen() && options.fullscreen.alwaysInLandscapeMode) {
          screen.lockOrientationUniversal('landscape');
        }
      }
    });
    player.on('dispose', function () {
      if (videojs__default["default"].browser.IS_IOS) {
        window.removeEventListener('orientationchange', rotationHandler);
      } else if (screen && screen.orientation) {
        // addEventListener('orientationchange') is not a user interaction on Android
        screen.orientation.onchange = null;
      }
    });
  };

  /**
   * A video.js plugin.
   *
   * In the plugin function, the value of `this` is a video.js `Player`
   * instance. You cannot rely on the player being in a "ready" state here,
   * depending on how the plugin is invoked. This may or may not be important
   * to you; if not, remove the wait for "ready"!
   *
   * @function landscapeFullscreen
   * @param    {Object} [options={}]
   *           An object of options left to the plugin author to define.
   */
  var landscapeFullscreen = function landscapeFullscreen(options) {
    var _this = this;
    if (videojs__default["default"].browser.IS_ANDROID || videojs__default["default"].browser.IS_IOS) {
      this.ready(function () {
        onPlayerReady(_this, videojs__default["default"].obj.merge(defaults, options));
      });
    }
  };

  // Register the plugin with video.js.
  registerPlugin('landscapeFullscreen', landscapeFullscreen);

  // Include the version number.
  landscapeFullscreen.VERSION = version;

  return landscapeFullscreen;

}));
