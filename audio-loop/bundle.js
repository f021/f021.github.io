var main =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
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
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _soundcloud = __webpack_require__(1);
	
	var _soundcloud2 = _interopRequireDefault(_soundcloud);
	
	var _audioNodeAnalyser = __webpack_require__(3);
	
	var _audioNodeAnalyser2 = _interopRequireDefault(_audioNodeAnalyser);
	
	var _visualization = __webpack_require__(4);
	
	var _visualization2 = _interopRequireDefault(_visualization);
	
	var _scene = __webpack_require__(5);
	
	var _scene2 = _interopRequireDefault(_scene);
	
	var _template = __webpack_require__(6);
	
	var _playlist = __webpack_require__(7);
	
	var _playlist2 = _interopRequireDefault(_playlist);
	
	var _sleep = __webpack_require__(8);
	
	var _sleep2 = _interopRequireDefault(_sleep);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	// const test = 'https://soundcloud.com/max-richter/this-bitter-earth-on-the';
	
	// set up CORS for SoundCloud output to prevent
	// MediaElementAudioSource outputs zeroes due to CORS access restrictions
	// https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_settings_attributes
	
	var draw = (0, _visualization2.default)(); // initialize canvas
	
	var audio = new Audio();
	audio.crossOrigin = 'Anonymous';
	
	var analyse = (0, _audioNodeAnalyser2.default)(audio);
	
	var sound = (0, _soundcloud2.default)({ audio: audio });
	sound.init();
	sound.addTrack(17556576, render);
	
	function render(track) {
	
	  sound.play();
	  (0, _template.renderInfo)(track);
	
	  var scene = (0, _scene2.default)(100);
	  var gap = 5672;
	
	  var listen = function listen() {
	    setInterval(function () {
	      scene.add(analyse.frequencies().filter(function (e) {
	        return e > 0;
	      }));
	    }, 10);
	  };
	
	  var painter = function painter() {
	    setInterval(function () {
	      if (scene.ready()) {
	        draw.clear();
	        draw.sun(scene.get(), gap);
	      };
	    }, 1000 / 60);
	  };
	
	  var activity = (0, _sleep2.default)({
	    sleepAfter: 10000,
	    step: 100,
	    elm: document.querySelector('#footer'),
	    lastActivity: new Date().valueOf()
	  });
	
	  listen();
	  painter();
	  activity.start();
	};
	
	module.exports = { sound: sound, sleep: _sleep2.default };

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _soundCloudID = __webpack_require__(2);
	
	var _soundCloudID2 = _interopRequireDefault(_soundCloudID);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	// import xhr from './xhr';
	
	var resolveStr = 'http://api.soundcloud.com/resolve?url=\'';
	
	var soundcloud = function soundcloud(state) {
	  return {
	    init: function init() {
	      SC.initialize({
	        client_id: _soundCloudID2.default
	      });
	    },
	    addTrack: function addTrack(trackID, render) {
	      SC.get('/tracks/17556576', function (track) {
	        console.log(track);
	        state.audio.src = track.stream_url + '?client_id=' + _soundCloudID2.default;
	        render(track);
	      });
	    },
	
	    JSON: {
	      byTrack: function byTrack(trackID) {
	        SC.get('/tracks/' + trackID, function (track) {
	          console.log(JSON.stringify(track));
	        });
	      },
	      byURL: function byURL(url) {
	        xhr.get('' + resolveStr + url + '&client_id=' + _soundCloudID2.default, function (e) {
	          return console.log(e);
	        });
	      }
	    },
	
	    play: function play() {
	      state.audio.play();
	    },
	    search: function search(target, callback) {
	      SC.get('/tracks', target, function (tracks) {
	        return callback(tracks);
	      });
	    }
	  };
	};
	
	exports.default = soundcloud;

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = '1d51481f386a3fbe750b685354180149';

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	// analyze <audio>
	
	var audioAnalyse = function audioAnalyse(audio) {
	
	  var context = new AudioContext();
	  var analyser = context.createAnalyser();
	  var source = context.createMediaElementSource(audio);
	
	  // audio graph: source -> analaser -> destination
	
	  source.connect(analyser);
	  analyser.connect(context.destination);
	
	  analyser.fftSize = 256;
	
	  var bufferLength = analyser.frequencyBinCount;
	
	  var waveform = function waveform() {
	    var arr = new Uint8Array(bufferLength);
	    analyser.getByteTimeDomainData(arr);
	    return arr;
	  };
	
	  var frequencies = function frequencies() {
	    var arr = new Uint8Array(bufferLength);
	    analyser.getByteFrequencyData(arr);
	    return arr;
	  };
	
	  return { waveform: waveform, frequencies: frequencies };
	};
	
	exports.default = audioAnalyse;

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var createCanvas = function createCanvas() {
	
	  var canvas = document.createElement('canvas');
	  var ctx = canvas.getContext('2d');
	  setSize();
	  document.body.appendChild(canvas);
	
	  function setSize() {
	    canvas.width = window.innerWidth;
	    canvas.height = window.innerHeight;
	  }
	
	  var waves = function waves(wave, j) {
	    var step = canvas.width / wave.length;
	    ctx.beginPath();
	    ctx.strokeStyle = 'rgba(200, 200, 200, ' + j / 10 + ')';
	    wave.forEach(function (w, i) {
	      ctx.lineTo(i, w);
	    });
	    ctx.stroke();
	  };
	
	  var freqRect = function freqRect(freq) {
	    var len = canvas.width / freq.length;
	    ctx.beginPath();
	    freq.forEach(function (f, i) {
	      ctx.fillStyle = 'rgb(' + f / 2 + ', 100, 100)';
	      ctx.rect(i, canvas.height - f, len, f);
	      ctx.stroke();
	      ctx.closePath();
	    });
	  };
	
	  var lines = function lines(data) {
	    data.forEach(function (line, i) {
	      ctx.setTransform(i, 0, 0, i / 10, 0, 0);
	      waves(line, i);
	      ctx.resetTransform();
	    });
	  };
	
	  var clear = function clear() {
	    ctx.fillRect(0, 0, canvas.width, canvas.height);
	  };
	
	  var sun = function sun(data, gap) {
	    ctx.translate(canvas.width / 2, canvas.height / 2);
	    data.forEach(function (line, i) {
	      ctx.rotate(gap / 100 * Math.PI / 180);
	      waves(line, i);
	    });
	    ctx.setTransform(1, 0, 0, 1, 0, 0);
	  };
	
	  window.addEventListener('resize', function () {
	    setSize();
	  });
	
	  return { lines: lines, freqRect: freqRect, sun: sun, clear: clear };
	};
	
	exports.default = createCanvas;

