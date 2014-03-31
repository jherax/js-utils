//**********************************
//  JavaScript Utilities for Validation
//  Author: David Rivera
//  Created: 26/06/2013
//  Version: 2.3.5
//**********************************
// http://jherax.github.io
// http://github.com/jherax/js-utils
//**********************************
// Has dependency on jQuery
// http://jquery.com/
//**********************************
// Copyright 2013, 2014 Jherax
// Released under the MIT license
;
// Essential JavaScript Namespacing Patterns
// http://addyosmani.com/blog/essential-js-namespacing

// We need to do a check before we create the namespace
var jsu = window.jsu || {
    author: "jherax",
    version: "2.3.5",
    dependencies: ["jQuery","jQuery.ui","jherax.css"]
};
// Specifies where tooltip and dialog elements will be appended
jsu.wrapper = "body"; //#main-section

// We provide encapsulation for global scope
(function() {
    // Create a custom exception notifier
    var CustomException = function(message) {
        for (var i = 1; i < arguments.length; i++)
            message = message.replace(new RegExp("\\{" + (i - 1) + "}"), arguments[i]);
        this.name = "js-utils exception";
        this.message = message || "An error has occurred";
        this.toString = function() {
            return this.name + ": " + this.message;
        };
    };
    if (jsu.author != 'jherax') {
        throw new CustomException("A variable with namespace [jsu] is already in use");
    }
    // Fixes unsupported Object.create() method on IE
    Object.create || (Object.create = function(o) {
        function F(){}
        F.prototype = o;
        return new F();
    });
    // Create a general purpose namespace method
    jsu.createNS || (jsu.createNS = function(namespace) {
        var nsparts = namespace.toString().split(".");
        var cparent = window;
        // we want to be able to include or exclude the root namespace so we strip it if it's in the namespace
        if (nsparts[0] === "window") nsparts = nsparts.slice(1);
        // loop through the parts and create a nested namespace if necessary
        for (var i = 0; i < nsparts.length; i++) {
            var subns = nsparts[i];
            // check if the namespace is a valid variable name
            if (!(/^[A-Za-z_]\w+/).test(subns)) throw new CustomException("Invalid namespace");
            // check if the current parent already has the namespace declared
            // if it isn't, then create it
            if (typeof cparent[subns] === "undefined") {
                cparent[subns] = {};
            }
            cparent = cparent[subns];
        }
        // the parent is now constructed with empty namespaces and can be used.
        // we return the outermost namespace
        return cparent;
    });

    //-----------------------------------
    // Immediately-invoked Function Expressions (IIFE)
    // We pass the namespace as an argument to a self-invoking function.
    // jherax is the local namespace context, and $ is the jQuery object
    (function(jherax, $) {
        //-----------------------------------
        /* PUBLIC API */
        //-----------------------------------
        // Creates the messages for specific culture
        jherax.spanish = {
            culture: "es",
            wordPattern: /\s(?:Y|O|Del?|Por|Al?|L[ao]s?|[SC]on|En|Se|Que|Una?)\b/g,
            timeFormat: "HH:mm",
            dateFormat: "dd/MM/yyyy",
            dateFormatError: "El formato de fecha es incorrecto",
            dateIsGreater: "La fecha no puede ser mayor a hoy",
            dateIsLesser: "La fecha no puede ser menor a hoy",
            validateForm: "El botón debe estar dentro de un formulario",
            validateRequired: "Este campo es requerido",
            validateFormat: "El formato es incorrecto",
            dialogTitle: "Información",
            dialogCancel: "Cancelar",
            dialogOK: "Aceptar"
        };
        jherax.english = {
            culture: "en",
            wordPattern: null,
            timeFormat: "HH:mm",
            dateFormat: "MM/dd/yyyy",
            dateFormatError: "The date format is incorrect",
            dateIsGreater: "The date can't be greater than today",
            dateIsLesser: "The date can't be lesser than today",
            validateForm: "The button must be inside a form",
            validateRequired: "This field is required",
            validateFormat: "The format is incorrect",
            dialogTitle: "Information",
            dialogCancel: "Cancel",
            dialogOK: "Agree"
        };
        //-----------------------------------
        // You can add more languages using $.extend
        jherax.current = $.extend({}, jherax.spanish);
        
        //-----------------------------------
        // Creates culture for jquery.ui datepicker
        (function() {
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
        })();
        //-----------------------------------
        // Sets the default language configuration
        jherax.set = function(obj, fnSetCustom) {
            $.extend(jherax.current, obj);
            // This code segment must be called before the plugin initialization
            // You can find more languages: [http://github.com/jquery/jquery-ui/tree/master/ui/i18n]
            if ($.datepicker) { $.datepicker.setDefaults($.datepicker.regional[jherax.current.culture]); }
            if ($.timepicker) { $.timepicker.setDefaults($.timepicker.regional[jherax.current.culture]); }
            if ($.isFunction(fnSetCustom)) fnSetCustom();
        };
    })(jsu.createNS("jsu.regional"), jQuery);
    // Create the namespace for languages

    //-----------------------------------
    // Immediately-invoked Function Expressions (IIFE)
    // We pass the namespace as an argument to a self-invoking function.
    // jherax is the local namespace context, and $ is the jQuery object
    (function(jherax, $, undefined) {
        //-----------------------------------
        /* PRIVATE MEMBERS */
        //-----------------------------------
        // Sets the default language configuration
        jsu.regional.set(jsu.regional.spanish);
        var _language = Object.create(jsu.regional.current);
        //-----------------------------------
        // Returns the boolean value of the parameter
        var bool = function(value) {
            return (/true/i).test(value);
        };
        //-----------------------------------
        // Adds support for browser detect.
        // jquery 1.9+ deprecates $.browser
        var browser = (function() {
            var ua = navigator.userAgent.toLowerCase();
            var match =
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
            return b;
        })();
        //-----------------------------------
        // Determines whether entry parameter is a writable or checkable <input>
        // http://www.quackit.com/html_5/tags/html_input_tag.cfm
        var input = {
            isText: function(_dom) {
                if(!isDOM(_dom)) return false;
                if ((/textarea/i).test(_dom.nodeName)) return true;
                var regx = /text|password|file|number|search|tel|url|email|datetime|datetime-local|date|time|month|week/i;
                return regx.test(_dom.type) && (/input/i).test(_dom.nodeName);
            },
            isCheck: function(_dom) {
                if(!isDOM(_dom)) return false;
                var regx = /checkbox|radio/i;
                return regx.test(_dom.type) && (/input/i).test(_dom.nodeName);
            }
        };
        //-----------------------------------
        // Determines if an event handler was created previously by specifying a namespace
        var handlerExist = function(dom, eventName, namespace) {
            var handler = ($._data(dom, 'events') || {})[eventName] || [];
            for (var h = 0; h < handler.length; h++) {
                if (handler[h].namespace === namespace || (handler[h].data || {}).handler === namespace) return true;
            }
            return false;
        };
        //-----------------------------------
        // Utility to create namespaced events
        var nsEvents = function(eventName, namespace) {
            namespace = "." + namespace;
            eventName = $.trim(eventName) + namespace;
            return eventName.replace(" ", namespace + " ");
        };
        //-----------------------------------
        // Determines if the entry parameter is a DOM element
        var isDOM = function(obj) {
            return (!!obj && typeof obj === "object" && !!obj.nodeType);
        };
        //-----------------------------------
        // Determines if the entry parameter is a function
        var isFunction = $.isFunction || function(obj) {
            return (!!obj && Object.prototype.toString.call(obj) == '[object Function]');
        };
        //-----------------------------------
        // Fix: failed to read the 'selectionStart' property from 'HTMLInputElement'
        // Second parameter provides a callback to execute additional instructions
        // http://www.whatwg.org/specs/web-apps/current-work/multipage/the-input-element.html#input-type-attr-summary
        var fixSelection = function(dom, fn) {
            var ok = (/text|search|password|url|tel/).test(dom.type);
            var selection = { 
                start: ok ? dom.selectionStart : 0,
                end: ok ? dom.selectionEnd : 0
            };
            if (ok && isFunction(fn)) fn(dom);
            return selection;
        };
        //-----------------------------------
        // This is a reference to JSON.stringify and provides a polyfill for old browsers
        var fnStringify = typeof JSON !== undefined ? JSON.stringify : function(json) {
            var arr = [];
            $.each(json, function(key, val) {
                var prop = "\"" + key + "\":";
                prop += ($.isPlainObject(val) ? fnStringify(val) : 
                    (typeof val === "string" ? "\"" + val + "\"" : val));
                arr.push(prop);
            });
            return "{" + arr.join(",") + "}";
        };
        //-----------------------------------
        // Dynamically add an external script
        function fnAddScript(path, before) {
            var o = $.extend({
                src: null,
                async: false,
                defer: false,
                charset: null,
                before: before || "jherax.js"
            }, $.isPlainObject(path) ? path : { src: path });
            before = new RegExp(fnEscapeRegExp(o.before));
            var js = document.createElement('script');
            js.type = 'text/javascript';
            js.src = o.src;
            if (o.async) js.async = true;
            if (o.defer) js.defer = true;
            if (o.charset) js.charset = o.charset;
            var s = document.getElementsByTagName('script');
            for (var i = 0; i < s.length; i++) {
                if (before.test(s[i].src)) {
                    s[i].parentNode.insertBefore(js, s[i]);
                    break;
                }
            }
        }
        //-----------------------------------
        // Dynamically add an external stylesheet
        function fnAddCSS(path, before) {
            before = fnEscapeRegExp(before);
            if (before) before = new RegExp(before);
            var lnk = document.createElement('link');
            lnk.rel = 'stylesheet';
            lnk.type = 'text/css';
            lnk.href = path;
            if (!before) {
                document.getElementsByTagName('head')[0].appendChild(lnk);
                return;
            }
            var css = document.getElementsByTagName('link');
            for (var i = 0; i < css.length; i++) {
                if (before.test(css[i].href)) {
                    css[i].parentNode.insertBefore(lnk, css[i]);
                    break;
                }
            }
        }
        //-----------------------------------
        // Escapes user input to be treated as a literal string in a regular expression
        function fnEscapeRegExp(txt) {
            if (typeof txt !== "string") return null;
            return txt.replace(/([.*+?=!:${}()|\^\[\]\/\\])/g, "\\$1");
        }
        //-----------------------------------
        // Gets the value of a specific parameter in the querystring
        function fnGetQueryToString(q) {
            if (!q || q === "") return "";
            var m = window.location.search.match(new RegExp("(" + q.toString() + ")=([^&]+)"));
            return m && m[2] || "";
        }
        //-----------------------------------
        // Gets the querystring from address bar and is returned as a JSON object
        function fnGetQueryToJSON(q) {
            var params = {};
            q = !q ? "" : q.toString();
            $.each(window.location.search.split(/[\?&]/g),
                function (i, item) {
                    var m = item.match(/(\w+)=([^&]+)/);
                    if (!m) return true;
                    if (q === "" || q.indexOf(m[1]) > -1) {
                        params[$.trim(m[1])] = m[2];
                    }
                });
            //encodeURIComponent()
            return params;
        }
        //-----------------------------------
        // Converts an inconsistent JSON string to its object representation
        function fnGetDataToJSON(data) {
            var params = {};
            var parser = function(value) {
                if (+value) return +value;
                if ((/true/i).test(value)) return true;
                if ((/false/i).test(value)) return false;
                if ((/null/i).test(value)) return null;
                return value;
            };
            data = !data ? "" : data.toString();
            $.each(data.split(/[\{\},]/g),
                function (i, item) {
                    var m = item.match(/['"]?(\w+)['"]?:['"]?([^'"]+)/);
                    if (!m) return true;
                    params[$.trim(m[1])] = parser(m[2]);
                });
            return params;
        }
        //-----------------------------------
        // Clone an object and set all its properties to read-only
        function fnCloneObject(obj) {
            var n = {};
            for (var p in obj) {
                Object.defineProperty(n, p, {
                    __proto__: null, //no inherited properties
                    configurable: false,
                    enumerable: true,
                    writable: false,
                    value: $.isPlainObject(obj[p]) ? fnCloneObject(obj[p]) : obj[p]
                });
            }
            return n;
        }
        //-----------------------------------
        // Gets the string representation of the specified date according to regional setting.
        // Allows ISO 8601 formats: [YYYY-MM-DD] and [YYYY-MM-DDThh:mm]
        function fnGetDate(o) {
            o = $.extend({ ISO8601: false }, o);
            if (typeof o.date === "string" && /Date/.test(o.date))
                o.date = +o.date.replace(/\D+/g, "");
            var f = o.date ? new Date(o.date) : new Date();
            if(!f.getDate()) throw new CustomException("Invalid Date: {0}", o.date);
            var fillZero = function(n) { return ("0" + n.toString()).slice(-2); };
            var fnDate = function() {
                return (o.ISO8601 ? "yyyy-MM-dd" : _language.dateFormat).replace(/[dMy]+/g, function(m) {
                    switch (m.toString()) {
                        case "dd": return fillZero(f.getDate());
                        case "MM": return fillZero(f.getMonth() + 1);
                        case "yyyy": return f.getFullYear();
                    }
                });
            };
            var fnTime = function() {
                return (o.ISO8601 ? "HH:mm" : _language.timeFormat).replace(/[Hhms]+/g, function(m) {
                    var h = f.getHours();
                    switch (m.toString()) {
                        case "HH": return fillZero(f.getHours());
                        case "hh": return fillZero(h === 12 ? 12 : h % 12);
                        case "mm": return fillZero(f.getMinutes());
                        case "ss": return fillZero(f.getSeconds());
                    }
                });
            };
            var fnDateTime = function() { return fnDate() + (o.ISO8601 ? "T" : " ") + fnTime(); };
            // Public API
            return {
                date: fnDate(),
                time: fnTime(),
                dateTime: fnDateTime()
            };
        }
        //-----------------------------------
        // Gets the date object from a string in ISO 8601 format
        function fnDateFromISO8601(date) {
            var msg = function() {
                return !!console.log("js-utils: Date format must be ISO 8601 » " + date) || null;
            };
            if (typeof date !== "string") return msg();
            var m = date.match(/(\d{4}-\d{2}-\d{2})(T(\d{2}\:\d{2}(?:\:\d{2})?)?([+-]\d{2}\:\d{2})?)?/);
            return m ? new Date(m[1].replace("-", "/") + " " + (m[3] || "")) : msg();
        }
        //-----------------------------------
        // Gets the text as encoded html
        // This is a delegate for $.val()
        function fnGetHtmlText(i, value) {
            if (!value && typeof i === "string") value = i;
            var html = $("<div>").text(value).html();
            return $.trim(html);
        }
        //-----------------------------------
        // Gets selected text in the document
        function fnGetSelectedText() {
            var _dom = document.activeElement;
            var _sel = { text: "", slice: "", start: -1, end: -1 };
            if (window.getSelection) {
                // Get selected text from input fields
                if (input.isText(_dom)) {
                    var selection = fixSelection(_dom);
                    _sel.start = selection.start;
                    _sel.end = selection.end;
                    if (_sel.end > _sel.start) {
                        _sel.text = _dom.value.substring(_sel.start, _sel.end);
                        _sel.slice = _dom.value.slice(0, _sel.start) + _dom.value.slice(_sel.end);
                    }
                }
                // Get selected text from document
                else _sel.text = window.getSelection().toString();
            } else if (document.selection.createRange)
                _sel.text = document.selection.createRange().text;
            if (_sel.text !== "") _sel.text = $.trim(_sel.text);
            return _sel;
        }
        //-----------------------------------
        // Gets the cursor position of DOM element
        function fnGetCaretPosition(dom) {
            if ('selectionStart' in dom) {
                return fixSelection(dom).start;
            } else { // IE below version 9
                var _sel = document.selection.createRange();
                _sel.moveStart('character', -dom.value.length);
                return (_sel.text.length);
            }
        }
        //-----------------------------------
        // Sets the position of the cursor in the DOM element
        function fnSetCaretPosition(dom, pos) {
            if ('selectionStart' in dom) {
                fixSelection(dom, function(_input) {
                    _input.setSelectionRange(pos, pos);
                });
            } else { // IE below version 9
                var range = dom.createTextRange();
                range.collapse(true);
                range.moveEnd('character', pos);
                range.moveStart('character', pos);
                range.select();
            }
        }
        //-----------------------------------
        // Applies a transformation to text,
        // also removes all consecutive spaces
        function fnCapitalize(obj, _type) {
            var _isDOM = input.isText(obj),
                _text = _isDOM ? obj.value : obj.toString();
            if (!_text || _text.length === 0) return "";
            if ((/textarea/i).test(obj.nodeName)) {
                _text = _text.replace(/\r|\n/g, "¶").replace(/\s{2,}/g, " ");
                while ((/^[¶\s]|[¶\s]$/g).test(_text))
                    _text = _text.replace(/^[¶\s]+|[¶\s]+$/g, "");
                _text = _text.replace(/\s*¶+\s*/g, "\n");
            }
            else _text = $.trim(_text.replace(/\s{2,}/g, " "));
            if (parseFloat(_text) === 0) _text = "0";
            if (_type == "word" || _type == "lower") _text = _text.toLowerCase();
            if (_type == "word" || _type == "title") _text = _text.replace(/(?:^|-|:|;|\s|\.|\(|\/)[a-záéíóúüñ]/g, function(m) { return m.toUpperCase(); });
            if (_type == "word" && _language.wordPattern instanceof RegExp) _text = _text.replace(_language.wordPattern, function(m) { return m.toLowerCase(); });
            if (_type == "first") _text = _text.replace(/^\w/, _text.charAt(0).toUpperCase());
            if (_type == "upper") _text = _text.toUpperCase();
            if (_isDOM) obj.value = _text;
            return _text;
        }
        //-----------------------------------
        // Sets the numeric format according to es-CO culture.
        // Places the decimal "." and thousand "," separator
        function fnNumericFormat(obj) {
            var _isDOM = input.isText(obj),
                _text = _isDOM ? obj.value : obj.toString();
            var x = _text.replace(/\./g, "").split(",") || [""];
            var num = x[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            var dec = x.length > 1 ? "," + x[1] : "";
            if (_isDOM) obj.value = num + dec;
            return (num + dec);
        }
        //-----------------------------------
        // Validates the text format, depending on the type supplied.
        // Date validations are run according to regional setting
        function fnIsValidFormat(obj, _type) {
            var _pattern = null,
                _text = input.isText(obj) ? obj.value : obj.toString();
            var _formatter = function(format) {
                return "^" +
                fnEscapeRegExp(format).replace(/[dMyHhms]+/g, function(m) {
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
            };
            switch (_type) {
                case "d": //Validates Date format according to regional setting
                    _pattern = new RegExp(_formatter(_language.dateFormat));
                    break;
                case "t": //Validates Time format: HH:mm:ss
                    _pattern = /^([0-1][0-9]|[2][0-3]):([0-5][0-9])(?::([0-5][0-9])){0,1}$/;
                    break;
                case "dt": //Validates DateTime format according to regional setting
                    _pattern = new RegExp(_formatter(_language.dateFormat + " " + _language.timeFormat));
                    break;
                case "email": //Validates an email address
                    _pattern = /^([0-9a-zA-Zñ](?:[\-.\w]*[0-9a-zA-Zñ])*@(?:[0-9a-zA-Zñ][\-\wñ]*[0-9a-zA-Zñ]\.)+[a-zA-Z]{2,9})$/i;
                    break;
                case "pass": //Validates the password strength (must have 8-20 characters, 1+ number, 1+ uppercase)
                    _pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/;
                    break;
                case "lat": //Validates the latitude
                    _pattern = /^-?([1-8]?[1-9]|[1-9]0|0)\,{1}\d{1,6}$/;
                    break;
                case "lon": //Validates the longitude
                    _pattern = /^-?([1]?[1-7][1-9]|[1]?[1-8][0]|[1-9]?[0-9])\,{1}\d{1,6}$/;
                    break;
            }
            return !!_pattern && _pattern.test(_text);
        }
        //-----------------------------------
        // Evaluates whether the input value is a date or not.
        // The validation result will be shown in a tooltip
        function fnIsValidDate(_dom, o) {
            if (!input.isText(_dom)) return false;
            o = $.extend({
                isFuture: false,
                compareTo: new Date(),
                warning: null }, o);
            var error = false,
                _type = _dom.value.length > 10 ? "dt" : "d";
            var parser = function(date) {
                if (date instanceof Date) return date;
                if (typeof date !== "string") return new Date();
                if (!fnIsValidFormat(date, _type)) { error = true; return new Date(); }
                var d = date.split(/\D/); date = "y/M/d";
                var p = _language.dateFormat.split(/[^yMd]/);
                for (var x = 0; x < p.length; x++) {
                    if ((/y+/).test(p[x])) date = date.replace("y", d[x]);
                    if ((/M+/).test(p[x])) date = date.replace("M", d[x]);
                    if ((/d+/).test(p[x])) date = date.replace("d", d[x]);
                }
                d.splice(0, 3);
                return new Date(date +" "+ d.join(":"));
            };
            var dif = (parser(_dom.value) - parser(o.compareTo)) / 1000 / 3600 / 24;
            if (error) return fnShowTooltip(_dom, _language.dateFormatError);
            if ( o.isFuture && dif < 0) return fnShowTooltip(_dom, o.warning || _language.dateIsLesser);
            if (!o.isFuture && dif > 0) return fnShowTooltip(_dom, o.warning || _language.dateIsGreater);
            return true;
        }
        //-----------------------------------
        // Displays a tooltip next to DOM element
        function fnShowTooltip(_dom, _msg, _pos) {
            if (isDOM(_dom)) _dom = $(_dom);
            _pos = $.extend({
                at: "right center",
                my: "left+6 center"
            }, _pos);
            // Checks if the event handler was defined previously
            var defined = handlerExist(_dom, "blur", "fnShowTooltip");
            // Creates the event handler to manage the "blur" event on the current element
            !defined && _dom.on(nsEvents("blur", "fnShowTooltip"), { handler: "fnShowTooltip" },
                function() { $(".vld-tooltip").remove(); });
            var vld = $('<span class="vld-tooltip">' + _msg + '</span>');
            vld.appendTo(jsu.wrapper).position({
                of: _dom,
                at: _pos.at,
                my: _pos.my,
                collision: "flipfit"
            }).hide().fadeIn(400);
            _dom.focus();
            return false;
        }
        //-----------------------------------
        // Shows the loading overlay screen
        function fnLoading(o) {
            var d = $.extend({
                show: true,
                hide: false,
                delay: 2600,
                at: null
            }, o);
            $("#floatingBarsG,#backBarsG").remove();
            var target = $(d.at || jsu.wrapper);//.css("overflow", "auto");
            if (d.hide) return true;
            var blockG = [];
            for (var i = 1; i < 9; i++) blockG.push('<div class="blockG"></div>');
            var loading = $('<div id="floatingBarsG">').append(blockG.join(""));
            var overlay = $('<div id="backBarsG" class="bg-fixed bg-opacity">');
            if (d.at) overlay.css('border-radius', $(d.at).css('border-radius'));
            //target.css("overflow", "hidden");
            overlay.add(loading).appendTo(target).hide().fadeIn(d.delay);
            loading.fnCenter({ at: d.at });
            return true;
        }
        //-----------------------------------
        // Sets the focus on input elements
        function fnSetFocus() {
            $($('input[type="text"], textarea').filter(':not(input:disabled)').get().reverse()).each(function() {
                if (!$(this).hasClass("no-auto-focus")) $(this).focus();
            });
        }

        //-----------------------------------
        /* jQUERY EXTENSIONS */
        //-----------------------------------
        // Position an element relative to another element
        (function() {
            // http://api.jqueryui.com/position/
            if (jQuery.ui && jQuery.ui.position) return;
            var _position = $.fn.position,
                rhorizontal = /left|center|right/,
                rvertical = /top|center|bottom/,
                roffset = /([a-z]+)([+-]\d+)?\s?([a-z]+)?([+-]\d+)?/; //brings 4 groups: (horizontal)(offset) (vertical)(offset)
            //normalizes "horizontal vertical" alignment
            var setAlignment = function(pos) {
                pos = $.trim(pos);
                var horizontal = rhorizontal.test(pos),
                    vertical = rvertical.test(pos);
                if (!horizontal && !vertical)
                    return "center center";
                if (!(/\s/).test(pos)) {
                    if (!horizontal) return "center " + pos;
                    if (!vertical) return pos + " center";
                }
                return (pos === "center" ? "center center" : pos);
            };
            $.fn.position = function(o) {
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
                    atOffset = (o.at).match(roffset),
                    myOffset = (o.my).match(roffset);
                //sets the coordinates relative to target element
                var atPosition = (function() {
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
                //sets the coordinates according to current element
                var myPosition = function(element) {
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
                return this.each(function(i, dom) {
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
        // Sets the jquery objects in the center of screen
        $.fn.fnCenter = function(o) {
            o = $.extend({}, o);
            if (o.at) {
                return this.position({
                    my: "center",
                    at: "center",
                    of: o.at
                });
            } else {
                return this.each(function(i, dom) {
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
        $.fn.fnMaxLength = function(length, o) {
            o = $.extend({}, o);
            return this.each(function(i, dom) {
                var count = "Max: " + length;
                var vld = '#max' + dom.id;
                if (!input.isText(dom)) return true; //continue
                $(dom).off(".fnMaxLength")
                .on(nsEvents("blur", "fnMaxLength"), function() { $(vld).remove(); })
                .on(nsEvents("keypress input paste", "fnMaxLength"), function(e) {
                    var len = dom.value.length;
                    var max = len >= length ? 1 : 0;
                    if (browser.mozilla) max = !e.keyCode && max;
                    if (max) {
                        len = length;
                        dom.value = dom.value.substr(0, len);
                        e.preventDefault();
                    }
                    count = "Max: " + len + "/" + length;
                    if(!$(vld).text(count).length) {
                        $('<span class="vld-tooltip" id="max' + dom.id + '">')
                        .text(count).appendTo(jsu.wrapper).position({
                            of: dom,
                            at: o.at || "right bottom",
                            my: o.my || "right top+6",
                            collision: o.collision || "flipfit"
                        }).hide().fadeIn(400);
                    }
                });
            });
        };
        //-----------------------------------
        // Apply the capitalized format to text when blur event occurs
        $.fn.fnCapitalize = function(type) {
            return this.each(function(i, dom) {
                $(dom).off(".fnCapitalize").on(nsEvents("blur", "fnCapitalize"), function() {
                    fnCapitalize(this, type);
                });
            });
        };
        //-----------------------------------
        // Displays a tooltip next to DOM element
        $.fn.fnShowTooltip = function(msg, pos) {
            return this.each(function(i, dom) {
                fnShowTooltip(dom, msg, pos);
            });
        };
        //-----------------------------------
        // Validates the format of first element, depending on the type supplied.
        // Date validations are run according to regional setting
        $.fn.fnIsValidFormat = function(type) {
            return fnIsValidFormat(this.get(0), type);
        };
        //-----------------------------------
        // Evaluates whether the input value is a date or not.
        // The validation result will be shown in a tooltip
        $.fn.fnIsValidDate = function(o) {
            return fnIsValidDate(this.get(0), o);
        };
        //-----------------------------------
        // Sets numeric format with decimal/thousand separators
        $.fn.fnNumericFormat = function() {
            return this.each(function(i, dom) {
                $(dom).off(".fnNumericFormat").on(nsEvents("keyup blur", "fnNumericFormat"), function() {
                    fnNumericFormat(this);
                });
            });
        };
        //-----------------------------------
        // Allows only numeric characters
        $.fn.fnNumericInput = function() {
            return this.each(function(i, dom) {
                var len = dom.maxLength;
                dom.maxLength = 524000;
                if (len < 1) len = 524000;
                $(dom).off(".fnNumericInput")
                .on(nsEvents("focus blur input paste", "fnNumericInput"), { max: len }, function(e) {
                    var _pos = e.type != "blur" ? fnGetCaretPosition(e.target) : 0;
                    var _value = e.target.value;
                    if (e.type == "paste") {
                        var _sel = fnGetSelectedText();
                        if (_sel.text !== "") _value = _sel.slice;
                    }
                    var _digits = _value.match(/\d/g);
                    _value = !_digits ? "" : _digits.join("").substr(0, e.data.max);
                    if (e.type == "blur" && parseFloat(_value) === 0) _value = "0";
                    _pos = Math.max(_pos - (e.target.value.length - _value.length), 0);
                    e.target.value = _value;
                    e.target.maxLength = e.data.max;
                    if (e.type != "blur") fnSetCaretPosition(e.target, _pos);
                })
                .on(nsEvents("keydown", "fnNumericInput"), function(e) {
                    var _key = e.which || e.keyCode;
                    var _ctrl = !!(e.ctrlKey || e.metaKey);
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
        // Sets a mask for the allowed characters
        $.fn.fnCustomInput = function(mask) {
            mask = mask instanceof RegExp ? mask : fnEscapeRegExp(mask);
            if (!mask) throw new CustomException("Mask must be RegExp or string");
            if (typeof mask === "string") mask = "[" + mask + "]";
            return this.each(function(i, dom) {
                var len = dom.maxLength;
                dom.maxLength = 524000;
                if (len < 1) len = 524000;
                $(dom).off(".fnCustomInput")
                .on(nsEvents("focus blur input paste", "fnCustomInput"), { max: len }, function(e) {
                    var _pos = e.type != "blur" ? fnGetCaretPosition(e.target) : 0;
                    var _value = e.target.value;
                    if (e.type == "paste") {
                        var _sel = fnGetSelectedText();
                        if (_sel.text !== "") _value = _sel.slice;
                    }
                    var _pattern = new RegExp(mask.source || mask, "gi");
                    var _matched = _value.match(_pattern);
                    _value = !_matched ? "" : _matched.join("").substr(0, e.data.max);
                    _pos = Math.max(_pos - (e.target.value.length - _value.length), 0);
                    e.target.value = _value;
                    e.target.maxLength = e.data.max;
                    if (e.type != "blur") fnSetCaretPosition(e.target, _pos);
                })
                .on(nsEvents("keypress", "fnCustomInput"), function(e) {
                    var _pattern = new RegExp(mask.source || mask, "i");
                    var _key = e.which || e.keyCode;
                    var _vk = (_key == 8 || _key == 9 || _key == 46 || (_key >= 35 && _key <= 40));
                    return _pattern.test(String.fromCharCode(_key)) || _vk;
                });
            });
        };
        //-----------------------------------
        // Disables the specified keyboard keys.
        // To allow a set of keys, better use $.fnCustomInput
        $.fn.fnDisableKey = function(key) {
            if (!key) return this;
            var keys = key.toString().split("");
            keys = keys.filter(function(n){ return (n && n.length); });
            return this.each(function() {
                $(this).off(".fnDisableKey").on(nsEvents("keypress", "fnDisableKey"), function(e) {
                    var _key = e.which || e.keyCode;
                    _key = String.fromCharCode(_key);
                    return $.inArray(_key, keys) == -1;
                });
            });
        };
        //-----------------------------------
        // Validates the required form fields
        (function() {
            // Creates the filters based on those
            // defined in fnIsValidFormat
            var filters = {
                "vld-date": "d",
                "vld-time": "t",
                "vld-datetime": "dt",
                "vld-email": "email",
                "vld-pass": "pass",
                "vld-latitude": "lat",
                "vld-longitude": "lon"
            };
            var allFilters = $.map(filters, function(value, key) { return "." + key; }).join(",");
            // Shows a tooltip for validation message
            var fnTooltip = function(dom, event, messageType, pos) {
                event.preventDefault(); //cancel the click event of button
                var vld = $('<span class="vld-tooltip">').data("target-id", dom.id);
                vld.appendTo(jsu.wrapper).html(messageType).position({
                    of: dom,
                    at: pos.at,
                    my: pos.my,
                    collision: "flipfit"
                }).hide().fadeIn(400);
                dom.focus();
            };
            $.fn.fnEasyValidate = function(o) {
                var d = $.extend({
                    fnValidator: null,
                    firstItemInvalid: true,
                    requiredForm: false,
                    position: {
                        at: "right center",
                        my: "left+6 center"
                    }
                }, o);
                var fnValidateFirstItem = function(dom) {
                    if (dom.length === 0) return true;
                    // Look at first item of <select> as an invalid option
                    return (d.firstItemInvalid && dom.selectedIndex === 0);
                };
                // Removes the validation message when the "blur" event is raised
                $(".vld-required," + allFilters).off(".fnEasyValidate")
                .on(nsEvents("blur", "fnEasyValidate"), function(e) {
                    var dom = e.target;
                    if (dom.selectedIndex !== 0 || dom.checked || dom.value.length) {
                        $(".vld-tooltip").each(function(i, _vld) {
                            if (dom.id == $(_vld).data("target-id"))
                            { $(_vld).remove(); return false; }
                        });
                    }
                });
                return this.each(function() {
                    var btn = this;
                    if (d.requiredForm && !$(btn).closest("form").length) {
                        fnShowTooltip(btn, _language.validateForm);
                        return true; //continue with next element
                    }
                    // Prevents send the form if any field is not valid
                    $(btn).off(".fnEasyValidate").on(nsEvents("click", "fnEasyValidate"), { handler: "fnEasyValidate" }, function(event) {
                        btn.blur(); $(".vld-tooltip").remove();
                        var _submit = true; fnSetFocus();
                        // Validates each <input> and <select> element
                        $(".vld-required," + allFilters).each(function(i, _dom) {
                            var _tag = _dom.nodeName.toLowerCase();
                            // Gets the html5 validation data storage, modern browsers admit: _dom.dataset.validation
                            if (btn.getAttribute('data-validation') !== _dom.getAttribute('data-validation')) return true; //continue
                            // If the element is a <select>, evaluates the first option, and options with value="0" will be marked as invalid
                            if ($(_dom).hasClass("vld-required") && ((_tag == "select" && (fnValidateFirstItem(_dom) || _dom.value === "0")) ||
                                (input.isText(_dom) && !_dom.value.length) || (input.isCheck(_dom) && !_dom.checked) || _tag == "span")) {
                                var dom = _dom;
                                // Asp.net radiobutton or checkbox
                                if (_tag == "span" || input.isCheck(_dom)) {
                                    if (_tag == "input") dom = $(_dom);
                                    else dom = $(_dom).find("input:first-child");
                                    if (dom.is(":checked") || $('[name="' + dom.attr("name") + '"]').filter(":checked").length) return true; //continue
                                    if (_tag == "span") dom.addClass("vld-required");
                                    dom = dom.get(0);
                                }
                                fnTooltip(dom, event, _language.validateRequired, d.position);
                                return (_submit = false); //break
                            } //end if for required
                            if (!input.isText(_dom) || !_dom.value.length) return true; //continue
                            // Validates the formats
                            for (var type in filters) {
                                if ($(_dom).hasClass(type) && !fnIsValidFormat(_dom, filters[type])) {
                                    fnTooltip(_dom, event, _language.validateFormat, d.position);
                                    return (_submit = false); //break
                                }
                            }
                        }); //end $.each
                        // Calls the function to validate the form if it was provided
                        if (_submit && isFunction(d.fnValidator) && !d.fnValidator(btn)) {
                            event.preventDefault();
                            _submit = false;
                        }
                        $.fn.fnEasyValidate.canSubmit = _submit;
                        return _submit;
                    }); //end $.click
                }); //return jquery
            }; //end fnEasyValidate
        })();
        
        //-----------------------------------
        // Displays a jquery confirm window
        $.fn.fnConfirm = function(o) {
            var type = "click", current = {};
            $.fn.fnConfirm.canSubmit = false;
            var hasValidUrl = function(href) {
                return !!(href && href.length && (/(?:^\w+:\/\/[^\s\n]+)[^#]$/).test(href));
            };
            return this.each(function(i, target) {
                $(target).off(".fnConfirm").on(nsEvents(type, "fnConfirm"), function(e) {
                    current = this;
                    // Allows to the fnEasyValidate function pass through
                    if (handlerExist(current, type, "fnEasyValidate"))
                        $.fn.fnConfirm.canSubmit = !$.fn.fnEasyValidate.canSubmit;
                    if (!$.fn.fnConfirm.canSubmit) {
                        e.stopImmediatePropagation();
                        e.preventDefault();
                        fnShowDialog(o);
                    }
                });
                o.buttons = [
                    {
                        text: _language.dialogOK,
                        click: function() {
                            if (hasValidUrl(current.href)) document.location = current.href;
                            $("#dialog").on("dialogclose", function(ev, ui) {
                                $.fn.fnConfirm.canSubmit = true;
                                $(current).off(".fnConfirm").trigger(type);
                                if ((/[_]{2}doPostBack/).test(current.href))
                                    setTimeout(current.href.replace(/javascript:/i, ""), 1);
                            }).dialog("close");
                        }
                    },
                    {
                        text: _language.dialogCancel,
                        click: function() {
                            $.fn.fnConfirm.canSubmit = false;
                            $("#dialog").dialog("close");
                        }
                    }
                ];
            });
        };
        // We expose a property to check whether the form can be submitted or not
        $.fn.fnConfirm.canSubmit = false;

        //-----------------------------------
        /* FACADES */
        //-----------------------------------
        // Shows a jquery.ui modal window
        // It also provides a mechanism for redefinition
        function fnShowDialog(o) {
            arguments.callee.source = arguments.callee.source || function () {
                if (!jQuery.ui || !jQuery.ui.dialog)
                    throw new CustomException("jQuery.ui.dialog is required");
                $('#dialog,.ui-widget-overlay').remove();
                if (!o.content) return false;
                var cnt = null, body = $('body');
                var d = $.extend({
                    closeOnPageUnload: false,
                    title: _language.dialogTitle,
                    appendTo: jsu.wrapper,
                    icon: null,
                    content: null,
                    buttons: {}
                }, o);
                if (!$.isPlainObject(d.buttons) && !$.isArray(d.buttons)) d.buttons = {};
                if (d.content instanceof jQuery) cnt = d.content;
                else if (isDOM(d.content)) cnt = $(d.content);
                else if ($.type(d.content) === "string") {
                    // If content is string, the html wrapper element will be created
                    var icon = d.icon ? '<div class="wnd-icon ' + d.icon + '"></div>' : "";
                    cnt = $(icon + '<p>' + d.content + '</p>').appendTo(jsu.wrapper).data("del", true);
                }
                // Wraps the content into the created dialog element
                cnt.wrapAll('<div id="dialog" title="' + d.title + '">')
                   .wrapAll('<section class="ui-dialog-custom">');
                var _dialog = $("#dialog");
                if (!d.width) d.width = $('.ui-dialog-custom').width();
                if ($('.ui-dialog-custom').height() > _dialog.height()) d.width += 15; //scrollbar
                $('.close-dialog').one("click", function () { $('#dialog').dialog("close"); });
                // Determines whether the dialog should be closed when the page is unloaded
                if (d.closeOnPageUnload && !($._data(window, 'events') || {}).beforeunload)
                    $(window).on(nsEvents('beforeunload', 'fnShowDialog'), function () { $('#dialog').dialog("close"); });
                // Check the version of jquery.ui dependency
                var v110 = (/^1\.1[0-9]/).test(jQuery.ui.version);
                body.css("overflow", "hidden");
                _dialog.dialog({
                    draggable: true,
                    resizable: false,
                    modal: true,
                    hide: 'drop',
                    show: 'fade',
                    minHeight: 134,
                    height: d.height || 'auto',
                    width: d.width,
                    buttons: d.buttons,
                    appendTo: d.appendTo,
                    open: function (ev, ui) {
                        if (!v110) $(".ui-widget-overlay,.ui-dialog").appendTo(d.appendTo);
                        _dialog.dialog("option", "position", v110 ? { my: "center", at: "center", of: window } : "center");
                    },
                    close: function (ev, ui) {
                        body.css("overflow", "");
                        if (_dialog.hasClass("ui-dialog-content")) {
                            _dialog.dialog("destroy");
                            cnt.data("del") ? _dialog.remove() : cnt.unwrap().unwrap();
                        }
                    }
                });
                return _dialog;
            }; //end fnShowDialog.source
            return (fnShowDialog = arguments.callee.source)(o);
        }

        //-----------------------------------
        /* PUBLIC API */
        //-----------------------------------
        jherax.bool = bool;
        jherax.browser = browser;
        jherax.inputType = input;
        jherax.handlerExist = handlerExist;
        jherax.nsEvents = nsEvents;
        jherax.isDOM = isDOM;
        jherax.isFunction = isFunction;
        jherax.fnStringify = fnStringify;
        jherax.fnAddScript = fnAddScript;
        jherax.fnAddCSS = fnAddCSS;
        jherax.fnEscapeRegExp = fnEscapeRegExp;
        jherax.fnGetQueryToString = fnGetQueryToString;
        jherax.fnGetQueryToJSON = fnGetQueryToJSON;
        jherax.fnGetDataToJSON = fnGetDataToJSON;
        jherax.fnCloneObject = fnCloneObject;
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
        jherax.fnSetFocus = fnSetFocus;

    })(jsu, jQuery);
    // Set default namespace
})();
