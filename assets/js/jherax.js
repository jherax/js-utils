//******************************
//  Utils for validations
//  Author: David Rivera
//  Created: 26/06/2013
//******************************
// jherax.github.io
// github.com/jherax/js-utils
//******************************
;
// Essential JavaScript Namespacing Patterns
// http://addyosmani.com/blog/essential-js-namespacing/

// Create a custom exception notifier
var CustomException = function(message) {
    this.name = "js-utils exception";
    this.message = message || "An error has occurred";
    this.toString = function() {
        return this.name + ": " + this.message;
    };
};
// We need to do a check before we create the namespace
var js = window.js || { author: 'jherax' };
if (js.author != 'jherax') {
    throw new CustomException("A variable with namespace [js] is already in use");
}
// Create a general purpose namespace method
js.createNS = js.createNS || function (namespace) {
    var nsparts = namespace.toString().split(".");
    var parent = js;
    // we want to be able to include or exclude the root namespace so we strip it if it's in the namespace
    if (nsparts[0] === "js") nsparts = nsparts.slice(1);
    // loop through the parts and create a nested namespace if necessary
    for (var i = 0; i < nsparts.length; i++) {
        var subns = nsparts[i];
        // check if the namespace is a valid variable name
        if (!(/\w+/).test(subns)) throw new CustomException("Invalid namespace");
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
};
// We expose a property to specify where the tooltip element will be appended
js.wrapper = "body"; //#main-section
//-----------------------------------
// Immediately-invoked Function Expressions (IIFE)
// We pass the namespace as an argument to a self-invoking function.
// jherax is the namespace context, and $ is the jQuery Object
(function (jherax, $) {
    //-----------------------------------
    /* PRIVATE MEMBERS */
    //-----------------------------------
    // Adds support for browser detect.
    // jquery 1.9+ deprecates $.browser
    var getBrowser = (function() {
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
    // Determines whether the entry parameter is a text input or checkable input
    // www.quackit.com/html_5/tags/html_input_tag.cfm
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
    // This is a facade of JSON.stringify and provides support in old browsers
    var fnStringify = typeof JSON != "undefined" ? JSON.stringify : function (json) {
        var arr = [];
        $.each(json, function (key, val) {
            var prop = "\"" + key + "\":";
            prop += ($.isPlainObject(val) ? fnStringify(val) : 
                (typeof val === "string" ? "\"" + val + "\"" : val));
            arr.push(prop);
        });
        return "{" + arr.join(",") + "}";
    };
    //-----------------------------------
    // Escaping user input to be treated as a literal string within a regular expression
    function fnEscapeRegExp(txt){
        if (typeof txt !== "string") return null;
        return txt.replace(/([.*+?=!:${}()|\^\[\]\/\\])/g, "\\$1");
    }
    //-----------------------------------
    // Gets the text of current date in es-CO culture. dd/MM/yyyy HH:mm:ss
    function fnGetDate() {
        var f = new Date();
        var fillZero = function(n) { return ("0" + n.toString()).slice(-2); };
        var fnDate = function() { return (fillZero(f.getDate()) +"/"+ fillZero(f.getMonth() + 1) +"/"+ f.getFullYear()); };
        var fnTime = function() { return (fillZero(f.getHours()) +":"+ fillZero(f.getMinutes()) +":"+ fillZero(f.getSeconds())); };
        var fnDateTime = function() { return fnDate() + " " + fnTime(); };
        return {
            date: fnDate(),
            time: fnTime(),
            dateTime: fnDateTime()
        };
    }
    //-----------------------------------
    // Gets the text as html encoded
    // This is a delegate for $.val()
    function fnGetHtmlText(i, value) {
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
    // Gets the cursor position in the text
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
    // Sets the cursor position in the text
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
    // Transforms the text to capital letter.
    // Also removes all consecutive spaces
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
        if (_type) {
            if (_type == "upper") _text = _text.toUpperCase();
            if (_type == "lower" || _type == "word") _text = _text.toLowerCase();
            if (_type == "title" || _type == "word") {
                _text = _text.replace(/(?:^|-|:|;|\s|\.|\(|\/)[a-záéíóúüñ]/g, function (m) { return m.toUpperCase(); });
                _text = _text.replace(/\s(?:Y|O|De[l]?|Por|A[l]?|L[ao]s?|[SC]on|En|Se|Que|Un[a]?)\b/g, function (m) { return m.toLowerCase(); });
            }
        }
        else _text = _text.replace(/^\w/, _text.charAt(0).toUpperCase());
        if (_isDOM) obj.value = _text;
        return _text;
    }
    //-----------------------------------
    // Sets the numeric format in es-CO culture.
    // Places decimal "." and thousand "," separator
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
    // Validates the format of text,
    // depending on the type supplied.
    // Date validations are performed according to es-CO culture
    function fnIsValidFormat(obj, _type) {
        var _pattern = null,
            _text = input.isText(obj) ? obj.value : obj.toString();
        switch (_type) {
            case "d": //Validates Date format: dd/MM/yyyy
                _pattern = /^((0[1-9])|([1-2][0-9])|(3[0-1]))\/((0[1-9])|(1[0-2]))\/([1-2][0,9][0-9][0-9])$/;
                break;
            case "t": //Validates Time format: HH:mm:ss
                _pattern = /^([0-1][0-9]|[2][0-3]):([0-5][0-9]):([0-5][0-9])$/;
                break;
            case "dt": //Validates DateTime format: dd/MM/yyyy HH:mm:ss
                _pattern = /^((0[1-9])|([1-2][0-9])|(3[0-1]))\/((0[1-9])|(1[0-2]))\/([1-2][0,9][0-9][0-9])\s([0-1][0-9]|[2][0-3]):([0-5][0-9]):([0-5][0-9])$/;
                break;
            case "email": //Validates an email address
                _pattern = /^([0-9a-zA-Zñ](?:[\-.\w]*[0-9a-zA-Zñ])*@(?:[0-9a-zA-Zñ][\-\wñ]*[0-9a-zA-Zñ]\.)+[a-zA-Z]{2,9})$/i;
                break;
            case "pass": //Validates the password strength (must have 8-20 characters, at least one number, at least one uppercase)
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
    // Evaluates whether the value of text is a date or not.
    // The validation outcome will be shown in a tooltip
    var fnIsValidDate = function(_dom, o) {
        if (!input.isText(_dom)) return false;
        var error = false;
        o = $.extend({
            isFuture: false,
            compareTo: new Date(),
            warning: 'La fecha no puede ser {0} a hoy'}, o);
        var _type = _dom.value.length > 10 ? "dt" : "d";
        var _date = _dom.value.substr(0, 10);
        var parser = function (date) {
            if (date instanceof Date) return date;
            if (typeof date !== "string") return new Date();
            if (!fnIsValidFormat(date, _type)) { error = true; return new Date(); }
            return new Date(date.replace(/^(\d{2})\/(\d{2})\/(\d{4})$/, '$3/$2/$1'));
        };
        var dif = (parser(_date) - parser(o.compareTo)) / 1000 / 3600 / 24;
        if (error) return fnShowTooltip(_dom, fnIsValidDate.formatError);
        if ( o.isFuture && dif < 0) return fnShowTooltip(_dom, o.warning.replace("{0}","menor"));
        if (!o.isFuture && dif > 0) return fnShowTooltip(_dom, o.warning.replace("{0}","mayor"));
        return true;
    };
    // We expose a property to set default message for the format error
    fnIsValidDate.formatError = 'El formato de fecha es incorrecto';
    //-----------------------------------
    // Shows a custom warning message
    function fnShowTooltip(_dom, _msg) {
        if (isDOM(_dom)) _dom = $(_dom);
        _dom.on("blur", function () { $(".vld-tooltip").remove(); });
        var vld = $('<span class="vld-tooltip">' + _msg + '</span>');
        vld.appendTo(js.wrapper).position({
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
        $('<div id="loadingWrapper" />').append(overlay, loading).appendTo(js.wrapper).hide().fadeIn(d.delay);
        loading.fnCenter();
        return true;
    }
    //-----------------------------------
    // Sets the focus on input elements
    function fnSetFocus() {
        $($('input[type="text"], textarea').filter(':not(input:disabled)').get().reverse()).each(function () {
            if (!$(this).hasClass("no-auto-focus")) $(this).focus();
        });
    }

    //-----------------------------------
    /* jQUERY EXTENSIONS */
    //-----------------------------------
    // Sets the jquery objects in the center of screen
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
        return this.each(function (i, dom) {
            var count = "Max: " + length;
            var vld = '#max' + dom.id;
            if (!input.isText(dom)) return true; //continue
            $(dom).on("blur", function() { $(vld).remove(); });
            $(dom).on("keypress input paste", function (e) {
                var len = dom.value.length;
                var max = len >= length ? 1 : 0;
                if (getBrowser.mozilla) max = !e.keyCode && max;
                if (max) {
                    len = length;
                    dom.value = dom.value.substr(0, len);
                    e.preventDefault();
                }
                count = "Max: " + len + "/" + length;
                if(!$(vld).text(count).length) {
                    $('<span class="vld-tooltip" id="max' + dom.id + '" />')
                    .text(count).appendTo(js.wrapper).position({
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
        return this.each(function (i, dom) {
            $(dom).on("blur", function() {
                fnCapitalize(this, type);
            });
        });
    };
    //-----------------------------------
    // Sets numeric format with decimal/thousand separators
    $.fn.fnNumericFormat = function() {
        return this.each(function (i, dom) {
            $(dom).on("keyup blur", function() {
                fnNumericFormat(this);
            });
        });
    };
    //-----------------------------------
    // Allows only numeric characters
    $.fn.fnNumericInput = function () {
        return this.each(function (i, dom) {
            var len = dom.maxLength;
            dom.maxLength = 524000;
            if (len < 1) len = 524000;
            $(dom).on("focus blur input paste", { max: len }, function (e) {
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
            $(dom).on("keydown", function (e) {
                var _key = e.which || e.keyCode;
                var _ctrl = !!(e.ctrlKey || e.metaKey);
                // Allow: (numbers), (keypad numbers),
                // Allow: (backspace, tab, delete), (home, end, arrows)
                // Allow: (Ctrl+A), (Ctrl+C)
                // Allow: (Ctrl+V), (Ctrl+X)
                return ((_key >= 48 && _key <= 57) || (_key >= 96 && _key <= 105) ||
                         (_key == 8 || _key == 9 || _key == 46) || (_key >= 35 && _key <= 40) ||
                         (_ctrl && _key == 65) || (_ctrl && _key == 67) ||
                         (_ctrl && _key == 86) || (_ctrl && _key == 88));
            });
        });
    };
    //-----------------------------------
    // Sets a mask for the allowed characters
    $.fn.fnCustomInput = function (mask) {
        mask = mask instanceof RegExp ? mask : fnEscapeRegExp(mask);
        if (!mask) throw new CustomException("Mask must be RegExp or string");
        if (typeof mask === "string") mask = "[" + mask + "]";
        return this.each(function (i, dom) {
            var len = dom.maxLength;
            dom.maxLength = 524000;
            if (len < 1) len = 524000;
            $(dom).on("focus blur input paste", { max: len }, function (e) {
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
            $(dom).on("keypress", function (e) {
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
    $.fn.fnDisableKey = function (key) {
        if (!key) return this;
        var keys = key.toString().split("");
        keys = keys.filter(function(n){ return (n && n.length); });
        return this.each(function() {
            $(this).on("keypress", function (e) {
                var _key = e.which || e.keyCode;
                _key = String.fromCharCode(_key);
                return $.inArray(_key, keys) == -1;
            });
        });
    };
    //-----------------------------------
    // Validates the required form fields
    $.fn.fnEasyValidate = function (fnValidator) {
        return this.each(function () {
            var btn = this;
            if (!window.jQuery.ui) {
                throw new CustomException("jQuery.UI is required");
            }
            if (!btn.type || btn.type.toLowerCase() != "submit") {
                fnShowTooltip(btn, "this method can be performed only on submit buttons");
                return true; //continue with next element
            }
            if (!$(btn).closest("form").length) {
                fnShowTooltip(btn, "The button must be inside a form");
                return true;
            }
            // Prevents send the form if any field is not valid
            $(btn).on("click", { handler: "easyValidate" }, function (event) {
                btn.blur(); $(".vld-tooltip").remove();
                var _submit = true; fnSetFocus();
                // Validates each [input, select] element
                $(".vld-required").each(function (i, _dom) {
                    var _tag = _dom.nodeName.toLowerCase();
                    // Gets the html5 validation data storage, modern browsers admit: _dom.dataset.validation
                    if (btn.getAttribute('data-validation') !== _dom.getAttribute('data-validation')) return true; //continue
                    // If the element is [select], the first option and the option with a value="0" will be invalid
                    if ((_tag == "select" && (_dom.selectedIndex === 0 || _dom.value === "0")) || _tag == "span" ||
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
                        vld.appendTo(js.wrapper).html("Este campo es requerido").position({
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
                $(".vld-required").on("blur", function (e) {
                    var dom = e.target;
                    if (dom.selectedIndex !== 0 || dom.checked || dom.value.length) {
                        $(".vld-tooltip").each(function (i, _vld) {
                            if (dom.id == $(_vld).data("target-id"))
                            { $(_vld).remove(); return false; }
                        });
                    }
                });
                // Calls the function to validate the form if it was provided
                if (_submit && isFunction(fnValidator) && !fnValidator(btn)) {
                    event.preventDefault();
                    _submit = false;
                }
                return _submit;
            }); //end $.click
        }); //return jquery
    };

    //-----------------------------------
    /* PUBLIC API */
    //-----------------------------------
    jherax.browser = getBrowser;
    jherax.isDOM = isDOM;
    jherax.isEvent = isEvent;
    jherax.isFunction = isFunction;
    //jherax.input = input;
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
    jherax.fnLoading = fnLoading;
    jherax.fnSetFocus = fnSetFocus;
})(js.createNS("js.utils"), jQuery);
// Create the namespace for utils