/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var scene = function scene(size) {
	
	  var arr = [];
	
	  return {
	    add: function add(elm) {
	      arr.push(elm);
	      if (arr.length > size) {
	        arr.shift();
	      };
	    },
	    get: function get() {
	      return arr;
	    },
	    ready: function ready() {
	      return arr.length === size;
	    }
	  };
	};
	
	exports.default = scene;

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var li = function li(state) {
	
	  // const rendTag = (tag, value) => `<${tag}></${tag}>`;
	
	  if (state.kind === 'track') {
	
	    var template = '\n      ' + (state.artwork_url !== null && '<img src=\'' + state.artwork_url + '\'>' || '') + '\n      <h1>' + state.title + '</h1>\n      <p>' + state.description + '</p>\n    ';
	
	    var elm = document.createElement('li');
	    elm.innerHTML = template;
	    console.log('tmp', elm);
	    return elm;
	  };
	};
	
	var renderInfo = function renderInfo(state) {
	
	  var elm = document.querySelector('#footer');
	
	  if (!elm) {
	    elm = document.createElement('div');
	    elm.id = 'footer';
	    document.body.appendChild(elm);
	  };
	
	  elm.innerHTML = '\n    <ul class="soundtrack-info">\n      <li class=\'user\'>\n        <a href=\'' + state.user.permalink_url + '\'>\n          ' + state.user.username + '\n        </a>\n      </li>\n      <li class=\'title\'>\n        <a href=\'' + state.permalink_url + '\'>\n          <p>' + state.title + '</p>\n        </a>\n      </li>\n      <li class=\'soundcloud-logo\'>\n        <a href=\'' + state.permalink_url + '\'>\n          <img src=\'./img/logo_white.png\'>\n        </a>\n      </li>\n    </ul>';
	};
	
	exports.renderInfo = renderInfo;
	exports.li = li;

/***/ },
/* 7 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = [228230638, 81253937, 1626898, 41412809, 45226360, 41228131, 17556576, 45226360];

/***/ },
/* 8 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var sleeper = function sleeper(state) {
	
	  document.body.addEventListener('mousemove', function (e) {
	    state.lastActivity = new Date().valueOf();
	    state.elm.style.opacity = '1';
	    document.querySelector('*').style.cursor = 'default';
	    state.elm.style.bottom = '0';
	  });
	
	  var noActivity = function noActivity() {
	    var current = new Date();
	    return current.valueOf() - state.lastActivity;
	  };
	
	  var fade = function fade() {
	    if (noActivity() > state.sleepAfter) {
	      state.elm.style.opacity = '0';
	      document.querySelector('*').style.cursor = 'none';
	      state.elm.style.bottom = '-10%';
	    };
	  };
	
	  var start = function start() {
	    return setInterval(fade, state.step);
	  };
	
	  // const stop = clearInterval(start);
	
	  return {
	    fade: fade,
	    start: start,
	    stop: stop
	  };
	};
	
	exports.default = sleeper;

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map