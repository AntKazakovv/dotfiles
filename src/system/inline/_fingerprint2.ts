// @ts-nocheck
/* eslint-disable */

// detect if object is array
// only implement if no native implementation is available
if (typeof Array.isArray === 'undefined') {
    Array.isArray = function (obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    };
}

/// MurmurHash3 related functions

//
// Given two 64bit ints (as an array of two 32bit ints) returns the two
// added together as a 64bit int (as an array of two 32bit ints).
//
var x64Add = function (m, n) {
    m = [m[0] >>> 16, m[0] & 0xffff, m[1] >>> 16, m[1] & 0xffff];
    n = [n[0] >>> 16, n[0] & 0xffff, n[1] >>> 16, n[1] & 0xffff];
    var o = [0, 0, 0, 0];
    o[3] += m[3] + n[3];
    o[2] += o[3] >>> 16;
    o[3] &= 0xffff;
    o[2] += m[2] + n[2];
    o[1] += o[2] >>> 16;
    o[2] &= 0xffff;
    o[1] += m[1] + n[1];
    o[0] += o[1] >>> 16;
    o[1] &= 0xffff;
    o[0] += m[0] + n[0];
    o[0] &= 0xffff;
    return [(o[0] << 16) | o[1], (o[2] << 16) | o[3]];
};

//
// Given two 64bit ints (as an array of two 32bit ints) returns the two
// multiplied together as a 64bit int (as an array of two 32bit ints).
//
var x64Multiply = function (m, n) {
    m = [m[0] >>> 16, m[0] & 0xffff, m[1] >>> 16, m[1] & 0xffff];
    n = [n[0] >>> 16, n[0] & 0xffff, n[1] >>> 16, n[1] & 0xffff];
    var o = [0, 0, 0, 0];
    o[3] += m[3] * n[3];
    o[2] += o[3] >>> 16;
    o[3] &= 0xffff;
    o[2] += m[2] * n[3];
    o[1] += o[2] >>> 16;
    o[2] &= 0xffff;
    o[2] += m[3] * n[2];
    o[1] += o[2] >>> 16;
    o[2] &= 0xffff;
    o[1] += m[1] * n[3];
    o[0] += o[1] >>> 16;
    o[1] &= 0xffff;
    o[1] += m[2] * n[2];
    o[0] += o[1] >>> 16;
    o[1] &= 0xffff;
    o[1] += m[3] * n[1];
    o[0] += o[1] >>> 16;
    o[1] &= 0xffff;
    o[0] += (m[0] * n[3]) + (m[1] * n[2]) + (m[2] * n[1]) + (m[3] * n[0]);
    o[0] &= 0xffff;
    return [(o[0] << 16) | o[1], (o[2] << 16) | o[3]];
};
//
// Given a 64bit int (as an array of two 32bit ints) and an int
// representing a number of bit positions, returns the 64bit int (as an
// array of two 32bit ints) rotated left by that number of positions.
//
var x64Rotl = function (m, n) {
    n %= 64;
    if (n === 32) {
        return [m[1], m[0]];
    } else if (n < 32) {
        return [(m[0] << n) | (m[1] >>> (32 - n)), (m[1] << n) | (m[0] >>> (32 - n))];
    } else {
        n -= 32;
        return [(m[1] << n) | (m[0] >>> (32 - n)), (m[0] << n) | (m[1] >>> (32 - n))];
    }
};
//
// Given a 64bit int (as an array of two 32bit ints) and an int
// representing a number of bit positions, returns the 64bit int (as an
// array of two 32bit ints) shifted left by that number of positions.
//
var x64LeftShift = function (m, n) {
    n %= 64;
    if (n === 0) {
        return m;
    } else if (n < 32) {
        return [(m[0] << n) | (m[1] >>> (32 - n)), m[1] << n];
    } else {
        return [m[1] << (n - 32), 0];
    }
};
//
// Given two 64bit ints (as an array of two 32bit ints) returns the two
// xored together as a 64bit int (as an array of two 32bit ints).
//
var x64Xor = function (m, n) {
    return [m[0] ^ n[0], m[1] ^ n[1]];
};
//
// Given a block, returns murmurHash3's final x64 mix of that block.
// (`[0, h[0] >>> 1]` is a 33 bit unsigned right shift. This is the
// only place where we need to right shift 64bit ints.)
//
var x64Fmix = function (h) {
    h = x64Xor(h, [0, h[0] >>> 1]);
    h = x64Multiply(h, [0xff51afd7, 0xed558ccd]);
    h = x64Xor(h, [0, h[0] >>> 1]);
    h = x64Multiply(h, [0xc4ceb9fe, 0x1a85ec53]);
    h = x64Xor(h, [0, h[0] >>> 1]);
    return h;
};

