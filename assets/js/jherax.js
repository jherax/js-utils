//**********************************
//  JavaScript Utilities for Validation
//  Author: David Rivera
//  Created: 26/06/2013
//  Version: 2.3.30
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
    version: "2.3.30",
    dependencies: ["jQuery","jQuery.ui","jherax.css"]
};
// Specifies where tooltip and dialog elements will be appended
jsu.wrapper = "body"; //#main-section

// We provide encapsulation for global scope
(function() {
    // Create a custom exception notifier
    var CustomException = function(message) {
        this.name = "js-utils exception";
        this.message = message || "An error has occurred";
        this.toString = function() {
            return this.name + ": " + this.message;
        };
    };
    if (jsu.author != 'jherax') {
        throw new CustomException("A variable with namespace [jsu] is already in use");
    }
    // Fixes unsupported create() method on IE
    Object.create || (Object.create = function(o) {
        function F(){}
        F.prototype = o;
        return new F();
    });
    // Create a general purpose namespace method
    jsu.createNS || (jsu.createNS = function(namespace) {
        var nsparts = namespace.toString().split(".");
        var parent = window;
        // we want to be able to include or exclude the root namespace so we strip it if it's in the namespace
        if (nsparts[0] === "window") nsparts = nsparts.slice(1);
        // loop through the parts and create a nested namespace if necessary
        for (var i = 0; i < nsparts.length; i++) {
            var subns = nsparts[i];
            // check if the namespace is a valid variable name
            if (!(/^[A-Za-z_]\w+/).test(subns)) throw new CustomException("Invalid namespace");
            // check if the current parent already has the namespace declared
            // if it isn't, then create it
            if (typeof parent[subns] === "undefined") {
                parent[subns] = {};
            }
            parent = parent[subns];
        }
        // the parent is now constructed with empty namespaces and can be used.
        // we return the outermost namespace
        return parent;
    });

    //-----------------------------------
    // Immediately-invoked Function Expressions (IIFE)
    // We pass the namespace as an argument to a self-invoking function.
    // jherax is the local namespace context, and $ is the jQuery object
    (function (jherax, $) {
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
            validateButton: "fnEasyValidate se ejecuta únicamente con botones [submit]",
            validateForm: "El botón debe estar dentro de un formulario",
            validateRequired: "Este campo es requerido",
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
            validateButton: "fnEasyValidate is performed only with buttons [submit]",
            validateForm: "The button must be inside a form",
            validateRequired: "This field is required",
            dialogTitle: "Information",
            dialogCancel: "Cancel",
            dialogOK: "Agree"
        };
        //-----------------------------------
        // You can add more languages using $.extend
        jherax.default = $.extend({}, jherax.spanish);
        
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
            $.extend(jherax.default, obj);
            // This code segment must be called before the plugin initialization
            // You can find more languages: [http://github.com/jquery/jquery-ui/tree/master/ui/i18n]
            if ($.datepicker) { $.datepicker.setDefaults($.datepicker.regional[jherax.default.culture]); }
            if ($.timepicker) { $.timepicker.setDefaults($.timepicker.regional[jherax.default.culture]); }
            if ($.isFunction(fnSetCustom)) fnSetCustom();
        };
    })(jsu.createNS("jsu.regional"), jQuery);
    // Create the namespace for languages

    //-----------------------------------
    // Immediately-invoked Function Expressions (IIFE)
    // We pass the namespace as an argument to a self-invoking function.
    // jherax is the local namespace context, and $ is the jQuery object
    (function (jherax, $, undefined) {
        //-----------------------------------
        /* PRIVATE MEMBERS */
        //-----------------------------------
        // Sets the default language configuration
        jsu.regional.set(jsu.regional.spanish);
        var _language = Object.create(jsu.regional.default);
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
        // Determines whether entry parameter is a writable or checkable input
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
        // Determines if a object is DOM element
        var isDOM = function(obj) {
            return (!!obj && typeof obj === "object" && !!obj.nodeType);
        };
        //-----------------------------------
        // Determines if the entry parameter is a normalized Event Object
        var isEvent = function(obj) {
            return (!!obj && typeof obj === "object" && obj.which !== undefined && !!obj.target);
        };
        //-----------------------------------
        // Determines if the entry parameter is a function
        var isFunction = function(obj) {
            return (!!obj && Object.prototype.toString.call(obj) == '[object Function]');
        };
        //-----------------------------------
        // This is a reference to JSON.stringify and provides support in old browsers
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
        // Escapes user input to be treated as a literal string in a regular expression
        function fnEscapeRegExp(txt) {
            if (typeof txt !== "string") return null;
            return txt.replace(/([.*+?=!:${}()|\^\[\]\/\\])/g, "\\$1");
        }
        //-----------------------------------
        // Gets the text of current date according to regional setting
        function fnGetDate() {
            var f = new Date();
            var fillZero = function(n) { return ("0" + n.toString()).slice(-2); };
            var fnDate = function() {
                return _language.dateFormat.replace(/[dMy]+/g, function(m) {
                    switch (m.toString()) {
                        case "dd": return fillZero(f.getDate());
                        case "MM": return fillZero(f.getMonth() + 1);
                        case "yyyy": return f.getFullYear();
                    }
                });
            };
            var fnTime = function() {
                return _language.timeFormat.replace(/[Hhms]+/g, function(m) {
                    var h = f.getHours();
                    switch (m.toString()) {
                        case "HH": return fillZero(f.getHours());
                        case "hh": return fillZero(h === 12 ? 12 : h % 12);
                        case "mm": return fillZero(f.getMinutes());
                        case "ss": return fillZero(f.getSeconds());
                    }
                });
            };
            var fnDateTime = function() { return fnDate() + " " + fnTime(); };
            // Public API
            return {
                date: fnDate(),
                time: fnTime(),
                dateTime: fnDateTime()
            };
        }
        //-----------------------------------
        // Gets the text as encoded html
        // This is a delegate for $.val()
        function fnGetHtmlText(i, value) {
            if (!value && typeof i === "string") value = i;
            var html = $("<div/>").text(value).html();
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
                    _sel.start = _dom.selectionStart;
                    _sel.end = _dom.selectionEnd;
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
        function fnGetCaretPosition(_dom) {
            if ('selectionStart' in _dom) {
                return (_dom.selectionStart);
            } else { // IE below version 9
                var _sel = document.selection.createRange();
                _sel.moveStart('character', -_dom.value.length);
                return (_sel.text.length);
            }
        }
        //-----------------------------------
        // Sets the position of the cursor in the DOM element
        function fnSetCaretPosition(_dom, pos) {
            if ('selectionStart' in _dom) {
                _dom.setSelectionRange(pos, pos);
            } else { // IE below version 9
                var range = _dom.createTextRange();
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
                case "d": //Validates Date format: dd/MM/yyyy
                    _pattern = new RegExp(_formatter(_language.dateFormat));
                    break;
                case "t": //Validates Time format: HH:mm:ss
                    _pattern = /^([0-1][0-9]|[2][0-3]):([0-5][0-9])(?::([0-5][0-9])){0,1}$/;
                    break;
                case "dt": //Validates DateTime format: dd/MM/yyyy HH:mm:ss
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
            var error = false;
            o = $.extend({
                isFuture: false,
                compareTo: new Date(),
                warning: null }, o);
            var _type = _dom.value.length > 10 ? "dt" : "d";
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
        function fnShowTooltip(_dom, _msg) {
            if (isDOM(_dom)) _dom = $(_dom);
            _dom.on("blur", function() { $(".vld-tooltip").remove(); });
            var vld = $('<span class="vld-tooltip">' + _msg + '</span>');
            vld.appendTo(jsu.wrapper).position({
                of: _dom,
                at: "right center",
                my: "left+6 center",
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
                delay: 2600
            }, o);
            $("#loadingWrapper").remove();
            if (d.hide) return true;
            var blockG = [];
            for (var i = 1; i < 9; i++) blockG.push('<div class="blockG"></div>');
            var loading = $('<div id="floatingBarsG" />').append(blockG.join(""));
            var overlay = $('<div class="bg-fixed bg-opacity" />');
            $('<div id="loadingWrapper" />').append(overlay, loading).appendTo(jsu.wrapper).hide().fadeIn(d.delay);
            loading.fnCenter();
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
        // Sets the jquery objects in the center of screen
        // See css:calc [http://jsfiddle.net/apaul34208/e4y6F]
        $.fn.fnCenter = function() {
            this.css({
                'position': 'fixed',
                'left': '50%',
                'top': '50%'
            });
            this.css({
                'margin-left': -this.outerWidth() / 2 + 'px',
                'margin-top': -this.outerHeight() / 2 + 'px'
            });
            return this;
        };
        //-----------------------------------
        // Limits the max length in the input:text
        $.fn.fnMaxLength = function(length) {
            return this.each(function(i, dom) {
                var count = "Max: " + length;
                var vld = '#max' + dom.id;
                if (!input.isText(dom)) return true; //continue
                $(dom).on("blur", function() { $(vld).remove(); });
                $(dom).on("keypress input paste", function(e) {
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
                        $('<span class="vld-tooltip" id="max' + dom.id + '" />')
                        .text(count).appendTo(jsu.wrapper).position({
                            of: dom,
                            at: "right top",
                            my: "left+6 top",
                            collision: "flipfit"
                        }).hide().fadeIn(400);
                    }
                });
            });
        };
        //-----------------------------------
        // Apply the capitalized format to text when blur event occurs
        $.fn.fnCapitalize = function(type) {
            return this.each(function(i, dom) {
                $(dom).on("blur", function() {
                    fnCapitalize(this, type);
                });
            });
        };
        //-----------------------------------
        // Displays a tooltip next to DOM element
        $.fn.fnShowTooltip = function(msg) {
            return this.each(function(i, dom) {
                fnShowTooltip(dom, msg);
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
                $(dom).on("keyup blur", function() {
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
                $(dom).on("focus blur input paste", { max: len }, function(e) {
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
                });
                $(dom).on("keydown", function(e) {
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
                $(dom).on("focus blur input paste", { max: len }, function(e) {
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
                });
                $(dom).on("keypress", function(e) {
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
                $(this).on("keypress", function(e) {
                    var _key = e.which || e.keyCode;
                    _key = String.fromCharCode(_key);
                    return $.inArray(_key, keys) == -1;
                });
            });
        };
        //-----------------------------------
        // Validates the required form fields
        $.fn.fnEasyValidate = function(o) {
            var d = $.extend({ fnValidator: null, firstItemInvalid: true }, o);
            var fnValidateFirstItem = function(dom) {
                if (dom.length === 0) return true;
                // Validates first item of <select> as an invalid option
                return (d.firstItemInvalid && dom.selectedIndex === 0);
            };
            return this.each(function() {
                var btn = this;
                if (!window.jQuery.ui) {
                    throw new CustomException("jQuery.ui is required");
                }
                if (!btn.type || btn.type.toLowerCase() != "submit") {
                    fnShowTooltip(btn, _language.validateButton);
                    return true; //continue with next element
                }
                if (!$(btn).closest("form").length) {
                    fnShowTooltip(btn, _language.validateForm);
                    return true; //continue with next element
                }
                // Prevents send the form if any field is not valid
                $(btn).on("click", { handler: "easyValidate" }, function(event) {
                    btn.blur(); $(".vld-tooltip").remove();
                    var _submit = true; fnSetFocus();
                    // Validates each [input, select] element
                    $(".vld-required").each(function(i, _dom) {
                        var _tag = _dom.nodeName.toLowerCase();
                        // Gets the html5 validation data storage, modern browsers admit: _dom.dataset.validation
                        if (btn.getAttribute('data-validation') !== _dom.getAttribute('data-validation')) return true; //continue
                        // If the element is <select>, evaluates first option and the option with value="0" will be invalid
                        if ((_tag == "select" && (fnValidateFirstItem(_dom) || _dom.value === "0")) || _tag == "span" ||
                            (input.isText(_dom) && !_dom.value.length) || (input.isCheck(_dom) && !_dom.checked)) {
                            var dom = _dom;
                            // Asp radiobutton or checkbox
                            if (_tag == "span" || input.isCheck(_dom)) {
                                if (_tag == "input") dom = $(_dom);
                                else dom = $(_dom).find("input:first-child");
                                if (dom.is(":checked") || $('[name="' + dom.attr("name") + '"]').filter(":checked").length) return true; //continue
                                if (_tag == "span") dom.addClass("vld-required");
                                dom = dom.get(0);
                            }
                            // Shows the tooltip for required field
                            var vld = $('<span class="vld-tooltip" />').data("target-id", dom.id);
                            vld.appendTo(jsu.wrapper).html(_language.validateRequired).position({
                                of: dom,
                                at: "right center",
                                my: "left+6 center",
                                collision: "flipfit"
                            }).hide().fadeIn(400);
                            event.preventDefault();
                            dom.focus();
                            return (_submit = false); //break
                        } //end if
                    }); //end $.each
                    // Removes the validation message
                    $(".vld-required").on("blur", function(e) {
                        var dom = e.target;
                        if (dom.selectedIndex !== 0 || dom.checked || dom.value.length) {
                            $(".vld-tooltip").each(function(i, _vld) {
                                if (dom.id == $(_vld).data("target-id"))
                                { $(_vld).remove(); return false; }
                            });
                        }
                    });
                    // Calls the function to validate the form if it was provided
                    if (_submit && isFunction(d.fnValidator) && !d.fnValidator(btn)) {
                        event.preventDefault();
                        _submit = false;
                    }
                    return _submit;
                }); //end $.click
            }); //return jquery
        };
        //-----------------------------------
        // Displays a jquery confirm window
        $.fn.fnConfirm = function(o) {
            var type = "click", current = {};
            $.fn.fnConfirm.canSubmit = false;
            return this.each(function(i, target) {
                $(target).on(type, function(e) {
                    current = this;
                    if (!$.fn.fnConfirm.canSubmit) {
                        e.stopImmediatePropagation();
                        e.preventDefault();
                        fnShowDialog(o);
                    }
                });
                var hasValidUrl = function(href) {
                    return !!(href && href.length && (/(?:^\w+:\/\/[^\s\n]+)[^#]$/).test(href));
                };
                o.buttons = [
                    {
                        text: _language.dialogOK,
                        click: function() {
                            if (hasValidUrl(current.href)) document.location = current.href;
                            $("#dialog").on("dialogclose", function(ev, ui) {
                                $.fn.fnConfirm.canSubmit = true;
                                $(current).trigger(type);
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
        // Shows a jquery.ui modal dialog
        function fnShowDialog(o) {
            $('#dialog,.ui-widget-overlay').remove();
            if (!o.content) return false;
            var cnt = null, body = $('body');
            var d = $.extend({
                closeOnPageUnload: false,
                title: _language.dialogTitle,
                appendTo: null,
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
            cnt.wrapAll('<div id="dialog" title="' + d.title + '"/>')
               .wrapAll('<section class="ui-dialog-custom"/>');
            var _dialog = $("#dialog");
            if (!d.width) d.width = $('.ui-dialog-custom').width();
            if ($('.ui-dialog-custom').height() > _dialog.height()) d.width += 15; //scrollbar
            $('.close-dialog').one("click", function() { $('#dialog').dialog("close"); });
            // Determines whether the dialog should be closed when the page is unloaded
            if (d.closeOnPageUnload && !($._data(window, 'events') || {}).beforeunload)
                $(window).on('beforeunload', function() { $('#dialog').dialog("close"); });
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
                open: function(ev, ui) {
                    $(".ui-dialog").appendTo(d.appendTo || _dialog.parent());
                    _dialog.dialog("option", "position", "center");
                },
                close: function(ev, ui) {
                    body.css("overflow", "");
                    _dialog.dialog("destroy");
                    cnt.data("del") ? _dialog.remove() : cnt.unwrap().unwrap();
                }
            });
            return _dialog;
        }

        //-----------------------------------
        /* PUBLIC API */
        //-----------------------------------
        jherax.browser = browser;
        jherax.inputType = input;
        jherax.isDOM = isDOM;
        jherax.isFunction = isFunction;
        jherax.fnStringify = fnStringify;
        jherax.fnEscapeRegExp = fnEscapeRegExp;
        jherax.fnGetDate = fnGetDate;
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
