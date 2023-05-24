/*! @name videojs-landscape-fullscreen @version 11.1111.0 @license ISC */
import videojs from '!video.js';
import window from 'global/window';

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
  videojs.log('angle unknown');
  return 0;
};

// Cross-compatibility for Video.js 5 and 6.
var registerPlugin = videojs.registerPlugin || videojs.plugin;
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
  if (options.fullscreen.iOS && videojs.browser.IS_IOS && videojs.browser.IOS_VERSION > 9 && !player.el_.ownerDocument.querySelector('.bc-iframe')) {
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
  if (videojs.browser.IS_IOS) {
    window.addEventListener('orientationchange', rotationHandler);
  } else if (screen && screen.orientation) {
    // addEventListener('orientationchange') is not a user interaction on Android
    screen.orientation.onchange = rotationHandler;
  }
  player.on('fullscreenchange', function (e) {
    if (videojs.browser.IS_ANDROID || videojs.browser.IS_IOS) {
      if (!angle() && player.isFullscreen() && options.fullscreen.alwaysInLandscapeMode) {
        screen.lockOrientationUniversal('landscape');
      }
    }
  });
  player.on('dispose', function () {
    if (videojs.browser.IS_IOS) {
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
  if (videojs.browser.IS_ANDROID || videojs.browser.IS_IOS) {
    this.ready(function () {
      onPlayerReady(_this, videojs.obj.merge(defaults, options));
    });
  }
};

// Register the plugin with video.js.
registerPlugin('landscapeFullscreen', landscapeFullscreen);

// Include the version number.
landscapeFullscreen.VERSION = version;

export { landscapeFullscreen as default };