//
// Given a string and an optional seed as an int, returns a 128 bit
// hash using the x64 flavor of MurmurHash3, as an unsigned hex.
//
var x64hash128 = function (key, seed) {
    key = key || '';
    seed = seed || 0;
    var remainder = key.length % 16;
    var bytes = key.length - remainder;
    var h1 = [0, seed];
    var h2 = [0, seed];
    var k1 = [0, 0];
    var k2 = [0, 0];
    var c1 = [0x87c37b91, 0x114253d5];
    var c2 = [0x4cf5ad43, 0x2745937f];
    for (var i = 0; i < bytes; i = i + 16) {
        k1 = [((key.charCodeAt(i + 4) & 0xff)) | ((key.charCodeAt(i + 5) & 0xff) << 8) | ((key.charCodeAt(i + 6) & 0xff) << 16) | ((key.charCodeAt(i + 7) & 0xff) << 24), ((key.charCodeAt(i) & 0xff)) | ((key.charCodeAt(i + 1) & 0xff) << 8) | ((key.charCodeAt(i + 2) & 0xff) << 16) | ((key.charCodeAt(i + 3) & 0xff) << 24)];
        k2 = [((key.charCodeAt(i + 12) & 0xff)) | ((key.charCodeAt(i + 13) & 0xff) << 8) | ((key.charCodeAt(i + 14) & 0xff) << 16) | ((key.charCodeAt(i + 15) & 0xff) << 24), ((key.charCodeAt(i + 8) & 0xff)) | ((key.charCodeAt(i + 9) & 0xff) << 8) | ((key.charCodeAt(i + 10) & 0xff) << 16) | ((key.charCodeAt(i + 11) & 0xff) << 24)];
        k1 = x64Multiply(k1, c1);
        k1 = x64Rotl(k1, 31);
        k1 = x64Multiply(k1, c2);
        h1 = x64Xor(h1, k1);
        h1 = x64Rotl(h1, 27);
        h1 = x64Add(h1, h2);
        h1 = x64Add(x64Multiply(h1, [0, 5]), [0, 0x52dce729]);
        k2 = x64Multiply(k2, c2);
        k2 = x64Rotl(k2, 33);
        k2 = x64Multiply(k2, c1);
        h2 = x64Xor(h2, k2);
        h2 = x64Rotl(h2, 31);
        h2 = x64Add(h2, h1);
        h2 = x64Add(x64Multiply(h2, [0, 5]), [0, 0x38495ab5]);
    }
    k1 = [0, 0];
    k2 = [0, 0];
    switch (remainder) {
        case 15:
            k2 = x64Xor(k2, x64LeftShift([0, key.charCodeAt(i + 14)], 48));
        // fallthrough
        case 14:
            k2 = x64Xor(k2, x64LeftShift([0, key.charCodeAt(i + 13)], 40));
        // fallthrough
        case 13:
            k2 = x64Xor(k2, x64LeftShift([0, key.charCodeAt(i + 12)], 32));
        // fallthrough
        case 12:
            k2 = x64Xor(k2, x64LeftShift([0, key.charCodeAt(i + 11)], 24));
        // fallthrough
        case 11:
            k2 = x64Xor(k2, x64LeftShift([0, key.charCodeAt(i + 10)], 16));
        // fallthrough
        case 10:
            k2 = x64Xor(k2, x64LeftShift([0, key.charCodeAt(i + 9)], 8));
        // fallthrough
        case 9:
            k2 = x64Xor(k2, [0, key.charCodeAt(i + 8)]);
            k2 = x64Multiply(k2, c2);
            k2 = x64Rotl(k2, 33);
            k2 = x64Multiply(k2, c1);
            h2 = x64Xor(h2, k2);
        // fallthrough
        case 8:
            k1 = x64Xor(k1, x64LeftShift([0, key.charCodeAt(i + 7)], 56));
        // fallthrough
        case 7:
            k1 = x64Xor(k1, x64LeftShift([0, key.charCodeAt(i + 6)], 48));
        // fallthrough
        case 6:
            k1 = x64Xor(k1, x64LeftShift([0, key.charCodeAt(i + 5)], 40));
        // fallthrough
        case 5:
            k1 = x64Xor(k1, x64LeftShift([0, key.charCodeAt(i + 4)], 32));
        // fallthrough
        case 4:
            k1 = x64Xor(k1, x64LeftShift([0, key.charCodeAt(i + 3)], 24));
        // fallthrough
        case 3:
            k1 = x64Xor(k1, x64LeftShift([0, key.charCodeAt(i + 2)], 16));
        // fallthrough
        case 2:
            k1 = x64Xor(k1, x64LeftShift([0, key.charCodeAt(i + 1)], 8));
        // fallthrough
        case 1:
            k1 = x64Xor(k1, [0, key.charCodeAt(i)]);
            k1 = x64Multiply(k1, c1);
            k1 = x64Rotl(k1, 31);
            k1 = x64Multiply(k1, c2);
            h1 = x64Xor(h1, k1);
        // fallthrough
    }
    h1 = x64Xor(h1, [0, key.length]);
    h2 = x64Xor(h2, [0, key.length]);
    h1 = x64Add(h1, h2);
    h2 = x64Add(h2, h1);
    h1 = x64Fmix(h1);
    h2 = x64Fmix(h2);
    h1 = x64Add(h1, h2);
    h2 = x64Add(h2, h1);
    return ('00000000' + (h1[0] >>> 0).toString(16)).slice(-8) + ('00000000' + (h1[1] >>> 0).toString(16)).slice(-8) + ('00000000' + (h2[0] >>> 0).toString(16)).slice(-8) + ('00000000' + (h2[1] >>> 0).toString(16)).slice(-8);
};

