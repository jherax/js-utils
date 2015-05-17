/*
 *  JSU Library
 *  Author: David Rivera
 *  Created: 2013/06/26
 *  Version: 3.7.2
 -------------------------------------
 *  Source:
 *  http://github.com/jherax/js-utils
 -------------------------------------
 *  Documentation:
 *  http://jherax.github.io
 *  http://jherax.github.io/?lang=spanish
 -------------------------------------
 *  Has dependency on jQuery
 *  http://jquery.com/
 -------------------------------------
 *  Abstract:
 *  This is a library of JavaScript/jQuery utilities, which includes tools for data validation and text formatting,
 *  plugins for tooltip, modal-windows and positioning elements, resources injection,
 *  string and JSON manipulation, object cloning, sorting arrays, and other features.
 -------------------------------------
 *  Released under the MIT license
 *  https://raw.githubusercontent.com/jherax/js-utils/master/LICENSE
 *  Copyright (C) 2013-2015 jherax
 */
;
// Avoid console errors in browsers that lack a console.
(function (window) {
    var noop = function () {},
        method,
        methods = [
            'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
            'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
            'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
            'timeStamp', 'trace', 'warn'
        ],
        length = methods.length,
        console = (window.console = window.console || {});

    while (length -= 1) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}(window));

// Creates the global namespace
if (window["jsu"] && jsu.author !== 'jherax')
    throw new Error("A variable with namespace [jsu] is already in use");

// Creates the initial properties
var jsu = window.jsu || Object.defineProperties({}, {
    "author": {
        enumerable: false,
        configurable: false,
        value: "jherax"
    },
    "version": {
        enumerable: false,
        configurable: false,
        value: "3.7.2"
    },
    "dependencies": {
        enumerable: false,
        configurable: false,
        value: ["jQuery", "jherax.css"]
    },
    //selector where dynamic HTML is placed
    "wrapper": {
        enumerable: true,
        configurable: true,
        writable: true,
        value: "body"
    },
    //polyfill to get the host of the site
    "siteOrigin": {
        enumerable: true,
        configurable: false,
        value: (location.origin ||
            (location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : ''))
        )
    },
    //utility to create safe namespaces
    "createNS": {
        enumerable: true,
        configurable: false,
        value: function (namespace) {
            var nsparts = namespace.toString().split("."),
                cparent = window,
                i, subns, nspartsLength;
            // we want to be able to include or exclude the root namespace so we strip it if it's in the namespace
            if (nsparts[0] === "window") nsparts = nsparts.slice(1);
            // loop through the parts and create a nested namespace if necessary
            for (i = 0, nspartsLength = nsparts.length; i < nspartsLength; i+=1) {
                subns = nsparts[i];
                // check if the namespace is a valid variable name
                if (!(/^[A-Za-z_]\w+/).test(subns)) throw new Error("Incorrect namespace");
                // check if the current parent already has the namespace declared,
                // if it isn't, then create it
                if (typeof cparent[subns] === "undefined") {
                    cparent[subns] = {};
                }
                cparent = cparent[subns];
            }
            i = subns = nsparts = nspartsLength = null;
            // the parent is now constructed with empty namespaces and can be used.
            // we return the outermost namespace
            return cparent;
        }
    }
});
// Polyfill for Object.create() method on IE
if (typeof Object.create !== 'function') {
    Object.create = (function () {
        function F() {}
        return function (proto) {
            F.prototype = proto;
            var newObj = new F();
            F.prototype = null;
            return newObj;
        };
    }());
}
// Polyfill for Array.prototype.some
if (typeof Array.prototype.some !== 'function') {
    Object.defineProperty(Array.prototype, "some", {
        configurable: false,
        enumerable: false,
        value: function (fn /*, thisArg */) {
            'use strict';
            if (this === void 0 || this === null)
                throw new TypeError();

            if (typeof fn !== 'function')
                throw new TypeError();

            var thisArg, index,
                array = Object(this),
                //let @len be ToUint32(value)
                len = array.length >>> 0;

            thisArg = arguments.length >= 2 ? arguments[1] : void 0;
            for (index = 0; index < len; index += 1) {
                if (index in array && fn.call(thisArg, array[index], index, array))
                    return true;
            }
            return false;
        }
    });
}
// Polyfill for Array.prototype.filter
if (typeof Array.prototype.filter !== 'function') {
    Object.defineProperty(Array.prototype, "filter", {
        configurable: false,
        enumerable: false,
        value: function (fn /*, thisArg */) {
            'use strict';
            if (this === void 0 || this === null) {
                throw new TypeError();
            }

            if (typeof fn !== 'function') {
                throw new TypeError();
            }

            var filtered, thisArg,
                index, element,
                array = Object(this),
                len = array.length >>> 0;

            filtered = [];
            thisArg = arguments.length >= 2 ? arguments[1] : void 0;
            for (index = 0; index < len; index += 1) {
                if (index in array) {
                    element = array[index];
                    // NOTE: Technically this should Object.defineProperty at
                    //       the next index, as push can be affected by
                    //       properties on Object.prototype and Array.prototype.
                    //       But that method's new, and collisions should be
                    //       rare, so use the more-compatible alternative.
                    if (fn.call(thisArg, element, index, array)) {
                        filtered.push(element);
                    }
                }
            }
            return filtered;
        }
    });
}

//-----------------------------------
// Immediately-invoked Function Expressions (IIFE)
// We pass the namespace as an argument to a self-invoking function.
// "regional" is the context of the local namespace, and "$" is the jQuery object.
(function (regional, $) {

    // Creates the messages for specific culture
    regional.spanish = {
        culture: "es",
        deprecated: " .{0} está en desuso, use .{1} en su lugar ",
        wordPattern: /\s(?:Y|O|Del?|Por|Al?|L[ao]s?|[SC]on|En|Se|Que|Una?)\b/g,
        decimalMark: ",",
        thousandsMark: ".",
        timeFormat: "HH:mm",
        dateFormat: "dd/MM/yyyy",
        dateFormatError: "El formato de fecha es incorrecto",
        dateIsGreater: "La fecha no puede ser mayor a hoy",
        dateIsLesser: "La fecha no puede ser menor a hoy",
        validateForm: "El botón debe estar dentro de un &lt;form&gt;",
        validateRequired: "Este campo es requerido",
        validateFormat: "El formato es incorrecto",
        dialogTitle: "Información",
        dialogCancel: "Cancelar",
        dialogOK: "Aceptar"
    };
    regional.english = {
        culture: "en",
        deprecated: " .{0} is deprecated, use .{1} instead ",
        wordPattern: null,
        decimalMark: ".",
        thousandsMark: ",",
        timeFormat: "HH:mm",
        dateFormat: "MM/dd/yyyy",
        dateFormatError: "The date format is incorrect",
        dateIsGreater: "The date can't be greater than today",
        dateIsLesser: "The date can't be lesser than today",
        validateForm: "The button must be inside a &lt;form&gt;",
        validateRequired: "This field is required",
        validateFormat: "The format is incorrect",
        dialogTitle: "Information",
        dialogCancel: "Cancel",
        dialogOK: "Agree"
    };
    //-----------------------------------
    // You can add more languages using $.extend
    regional.current = $.extend({}, regional.spanish);

    //-----------------------------------
    // Creates culture for jquery.ui datepicker
    if ($.datepicker) {
        $.datepicker.regional['en'] = $.extend({}, $.datepicker.regional[""]);
        $.datepicker.regional['es'] = {
            closeText: 'Cerrar',
            prevText: '&lt; Anterior',
            nextText: 'Siguiente &gt;',
            currentText: 'Hoy',
            monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
            monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
            dayNames: ['Domingo', 'Lunes', 'Martes', 'Mi&eacute;rcoles', 'Jueves', 'Viernes', 'S&aacute;bado'],
            dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mi&eacute;', 'Juv', 'Vie', 'S&aacute;b'],
            dayNamesMin: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'S&aacute;'],
            weekHeader: 'Sm',
            dateFormat: 'dd/mm/yy',
            firstDay: 1,
            isRTL: false,
            showMonthAfterYear: false,
            yearSuffix: ""
        };
    }
    if ($.timepicker) {
        $.timepicker.regional['en'] = $.extend({}, $.timepicker.regional[""]);
        $.timepicker.regional['es'] = {
            timeOnlyTitle: 'Seleccione Hora',
            timeText: 'Tiempo',
            hourText: 'Hora',
            minuteText: 'Minuto',
            secondText: 'Segundo',
            currentText: 'Actual',
            closeText: 'Aceptar',
            timeFormat: 'HH:mm',
            hourGrid: 4,
            minuteGrid: 10,
            ampm: false
        };
    }
    //-----------------------------------
    // Sets the default language configuration
    Object.defineProperty(regional, "set", {
        enumerable: true,
        configurable: false,
        value: function (obj, fnSetCustom) {
            $.extend(regional.current, obj);
            // This code segment must be called before the plugin initialization
            // You can find more languages: [http://github.com/jquery/jquery-ui/tree/master/ui/i18n]
            if ($.datepicker) { $.datepicker.setDefaults($.datepicker.regional[regional.current.culture]); }
            if ($.timepicker) { $.timepicker.setDefaults($.timepicker.regional[regional.current.culture]); }
            if ($.isFunction(fnSetCustom)) fnSetCustom();
        }
    });

}(jsu.createNS("jsu.regional"), jQuery));
// Create the namespace for languages

