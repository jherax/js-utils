[js-utils][js-utils]
========

This is a suite of utilities for JavaScript and jQuery, which includes tools for validating, text formatting, and other features.

Getting Started
---------------
The utility has a dependency on [jQuery 1.10+][jQuery.js] which must be loaded before [js-utils][jherax.js].<br>
It also requires some [CSS][jherax.css] rules for functions showing tooltips, and other methods.

If [jQuery.ui.position](http://api.jqueryui.com/position/) is available, all tooltips will be rendered using jQuery.ui, otherwise an internal function for positioning will be used.

[fnShowDialog](#fnshowdialog-options) is a facade for [ui dialog widget](https://jqueryui.com/dialog/) and has a dependency on [jQuery.UI 1.9+][jQuery.ui].<br>
But if you don't want to use jQuery.ui, this method can be overridden by specifying the `source` property to the function that will replace it.

The library has the following structure:
- `jsu:` main namespace
  - `author:` me :^)
  - `version:` release number
  - `dependencies:` array with name of dependencies
  - `createNS:` utility to create safe namespaces
  - `wrapper:` selector where dynamic HTML elements are placed
  - `regional:` namespace to set the language setting

Initialization
--------------
```javascript
  (function() {
    // We set the container of the views
    jsu.wrapper = "#main-section";

    // We set the language setting
    jsu.regional.set(jsu.regional.english);
    
    // Add your code for plugins init, event handlers, etc...
  })();
```
  
Namespacing
-----------
In many programming languages, namespacing is a technique employed to avoid collisions with other objects or variables in the global context. They're also extremely useful for helping organize blocks of functionality in your application into easily manageable groups that can be uniquely identified.

Global variables should be reserved for objects that have system-wide relevance and they should be named to avoid ambiguity and minimize the risk of naming collisions. In practice this means you should avoid creating global objects unless they are absolutely necessary.

Is critical as it's important to safeguard your code from breaking in the event of another script on the page using the same variable or method names as you are. To overcome some of these issues, we take advantage of the [Module Pattern](http://www.adequatelygood.com/JavaScript-Module-Pattern-In-Depth.html) through namespace injection. The logic is shielded from the global scope by a function wrapper (usually self-invoking) which exposes an object representing the module’s public interface.

I recommend this excellent book: [Learning JavaScript Design Patterns](http://www.addyosmani.com/resources/essentialjsdesignpatterns/book/).<br>
Also worth reading these articles:
* [Namespacing in JavaScript](http://msdn.microsoft.com/en-us/magazine/gg578608.aspx)
* [Essential JavaScript Namespacing Patterns](http://addyosmani.com/blog/essential-js-namespacing/)
* [JavaScript Namespacing Common Practices](http://michaux.ca/articles/javascript-namespacing)
* [Immediately-Invoked Function Expression (IIFE)](http://benalman.com/news/2010/11/immediately-invoked-function-expression/)
* [JavaScript Coding Standards and Best Practices](http://github.com/stevekwan/best-practices/blob/master/javascript/best-practices.md)

### jsu.createNS
This utility makes life easier when you require create nested namespaces.<br>
For example, you need to create the following object structure:
- animation
  - g2D
    - slide
  - g3D
    - cubic
  - tools

```javascript
  // using closures, modules, IIFE, are good practices
  (function() {
    jsu.createNS("animation.g2D.slide");
    jsu.createNS("animation.g3D.cubic");
    // you can get the reference of created namespace
    var tools = jsu.createNS("animation.tools");
    // If you use local/cached references is recommended declare them
    // within a function or module at the top of your function scope
    // (this is a dependancy declaration pattern)
  })();
```

### jsu.regional
This namespace exposes objects and methods to setup your language preferences.<br>
If we are using [jQuery.UI][jQuery.ui], we can provide a [language](http://github.com/jquery/jquery-ui/tree/master/ui/i18n) to configure the [datepicker](http://api.jqueryui.com/datepicker/) widget.<br>
Available predefined languages are `jsu.regional.english` and `jsu.regional.spanish`<br>
By default spanish language is set, although you can specify language using method `set()`<br>
e.g. `jsu.regional.set(jsu.regional.english);`<br>
You can define your own language settings:
```javascript
(function() {
  // Create the locale language object
  // (the text should be in Italian)
  jsu.regional.italian = {
    culture: "it", //locale codes: http://www.science.co.il/Language/Locale-codes.asp
    wordPattern: null, //regular expression pattern for text capitalization in fnCapitalize
    timeFormat: "HH:mm", //pattern for time. HH: 0-23 hour, hh: 1-12 hour, mm: minutes, ss: seconds
    dateFormat: "MM/dd/yyyy", //pattern for date. dd: 2-digit day, MM: 2-digit month, yyyy: 4-digit year
    dateFormatError: "The date format is incorrect", //text for fnIsValidDate when date format is wrong
    dateIsGreater: "The date can't be greater than today", //text of date validation in fnIsValidDate
    dateIsLesser: "The date can't be lesser than today", //text of date validation in fnIsValidDate
    validateRequired: "This field is required", //text for $.fnEasyValidate required fields
    validateFormat: "The format is incorrect", //text for $.fnEasyValidate wrong format
    dialogTitle: "Information", //default jQuery.ui.dialog title
    dialogCancel: "Cancel", //default $.fnConfirm cancel text
    dialogOK: "Agree" //default $.fnConfirm approve text
  };
  // We set the created language setting
  jsu.regional.set(jsu.regional.italian);
})();
```
If you want to provide additional languages to other plugins, you can pass a function as second parameter in method `set();` Keep in mind that some plugins can be configured only previous to its initialization.
```javascript
(function() {
  // We will create italian language for datepicker plugin
  // Additional languages for datepicker can be found at:
  // [http://github.com/jquery/jquery-ui/tree/master/ui/i18n]
  $.datepicker.regional['it'] = {
    closeText: 'Chiudi',
    prevText: '&#x3C;Prec',
    nextText: 'Succ&#x3E;',
    currentText: 'Oggi',
    monthNames: ['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno',
          'Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre'],
    monthNamesShort: ['Gen','Feb','Mar','Apr','Mag','Giu',
          'Lug','Ago','Set','Ott','Nov','Dic'],
    dayNames: ['Domenica','Lunedì','Martedì','Mercoledì','Giovedì','Venerdì','Sabato'],
    dayNamesShort: ['Dom','Lun','Mar','Mer','Gio','Ven','Sab'],
    dayNamesMin: ['Do','Lu','Ma','Me','Gi','Ve','Sa'],
    weekHeader: 'Sm',
    dateFormat: 'dd/mm/yy',
    firstDay: 1,
    isRTL: false,
    showMonthAfterYear: false,
    yearSuffix: ''
  };
  // We set the created language setting
  jsu.regional.set(jsu.regional.italian, function() {
    $.datepicker.setDefaults($.datepicker.regional['it']);
  });
})();
```
---

[List of methods](#list-of-methods)
---------------
* [browser](#browser)
* [inputType](#inputtype)
* [handlerExist](#handlerexist-dom-eventname-namespace)
* [isDOM](#isdom-object)
* [isFunction](#isfunction-object)
* [fnStringify](#fnstringify-json)
* [fnAddScript](#fnaddscript-path-before)
* [fnAddCSS](#fnaddcss-path-before)
* [fnEscapeRegExp](#fnescaperegexp-text)
* [fnGetQueryToString](#fngetquerytostring-query)
* [fnGetQueryToJSON](#fngetquerytojson-query)
* [fnCloneObject](#fncloneobject-object)
* [fnGetDate](#fngetdate-options)
* [fnDateFromISO8601](#fndatefromiso8601-date)
* [fnGetHtmlText](#fngethtmltext-value)
* [fnGetSelectedText](#fngetselectedtext-)
* [fnGetCaretPosition](#fngetcaretposition-dom)
* [fnSetCaretPosition](#fnsetcaretposition-dom-position)
* [fnCapitalize](#fncapitalize-object-type)
* [fnNumericFormat](#fnnumericformat-object)
* [fnIsValidFormat](#fnisvalidformat-object-type)
* [fnIsValidDate](#fnisvaliddate-dom-options)
* [fnShowTooltip](#fnshowtooltip-dom-message-position)
* [fnShowDialog](#fnshowdialog-options)
* [fnSetFocus](#fnsetfocus-)
* [fnLoading](#fnloading-options)

[jQuery extensions](#jquery-extensions)
-----------------
<!---* [$.position](#jqueryposition-options)-->
* [$.fnCenter](#jqueryfncenter-options)
* [$.fnMaxLength](#jqueryfnmaxlength-length-options)
* [$.fnCapitalize](#jqueryfncapitalize-type)
* [$.fnNumericFormat](#jqueryfnnumericformat-)
* [$.fnNumericInput](#jqueryfnnumericinput-)
* [$.fnCustomInput](#jqueryfncustominput-mask)
* [$.fnDisableKey](#jqueryfndisablekey-keys)
* [$.fnIsValidFormat](#jqueryfnisvalidformat-type)
* [$.fnIsValidDate](#jqueryfnisvaliddate-options)
* [$.fnEasyValidate](#jqueryfneasyvalidate-options)
* [$.fnShowTooltip](#jqueryfnshowtooltip-message-position)

<!---* [$.fnConfirm](#jqueryfnconfirm-options)-->

Usage
-----

### browser
Adds support for browser detect, because jquery 1.9+ deprecates the *[browser](http://api.jquery.com/category/deprecated/#post-301)* property.<br>
For detecting capabilities, is better to use [Modernizr](http://modernizr.com/docs/).<br>
**Returns** `Object`
```javascript
  // see browser and version
  console.log(jsu.browser);
  // check for a specific browser
  if (jsu.browser.msie) { ... }
  if (jsu.browser.chrome) { ... }
  if (jsu.browser.mozilla) { ... }
  if (jsu.browser.opera) { ... }
```

### inputType
This object has two methods to determine the type of the `<input>` element.
* **`isText (dom)`**: This function returns `true` when the ***dom*** parameter is a writable  `<input>`<br>Elements classified in this category are: [Category:text](#categorytext)
* **`isCheck (dom)`**: This function returns `true` when the ***dom*** parameter is a checkable `<input>`<br>Elements classified in this category are: input type *checkbox* and *radio.*

```html
  <input type="radio" id="radio" />
  <input type="date" id="date" />
  <textarea id="area"></textarea>
```
```javascript
  (function() {
    //we use jquery.get() to get first DOM element
    var area = $("#area").get(0);
    var date = $("#date").get(0);
    var radio = $("#radio").get(0);
    if (jsu.inputType.isText(area)) area.value = "I am category:text";
    if (jsu.inputType.isText(date)) date.value = new Date().toISOString().substring(0, 10);
    if (jsu.inputType.isCheck(radio)) radio.checked = true;
  })();
```

### handlerExist *(dom, eventname, namespace)*
This utility allow us to determine if an event handler was created previously by specifying a namespace.<br>
**Note:** [Namespacing events](https://api.jquery.com/on/#event-names) is a technique to handle tasks differently depending on the event namespace used, and it is very useful when you've attached several listeners to the same event, and need to do something with just one of them. Check this article: [Namespaced Events in jQuery](http://css-tricks.com/namespaced-events-jquery/)<br>
**Returns** `Boolean`
* **dom:** `DOM` element
* **eventname:** `String` event type
* **namespace:** `String` event namespace

```javascript
  var txb = $("#txtName").get(0);
  // Checks if the event handler was defined previously
  var defined = jsu.handlerExist(txb, "focus", "fnHighlight");
  // Creates the event handler by namespacing the event
  !defined && $(txb).on("focus.fnHighlight", function(e) {
    console.log("Event type:", e.type);
    console.log("Namespace:", e.namespace || e.handleObj.namespace);
    // Add your code here...
  });
```

### isDOM *(object)*
Determines if the entry parameter is a [DOM Element](http://api.jquery.com/Types/#Element).<br>
**Returns** `Boolean`
* **object:** `Object` to validate

```javascript
  var obj = { name: "Mordecai" };
  if (jsu.isDOM(obj)) { ... } //false
  obj = document.getElementById("txtName");
  if (jsu.isDOM(obj)) { ... } //true
  obj = $(":button");
  if (jsu.isDOM(obj)) { ... } //false
  obj = $(":button").get(0);
  if (jsu.isDOM(obj)) { ... } //true
```

### isFunction *(object)*
Determines if the entry parameter is a function.<br>
**Returns** `Boolean`
* **object:** `Object` to validate

```javascript
  var fn = {};
  if (jsu.isFunction(fn)) { fn(); } //false
  fn = null;
  if (jsu.isFunction(fn)) { fn(); } //false
  fn = "function";
  if (jsu.isFunction(fn)) { fn(); } //false
  fn = function() { alert("is function"); };
  if (jsu.isFunction(fn)) { fn(); } //true
```

### fnStringify *(json)*
This is a reference to [`JSON.stringify`](http://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) and provides a polyfill for old browsers.<br>
fnStringify serialize an object, array or primitive value and returns it as a *JSON string*.<br>
**Returns** `String`
* **json:** `Object` to be serialized

```javascript
  var jsonPerson = {
      name: "David",
      sex: "male",
      age: 30
  };
  console.log(jsu.fnStringify(jsonPerson));
  // '{"name":"David","age":30,"sex":"male"}'

  // We use jQuery.extend to merge the contents of
  // two or more objects together into the first object.
  var jsonNew = $.extend({ alias: 'jherax' }, jsonPerson);
  console.log(jsu.fnStringify(jsonNew));
```

### fnAddScript *(path, before)*
Dynamically add an external script. This method is useful to inject dependencies from an external file, in case your code might fail if it depends on a specific component. Thus for example, if you have a function that uses the  kendo.ui.window component to build a window, you can check for dependencies before trying to access that component.<br>
**Returns** `undefined` this method returns nothing.
* **path:** `String` source of the script to be added. It can also be a `JSON` object with a set of attributes for *[script tag](http://www.quackit.com/html_5/tags/html_script_tag.cfm):* `{ src: String, async: Boolean, defer: Boolean, charset: String }`, we can also specify other properties like `{ execute: Bolean, before: String }` which dictate whether to run the script once loaded, or indicate where to insert it (see the *before* parameter).
* **before:** `String` part of `src` attribute of the element that identifies where the script will be added. This parameter is optional and if it is not specified, the new script will be inserted before `"jherax.js"`

```javascript
  function fnShowWindow(o) {
    var d = $.extend({
      content: null,
      title: "Information",
      appendTo: "body",
      width: "360px"
    }, o);
    if(!window.kendo)
      jsu.fnAddScript({ src: '/scripts/kendo/kendo.core.js', execute: true });
    //After the kendo core is loaded
    if (!kendo.ui.Window)
      jsu.fnAddScript({ src: '/scripts/kendo/kendo.window.js', execute: true });
    //Adds another script asynchronously
    jsu.fnAddScript({ src: '/scripts/fullscreen.js', before: 'kendo.core.js', async: true });
    //Implementation...
  }
```

### fnAddCSS *(path, before)*
Dynamically add an external stylesheet. This method is useful to inject a cascading style sheet resource from an external file, in case that you use some plugins requiring specific css and you don't want to include them inside your main stylesheet.<br>
**Returns** `undefined` this method returns nothing.
* **path:** `String` source of the stylesheet to be added
* **before:** `String` part of `href` attribute of the element that identifies where the resource will be added. This parameter is optional and if it is not specified, the new stylesheet will be appended to `<head>`

```javascript
  (function(){
    //Adds the stylesheet just before main.css link
    jsu.fnAddCSS("/content/css/jquery.dataTables.css", "main.css");
    //or appends the stylesheet to <head> element
    //jsu.fnAddCSS("/content/css/jquery.dataTables.css");
    $('.dataTable').wrap('<div class="tt-wrapper">').dataTable();
  }());
```

### fnEscapeRegExp *(text)*
Escapes user input to be treated as a literal string in a regular expression.<br>
This mean that special characters will be treated as literals.<br>
e.g. The expression `"(\\w+)"` will turn into `"\(\\w\+\)"`<br>
**Returns** `String`, or `null` if ***text*** parameter is not a string
* **text:** `String` to literalize

```javascript
  var re1 = new RegExp("[abc]+\\d"); //treats the string as a regular expression pattern
  var re2 = new RegExp(jsu.fnEscapeRegExp("[abc]+\\d")); //treats the string as a literal
  console.log("re1: " + re1.test("ac1") + ", regexp: " + re1.source); //regexp: /[abc]+\d/
  console.log("re2: " + re2.test("ac1") + ", regexp: " + re2.source); //regexp: /\[abc\]\+\\d/
```

### fnGetQueryToString *(query)*
Gets the value of a specific parameter in the querystring (search in the address bar).<br>
**Returns** `String`. If the parameter is not found, an empty string is returned.
* **query:** `String` with name of the parameter to search for.

```javascript
  //assuming you have the following url
  //http://www.google.com.co/search?q=300+rise+of+an+empire&oq=300
  
  //we want to retrieve the value of [q] parameter
  var q = jsu.fnGetQueryToString("q");
  //prints: "300+rise+of+an+empire"
  console.log(q);
```

### fnGetQueryToJSON *(query)*
Gets the querystring from address bar and is returned as a JSON object.<br>
**Note:** The entry parameter is not mandatory, and if not specified, all variables found in the querystring will be retrieved in a JSON object.<br>
**Returns** `Object` in JSON notation.
* **query:** `String` with name of the parameter to search for.

```javascript
  //assuming you have the following url
  //http://www.youtube.com/watch?v=hrZl_EQUbRQ&hd=1
  
  //we want to retrieve all values from querystring
  var q = jsu.fnGetQueryToJSON();
  console.log(q); //prints: {v: "hrZl_EQUbRQ", hd: "1"}
  
  //we want to retrieve the variable [v] and its value
  var v = jsu.fnGetQueryToJSON("v");
  console.log(v); //prints: {v: "hrZl_EQUbRQ"}
```

### fnCloneObject *(object)*
Clones an object and set all its properties to read-only.<br>
In some cases, you may need to lock an object to prevent being modified.<br>
This could be useful, for example, if you need preserve a model object.<br>
**Returns** `Object`
* **object:** `Object` to be cloned

```javascript
  var ajaxResponse = {
    serie: "Lenovo IdeaPad Z710",
    features: {
      processor: "Intel Core i7-4700MQ",
      graphics: "NVIDIA GeForce GT 745M",
      memory: "PC3-12800 DDR3L",
      ram: 8
    }
  };
  // Clone the original object
  var readOnly = jsu.fnCloneObject(ajaxResponse);
  console.log("READ-ONLY OBJECT:", readOnly);
  readOnly.serie = "ThinkPad W540";
  readOnly.features.ram = 16;
  console.log("READ-ONLY OBJECT:", readOnly);
```

### fnGetDate *(options)*
Gets the string representation of the specified date according to [regional setting](#jsuregional) `dateFormat` `timeFormat`<br>
**Note:** This function has support for [ISO 8601](http://www.ecma-international.org/ecma-262/5.1/#sec-15.9.1.15) format which allow to set the value on `input` of type date, datetime, datetime-local. According to [w3.org](http://www.w3.org/TR/html-markup/input.datetime.html#input.datetime.attrs.value) the *value* attribute must be a valid date-time as defined in [RFC 3339](http://tools.ietf.org/html/rfc3339#section-5.6).<br>
**Returns** `Object`
* **options:** `Object` Optional. If not provided, the current date and time is returned. If you pass an argument, you can specify some of the following options:

```javascript
{
  date: Date|String|Number //date to parse according to regional setting (Default: new Date)
  ISO8601: Boolean //the date will be formatted according to ISO 8601 (Default: false)
}
```
**Note:** The object returned has the following properties:
```javascript
{
  date: String //gets the date according to [dateFormat]
  time: String //gets the time according to [timeFormat]
  dateTime: String //gets the date with [dateFormat] + [timeFormat]
}
```
```javascript
  (function() {
    // We set the language setting
    jsu.regional.set(jsu.regional.english);
    
    // No arguments, gets the current date
    var d = jsu.fnGetDate();
    $("#date").html(d.date +" <b>"+ d.time +"</b>");
    
    // We provide a specific date and format (output ISO-8601)
    var dt = "12/24/2013 23:59:13";
    var iso = jsu.fnGetDate({ date: dt, ISO8601: true });
    console.log("ISO 8601:", iso.dateTime);
    
    // We provide a date in ISO 8601 (output regional)
    dt = "1995-12-17T03:24:59Z"; //Z UTC
    iso = jsu.fnGetDate({ date: dt });
    console.log("UTC:", iso.dateTime);
    
    // We provide a date in ISO 8601 (output regional)
    dt = "1995-12-17T03:24:59-05:00"; //-05:00 offset
    iso = jsu.fnGetDate({ date: dt });
    console.log("Time offset:", iso.dateTime);
    
    // We provide a specific date
    dt = new Date(1395971368528);
    d = jsu.fnGetDate({ date: dt });
    console.log("Regional:", d.dateTime);
  })();
```

### fnDateFromISO8601 *(date)*
Gets the date object from a string in [ISO 8601](http://www.ecma-international.org/ecma-262/5.1/#sec-15.9.1.15) [format](http://www.w3.org/TR/NOTE-datetime).<br>
It is mandatory that input parameter be a string in ISO 8601, otherwise `null` is returned.<br>
**Note:** Time offset and UTC are omitted for the entry parameter.<br>
**Returns** `Date` or `Null`
* **date:** `String` date as string in ISO 8601 [format](http://www.w3.org/TR/NOTE-datetime)

```javascript
  jsu.fnDateFromISO8601(0);
  jsu.fnDateFromISO8601(null);
  jsu.fnDateFromISO8601("12/17/1995");
  var date = jsu.fnDateFromISO8601("1995-12-17T03:24:59Z");
  console.log("Date:", date);
```

### fnGetHtmlText *(value)*
Converts a pure HTML string to encoded html, so if you have the string `<p>hello</p>`,<br>
this function will encode the hmtl text to `&lt;p&gt;hello&lt;/p&gt;`<br>
This method can be used just as a function: *fnGetHtmlText (value)*<br>
or as delegate for jQuery [.val()](http://api.jquery.com/val/#val2) or [.text()](http://api.jquery.com/text/#text2) *fnGetHtmlText (index, value)*<br>
**Returns** `String` with encoded html
* **value:** `String` html to be encoded

```html
  <textarea rows="4"></textarea>
  <textarea rows="6" id="target-v"></textarea>
  <div id="demo-wrapper">
    <h3>fnGetHtmlText</h3>
    <p><u>Delegated function</u></p>
  </div>
```
```javascript
  setTimeout(function() {
    var html = $("#demo-wrapper").html();
    $("textarea").val($.trim(html));
    // you can run it just as a function
    var htmlEncoded = jsu.fnGetHtmlText(html);
    console.log("Encoded:", htmlEncoded);
    $("#target-v").fnShowTooltip("This html will be encoded ...3");
  }, 1);
  
  setTimeout(function() {
    $(".vld-tooltip").remove();
    $("#target-v").fnShowTooltip("This html will be encoded ...2");
  }, 1000);
  
  setTimeout(function() {
    $(".vld-tooltip").remove();
    // you can also run it as a delegate for .val() or .text()
    // note that we just pass the reference to the function
    $("#target-v").val(jsu.fnGetHtmlText).fnShowTooltip("Encoded");
  }, 2000);
```

### fnGetSelectedText ()
Gets the selected text in the document.<br>
**Note:** There are some `<input>` elements that not support text selection.<br>
**Returns** `Object` with the following properties:
```javascript
{
  text: String //selected text (whitespace removed from the beginning and end of text)
  slice: String //complement of selected text (if active element is category:text)
  start: Number //initial cursor position (if active element is category:text)
  end: Number //final cursor position (if active element is category:text)
}
```
<div align="left">Take a look at <a href="#categorytext">category:text</a>&nbsp;</div>
```javascript
  var sel = jsu.fnGetSelectedText();
  if (sel.text !== "") alert(sel.text);
  console.log(sel);
```

### fnGetCaretPosition *(dom)*
Gets the cursor position of ***dom*** element.<br>
**Note:** There are some `<input>` elements that not support text selection.<br>
**Returns** `Number`
* **dom:** `DOM` element [category:text][category.text]

```javascript
  var text = $("#txtName").val("Hello!").get(0);
  var pos = jsu.fnGetCaretPosition(text);
  console.log(pos);
```

### fnSetCaretPosition *(dom, position)*
Sets the cursor ***position*** in the ***dom*** element.<br>
**Note:** There are some `<input>` elements that not support text selection.<br>
* **dom:** `DOM` element [category:text][category.text]
* **position:** `Number` that indicates where the cursor is set

```javascript
  var text = $("#txtName").get(0);
  text.value = "Hello World!";
  text.focus();
  jsu.fnSetCaretPosition(text, 5);
  //cursor is positioned after "Hello"
```

### fnCapitalize *(object, type)*
Applies a transformation to the text, removing all line-breaks, spaces, and tabs from the beginning and end of the supplied string. If the whitespace characters occur in middle of the string, also they are removed.<br>
**Note:** When ***object*** parameter is a `DOM` element, the `value` property is used as the string to transform.<br>
**Note:** The object defined in [`jsu.regional.<language>.wordPattern`](#jsuregional) is a regular expression used to&nbsp; lowercasing some words after text capitalization. Only works when ***type*** parameter is `"word"`<br>
**Note:** You can use this function as a jQuery extension, see [jQuery.fnCapitalize](#jqueryfncapitalize-type).<br>
**Returns** `String`
* **object:** `String` or `DOM` element [category:text][category.text]
* **type:** `String` specifying the text transformation. Can be one of the following values:
  * `"word"` transform to lowercase and then turns the first letter of each word into uppercase
  * `"title"` turns the first letter of each word into uppercase
  * `"first"` turns only the first letter to uppercase
  * `"upper"` transform to uppercase
  * `"lower"` transform to lowercase

```javascript
  var text = "\n  make  your\t  code DRY  \n ";
  console.log('original text: "' + text + '"');
  console.log('word : "' + jsu.fnCapitalize(text, "word" ) + '"');
  console.log('title: "' + jsu.fnCapitalize(text, "title") + '"');
  console.log('first: "' + jsu.fnCapitalize(text, "first") + '"');
  console.log('upper: "' + jsu.fnCapitalize(text, "upper") + '"');
  console.log('lower: "' + jsu.fnCapitalize(text, "lower") + '"');
```
If you want to lowercase specific words, you can do it this way:
```javascript
  (function() {
    // We configure the global language setting
    // The following words will always be lowercase
    jsu.regional.english.wordPattern = /\s(?:And|Are|At|A|O[nrf]|By|In|The)\b/g;
    jsu.regional.set(jsu.regional.english);
    var text = " pc AND KEYBOARD\t ArE oN tHe table ";
    console.log("Before: ", '"' + text + '"');
    // Transforms the text after 2 seconds
    setTimeout(function() {
      text = jsu.fnCapitalize(text, "word");
      console.log("After: ", '"' + text + '"');
    }, 2000);
  })();
```

### fnNumericFormat *(object)*
Sets numeric format according to **es-CO** culture by placing the decimal`.` and thousands`,` separator.<br>
**Note:** When ***object*** parameter is a `DOM` element, the `value` property is used as the string to format.<br>
**Note:** You can use this function as a jQuery extension, see [jQuery.fnNumericFormat](#jqueryfnnumericformat-).<br>
**Returns** `String` with the formatted number
* **object:** `String` or `DOM` element [category:text][category.text]

```javascript
  var num = "123456789,47.15";
  console.log(jsu.fnNumericFormat(num)); //sends string
  var dom = $("#txtName").val(num).get(0);
  jsu.fnNumericFormat(dom) //sends DOM
  console.log(dom.value);
```

### fnIsValidFormat *(object, type)*
Validates the format, depending on ***type*** supplied. Date validations are run according to [regional setting](#jsuregional).<br>
**Note:** When ***object*** parameter is a `DOM` element, the `value` property is used as the string to validate.<br>
**Note:** You can use this function as a jQuery extension, see [jQuery.fnIsValidFormat](#jqueryfnisvalidformat-type).<br>
**Returns** `Boolean`
* **object:** `String` or `DOM` element [category:text][category.text]
* **type:** `String` specifying the type of validation:
  * `"t"` validates the time format ([timeFormat](#jsuregional))
  * `"d"` validates the date format ([dateFormat](#jsuregional))
  * `"dt"` validates full date format ([dateFormat + timeFormat](#jsuregional))
  * `"pass"` validates the password strength (must have 8-20 characters, 1+ uppercase, 1+ number)
  * `"email"` validates the email address
  * `"lat"` validates the latitude
  * `"lon"` validates the longitude

```javascript
  (function() {
    //We configure the global language setting
    jsu.regional.set(jsu.regional.english);
    var _dateTime = "10/31/2013 16:10";
    var _email = "some-mail.gmail.com";
    var _pass = "insufficient";
    console.log(jsu.fnIsValidFormat(_dateTime, "dt"));
    console.log(jsu.fnIsValidFormat(_email, "email"));
    console.log(jsu.fnIsValidFormat(_pass, "pass"));
  })();
```

### fnIsValidDate *(dom, options)*
Evaluates whether the entry `DOM` element has the date format for the `value` property.<br>
Date validations are performed according to [regional setting](#jsuregional) `dateFormat` `timeFormat`<br>
The validation message is displayed with a tooltip. If [jQuery.ui.position](http://api.jqueryui.com/position/) is available, the tooltip is rendered by jQuery.ui.position, otherwise an extension method for built-in jQuery.position is used.<br>
**Note:** You can use this function as a jQuery extension, see [jQuery.fnIsValidDate](#jqueryfnisvaliddate-options).<br>
**Important:** You can customize the messages defined in [`jsu.regional`](#jsuregional) namespace:<br>
`dateIsGreater` `dateIsLesser` `dateFormatError`<br>
**Returns** `Boolean`
* **dom:** `DOM` element [category:text][category.text]
* **options:** `Object` that provides the following settings:

```javascript
{
  compareTo: Date|String //date against which to compare the dom value (Default: new Date)
  isFuture: Boolean //does entry date must be greater than [compareTo] (Default: false)
  warning: String //message indicating that entry date did not meet the requirements
  position: Object //tooltip position { at, my, collision } (Default: see fnShowTooltip)
}
```
```javascript
  (function() {
    //We configure the global language setting
    jsu.regional.set(jsu.regional.english);
    var d = new Date();
    $("#txtLicence").val(
      jsu.fnGetDate({ date: d.setHours(24) }).date);
    $("#txtBirthday").val(
      jsu.fnGetDate({ date: d.setHours(24) }).date);
  }());

  //Validates elements in the form
  $("#btnSend").on("click", function() {
    var dBirthday = $("#txtBirthday").get(0);
    var dDriverLic = $("#txtLicence").get(0);

    if (!jsu.fnIsValidDate(dDriverLic)) return false;
    if (!jsu.fnIsValidDate(dBirthday, {
        compareTo: dDriverLic.value,
        warning: "Your birthday can't be greater than driver's license expedition"
    })) return false;

    alert("Submit form");
  });
```

### fnShowTooltip *(dom, message, position)*
This function is very useful when you need display a validation message.<br>
Shows the ***message*** in a tooltip at the right side of the ***dom*** element and focuses that element.<br>
The tooltip element is painted according to the rules defined by [`.vld-tooltip`][jherax.css] class.<br>
It has the following `DOM` structure: `<span class="vld-tooltip"> your message </span>`<br>
**Important:** If [jQuery.ui.position](http://api.jqueryui.com/position/) is available, the tooltip is rendered by jQuery.ui.position, otherwise an extension method for built-in jQuery.position is used.<br>
**Note:** The position for all tooltips can be overridden by specifying the object [`jsu.settings.position`](#jsu.settings.position)<br>
**Note:** You can use this function as a jQuery extension, see [jQuery.fnShowTooltip](#jqueryfnshowtooltip-message-position).<br>
**Returns** `Boolean`, always returns `false`
* **message:** `String` with the message to display
* **dom:** `DOM` element to where the tooltip is positioned
* **position** `Object` This parameter is not mandatory. It defines the position where the tooltip is displayed and have the following properties:

```javascript
{
  at: String. Default "right center". //Defines which position on the target element to align the positioned element against: "horizontal vertical" alignment.
  my: String. Default "left+6 center". //Defines which position on the element being positioned to align with the target element: "horizontal vertical" alignment.
  collision: String. Default "flipfit". //Only works when jQuery.ui.position is available.
}
```

```javascript
  (function() {
    //configure the global language setting
    jsu.regional.set(jsu.regional.english);
  
    var email = $("#txtEmail").get(0);
    var admission = $("#txtDate").get(0);
    
    if (!jsu.fnIsValidFormat(email, "email")) {
      // Displays the tooltip at the default position
      return jsu.fnShowTooltip(email, "The email address is not valid");
    }
    if (!jsu.fnIsValidFormat(admission, "d")) {
      // Displays the tooltip at the specified position
      return jsu.fnShowTooltip(
        admission,
        "The admission date is not valid", {
            at: "left bottom",
            my: "left+2 top+5"
        });
    }
  }());
```

### fnShowDialog *(options)*
This is a facade for [`jQuery.ui.dialog`](http://api.jqueryui.com/dialog/) which is a modal window useful for displaying text, [DOM](http://api.jquery.com/Types/#Element) or [jQuery](http://api.jquery.com/Types/#jQuery) elements. 
You can display text as html by passing the string to `content` property. Generated HTML is appended by default 
to where [`jsu.wrapper`](#getting-started) selector indicate, but if you want to place it into a specific element,
then you can provide the wrapper selector to `appendTo` property.<br>
There are some [images](https://dl.dropboxusercontent.com/u/91579606/img.zip) used to display an icon to the left side of text, only if `content` parameter is a string.<br>
Also you can display existing HTML elements by passing the *DOM* or *jQuery* object to the `content` property.<br>
The `closeOnPageUnload` option determines whether dialog should be closed on `window.beforeunload` event.<br>
**Note:** It has a dependency on [jQuery.UI][jQuery.ui] and also has some [css rules][jherax.css].<br>
**Returns** `jQuery` dialog element
* options: Object that provides the following properties: //TODO

### fnSetFocus ()
Sets the focus on all `input:text` and `textarea` elements, except those that have `.no-auto-focus` class.<br>
This function is useful when you need validate form fields using any of the below [jQuery plugins](#jquery-plugins).
```javascript
  $(document).on("ready", function() {
	  $("#txtDate").datepicker().addClass("no-auto-focus");
	  $("#txtName").fnCapitalize("word");
	  $("#txtID").fnNumericInput();
  });
  $("#btnSendForm").on("click", function() {
	  jsu.fnSetFocus();
  });
```

### fnLoading *(options)*
Shows a overlay screen with the "loading" indicator at the center.<br>
The progress animation is done via CSS3, so you must add the following [css][jherax.css]:<br>
`#floatingBarsG` `.blockG` `@keyframes fadeG` `.bg-fixed` `.bg-opacity`<br>
**Returns** `Boolean`, always returns `true`
* **options:** `Object` that provides the following settings:

```javascript
{
  show: Boolean //shows the loading screen (Default: true)
  hide: Boolean //hides the loading screen (Default: false)
  delay: Number //miliseconds of fadeIn animation (Default: 2600)
}
```
```javascript
  $("#btnTest").on("click", function() {
    jsu.fnLoading();
    setTimeout(function() {
      jsu.fnLoading({ hide:true });
    }, 8000);
  });
```

jQuery plugins
--------------
This is a set of utilities for [jQuery](http://jquery.com/).<br>
jQuery is a fast, small, and feature-rich JavaScript library. It makes things like HTML document traversal and manipulation, event handling, animation, and Ajax much simpler with an easy API that works cross-browser.<br>
If you want to learn more about jQuery, here is a full guide: [How jQuery Works](http://learn.jquery.com/about-jquery/how-jquery-works/).

### jQuery.fnCenter (options)
Sets the collection of jquery objects in the center of screen.<br>
Elements are centered using fixed position.<br>
**Returns** `jQuery`
```javascript
  // with existing element
  $(".warning").fnCenter();
  // or create a new one
  var div = $('<div id="divHello" />').css({
    'padding': '20px',
    'background': '#ccc',
    'borderRadius': '5px'
  }).appendTo("body").html("<h4>Hello jQuery</h4>");
  div.fnCenter();
```

### jQuery.fnMaxLength *(length, options)*
Limits the maximum length of characters allowed in the elements [category:text][category.text]<br>
A tooltip will be placed on the right side of input element showing the characters remaining.<br>
It has a dependency on [jQuery.UI][jQuery.ui] for positioning, and also has a [css class][jherax.css] `.vld-tooltip`<br>
**Returns** `jQuery`
* **length:** `Number` specifying the max length of characters

```javascript
  $("#txtName").fnMaxLength(20);
  $(".numbers").fnMaxLength(10);
```

### jQuery.fnCapitalize *(type)*
This is the jQuery extension for [fnCapitalize](#fncapitalize-object-type) function.<br>
Applies a transformation to the text, removing all line-breaks, spaces, and tabs from the beginning and end of the supplied string. If the whitespace characters occur in middle of the string, also they are removed.<br>
**Note:** The object defined in [`jsu.regional.<language>.wordPattern`](#jsuregional) is a regular expression used to&nbsp; lowercasing some words after text capitalization. Only works when ***type*** parameter is `"word"`<br>
**Note:** The text is transformed when the `blur` event occurs.<br>
**Returns** `jQuery`
* **type:** `String` specifying the text transformation. Can be one of the following values:
  * `"word"` transform to lowercase and then turns the first letter of each word into uppercase
  * `"title"` turns the first letter of each word into uppercase
  * `"first"` turns only the first letter to uppercase
  * `"upper"` transform to uppercase
  * `"lower"` transform to lowercase

```javascript
  setTimeout(function() {
    var text = "\n do\t it  with\t  jQuery\t\n ";
    var $input = $("#txtName").val(text).width(180);
    $input.fnShowTooltip("This text will be transformed");
    $input.fnCapitalize("title").focus();
  }, 1);

  //raise blur event to transform text
  setTimeout(function() {
    alert("click to transform");
    $("#txtName").blur();
  }, 2000);
```
If you want to lowercase specific words, you can do it this way:
```javascript
  (function() {
    // We configure the global language setting
    // The following words will always be lowercase
    jsu.regional.english.wordPattern = /\s(?:And|Are|At|A|O[nrf]|By|In|The)\b/g;
    jsu.regional.set(jsu.regional.english);
    // You can bind the event handler at beginning
    var $input = $("#txtName").fnCapitalize("word");
    var text = " pc AND KEYBOARD\t ArE oN tHe table ";
    // Raise blur event to transform text
    $input.val(text).focus();
    setTimeout(function() {
      alert("transform");
      $input.blur();
    }, 2000);
  })();
```

### jQuery.fnNumericFormat ()
This is the jQuery extension for [fnNumericFormat](#fnnumericformat-object).<br>
Sets numeric format according to **es-CO** culture.<br>
Places the decimal`.` and thousands`,` separator.<br>
**Note:** Text is formatted when `keyup, blur` events occurs.<br>
**Returns** `jQuery`
```javascript
  var num = "123456789,47.15";
  console.log(num); //number to be formatted
  $("#txtName").val(num).fnNumericFormat().focus();
```

### jQuery.fnNumericInput ()
This function allows that only numeric keys can be pressed at the input.<br>
**Returns** `jQuery`
```javascript
  $(".vld-numeric").fnNumericInput();
```

### jQuery.fnCustomInput *(mask)*
This function applies a mask for the allowed characters.<br>
**Returns** `jQuery`
* **mask:** It can be one of these types:<br>`String`: a literal with the allowed characters.<br>`RegExp`: a regular expression for the allowed characters.

```javascript
  $("#txtGrade").fnCustomInput("abc1-6");
  $("#txtEmail").fnCustomInput(/[@ñ;.\-\w]/);
```

### jQuery.fnDisableKey *(keys)*
Disables the specified keyboard keys.<br>
To allow a set of characters, better use [$.fnCustomInput](#jqueryfncustominput-mask)<br>
**Returns** `jQuery`
* **keys:** `String` with character(s) that will be blocked

```javascript
  // prevents the spacebar be pressed in the document
  $(document).fnDisableKey(" ");
  // avoids pressing the keys q,w,e,r,t on the input
  $("#txtName").fnDisableKey("qwert");
```

### jQuery.fnIsValidFormat *(type)*
This is the jQuery extension for [fnIsValidFormat](#fnisvalidformat-object-type).<br>
Validates the format of `value`, depending on ***type*** supplied.<br>
Date validations are performed according to [regional setting](#jsuregional).<br>
**Returns** `jQuery`
* **type:** `String` specifying the type of validation:
  * `"t"` validates the time format ([timeFormat](#jsuregional))
  * `"d"` validates the date format ([dateFormat](#jsuregional))
  * `"dt"` validates full date format ([dateFormat + timeFormat](#jsuregional))
  * `"pass"` validates the password strength (must have 8-20 characters, 1+ uppercase, 1+ number)
  * `"email"` validates the email address
  * `"lat"` validates the latitude
  * `"lon"` validates the longitude

```javascript
  (function() {
    //We configure the global language setting
    jsu.regional.set(jsu.regional.english);
    var dt = $("#date").val("12/31/2013 23:10");
    var isValid = dt.fnIsValidFormat("dt");
    console.log("Is dateTime: ", isValid);
  })();
```

### jQuery.fnIsValidDate *(options)*
This is the jQuery extension for [fnIsValidDate](#fnisvaliddate-dom-options).<br>
Evaluates whether the first element in the collection has the `value` with date format.<br>
Date validations are performed according to [regional setting](#jsuregional) `dateFormat` `timeFormat`<br>
The validation message is displayed with a tooltip. If [jQuery.ui.position](http://api.jqueryui.com/position/) is available, the tooltip is rendered by jQuery.ui.position, otherwise an extension method for built-in jQuery.position is used.<br>
**Important:** You can customize the messages defined in [`jsu.regional`](#jsuregional) namespace:<br>
`dateIsGreater` `dateIsLesser` `dateFormatError`<br>
**Returns** `jQuery`
* **options:** `Object` that provides the following settings:

```javascript
{
  compareTo: Date|String //date against which to compare the dom value (Default: new Date)
  isFuture: Boolean //does entry date must be greater than [compareTo] (Default: false)
  warning: String //message indicating that entry date did not meet the requirements
}
```
```javascript
  (function() {
    //We configure the global language setting
    jsu.regional.set(jsu.regional.english);
    var d = new Date();
    $("#txtLicence").val(
      jsu.fnGetDate({ date: d.setHours(24) }).date);
    $("#txtBirthday").val(
      jsu.fnGetDate({ date: d.setHours(24) }).date);
  }());

  //Validates elements in the form
  $("#btnSend").on("click", function() {
    if (!$("#txtLicence").fnIsValidDate()) return false;
    if (!$("#txtBirthday").fnIsValidDate({
        compareTo: $("#txtLicence").val(),
        warning: "Your birthday can't be greater than driver's license expedition"
    })) return false;

    alert("Submit form");
  });
```

### jQuery.fnEasyValidate *(options)*
Validates the form fields with [css class][jherax.css] `.vld-required` through a submit button.<br>
It has a dependency on [jQuery.UI][jQuery.ui] for the validation notification.<br>
If you wish to validate only a set of elements in the form, you can specify a **validation group** by adding the `data-validation` attribute to the elements to validate and also to the submit button.<br>
**Returns** `jQuery`
* **options:** `Object` that provides the following settings:

```javascript
{
  fnvalidator: Function //performs a custom validation and the function must return true or false
  firstItemInvalid: Boolean //validates first item of <select> as an invalid option (Default: true)
}
```
```html
<select id="ddlType" class="vld-required" data-validation="group.a">
  <option value="0">Select...</option>
  <option value="1">Magnetic</option>
  <option value="2">Electric</option>
</select>
<input type="number" id="txtValue" class="vld-numeric vld-required" data-validation="group.a" />
<input type="date" id="txtDate" class="vld-required" /><!--This one is not in validation group-->
<button type="submit" id="btnAdd" data-validation="group.a">Add new item</button>
```
```javascript
$(document).on("ready", function () {
  $(".vld-numeric").fnNumericInput();
  $("#txtDate").datepicker().addClass("no-auto-focus");
  //$("#btnAdd").fnEasyValidate(); //only validates required fields
  $("#btnAdd").fnEasyValidate({
    firstItemInvalid: true,
    fnValidator: function (btn) {
      var num = $('#txtValue').get(0);
      if (parseFloat(num.value) < 1000) {
        return jsu.fnShowTooltip(num, "Price must be greater than $999"); //cancel submit
      }
      return true; //submit the form
  	}
  });
});
```

### jQuery.fnConfirm *(options)*
TODO

Appendix
--------
### Category:text
We speak about *DOM element category:text* when that object belongs to one of the following html elements:
```html
  <textarea></textarea>
  <input type="text" />
  <input type="password" />
  <input type="number" />
  <input type="search" />
  <input type="tel" />
  <input type="url" />
  <input type="email" />
  <input type="datetime" />
  <input type="datetime-local" />
  <input type="date" />
  <input type="time" />
  <input type="month" />
  <input type="week" />
  <input type="file" />
```

Issues
------
If you discover a bug, please let me know here on GitHub!<br>
https://github.com/jherax/js-utils/issues

Versioning
----------
The releases will be numbered with the follow format:<br>
`<major>.<minor>.<patch>`

And constructed with the following guidelines:

* Breaking backwards compatibility bumps the major
* New additions without breaking backwards compatibility bumps the minor
* Bug fixes and misc changes bump the patch

For more information on semantic versioning, please visit http://semver.org/

Author
------
Developed by [David Rivera](http://careers.stackoverflow.com/jheraxcorp) ([stackoverflow](http://stackoverflow.com/users/2247494/jherax-corp) / [GitHub](https://github.com/jherax)) as *jherax*, from Bogota-Colombia.


License
-------
Licensed under the MIT License

<!-- links -->
[js-utils]: http://jherax.github.io/
[jQuery.js]: http://code.jquery.com/jquery-1.10.2.min.js
[jQuery.ui]: http://ajax.googleapis.com/ajax/libs/jqueryui/1.9.2/jquery-ui.min.js
[category.text]: #categorytext
[jherax.css]: https://github.com/jherax/js-utils/tree/master/assets/css/jherax.css
[jherax.js]: https://github.com/jherax/js-utils/tree/master/assets/js/jherax.js