var defaultOptions = {
    preprocessor: null,
    screen: {
        // To ensure consistent fingerprints when users rotate their mobile devices
        detectScreenOrientation: true,
    },
    plugins: {
        sortPluginsFor: [/palemoon/i],
        excludeIE: false,
    },
    extraComponents: [],
    excludes: {
        // devicePixelRatio depends on browser zoom, and it's impossible to detect browser zoom
        'pixelRatio': true,
        // DNT depends on incognito mode for some browsers (Chrome) and it's impossible to detect incognito mode
        'doNotTrack': true,
    },
    NOT_AVAILABLE: 'not available',
    ERROR: 'error',
    EXCLUDED: 'excluded',
};

var each = function (obj, iterator) {
    if (Array.prototype.forEach && obj.forEach === Array.prototype.forEach) {
        obj.forEach(iterator);
    } else if (obj.length === +obj.length) {
        for (var i = 0, l = obj.length; i < l; i++) {
            iterator(obj[i], i, obj);
        }
    } else {
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                iterator(obj[key], key, obj);
            }
        }
    }
};

var map = function (obj, iterator) {
    var results = [];
    // Not using strict equality so that this acts as a
    // shortcut to checking for `null` and `undefined`.
    if (obj == null) {
        return results;
    }
    if (Array.prototype.map && obj.map === Array.prototype.map) {
        return obj.map(iterator);
    }
    each(obj, function (value, index, list) {
        results.push(iterator(value, index, list));
    });
    return results;
};

var extendSoft = function (target, source) {
    if (source == null) {
        return target;
    }
    var value;
    var key;
    for (key in source) {
        value = source[key];
        if (value != null && !(Object.prototype.hasOwnProperty.call(target, key))) {
            target[key] = value;
        }
    }
    return target;
};