//-----------------------------------
// We provide an object to override default settings.
// "settings" is the context of the local namespace, and "$" is the jQuery object.
(function (settings, $) {
    settings.position = null; //{ at:null, my:null };
    settings.release = false;
    settings.urlprefix = "";
})(jsu.createNS("jsu.settings"), jQuery);
// Create the namespace for global settings

//-----------------------------------
// Immediately-invoked Function Expressions (IIFE)
// We pass the namespace as an argument to a self-invoking function.
// "jherax" is the context of the local namespace, and "$" is the jQuery object.
(function (window, $, jherax, undefined) {

    //===================================
    /* PRIVATE MEMBERS */
    //===================================

    // Sets the default language configuration
    jherax.regional.set(jherax.regional.spanish);
    var _toString = Object.prototype.toString,
        _language = jherax.regional.current;

    //-----------------------------------
    // Create a custom exception notifier
    // Constructor Pattern
    // @@Private
    var CustomError = (function () {
        'use strict';
        function CustomError (message) {
            var i, argsLength, error;
            //enforces new
            if (!(this instanceof CustomError)) {
                return new CustomError(message);
            }
            message = message || "An exception occurred";
            for (i = 1, argsLength = arguments.length; i < argsLength; i+=1)
                message = message.replace(new RegExp("\\{" + (i - 1) + "}"), arguments[i]);
            //saves the current stack
            error = new Error(message);
            error.name = this.name;
            Object.defineProperties(this, {
                "stack": {
                    enumerable: false,
                    get: function () { return error.stack; }
                },
                "message": {
                    enumerable: false,
                    value: message
                }
            });
        }
        // Prevents reference to Error.prototype
        CustomError.prototype = Object.create(Error.prototype);
        Object.defineProperties(CustomError.prototype, {
            "constructor": {
                enumerable: false,
                value: CustomError
            },
            "name": {
                enumerable: false,
                value: "JSU Error"
            }
        });
        return CustomError;
    }());
    //-----------------------------------
    // Prints a console message notifying the compatibility mode
    // @@Private
    function deprecated (oldname, newname) {
        console.log("%c" +
            _language.deprecated.replace("{0}", oldname).replace("{1}", newname),
            'background: tomato; color: white; display: block;');
    }
    //-----------------------------------
    // Seals the writable attribute in all object's properties
    // @@Private
    function sealWritable (obj) {
        for (var p in obj) {
            Object.defineProperty(obj, p, {
                __proto__: null,
                configurable: true,
                enumerable: true,
                writable: false
            });
        }
    }
    //-----------------------------------
    // Sets the @value of specific @property in the @obj,
    // keeping the writable attribute to false
    // @@Private
    function setWritable (obj, property, value, enumerable) {
        Object.defineProperty(obj, property, {
            "configurable": true,
            "enumerable": !!enumerable,
            "writable": false,
            "value": value
        });
    }
    //-----------------------------------
    // Fix: failed to read the 'selectionStart' property from 'HTMLInputElement'
    // The @fn parameter provides a callback to execute additional code
    // http://www.whatwg.org/specs/web-apps/current-work/multipage/the-input-element.html#input-type-attr-summary
    // @@Private
    function fixSelection (dom, fn) {
        var ok = (/text|password|search|tel|url/).test(dom.type),
            selection = {
                start: ok ? dom.selectionStart : 0,
                end: ok ? dom.selectionEnd : 0
            };
        if (ok && isFunction(fn)) fn(dom);
        return selection;
    }
    //-----------------------------------
    // Returns the boolean value of the @obj parameter
    var bool = function (obj) {
        return (/^true$/i).test(obj);
    };
    //-----------------------------------
    // Detects the browser via userAgent, since
    // jQuery 1.9+ deprecated the browser property.
    var browser = (function () {
        var ua = navigator.userAgent.toLowerCase(),
            match =
                /(msie) ([\w.]+)/.exec(ua) ||
                /(chrome)[ \/]([\w.]+)/.exec(ua) ||
                /(webkit)[ \/]([\w.]+)/.exec(ua) ||
                /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) ||
                ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) ||
                [];
        var b = {}, o = {
            browser: match[1] || "unknown",
            version: match[2] || "0"
        };
        b[o.browser] = true;
        b.version = o.version;
        return Object.freeze(b);
    }());
    //-----------------------------------
    // Determines if the @obj parameter is a DOM Element
    function isDOM (obj) {
        if ("HTMLElement" in window) return (!!obj && obj instanceof HTMLElement);
        return (!!obj && typeof obj === "object" && obj.nodeType === 1 && !!obj.nodeName);
    }
    //-----------------------------------
    // Determines if the @obj parameter is a function
    function isFunction (obj) {
        return (!!obj && _toString.call(obj) == '[object Function]');
    }
    //-----------------------------------
    // This is a reference to JSON.stringify and provides a polyfill for old browsers.
    // fnStringify serializes an object, array or primitive value and return it as JSON.
    var fnStringify = typeof JSON !== "undefined" ? JSON.stringify : function (obj) {
        var arr = [], prop;
        $.each(obj, function (key, val) {
            prop = "\"" + key + "\":";
            prop += ($.isPlainObject(val) ? fnStringify(val) :
                (typeof val === "string" ? "\"" + val + "\"" : val));
            arr.push(prop);
        });
        return "{" + arr.join(",") + "}";
    };
    //-----------------------------------
    // Sorts the elements of an array
    var sortBy = (function () {
        var //the default parser function
            _parser = function (x) { return x; },
            //gets the item to be sorted
            _getItem = function (x) {
                return this.parser((_toString.call(x) == "[object Object]" && x[this.prop]) || x);
            };
        // Creates a sort method in the Array prototype
        Object.defineProperty(Array.prototype, "sortBy", {
            configurable: false,
            enumerable: false,
            // @o.prop: property name (if it is an Array of objects)
            // @o.desc: determines whether the sort is descending
            // @o.parser: function to parse the items to expected type
            value: function (o) {
                if (_toString.call(o) != "[object Object]")
                    o = {};
                if (_toString.call(o.parser) != "[object Function]")
                    o.parser = _parser;
                //if @o.desc is false: set 1, else -1
                o.desc = [1, -1][+!!o.desc];
                return this.sort(function (a, b) {
                    a = _getItem.call(o, a);
                    b = _getItem.call(o, b);
                    return ((a > b) - (b > a)) * o.desc;
                    //return a = getItem(a), b = getItem(b), o.desc * (a < b ? -1 : +(a > b));
                });
            }
        });
        // Creates a method for sorting the Array
        // @array: the Array of elements
        // @o.prop: property name (if it is an Array of objects)
        // @o.desc: determines whether the sort is descending
        // @o.parser: function to parse the items to expected type
        return function (array, o) {
            if (_toString.call(array) != "[object Array]" || !array.length)
                return [];
            if (_toString.call(o) != "[object Object]")
                o = {};
            if (_toString.call(o.parser) != "[object Function]")
                o.parser = _parser;
            //if @o.desc is false: set 1, else -1
            o.desc = [1, -1][+!!o.desc];
            return array.sort(function (a, b) {
                a = _getItem.call(o, a);
                b = _getItem.call(o, b);
                return ((a > b) - (b > a)) * o.desc;
            });
        };
    }());
    //-----------------------------------
    // Determines whether the @dom parameter is a text or checkable <input>
    // http://www.quackit.com/html_5/tags/html_input_tag.cfm
    // http://github.com/jherax/js-utils#inputtypetext
    var input = (function () {
        var _textarea = /textarea/i,
            _text = /text|password|file|number|search|tel|url|email|datetime|datetime-local|date|time|month|week/i,
            _radio = /checkbox|radio/i,
            _input = /input/i;
        return {
            isText: function (dom) {
                if (!isDOM(dom)) return false;
                if (_textarea.test(dom.nodeName)) return true;
                return _text.test(dom.type) && _input.test(dom.nodeName);
            },
            isCheck: function (dom) {
                if (!isDOM(dom)) return false;
                return _radio.test(dom.type) && _input.test(dom.nodeName);
            }
        };
    }());
    //-----------------------------------
    // Determines if an event handler (defined by @eventName + @namespace) was created previously
    function handlerExist (dom, eventName, namespace) {
        var h,
            handler = ($._data(dom, 'events') || {})[eventName] || [],
            handlerLength = handler.length;
        for (h = 0; h < handlerLength; h+=1) {
            if (handler[h].namespace === namespace || (handler[h].data || {}).handler === namespace) return true;
        }
        h = handler = handlerLength = null;
        return false;
    }
    //-----------------------------------
    // Builds the event name, by appending "." + @namespace at the end of @eventName
    function nsEvents (eventName, namespace) {
        namespace = "." + namespace;
        eventName = $.trim(eventName).replace(".", "") + namespace;
        return eventName.replace(/\s+|\t+/g, namespace + " ");
    }
    //-----------------------------------
    // Dynamically adds a script.
    // This method is useful to insert JavaScript code from an external file.
    function fnAddScript (path) {
        var o = $.extend({
                src: null,
                async: true,
                createTag: false,
                charset: null,
                onload: null,
                before: null
            }, $.isPlainObject(path) ? path : { src: path });
        if (!o.src) throw new CustomError("The url of file is required");
        //creates the <script> element
        if (o.createTag === true) {
            var tags, tagsLength, i,
                file = document.createElement('script'),
                before = fnEscapeRegExp(o.before);
            file.type = 'text/javascript';
            file.src = o.src;
            if (o.charset) file.charset = o.charset;
            if (isFunction(o.onload)) file.onload = o.onload;
            tags = document.getElementsByTagName('script');
            if (!before) return !!$(tags).last().before(file);
            before = new RegExp(before);
            for (i = 0, tagsLength = tags.length; i < tagsLength; i+=1) {
                if (before.test(tags[i].src)) {
                    tags[i].parentNode.insertBefore(file, tags[i]);
                    break;
                }
            }
            return file;
        }
        //returns jqXHR object
        return $.ajax({
            url: o.src,
            async: o.async,
            dataType: "script"
        }).done(function (script) {
            if (isFunction(o.onload)) o.onload();
        }).fail(function (jqXHR, result) {
            console.log("fnAddScript:", jqXHR);
            throw new CustomError(result);
        });
    }
    //-----------------------------------
    // Dynamically adds an external stylesheet file (CSS).
    // This method is useful to inject a css file to the document.
    function fnAddCSS (path, before) {
        if (!path) throw new CustomError("The url of file is required");
        before = fnEscapeRegExp(before);
        var tags, tagsLength, i,
            file = document.createElement('link');
        file.rel = 'stylesheet';
        file.type = 'text/css';
        file.href = path;
        if (!before) {
            tags = document.getElementsByTagName('head');
            tags && tags[0].appendChild(file);
            return file;
        }
        before = new RegExp(before);
        tags = document.getElementsByTagName('link');
        for (i = 0, tagsLength = tags.length; i < tagsLength; i+=1) {
            if (before.test(tags[i].href)) {
                tags[i].parentNode.insertBefore(file, tags[i]);
                break;
            }
        }
        return file;
    }
    //-----------------------------------
    // Escapes the special characters in @text so that it can serve as a literal pattern in a regular expression
    var fnEscapeRegExp = (function () {
        var _pattern = /([.*+?=!:${}()|\-\^\[\]\/\\])/g;
        return function (text) {
            if (typeof text !== "string") return null;
            return text.replace(_pattern, "\\$1");
        }
    }());
    //-----------------------------------
    // Gets the value of a specific @key read from the querystring in the current url
    function fnGetQueryToString (key) {
        if (!key || key === "") return "";
        var m = window.location.search.match(new RegExp("(" + key.toString() + ")=([^&]+)"));
        return m && m[2] || "";
    }
    //-----------------------------------
    // Gets the values from the querystring in the url and saves them as an Object literal
    function fnGetQueryToObject (key) {
        var m, params = {},
            pair = /(\w+)=([^&]+)/;
        key = key ? key.toString() : "";
        $.each(window.location.search.split(/[\?&]/g),
            function (i, item) {
                m = item.match(pair);
                if (!m) return true;
                if (key === "" || key.indexOf(m[1]) > -1) {
                    params[$.trim(m[1])] = m[2];
                }
            });
        //encodeURIComponent()
        return params;
    }
    //-----------------------------------
    // Deserialize an inconsistent JSON string to its correct Object Literal notation
    var fnGetDataToObject = (function () {
        function parser (value) {
            if ((/true/i).test(value)) return true;
            if ((/false/i).test(value)) return false;
            if ((/null/i).test(value)) return null;
            if ((/undefined/i).test(value)) return undefined;
            if ((/^[0-9]+$/).test(value)) return +value;
            return value;
        }
        var _pattern = /['"]?(\w+)['"]?\s*:\s*['"]?([^'"]+|(?:.*(?='|")))/;
        //"{id:0,edad:32,nombre:'',casado:true,hijos:false,salario:undefined,cesantias:null}"
        return function (data) {
            var m, params = {};
            data = data ? data.toString() : "";
            $.each(data.split(/[\{\},]/g),
                function (i, item) {
                    m = item.match(_pattern);
                    if (!m) return true;
                    params[$.trim(m[1])] = parser(m[2]);
                });
            return params;
        };
    }());
    //-----------------------------------
    // Copies an object and freezes all navigable properties in the object (set them to read-only)
    function fnFreezeObject (obj) {
        //Object.freeze(obj)
        var n = {}, p;
        for (p in obj) {
            Object.defineProperty(n, p, {
                __proto__: null, //no inherited properties
                configurable: false,
                enumerable: true,
                writable: false,
                value: $.isPlainObject(obj[p]) ? fnFreezeObject(obj[p]) : obj[p]
            });
        }
        return Object.preventExtensions(n);
    }
    //-----------------------------------
    // Extends the properties of the object @from to the object @to.
    // If @to is not provided, then a deep copy of @from is returned.
    function fnExtend (from, to) {
        var _objects = [];
        var _fnExtend = function (_from, _to) {
            var prop;
            // checks if @from refers to an object already defined
            if (_toString.call(_from) == "[object Object]") {
                if (_objects.filter(function (item) {
                    return item === _from;
                }).length) return _from;
                // keeps the reference to objects to check if it was created
                _objects.push(_from);
            }
            // determines whether @from is a primitive object or a function
            if (_from == null || typeof _from != "object") return _from;
            // determines whether @from is an instance of any of these prototypes
            if (_from.constructor == Date || _from.constructor == RegExp || _from.constructor == Function ||
                _from.constructor == String || _from.constructor == Number || _from.constructor == Boolean) {
                return new _from.constructor(_from);
            }
            if (_from.constructor != Object && _from.constructor != Array) return _from;
            // iterates recursively the object properties
            _to = _to || new _from.constructor();
            for (prop in _from) {
                _to[prop] = typeof _to[prop] == "undefined" ? _fnExtend(_from[prop], null) : _to[prop];
            }
            return _to;
        };
        // Lazy Function Definition Pattern
        jherax.fnExtend = function (_from, _to) {
            var cloned = _fnExtend(_from, _to);
            _objects = [];
            return cloned;
        };
        //invokes the function to create the closure
        //and allow "Lazy Function" takes place
        //to reasign in memory the new fnExtend
        return jherax.fnExtend(from, to);
    }

    //-----------------------------------
    // Displays the date according to the format specified by .dateFormat and .timeFormat in jsu.regional
    // The supported formats for ISO 8601 are: [YYYY-MM-DD] and [YYYY-MM-DDThh:mm]
    var fnGetDate = (function () {
        var _pattern = /\[object (?:String|Number|Date)\]/,
            _date = /[dMy]+/g,
            _hour = /[Hhms]+/g;
        function fillZero (n) { return ("0" + n.toString()).slice(-2); }
        function fnDate (o) {
            return (o.ISO8601 ? "yyyy-MM-dd" : _language.dateFormat).replace(_date, function (m) {
                switch (m.toString()) {
                    case "dd": return fillZero(o.date.getDate());
                    case "MM": return fillZero(o.date.getMonth() + 1);
                    case "yyyy": return o.date.getFullYear();
                }
            });
        }
        function fnTime (o) {
            return (o.ISO8601 ? "HH:mm" : _language.timeFormat).replace(_hour, function (m) {
                var h = o.date.getHours();
                switch (m.toString()) {
                    case "HH": return fillZero(o.date.getHours());
                    case "hh": return fillZero(h === 12 ? 12 : h % 12);
                    case "mm": return fillZero(o.date.getMinutes());
                    case "ss": return fillZero(o.date.getSeconds());
                }
            });
        }
        function fnDateTime (o) {
            return fnDate(o) + (o.ISO8601 ? "T" : " ") + fnTime(o);
        }
        // Return Module
        return function (o) {
            if (_pattern.test(_toString.call(o))) o = { date: o };
            o = $.extend({ date: new Date(), ISO8601: false }, o);
            if (typeof o.date === "string" && /Date/.test(o.date))
                o.date = +o.date.replace(/\D+/g, "");
            if (o.date instanceof Date === false) o.date = new Date(o.date);
            if (!o.date.valueOf()) throw new CustomError("Invalid Date: {0}", o.date);
            // Public API
            return {
                date: fnDate(o),
                time: fnTime(o),
                dateTime: fnDateTime(o)
            };
        };
    }());
    //-----------------------------------
    // Gets the Date object from a string that meets the ISO 8601 format
    function fnDateFromISO8601 (date) {
        if (typeof date !== "string") { console.log("%c js-utils: Date format must be ISO 8601 » ", "color:red", date); return null; }
        var r = date.match(/(?:(\d{4})-(\d{2})-(\d{2}))(?:T(?:(\d{2})(?:\:(\d{2}))?(?:\:(\d{2}))?)?(?:([+-]\d{2})(?:\:?(\d{2}))?)?)?/);
        if (!r) { console.log("%c js-utils: Date format must be ISO 8601 » " + date, "color:red"); return null; }
        var gmt = new Date(),
            th = +r[7] || (gmt.getTimezoneOffset() / -60), //normalize the hours offset
            tm = +r[8] || (gmt.getTimezoneOffset() % -60), //normalize the minutes offset
            M = r[2] - 1,
            h = r[4] || 0,
            m = r[5] || 0,
            s = r[6] || 0,
            ms;
        if (th < 0 && tm > 0) tm = -tm; //fixes the minutes offset
        ms = -60000 * (th * 60 + tm); //corrects the time offset
        gmt = new Date(Date.UTC(r[1], M, r[3], h, m, s) + ms);
        return new Date(gmt);
    }
    //-----------------------------------
    // Encodes a string, by converting special characters like <, >, &... to its corresponding HTML entity.
    // This method also can be used as a delegate for the jQuery methods: $.val() and $.text()
    function fnGetHtmlText (i, value) {
        if (!value && typeof i === "string") value = i;
        var html = $("<div>").text(value).html();
        return $.trim(html);
    }
    //-----------------------------------
    // Gets the selected text in the document and inside the text boxes.
    function fnGetSelectedText() {
        var _dom = document.activeElement,
            _sel = { text: "", slice: "", start: -1, end: -1 },
            _getSelection = window.getSelection || document.getSelection,
            _selection;
        if (_getSelection) {
            // Get selected text from an input field
            if (input.isText(_dom)) {
                _selection = fixSelection(_dom);
                _sel.start = _selection.start;
                _sel.end = _selection.end;
                if (_sel.end > _sel.start) {
                    _sel.text = _dom.value.substring(_sel.start, _sel.end);
                    _sel.slice = _dom.value.slice(0, _sel.start) + _dom.value.slice(_sel.end);
                }
            }
            // Gets the selected text in the document
            else _sel.text = _getSelection().toString();
        } else {
            _selection = document.selection;
            if (_selection && _selection.type != "Control")
                _sel.text = _selection.createRange().text;
        }
        if (_sel.text !== "") _sel.text = $.trim(_sel.text);
        return _sel;
    }
    //-----------------------------------
    // Gets the current position of the cursor in the @dom element
    function fnGetCaretPosition (dom) {
        var _selection, _sel;
        if ('selectionStart' in dom) {
            return fixSelection(dom).start;
        } else { // IE below version 9
            _selection = document.selection;
            if (_selection) {
                _sel = _selection.createRange();
                _sel.moveStart('character', -dom.value.length);
                return _sel.text.length;
            }
        }
        return -1;
    }
    //-----------------------------------
    // Sets the @position of the cursor in the @dom element
    function fnSetCaretPosition (dom, pos) {
        var _createTextRange, range;
        pos = +pos || 0;
        if ('selectionStart' in dom) {
            fixSelection(dom, function (_dom) {
                _dom.setSelectionRange(pos, pos);
            });
        } else { // IE below version 9
            _createTextRange = dom.createTextRange;
            if (_createTextRange) {
                range = _createTextRange();
                if (!range) return;
                range.collapse(true);
                range.moveEnd('character', pos);
                range.moveStart('character', pos);
                range.select();
            }
        }
    }
    //-----------------------------------
    // Applies a transformation to the text,
    // also it removes all consecutive spaces
    var fnCapitalize = (function () {
        var _textarea = /textarea/i,
            _linebreak = (/\r|\n/g),
            _paragraph = (/^[¶\s]+|[¶\s]+$/g),
            _section = (/\s*¶+\s*/g),
            _spaces = (/\s{2,}/g),
            _word = (/(?:^|-|:|;|\s|\.|\(|\/)[a-záéíóúüñ]/g),
            _first = (/^\w/);
        return function (obj, type) {
            var isText = input.isText(obj),
                text = isText ? obj.value : obj && obj.toString();
            if (!text || !text.length) return "";
            if (_textarea.test(obj.nodeName)) {
                text = text.replace(_linebreak, "¶").replace(_spaces, " ");
                while (_paragraph.test(text)) text = text.replace(_paragraph, "");
                text = text.replace(_section, "\n");
            }
            else text = $.trim(text.replace(_spaces, " "));
            if (+text === 0) text = "0";
            switch (type) {
                case "word":
                    text = text.toLowerCase().replace(_word, function (m) { return m.toUpperCase(); });
                    text = _language.wordPattern instanceof RegExp
                         ? text.replace(_language.wordPattern, function (m) { return m.toLowerCase(); })
                         : text;
                    break;
                case "title":
                    text = text.replace(_word, function (m) { return m.toUpperCase(); });
                    break;
                case "first":
                    text = text.replace(_first, function (m) { return m.toUpperCase(); });
                    break;
                case "upper":
                    text = text.toUpperCase();
                    break;
                case "lower":
                    text = text.toLowerCase();
                    break;
            }
            if (isText) obj.value = text;
            return text;
        }
    }());
    //-----------------------------------
    // Sets the numeric format according to current culture.
    // Places the decimal and thousand separators specified in _language
    function fnNumericFormat (obj, o) {
        o = $.extend({
            inDecimalMark: _language.decimalMark,
            inThousandsMark: _language.thousandsMark,
            outDecimalMark: _language.decimalMark,
            outThousandsMark: _language.thousandsMark
        }, o);
        var isText = input.isText(obj),
            text = isText ? obj.value : obj && obj.toString();
            if (!text || !text.length) return "";
        var thousands = new RegExp(fnEscapeRegExp(o.inThousandsMark), "g"),
            number = text.replace(thousands, "").split(o.inDecimalMark) || [""],
            integer = number[0].replace(/\B(?=(\d{3})+(?!\d))/g, o.outThousandsMark),
            decimal = number.length > 1 ? o.outDecimalMark + number[1] : "";
        text = integer + decimal;
        if (isText) obj.value = text;
        return text;
    }
    //-----------------------------------
    // Validates the text format, depending on the type supplied.
    // Date validations are run according to regional setting.
    var fnIsValidFormat = (function () {
        function _formatter (format) {
            return "^" +
            fnEscapeRegExp(format).replace(/[dMyHhms]+/g, function (m) {
                switch (m.toString()) {
                    case "dd": return "((0[1-9])|([1-2][0-9])|(3[0-1]))";
                    case "MM": return "((0[1-9])|(1[0-2]))";
                    case "yyyy": return "([1-2][0,9][0-9][0-9])";
                    case "HH": return "([0-1][0-9]|[2][0-3])";
                    case "hh": return "([0][0-9]|[1][0-2])";
                    case "mm": return "([0-5][0-9])";
                    case "ss": return "([0-5][0-9])";
                }
            }) + "$";
        }
        function _validate (obj, pattern) {
            obj = input.isText(obj) ? obj.value : obj.toString();
            return pattern.test(obj);
        }
        var validator = {
            date: function (text) {
                //Validates the date format according to regional setting
                return _validate(text, new RegExp(_formatter(_language.dateFormat)));
            },
            time: function (text) {
                //Validates the time format: HH:mm:ss
                return _validate(text, /^([0-1][0-9]|[2][0-3]):([0-5][0-9])(?::([0-5][0-9])){0,1}$/);
            },
            datetime: function (text) {
                //Validates the date-time format according to regional setting
                return _validate(text, new RegExp(_formatter(_language.dateFormat + " " + _language.timeFormat)));
            },
            email: function (text) {
                //Validates an email address
                return _validate(text, /^([0-9a-zñÑ](?:[\-.\w]*[0-9a-zñÑ])*@(?:[0-9a-zñÑ][\-\wñÑ]*[0-9a-zñÑ]\.)+[a-z]{2,9})$/i);
            },
            url: function (text) {
                return _validate(text, /((?:http|ftp|https):\/\/[\w\-_]+(?:\.[\w\-_]+)+(?:[\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?)/gi);
            },
            ipv4: function (text) {
                //Validates an IP address v4
                return _validate(text, /^(?:(?:25[0-5]|2[0-4]\d|[01]\d\d|\d{1,2})\.){3}(?:25[0-5]|2[0-4]\d|[01]\d\d|\d{1,2})$/);
            },
            password: function (text) {
                //Validates the password strength (must have 8+ characters, 1+ number, 1+ uppercase)
                return _validate(text, /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/);
            },
            latitude: function (text) {
                //Validates latitudes range from -90 to 90
                return _validate(text, /^-?([1-8]?[1-9]|[1-9]0|0)\,{1}\d{1,6}$/);
            },
            longitude: function (text) {
                //Validates longitudes range from -180 to 180
                return _validate(text, /^-?([1]?[1-7][1-9]|[1]?[1-8][0]|[1-9]?[0-9])\,{1}\d{1,6}$/);
            }
        };
        //Set properties as not writable
        sealWritable(validator);
        Object.defineProperty(validator, "set", {
            __proto__: null,
            configurable: false,
            enumerable: false,
            writable: false,
            value: function (property, value) {
                if (!isFunction(value)) return;
                setWritable(this, property, value, true);
            }
        });
        return validator;
    }());
    //-----------------------------------
    // Evaluates whether the @dom element contains a value with a date.
    // The result of the validation will be shown in a tooltip
    var fnIsValidDate = (function () {
        var error = false;
        function parser (date) {
            var type, d, part, partLength, x;
            if (date instanceof Date) return date;
            if (typeof date !== "string") {
                if (+date) return new Date(+date);
                return new Date();
            }
            type = date.length > 10 ? "datetime" : "date";
            error = (error || !fnIsValidFormat[type](date));
            if (error) return new Date();
            d = date.split(/\D/);
            date = "y/M/d";
            part = _language.dateFormat.split(/[^yMd]/);
            for (x = 0, partLength = part.length; x < partLength; x+=1) {
                if ((/y+/).test(part[x])) date = date.replace("y", d[x]);
                if ((/M+/).test(part[x])) date = date.replace("M", d[x]);
                if ((/d+/).test(part[x])) date = date.replace("d", d[x]);
            }
            d.splice(0, 3);
            return new Date(date + " " + d.join(":"));
        }
        return function (dom, o) {
            if (!input.isText(dom)) return false;
            o = $.extend({
                isFuture: false,
                compareTo: new Date(),
                warning: null,
                position: null
            }, o);
            error = false;
            var dif = (parser(dom.value) - parser(o.compareTo)) / 1000 / 3600 / 24;
            if (error) return fnShowTooltip(dom, _language.dateFormatError);
            if ( o.isFuture && dif < 0) return fnShowTooltip(dom, o.warning || _language.dateIsLesser, o.position);
            if (!o.isFuture && dif > 0) return fnShowTooltip(dom, o.warning || _language.dateIsGreater, o.position);
            return true;
        };
    }());
    //-----------------------------------
    // Delegates the blur event to removing the tooltips
    $(document).off("blur.tooltip").on(nsEvents("blur", "tooltip"), "[data-role=tooltip]", function () {
        $(".vld-tooltip").remove();
    });
    //-----------------------------------
    // Displays a tooltip next to the @dom element
    function fnShowTooltip (dom, msg, pos) {
        dom = $(dom);
        pos = $.extend({
            at: "right center",
            my: "left+6 center",
            collision: "flipfit"
        }, jherax.settings.position, pos);
        dom.attr("data-role", "tooltip").trigger(nsEvents("blur", "tooltip"));
        if (dom.focus) dom.focus(); //sets focus before showing the tooltip
        var vld = $('<span class="vld-tooltip">').html(msg);
        vld.appendTo(jherax.wrapper).position({
            of: dom,
            at: pos.at,
            my: pos.my,
            collision: pos.collision
        }).hide().fadeIn(400);
        return false;
    }
    //-----------------------------------
    // Shows the overlay screen with the loading animation
    function fnLoading (o) {
        if (o === false)
            o = { hide: true };
        var d = $.extend({
            hide: false,
            delay: 1800,
            async: true,
            of: null
        }, o);
        $("#floatingBarsG,#backBarsG").stop().remove();
        if (d.hide === true) return true;
        var target = $(d.of || "body"),
            blockG = [],
            i, loading, overlay;
        for (i = 1; i < 9; i+=1) blockG.push('<div class="blockG"></div>');
        loading = $('<div id="floatingBarsG">').append(blockG.join(""));
        overlay = $('<div id="backBarsG" class="bg-fixed bg-opacity">');
        if (d.of) {
            overlay.css({
                'border-radius': $(d.of).css('border-radius'),
                'position': 'absolute',
                'top': target.position().top,
                'left': target.position().left,
                'height': target.outerHeight(),
                'width': target.outerWidth()
            });
        }
        overlay.add(loading).appendTo(target);
        if (bool(d.async)) overlay.hide().fadeIn(d.delay);
        else overlay.show();
        loading.fnCenter({ of: d.of });
        return true;
    }
    //-----------------------------------
    // Detects the width of the scrollbar
    function fnScrollbarWidth() {
        var outer = $('<div>').css({ visibility: 'hidden', width: 100, overflow: 'scroll' }).appendTo('body'),
            barWidth = $('<div>').css('width', '100%').appendTo(outer).outerWidth();
        outer.remove();
        return 100 - barWidth;
    }
    //-----------------------------------
    // Updates the HTML5 browser cache
    function fnUpdateCache() {
        if (handlerExist(window, "load", "fnUpdateCache")) return;
        $(window).on(nsEvents("load", "fnUpdateCache"), function (event) {
            $(window.applicationCache).on("updateready", function (e) {
                if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
                    //the browser downloads a new version of the cache manifest,
                    //and must reload the page in order to access to the new resources
                    window.applicationCache.swapCache();
                    window.location.reload(true);
                }
            });
        });
    }

    //===================================
    /* JQUERY EXTENSIONS */
    //===================================

    // Reverses the array of matched elements
    $.fn.reverse = [].reverse;
    //-----------------------------------
    // Detects if the element has vertical scrollbar
    $.fn.hasVScroll = function () {
        if (!this.length) return false;
        return this.get(0).scrollHeight > this.get(0).clientHeight;
    };
    //-----------------------------------
    // Detects if the element has horizontal scrollbar
    $.fn.hasHScroll = function () {
        if (!this.length) return false;
        return this.get(0).scrollWidth > this.get(0).clientWidth;
    };
    //-----------------------------------
    // Position an element relative to another element
    (function () {
        // http://api.jqueryui.com/position/
        if (jQuery.ui && jQuery.ui.position) return;
        var _position,
            _rhorizontal = /left|center|right/,
            _rvertical = /top|center|bottom/,
            _roffset = /([a-z]+)([+-]\d+)?\s?([a-z]+)?([+-]\d+)?/; //brings 4 groups: (horizontal)(offset) (vertical)(offset)
        //normalizes "horizontal vertical" alignment
        function setAlignment (pos) {
            pos = $.trim(pos);
            var horizontal = _rhorizontal.test(pos),
                vertical = _rvertical.test(pos);
            if (!horizontal && !vertical)
                return "center center";
            if (!(/\s/).test(pos)) {
                if (!horizontal) return "center " + pos;
                if (!vertical) return pos + " center";
            }
            return (pos === "center" ? "center center" : pos);
        }
        //monkey-patching
        _position = $.fn.position;
        $.fn.position = function (o) {
            if (!o || !o.of) return _position.apply(this, arguments);
            o = $.extend({
                of: null,
                at: "center center",
                my: "center center"
            }, o);
            o.at = setAlignment(o.at);
            o.my = setAlignment(o.my);
            //gets the target dimensions
            var target = $(o.of).first();
            if (target.length === 0) return this;
            var targetOffset = target.offset(),
                targetWidth = target.outerWidth(),
                targetHeight = target.outerHeight(),
                atOffset = (o.at).match(_roffset),
                myOffset = (o.my).match(_roffset);
            //sets the coordinates relative to target element
            var atPosition = (function () {
                var left = 0, top = 0;
                switch (atOffset[1]) {
                    case "left":
                        left = targetOffset.left + (+atOffset[2] || 0);
                        break;
                    case "center":
                        left = targetOffset.left + (+atOffset[2] || 0) + (targetWidth / 2);
                        break;
                    case "right":
                        left = targetOffset.left + (+atOffset[2] || 0) + (targetWidth);
                        break;
                }
                switch (atOffset[3]) {
                    case "top":
                        top = targetOffset.top + (+atOffset[4] || 0);
                        break;
                    case "center":
                        top = targetOffset.top + (+atOffset[4] || 0) + (targetHeight / 2);
                        break;
                    case "bottom":
                        top = targetOffset.top + (+atOffset[4] || 0) + (targetHeight);
                        break;
                }
                return { "left": left, "top": top };
            })();
            //sets the coordinates according to current @element
            var myPosition = function (element) {
                var left = 0, top = 0,
                    elementWidth = element.outerWidth(),
                    elementHeight = element.outerHeight();
                switch (myOffset[1]) {
                    case "left":
                        left = (+myOffset[2] || 0);
                        break;
                    case "center":
                        left = -(-(+myOffset[2] || 0) + (elementWidth / 2));
                        break;
                    case "right":
                        left = -(-(+myOffset[2] || 0) + (elementWidth));
                        break;
                }
                switch (myOffset[3]) {
                    case "top":
                        top = (+myOffset[4] || 0);
                        break;
                    case "center":
                        top = -(-(+myOffset[4] || 0) + (elementHeight / 2));
                        break;
                    case "bottom":
                        top = -(-(+myOffset[4] || 0) + (elementHeight));
                        break;
                }
                return { "left": left, "top": top };
            };
            //positioning each element
            return this.each(function (i, dom) {
                var element = $(dom).css({ "position": "absolute", "margin": 0 }),
                    my = myPosition(element);
                element.offset({
                    top: atPosition.top + my.top,
                    left: atPosition.left + my.left
                });
            });
        };
    })();
    //-----------------------------------
    // Centers an element relative to another
    // css:calc [http://jsfiddle.net/apaul34208/e4y6F]
    $.fn.fnCenter = function (o) {
        o = $.extend({}, o);
        if (o.of) {
            return this.position({
                my: "center",
                at: "center",
                of: o.of
            });
        } else {
            return this.each(function (i, dom) {
                var elem = $(dom);
                elem.css({
                    'position': 'fixed',
                    'left': '50%',
                    'top': '50%',
                    'margin-left': -elem.outerWidth() / 2 + 'px',
                    'margin-top': -elem.outerHeight() / 2 + 'px'
                });
            });
        }
    };
    //-----------------------------------
    // Limits the max length in the input:text
    $.fn.fnMaxLength = function (length, o) {
        if (!length) throw new CustomError("The length must be greater than 0");
        o = $.extend({
            at: "right bottom",
            my: "right top+6",
            collision: "flipfit"
        }, jherax.settings.position, o);
        return this.each(function (i, dom) {
            var count = "Max: " + length;
            if (!input.isText(dom)) return true; //continue
            dom.maxLength = length;
            $(dom).off(".fnMaxLength").attr("data-role", "tooltip")
            .on(nsEvents("keypress input paste", "fnMaxLength"), function (e) {
                var len = dom.value.length,
                    max = len >= length ? 1 : 0;
                if (browser.mozilla) max = (!e.keyCode && max);
                if (max) {
                    len = length;
                    dom.value = dom.value.substr(0, len);
                    e.preventDefault();
                }
                count = "Max: " + len + "/" + length;
                if (!$('#max' + dom.id).text(count).length) {
                    $('<span class="vld-tooltip" id="max' + dom.id + '">')
                    .text(count).appendTo(jherax.wrapper).position({
                        of: dom,
                        at: o.at,
                        my: o.my,
                        collision: o.collision
                    }).hide().fadeIn(400);
                }
            });
        });
    };
    //-----------------------------------
    // Apply the capitalized format to text when the blur event is raised
    $.fn.fnCapitalize = function (type) {
        return this.each(function (i, dom) {
            $(dom).off(".fnCapitalize").on(nsEvents("blur", "fnCapitalize"), function () {
                fnCapitalize(this, type);
            });
        });
    };
    //-----------------------------------
    // Displays a tooltip next to the current element
    $.fn.fnShowTooltip = function (msg, pos) {
        return this.each(function (i, dom) {
            fnShowTooltip(dom, msg, pos);
        });
    };
    //-----------------------------------
    // Validates the format of the first element, depending on the type supplied.
    // Date validations are run according to regional setting
    $.fn.fnIsValidFormat = function (type) {
        if (!this.length) return false;
        if (!fnIsValidFormat[type])
            throw new CustomError("Property fnIsValidFormat.{0} does not exist", type);
        return fnIsValidFormat[type](this.get(0));
    };
    //-----------------------------------
    // Evaluates whether the current element contains a value with a date.
    // The result of the validation will be shown in a tooltip
    $.fn.fnIsValidDate = function (o) {
        if (!this.length) return false;
        return fnIsValidDate(this.get(0), o);
    };
    //-----------------------------------
    // Sets the numeric format according to current culture.
    // Places the decimal and thousand separators specified in _language
    $.fn.fnNumericFormat = function (o) {
        return this.each(function (i, dom) {
            $(dom).off(".fnNumericFormat").on(nsEvents("keyup blur", "fnNumericFormat"), function () {
                fnNumericFormat(this, o);
            });
        });
    };
    //-----------------------------------
    // The matched elements accept only numeric characters
    $.fn.fnNumericInput = function () {
        return this.each(function (i, dom) {
            var len = dom.maxLength;
            dom.maxLength = 524000;
            if (len < 1) len = 524000;
            $(dom).off(".fnNumericInput")
            .on(nsEvents("focus blur input paste", "fnNumericInput"), { max: len }, function (e) {
                var _pos = e.type != "blur" ? fnGetCaretPosition(e.target) : 0,
                    _value = e.target.value,
                    _sel, _digits;
                if (e.type == "paste") {
                    _sel = fnGetSelectedText();
                    if (_sel.text !== "") _value = _sel.slice;
                }
                _digits = _value.match(/\d/g);
                _value = !_digits ? "" : _digits.join("").substr(0, e.data.max);
                if (e.type == "blur" && parseFloat(_value) === 0) _value = "0";
                _pos = Math.max(_pos - (e.target.value.length - _value.length), 0);
                e.target.value = _value;
                e.target.maxLength = e.data.max;
                if (e.type != "blur") fnSetCaretPosition(e.target, _pos);
            })
            .on(nsEvents("keydown", "fnNumericInput"), function (e) {
                var _key = (e.which || e.keyCode),
                    _ctrl = !!(e.ctrlKey || e.metaKey);
                // Allow: (numbers), (keypad numbers),
                // Allow: (backspace, tab, delete), (home, end, arrows)
                // Allow: (Ctrl+A), (Ctrl+C), (Ctrl+V), (Ctrl+X)
                return ((_key >= 48 && _key <= 57) || (_key >= 96 && _key <= 105) ||
                         (_key == 8 || _key == 9 || _key == 46) || (_key >= 35 && _key <= 40) ||
                         (_ctrl && _key == 65) || (_ctrl && _key == 67) ||
                         (_ctrl && _key == 86) || (_ctrl && _key == 88));
            });
        });
    };
    //-----------------------------------
    // Sets a mask of allowed characters for the matched elements
    $.fn.fnCustomInput = function (mask) {
        mask = mask instanceof RegExp ? mask : fnEscapeRegExp(mask);
        if (!mask) throw new CustomError("Mask must be RegExp or string");
        if (typeof mask === "string") mask = "[" + mask + "]";
        return this.each(function (i, dom) {
            var len = dom.maxLength;
            dom.maxLength = 524000;
            if (len < 1) len = 524000;
            $(dom).off(".fnCustomInput")
            .on(nsEvents("focus blur input paste", "fnCustomInput"), { max: len }, function (e) {
                var _pos = e.type != "blur" ? fnGetCaretPosition(e.target) : 0,
                    _value = e.target.value,
                    _sel, _pattern, _matched;
                if (e.type == "paste") {
                    _sel = fnGetSelectedText();
                    if (_sel.text !== "") _value = _sel.slice;
                }
                _pattern = new RegExp(mask.source || mask, "gi");
                _matched = _value.match(_pattern);
                _value = !_matched ? "" : _matched.join("").substr(0, e.data.max);
                _pos = Math.max(_pos - (e.target.value.length - _value.length), 0);
                e.target.value = _value;
                e.target.maxLength = e.data.max;
                if (e.type != "blur") fnSetCaretPosition(e.target, _pos);
            })
            .on(nsEvents("keypress", "fnCustomInput"), function (e) {
                var _pattern = new RegExp(mask.source || mask, "i"),
                    _key = (e.which || e.keyCode),
                    _vk = (_key == 8 || _key == 9 || _key == 46 || (_key >= 35 && _key <= 40));
                return _pattern.test(String.fromCharCode(_key)) || _vk;
            });
        });
    };
    //-----------------------------------
    // Prevents press specific keys for the matched elements
    $.fn.fnDisableKey = function (key) {
        if (!key) return this;
        var keys = key.toString().split("");
        keys = keys.filter(function (n){ return (n && n.length); });
        return this.each(function () {
            $(this).off(".fnDisableKey").on(nsEvents("keypress", "fnDisableKey"), function (e) {
                var _key = (e.which || e.keyCode);
                _key = String.fromCharCode(_key);
                return ($.inArray(_key, keys) == -1);
            });
        });
    };
    //-----------------------------------
    // Validates the elements marked or performs a custom validation
    (function () {
        // Creates the filters based on those properties defined in fnIsValidFormat
        var allFilters = $.map(fnIsValidFormat, function (value, key) { return ".vld-" + key; }).join(",");
        // Shows a tooltip for the validation message
        function fnTooltip (dom, event, messageType, pos) {
            var beforeTooltip,
                button = $(event.currentTarget),
                args = { "target": dom, "position": pos };

            //executes a function before displaying the tooltip,
            //useful to change the element to which the tooltip is attached
            beforeTooltip = button.data("nsEvent");
            if (beforeTooltip) button.trigger(beforeTooltip, [args]);

            //removes the validation message when the [blur] event is raised
            $(dom).attr("data-role", "tooltip").trigger("blur.tooltip");
            if (args.target.focus) args.target.focus();

            $('<span class="vld-tooltip">')
            .appendTo(jherax.wrapper)
            .html(messageType)
            .position({
                of: args.target,
                at: args.position.at,
                my: args.position.my,
                collision: args.position.collision
            }).hide().fadeIn(400);
        }
        // Sets the focus on the input elements inside the @container
        function fnSetFocus (container, group) {
            var elements = $(container)
                .find('input:not([type=button]):not([type=submit]), textarea')
                .filter(':not(:disabled):not(.no-auto-focus)').get().reverse();
            $(elements).each(function () {
                if (input.isText(this) && this.getAttribute('data-group') == group) $(this).focus();
            });
        }
        $.fn.fnEasyValidate = function (o) {
            var position = $.extend({
                        at: "right center",
                        my: "left+6 center",
                        collision: "flipfit"
                    }, jherax.settings.position),
                d = $.extend({
                        fnValidator: null,
                        firstItemInvalid: false,
                        container: jherax.wrapper,
                        requiredForm: false,
                        position: position
                    }, o),
                fnValidateFirstItem = function (dom) {
                    if (dom.length === 0) return true;
                    //treat the first item of the <select> element as an invalid option
                    return (d.firstItemInvalid && dom.selectedIndex === 0);
                },
                selector = this.selector;
            // Returns the collection of matching elements
            return this.each(function (index, btn) {
                var evt, handlers;
                if (d.requiredForm && !$(btn).closest("form").length) {
                    fnShowTooltip(btn, _language.validateForm);
                    return true; //continue with next element
                }
                // Delegates the handler to execute a callback before displaying the tooltip,
                // useful to change the element to which show the tooltip against
                if (isFunction(d.fnBeforeTooltip)) {
                    evt = nsEvents("beforeTooltip", "fnEasyValidate-" + index);
                    $(btn).data("nsEvent", evt);
                    $(document).off(evt).on(evt, selector, function (e, args) {
                        //args.target is the DOM element to which the "tooltip" is attached
                        //args.position is the position of "tooltip" { at, my, collision }
                        d.fnBeforeTooltip(args);
                    });
                    evt = null;
                }
                // Each button validates the marked elements according to the specified rules
                $(btn).off(".fnEasyValidate").on(nsEvents("click", "fnEasyValidate"), { handler: "fnEasyValidate" }, function (event) {
                    fnSetFocus(d.container, btn.getAttribute('data-group')); $(btn).focus().blur();
                    $(".vld-tooltip").remove();
                    var _submit = true;

                    // Validates each element according to specific rules
                    $(".vld-required," + allFilters).each(function (i, _dom) {
                        var type, dom, _tag = _dom.nodeName.toLowerCase();
                        // Gets the html5 data- attribute; modern browsers admit: dom.dataset[attribute]
                        if (btn.getAttribute('data-group') !== _dom.getAttribute('data-group')) return true; //continue
                        if (input.isText(_dom)) _dom.value = $.trim(_dom.value);

                        // Validates the elements marked with the css class "vld-required"
                        // Looks for empty <input> elements, <select> elements and those having the [value] attribute equal to "0"
                        if ($(_dom).hasClass("vld-required") && ((_tag == "select" && (fnValidateFirstItem(_dom) || _dom.value === "0")) ||
                            (input.isText(_dom) && !_dom.value.length) || (input.isCheck(_dom) && !_dom.checked) || _tag == "span")) {
                            dom = _dom;
                            // Awful asp.net radiobutton or checkbox
                            if (_tag == "span" || input.isCheck(_dom)) {
                                if (_tag == "input") dom = $(_dom);
                                else dom = $(_dom).find("input:first-child");
                                if (dom.is(":checked") || $('[name="' + dom.attr("name") + '"]').filter(":checked").length) return true; //continue
                                if (_tag == "span") dom.addClass("vld-required");
                                dom = dom.get(0);
                            }
                            fnTooltip(dom, event, _language.validateRequired, d.position);
                            return (_submit = false); //break
                        } //end of "vld-required" elements

                        if (!input.isText(_dom) || !_dom.value.length) return true; //continue
                        // Validates the elements marked with specific formats like "vld-email"
                        for (type in fnIsValidFormat) {
                            if ($(_dom).hasClass("vld-" + type) && !fnIsValidFormat[type](_dom)) {
                                fnTooltip(_dom, event, _language.validateFormat, d.position);
                                return (_submit = false); //break
                            }
                        } //end of specific format validation
                    }); //end $.each field

                    // Executes the callback function for the custom validation
                    if (_submit && isFunction(d.fnValidator) && !d.fnValidator(btn)) {
                        _submit = false;
                    }
                    setWritable($.fn.fnEasyValidate, "canSubmit", _submit);
                    if (!_submit) event.stopImmediatePropagation();
                    return _submit;

                }); //end btn.click

                handlers = ($._data(btn, 'events') || {})["click"];
                // Move at the beginning the click.fnEasyValidate handler
                handlers.unshift(handlers.pop());

            }); //end $.each
        }; //end fnEasyValidate
    })();

    //-----------------------------------
    // Displays a confirm window on click event
    (function () {
        var type = "click",
            pattern = (/(?:^\w+:\/\/[^\s\n]+)[^#]$/);
        function hasValidUrl (href) {
            return !!(href && href.length && pattern.test(href));
        }
        $.fn.fnConfirm = function (o) {
            setWritable($.fn.fnConfirm, "canSubmit", false);
            // Returns the collection of matching elements
            return this.each(function (i, target) {
                var current = {};
                $(target).off(".fnConfirm").on(nsEvents(type, "fnConfirm"), function (e) {
                    current = this;
                    // Allows to the fnEasyValidate function pass through
                    if (handlerExist(current, type, "fnEasyValidate"))
                        setWritable ($.fn.fnConfirm, "canSubmit", !$.fn.fnEasyValidate.canSubmit);
                    if (!$.fn.fnConfirm.canSubmit) {
                        e.stopImmediatePropagation();
                        e.preventDefault();
                        // Executes the callback before the window is displayed
                        if (isFunction(o.beforeShow))
                            o.beforeShow.call(current);
                        // Shows the confirm window
                        fnShowDialog(o);
                    }
                });
                var handlers = ($._data(target, 'events') || {})[type];
                // Move at the beginning the type.fnConfirm handler
                var h = 0, handler = handlers.pop();
                $.each(handlers, function (index, item) {
                    if (item.namespace === "fnEasyValidate") {
                        h = index + 1;
                        return false;
                    }
                });
                handlers.splice(h, 0, handler);
                o.id = 'jsu-dialog-confirm';
                // Creates the buttons for jquery.ui.dialog
                o.buttons = [
                    {
                        text: _language.dialogOK,
                        click: function () {
                            if (hasValidUrl(current.href)) document.location = current.href;
                            $("#" + o.id).on("dialogclose", function (ev, ui) {
                                setWritable($.fn.fnConfirm, "canSubmit", true);
                                // Unbinds  the event handler and triggers the previous actions
                                $(current).off(".fnConfirm").trigger(type);
                                // Triggers the awful asp.net postback
                                if ((/[_]{2}doPostBack/).test(current.href))
                                    setTimeout(current.href.replace(/javascript:/i, ""), 1);
                            }).dialog("close");
                        }
                    },
                    {
                        text: _language.dialogCancel,
                        click: function () {
                            setWritable($.fn.fnConfirm, "canSubmit", false);
                            $("#" + o.id).dialog("close");
                        }
                    }
                ];
            }); //end $.each
        };
    }());

    //===================================
    /* FACADES */
    //===================================

    // Public implementation to display a dialog window
    // It also provides a mechanism for redefinition:
    // fnShowDialog.set("source", callback);
    function fnShowDialog (options) {
        return fnShowDialog.source(options);
    }

    setWritable(fnShowDialog, "source", function () {
        return _fnShowDialog.apply(jherax, arguments);
    });

    Object.defineProperty(fnShowDialog, "set", {
        configurable: false,
        enumerable: true,
        writable: false,
        value: function (property, value) {
            if (!isFunction(value)) return;
            setWritable(this, property, value);
        }
    });

    // Private implementation to display a dialog window
    // Displays a jquery.ui modal window
    // @@Private
    function _fnShowDialog (o) {
        if (!jQuery.ui || !jQuery.ui.dialog)
            throw new CustomError("jQuery.ui.dialog is required");
        var d = $.extend(true, {
                appendTo: jherax.wrapper,
                title: _language.dialogTitle,
                content: null,
                icon: null,
                buttons: {},
                modal: true,
                closeOnPageUnload: false
            }, o),
            cnt = $(),
            body = $('body'),
            id = d.id || 'jsu-dialog',
            icon, cbClose;
        // Set the Id for dialog element
        Object.defineProperty(d, "id", {
            enumerable: false,
            writable: false,
            value: '#' + id
        });
        cbClose = $(d.id).dialog('option')['close'];
        if (isFunction(cbClose)) cbClose();
        //$(d.id + ',.ui-widget-overlay').remove();
        if (!d.content) return;
        if (!$.isPlainObject(d.buttons) && !$.isArray(d.buttons)) d.buttons = {};
        if (d.content instanceof jQuery || 'jquery' in Object(d.content)) cnt = d.content;
        else if (isDOM(d.content)) cnt = $(d.content);
        // Determines the original location for the DOM element to be displayed
        cnt.parent().addClass(id + '-place-parent');
        cnt.prev().addClass(id + '-place-prev');
        cnt.next().addClass(id + '-place-next');
        if (typeof d.content === "string") {
            // Displays an icon to the left of text
            icon = d.icon ? '<div class="wnd-icon ' + d.icon.toLowerCase() + '"></div>' : "";
            cnt = $(icon + '<div class="wnd-text">' + d.content + '</div>').appendTo("body").data("del", true);
            cnt.css({ display: "table-cell", "vertical-align": "middle", cursor: "default" });
        }
        // Wraps the content into the dialog window
        cnt.wrapAll('<div id="' + id + '">')
           .wrapAll('<div class="ui-dialog-custom" style="display:table; margin:0 auto; border-collapse:collapse; border:0 none;">');
        var wnd = $(d.id).appendTo("body"),
            v110 = (/^1\.1[0-9]/).test(jQuery.ui.version);
        if (!+o.width) d.width = wnd.find('.ui-dialog-custom')[0].clientWidth;
        // Determines whether the dialog should be closed when the page is unloaded
        if (d.closeOnPageUnload === true) wnd.attr("data-dialog-unload", true);
        if (!handlerExist(window, "beforeunload", "fnShowDialog")) {
            $(window).on(nsEvents("beforeunload", "fnShowDialog"), function () {
                $("[data-dialog-unload]").each(function () {
                    $(this).dialog("close");
                });
            });
        }
        // Closes the window for those elements with the "close-dialog" class
        wnd.one("click.dialog", '.close-dialog', function (e) {
            e.preventDefault();
            $(e.delegateTarget).dialog("close");
        });
        // Check the version of jquery.ui for "appendTo" feature
        body.css("overflow", "hidden");
        wnd.dialog({
            title: d.title,
            draggable: true,
            resizable: false,
            modal: !!d.modal,
            hide: 'drop',
            show: 'fade',
            maxHeight: +d.maxHeight || Math.floor($(window).height() * 0.86),
            minHeight: +d.minHeight || 50,
            height: d.height || 'auto',
            maxWidth: +d.maxWidth || 1024,
            minWidth: +d.minWidth || 150,
            width: +d.width,
            buttons: d.buttons,
            appendTo: d.appendTo,
            create: function (event, ui) {
                var wnd = $(this);
                if (!+o.width) {
                    // Fixes the width of the window
                    var width = wnd.dialog("option", "width"),
                        maxwidth = wnd.dialog("option", "maxWidth"),
                        padding = Math.round(parseFloat(wnd.css("padding-left"))) * 2;
                    wnd.dialog("option", "width", Math.min(width, maxwidth) + padding);
                }
                if (!v110) {
                    // Add "appendTo" feature if it is not supported
                    wnd.css("max-height", wnd.dialog("option", "maxHeight"))
                    .closest(".ui-dialog").add(".ui-widget-overlay").appendTo(d.appendTo);
                }
            },
            open: function (event, ui) {
                var wnd = $(event.target), width, zindex;
                // Fixes the width of the window with scrollbar
                if (!+o.width && wnd.hasVScroll()) {
                    width = wnd.dialog("option", "width");
                    wnd.dialog("option", "width", width + fnScrollbarWidth());
                }
                // Honor z-index for $.fnConfirm
                if (this.id === 'jsu-dialog-confirm') {
                    zindex = +$(".ui-dialog").css("z-index") + 1;
                    wnd.closest(".ui-dialog").css("z-index", zindex);
                }
            },
            close: function (event, ui) {
                var wnd = $(event.target);
                body.css("overflow", "");
                if (wnd.hasClass("ui-dialog-content")) {
                    wnd.dialog("destroy");
                    if (cnt.data("del")) wnd.remove();
                    else {
                        cnt.unwrap().unwrap();
                        // Restores the DOM element to its original location
                        $("[class*=" + id + "]").reverse().each(function () {
                            var dom = $(this),
                                css = new RegExp("^" + id + "-place-"),
                                place = this.className.split(/\s+/).filter(function (item) {
                                    return css.test(item);
                                }).join(" ");
                            if ((/next/).test(place)) return !dom.before(cnt);
                            if ((/prev/).test(place)) return !dom.after(cnt);
                            if ((/parent/).test(place)) return !dom.append(cnt);
                        }).removeClass(["", "next", "prev", "parent"].join(" " + id + "-place-"));
                    }
                }
            }
        });
        return wnd;
    }

    //===================================
    /* PUBLIC API */
    //===================================

    jherax.bool = bool; //undocumented
    jherax.browser = browser;
    jherax.isDOM = isDOM;
    jherax.isFunction = isFunction;
    jherax.fnStringify = fnStringify;
    jherax.sortBy = sortBy; //undocumented
    jherax.inputType = input;
    jherax.handlerExist = handlerExist;
    jherax.nsEvents = nsEvents;
    jherax.fnAddScript = fnAddScript;
    jherax.fnAddCSS = fnAddCSS;
    jherax.fnEscapeRegExp = fnEscapeRegExp;
    jherax.fnGetQueryToString = fnGetQueryToString;
    jherax.fnGetQueryToObject = fnGetQueryToObject;
    jherax.fnGetDataToObject = fnGetDataToObject; //undocumented
    jherax.fnFreezeObject = fnFreezeObject;
    jherax.fnExtend = fnExtend; //undocumented
    jherax.fnGetDate = fnGetDate;
    jherax.fnDateFromISO8601 = fnDateFromISO8601;
    jherax.fnGetHtmlText = fnGetHtmlText;
    jherax.fnGetSelectedText = fnGetSelectedText;
    jherax.fnGetCaretPosition = fnGetCaretPosition;
    jherax.fnSetCaretPosition = fnSetCaretPosition;
    jherax.fnCapitalize = fnCapitalize;
    jherax.fnNumericFormat = fnNumericFormat;
    jherax.fnIsValidFormat = fnIsValidFormat;
    jherax.fnIsValidDate = fnIsValidDate;
    jherax.fnShowTooltip = fnShowTooltip;
    jherax.fnShowDialog = fnShowDialog;
    jherax.fnLoading = fnLoading;
    jherax.fnScrollbarWidth = fnScrollbarWidth;
    jherax.fnUpdateCache = fnUpdateCache; //undocumented

    //Provide compatibility with older versions
    jherax.fnGetQueryToJSON = function () {
        deprecated("fnGetQueryToJSON", "fnGetQueryToObject");
        return fnGetQueryToObject.apply(this, arguments);
    };
    jherax.fnGetDataToJSON = function () {
        deprecated("fnGetDataToJSON", "fnGetDataToObject");
        return fnGetDataToObject.apply(this, arguments);
    };
    jherax.fnCloneObject = function () {
        deprecated("fnCloneObject", "fnFreezeObject");
        return fnFreezeObject.apply(this, arguments);
    };

}(window, jQuery, jsu));
/*
//-----------------------------------
// Enables Cross Domain Requests
// http://api.jquery.com/jquery.ajaxprefilter/
$.ajaxPrefilter(function (options) {
    if (options.crossDomain && $.support.cors) {
        var http = (window.location.protocol === 'http:' ? 'http:' : 'https:'),
            url = options.url; //encodeURIComponent(options.url);
        options.url = http + '//cors-anywhere.herokuapp.com/' + url;
        //options.url = "http://cors.corsproxy.io/url=" + url;
        //options.crossDomain = false;
    }
});
*/