var UserAgent = function (done) {
    done(navigator.userAgent);
};
var webdriver = function (done, options) {
    done(navigator.webdriver == null ? options.NOT_AVAILABLE : navigator.webdriver);
};
var languageKey = function (done, options) {
    done(navigator.language || navigator.userLanguage || navigator.browserLanguage || navigator.systemLanguage || options.NOT_AVAILABLE);
};
var colorDepthKey = function (done, options) {
    done(window.screen.colorDepth || options.NOT_AVAILABLE);
};
var deviceMemoryKey = function (done, options) {
    done(navigator.deviceMemory || options.NOT_AVAILABLE);
};
var pixelRatioKey = function (done, options) {
    done(window.devicePixelRatio || options.NOT_AVAILABLE);
};
var screenResolutionKey = function (done, options) {
    done(getScreenResolution(options));
};
var getScreenResolution = function (options) {
    var resolution = [window.screen.width, window.screen.height];
    if (options.screen.detectScreenOrientation) {
        resolution.sort().reverse();
    }
    return resolution;
};
var availableScreenResolutionKey = function (done, options) {
    done(getAvailableScreenResolution(options));
};
var getAvailableScreenResolution = function (options) {
    if (window.screen.availWidth && window.screen.availHeight) {
        var available = [window.screen.availHeight, window.screen.availWidth];
        if (options.screen.detectScreenOrientation) {
            available.sort().reverse();
        }
        return available;
    }
    // headless browsers
    return options.NOT_AVAILABLE;
};
var timezoneOffset = function (done) {
    done(new Date().getTimezoneOffset());
};
var timezone = function (done, options) {
    if (window.Intl && window.Intl.DateTimeFormat) {
        done(new window.Intl.DateTimeFormat().resolvedOptions().timeZone);
        return;
    }
    done(options.NOT_AVAILABLE);
};
var sessionStorageKey = function (done, options) {
    done(hasSessionStorage(options));
};
var localStorageKey = function (done, options) {
    done(hasLocalStorage(options));
};
var indexedDbKey = function (done, options) {
    done(hasIndexedDB(options));
};
var addBehaviorKey = function (done) {
    // body might not be defined at this point or removed programmatically
    done(!!(document.body && document.body.addBehavior));
};
var openDatabaseKey = function (done) {
    done(!!window.openDatabase);
};
var cpuClassKey = function (done, options) {
    done(getNavigatorCpuClass(options));
};
var platformKey = function (done, options) {
    done(getNavigatorPlatform(options));
};
var doNotTrackKey = function (done, options) {
    done(getDoNotTrack(options));
};
var hasLiedLanguagesKey = function (done) {
    done(getHasLiedLanguages());
};
var hasLiedResolutionKey = function (done) {
    done(getHasLiedResolution());
};
var hasLiedOsKey = function (done) {
    done(getHasLiedOs());
};
var hasLiedBrowserKey = function (done) {
    done(getHasLiedBrowser());
};
var pluginsComponent = function (done, options) {
    if (isIE()) {
        if (!options.plugins.excludeIE) {
            done(getIEPlugins(options));
        } else {
            done(options.EXCLUDED);
        }
    } else {
        done(getRegularPlugins(options));
    }
};
var getRegularPlugins = function (options) {
    if (navigator.plugins == null) {
        return options.NOT_AVAILABLE;
    }

    var plugins = [];
    // plugins isn't defined in Node envs.
    for (var i = 0, l = navigator.plugins.length; i < l; i++) {
        if (navigator.plugins[i]) {
            plugins.push(navigator.plugins[i]);
        }
    }

    // sorting plugins only for those user agents, that we know randomize the plugins
    // every time we try to enumerate them
    if (pluginsShouldBeSorted(options)) {
        plugins = plugins.sort(function (a, b) {
            if (a.name > b.name) {
                return 1;
            }
            if (a.name < b.name) {
                return -1;
            }
            return 0;
        });
    }
    return map(plugins, function (p) {
        var mimeTypes = map(p, function (mt) {
            return [mt.type, mt.suffixes];
        });
        return [p.name, p.description, mimeTypes];
    });
};
var getIEPlugins = function (options) {
    var result = [];
    if ((Object.getOwnPropertyDescriptor && Object.getOwnPropertyDescriptor(window, 'ActiveXObject')) || ('ActiveXObject' in window)) {
        var names = [
            'AcroPDF.PDF', // Adobe PDF reader 7+
            'Adodb.Stream',
            'AgControl.AgControl', // Silverlight
            'DevalVRXCtrl.DevalVRXCtrl.1',
            'MacromediaFlashPaper.MacromediaFlashPaper',
            'Msxml2.DOMDocument',
            'Msxml2.XMLHTTP',
            'PDF.PdfCtrl', // Adobe PDF reader 6 and earlier, brrr
            'QuickTime.QuickTime', // QuickTime
            'QuickTimeCheckObject.QuickTimeCheck.1',
            'RealPlayer',
            'RealPlayer.RealPlayer(tm) ActiveX Control (32-bit)',
            'RealVideo.RealVideo(tm) ActiveX Control (32-bit)',
            'Scripting.Dictionary',
            'SWCtl.SWCtl', // ShockWave player
            'Shell.UIHelper',
            'ShockwaveFlash.ShockwaveFlash', // flash plugin
            'Skype.Detection',
            'TDCCtl.TDCCtl',
            'WMPlayer.OCX', // Windows media player
            'rmocx.RealPlayer G2 Control',
            'rmocx.RealPlayer G2 Control.1',
        ];
        // starting to detect plugins in IE
        result = map(names, function (name) {
            try {
                // eslint-disable-next-line no-new
                new window.ActiveXObject(name);
                return name;
            } catch (e) {
                return options.ERROR;
            }
        });
    } else {
        result.push(options.NOT_AVAILABLE);
    }
    if (navigator.plugins) {
        result = result.concat(getRegularPlugins(options));
    }
    return result;
};
var pluginsShouldBeSorted = function (options) {
    var should = false;
    for (var i = 0, l = options.plugins.sortPluginsFor.length; i < l; i++) {
        var re = options.plugins.sortPluginsFor[i];
        if (navigator.userAgent.match(re)) {
            should = true;
            break;
        }
    }
    return should;
};
var touchSupportKey = function (done) {
    done(getTouchSupport());
};
var hardwareConcurrencyKey = function (done, options) {
    done(getHardwareConcurrency(options));
};
var hasSessionStorage = function (options) {
    try {
        return !!window.sessionStorage;
    } catch (e) {
        return options.ERROR; // SecurityError when referencing it means it exists
    }
};

// https://bugzilla.mozilla.org/show_bug.cgi?id=781447
var hasLocalStorage = function (options) {
    try {
        return !!window.localStorage;
    } catch (e) {
        return options.ERROR; // SecurityError when referencing it means it exists
    }
};
var hasIndexedDB = function (options) {
    try {
        return !!window.indexedDB;
    } catch (e) {
        return options.ERROR; // SecurityError when referencing it means it exists
    }
};
var getHardwareConcurrency = function (options) {
    if (navigator.hardwareConcurrency) {
        return navigator.hardwareConcurrency;
    }
    return options.NOT_AVAILABLE;
};
var getNavigatorCpuClass = function (options) {
    return navigator.cpuClass || options.NOT_AVAILABLE;
};
var getNavigatorPlatform = function (options) {
    if (navigator.platform) {
        return navigator.platform;
    } else {
        return options.NOT_AVAILABLE;
    }
};
var getDoNotTrack = function (options) {
    if (navigator.doNotTrack) {
        return navigator.doNotTrack;
    } else if (navigator.msDoNotTrack) {
        return navigator.msDoNotTrack;
    } else if (window.doNotTrack) {
        return window.doNotTrack;
    } else {
        return options.NOT_AVAILABLE;
    }
};
// This is a crude and primitive touch screen detection.
// It's not possible to currently reliably detect the  availability of a touch screen
// with a JS, without actually subscribing to a touch event.
// http://www.stucox.com/blog/you-cant-detect-a-touchscreen/
// https://github.com/Modernizr/Modernizr/issues/548
// method returns an array of 3 values:
// maxTouchPoints, the success or failure of creating a TouchEvent,
// and the availability of the 'ontouchstart' property

var getTouchSupport = function () {
    var maxTouchPoints = 0;
    var touchEvent;
    if (typeof navigator.maxTouchPoints !== 'undefined') {
        maxTouchPoints = navigator.maxTouchPoints;
    } else if (typeof navigator.msMaxTouchPoints !== 'undefined') {
        maxTouchPoints = navigator.msMaxTouchPoints;
    }
    try {
        document.createEvent('TouchEvent');
        touchEvent = true;
    } catch (_) {
        touchEvent = false;
    }
    var touchStart = 'ontouchstart' in window;
    return [maxTouchPoints, touchEvent, touchStart];
};

var getHasLiedLanguages = function () {
    // We check if navigator.language is equal to the first language of navigator.languages
    // navigator.languages is undefined on IE11 (and potentially older IEs)
    if (typeof navigator.languages !== 'undefined') {
        try {
            var firstLanguages = navigator.languages[0].substr(0, 2);
            if (firstLanguages !== navigator.language.substr(0, 2)) {
                return true;
            }
        } catch (err) {
            return true;
        }
    }
    return false;
};
var getHasLiedResolution = function () {
    return window.screen.width < window.screen.availWidth || window.screen.height < window.screen.availHeight;
};
var getHasLiedOs = function () {
    var userAgent = navigator.userAgent.toLowerCase();
    var oscpu = navigator.oscpu;
    var platform = navigator.platform.toLowerCase();
    var os;
    // We extract the OS from the user agent (respect the order of the if else if statement)
    if (userAgent.indexOf('windows phone') >= 0) {
        os = 'Windows Phone';
    } else if (userAgent.indexOf('windows') >= 0 || userAgent.indexOf('win16') >= 0 || userAgent.indexOf('win32') >= 0 || userAgent.indexOf('win64') >= 0 || userAgent.indexOf('win95') >= 0 || userAgent.indexOf('win98') >= 0 || userAgent.indexOf('winnt') >= 0 || userAgent.indexOf('wow64') >= 0) {
        os = 'Windows';
    } else if (userAgent.indexOf('android') >= 0) {
        os = 'Android';
    } else if (userAgent.indexOf('linux') >= 0 || userAgent.indexOf('cros') >= 0 || userAgent.indexOf('x11') >= 0) {
        os = 'Linux';
    } else if (userAgent.indexOf('iphone') >= 0 || userAgent.indexOf('ipad') >= 0 || userAgent.indexOf('ipod') >= 0 || userAgent.indexOf('crios') >= 0 || userAgent.indexOf('fxios') >= 0) {
        os = 'iOS';
    } else if (userAgent.indexOf('macintosh') >= 0 || userAgent.indexOf('mac_powerpc)') >= 0) {
        os = 'Mac';
    } else {
        os = 'Other';
    }
    // We detect if the person uses a touch device
    var mobileDevice = (('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 0) ||
        (navigator.msMaxTouchPoints > 0));

    if (mobileDevice && os !== 'Windows' && os !== 'Windows Phone' && os !== 'Android' && os !== 'iOS' && os !== 'Other' && userAgent.indexOf('cros') === -1) {
        return true;
    }

    // We compare oscpu with the OS extracted from the UA
    if (typeof oscpu !== 'undefined') {
        oscpu = oscpu.toLowerCase();
        if (oscpu.indexOf('win') >= 0 && os !== 'Windows' && os !== 'Windows Phone') {
            return true;
        } else if (oscpu.indexOf('linux') >= 0 && os !== 'Linux' && os !== 'Android') {
            return true;
        } else if (oscpu.indexOf('mac') >= 0 && os !== 'Mac' && os !== 'iOS') {
            return true;
        } else if ((oscpu.indexOf('win') === -1 && oscpu.indexOf('linux') === -1 && oscpu.indexOf('mac') === -1) !== (os === 'Other')) {
            return true;
        }
    }

    // We compare platform with the OS extracted from the UA
    if (platform.indexOf('win') >= 0 && os !== 'Windows' && os !== 'Windows Phone') {
        return true;
    } else if ((platform.indexOf('linux') >= 0 || platform.indexOf('android') >= 0 || platform.indexOf('pike') >= 0) && os !== 'Linux' && os !== 'Android') {
        return true;
    } else if ((platform.indexOf('mac') >= 0 || platform.indexOf('ipad') >= 0 || platform.indexOf('ipod') >= 0 || platform.indexOf('iphone') >= 0) && os !== 'Mac' && os !== 'iOS') {
        return true;
    } else if (platform.indexOf('arm') >= 0 && os === 'Windows Phone') {
        return false;
    } else if (platform.indexOf('pike') >= 0 && userAgent.indexOf('opera mini') >= 0) {
        return false;
    } else {
        var platformIsOther = platform.indexOf('win') < 0 &&
            platform.indexOf('linux') < 0 &&
            platform.indexOf('mac') < 0 &&
            platform.indexOf('iphone') < 0 &&
            platform.indexOf('ipad') < 0 &&
            platform.indexOf('ipod') < 0;
        if (platformIsOther !== (os === 'Other')) {
            return true;
        }
    }

    return typeof navigator.plugins === 'undefined' && os !== 'Windows' && os !== 'Windows Phone';
};
var getHasLiedBrowser = function () {
    var userAgent = navigator.userAgent.toLowerCase();
    var productSub = navigator.productSub;

    // we extract the browser from the user agent (respect the order of the tests)
    var browser;
    if (userAgent.indexOf('edge/') >= 0 || userAgent.indexOf('iemobile/') >= 0) {
        // Unreliable, different versions use EdgeHTML, Webkit, Blink, etc.
        return false;
    } else if (userAgent.indexOf('opera mini') >= 0) {
        // Unreliable, different modes use Presto, WebView, Webkit, etc.
        return false;
    } else if (userAgent.indexOf('firefox/') >= 0) {
        browser = 'Firefox';
    } else if (userAgent.indexOf('opera/') >= 0 || userAgent.indexOf(' opr/') >= 0) {
        browser = 'Opera';
    } else if (userAgent.indexOf('chrome/') >= 0) {
        browser = 'Chrome';
    } else if (userAgent.indexOf('safari/') >= 0) {
        if (userAgent.indexOf('android 1.') >= 0 || userAgent.indexOf('android 2.') >= 0 || userAgent.indexOf('android 3.') >= 0 || userAgent.indexOf('android 4.') >= 0) {
            browser = 'AOSP';
        } else {
            browser = 'Safari';
        }
    } else if (userAgent.indexOf('trident/') >= 0) {
        browser = 'Internet Explorer';
    } else {
        browser = 'Other';
    }

    if ((browser === 'Chrome' || browser === 'Safari' || browser === 'Opera') && productSub !== '20030107') {
        return true;
    }

    // eslint-disable-next-line no-eval
    var tempRes = eval.toString().length;
    if (tempRes === 37 && browser !== 'Safari' && browser !== 'Firefox' && browser !== 'Other') {
        return true;
    } else if (tempRes === 39 && browser !== 'Internet Explorer' && browser !== 'Other') {
        return true;
    } else if (tempRes === 33 && browser !== 'Chrome' && browser !== 'AOSP' && browser !== 'Opera' && browser !== 'Other') {
        return true;
    }

    // We create an error to see how it is handled
    var errFirefox;
    try {
        // eslint-disable-next-line no-throw-literal
        throw 'a';
    } catch (err) {
        try {
            err.toSource();
            errFirefox = true;
        } catch (errOfErr) {
            errFirefox = false;
        }
    }
    return errFirefox && browser !== 'Firefox' && browser !== 'Other';
};
var isIE = function () {
    if (navigator.appName === 'Microsoft Internet Explorer') {
        return true;
    } else if (navigator.appName === 'Netscape' && /Trident/.test(navigator.userAgent)) { // IE 11
        return true;
    }
    return false;
};
var hasSwfObjectLoaded = function () {
    return typeof window.swfobject !== 'undefined';
};
var hasMinFlashInstalled = function () {
    return window.swfobject.hasFlashPlayerVersion('9.0.0');
};

var components = [
    {key: 'userAgent', getData: UserAgent},
    {key: 'webdriver', getData: webdriver},
    {key: 'language', getData: languageKey},
    {key: 'colorDepth', getData: colorDepthKey},
    {key: 'deviceMemory', getData: deviceMemoryKey},
    {key: 'pixelRatio', getData: pixelRatioKey},
    {key: 'hardwareConcurrency', getData: hardwareConcurrencyKey},
    {key: 'screenResolution', getData: screenResolutionKey},
    {key: 'availableScreenResolution', getData: availableScreenResolutionKey},
    {key: 'timezoneOffset', getData: timezoneOffset},
    {key: 'timezone', getData: timezone},
    {key: 'sessionStorage', getData: sessionStorageKey},
    {key: 'localStorage', getData: localStorageKey},
    {key: 'indexedDb', getData: indexedDbKey},
    {key: 'addBehavior', getData: addBehaviorKey},
    {key: 'openDatabase', getData: openDatabaseKey},
    {key: 'cpuClass', getData: cpuClassKey},
    {key: 'platform', getData: platformKey},
    {key: 'doNotTrack', getData: doNotTrackKey},
    {key: 'plugins', getData: pluginsComponent},
    {key: 'hasLiedLanguages', getData: hasLiedLanguagesKey},
    {key: 'hasLiedResolution', getData: hasLiedResolutionKey},
    {key: 'hasLiedOs', getData: hasLiedOsKey},
    {key: 'hasLiedBrowser', getData: hasLiedBrowserKey},
    {key: 'touchSupport', getData: touchSupportKey},
];

var Fingerprint2 = function (options) {
    throw new Error('\'new Fingerprint()\' is deprecated, see https://github.com/Valve/fingerprintjs2#upgrade-guide-from-182-to-200');
};

Fingerprint2.get = function (options, callback) {
    if (!callback) {
        callback = options;
        options = {};
    } else if (!options) {
        options = {};
    }
    extendSoft(options, defaultOptions);
    options.components = options.extraComponents.concat(components);

    var keys = {
        data: [],
        addPreprocessedComponent: function (key, value) {
            if (typeof options.preprocessor === 'function') {
                value = options.preprocessor(key, value);
            }
            keys.data.push({key: key, value: value});
        },
    };

    var i = -1;
    var chainComponents = function (alreadyWaited) {
        i += 1;
        if (i >= options.components.length) { // on finish
            callback(keys.data);
            return;
        }
        var component = options.components[i];

        if (options.excludes[component.key]) {
            chainComponents(false); // skip
            return;
        }

        if (!alreadyWaited && component.pauseBefore) {
            i -= 1;
            setTimeout(function () {
                chainComponents(true);
            }, 1);
            return;
        }

        try {
            component.getData(function (value) {
                keys.addPreprocessedComponent(component.key, value);
                chainComponents(false);
            }, options);
        } catch (error) {
            // main body error
            keys.addPreprocessedComponent(component.key, String(error));
            chainComponents(false);
        }
    };

    chainComponents(false);
};

Fingerprint2.getPromise = function (options) {
    return new Promise(function (resolve, reject) {
        Fingerprint2.get(options, resolve);
    });
};

Fingerprint2.getV18 = function (options, callback) {
    if (callback == null) {
        callback = options;
        options = {};
    }
    return Fingerprint2.get(options, function (components) {
        var newComponents = [];
        for (var i = 0; i < components.length; i++) {
            var component = components[i];
            if (component.value === (options.NOT_AVAILABLE || 'not available')) {
                newComponents.push({key: component.key, value: 'unknown'});
            } else if (component.key === 'plugins') {
                newComponents.push({
                    key: 'plugins',
                    value: map(component.value, function (p) {
                        var mimeTypes = map(p[2], function (mt) {
                            if (mt.join) {
                                return mt.join('~');
                            }
                            return mt;
                        }).join(',');
                        return [p[0], p[1], mimeTypes].join('::');
                    }),
                });
            } else if (['sessionStorage', 'localStorage', 'indexedDb', 'addBehavior', 'openDatabase'].indexOf(component.key) !== -1) {
                if (component.value) {
                    newComponents.push({key: component.key, value: 1});
                } else {
                    // skip
                    continue;
                }
            } else {
                if (component.value) {
                    newComponents.push(component.value.join ? {
                        key: component.key,
                        value: component.value.join(';'),
                    } : component);
                } else {
                    newComponents.push({key: component.key, value: component.value});
                }
            }
        }
        var murmur = x64hash128(map(newComponents, function (component) {
            return component.value;
        }).join('~~~'), 31);
        callback(murmur, newComponents);
    });
};

Fingerprint2.x64hash128 = x64hash128;
Fingerprint2.VERSION = '2.1.2';

export {Fingerprint2};
/* eslint-enable */
