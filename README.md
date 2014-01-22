[js-utils][js-utils]
========

These are a suite of utilities for javascript and jquery, including tools for validating, text formatting, and misc.

Getting Started
---------------
The tools has a dependency on [jQuery 1.9+][jQuery.js], which must be loaded before *[js-utils][jherax.js]*.<br>
Also require some [CSS][jherax.css] for tooltip elements and other stuff.<br>
Some functions depend on [jQuery.UI][jQuery.ui]<br><br>
The namespace is `js.utils`, so we must use it to access the methods exposed.<br>
A property called `wrapper` was exposed in `js` namespace to specify where the [tooltip](#fnshowtooltip-dom-message) and [loading](#fnloading-options) elements will be appended. By default `js.wrapper = "body"`<br>

Namespacing
-----------
In many programming languages, namespacing is a technique employed to avoid collisions with other objects or variables in the global namespace. They're also extremely useful for helping organize blocks of functionality in your application into easily manageable groups that can be uniquely identified.<br>

In JavaScript, namespacing at an enterprise level is critical as it's important to safeguard your code from breaking in the event of another script on the page using the same variable or method names as you are.

List of methods
---------------
* [browser](#browser)
* [isDOM](#isdom-object)
* [isEvent](#isevent-object)
* [isFunction](#isfunction-object)
* [fnStringify](#fnstringify-json)
* [fnGetDate](#fngetdate-)
* [fnGetHtmlText](#fngethtmltext-index-value)
* [fnGetSelectedText](#fngetselectedtext-)
* [fnGetCaretPosition](#fngetcaretposition-dom)
* [fnSetCaretPosition](#fnsetcaretposition-dom-position)
* [fnEscapeRegExp](#fnescaperegexp-text)
* [fnCapitalize](#fncapitalize-object-type)
* [fnNumericFormat](#fnnumericformat-object)
* [fnIsValidFormat](#fnisvalidformat-object-type)
* [fnIsValidDate](#fnisvaliddate-dom-options)
* [fnShowTooltip](#fnshowtooltip-dom-message)
* [fnShowDialog--TODO](#fnshowdialog-options)
* [fnLoading](#fnloading-options)
* [fnSetFocus](#fnsetfocus-)

jQuery extensions
-----------------
* [$.fnCenter](#jqueryfncenter-)
* [$.fnMaxLength](#jqueryfnmaxlength-length)
* [$.fnCapitalize](#jqueryfncapitalize-type)
* [$.fnNumericFormat](#jqueryfnnumericformat-)
* [$.fnNumericInput](#jqueryfnnumericinput-)
* [$.fnCustomInput](#jqueryfncustominput-mask)
* [$.fnDisableKey](#jqueryfndisablekey-keys)
* [$.fnEasyValidate](#jqueryfneasyvalidate-options)
* [$.fnConfirm--TODO](#jqueryfnconfirm-options)

Usage
-----

### browser
Adds support for browser detect, because jquery 1.9+ deprecates the *[browser]* property.<br>
For detecting capabilities, better to use [Modernizr](http://modernizr.com/docs/).<br>
**Returns** `Object`
```javascript
  // see browser and version
  console.log(js.utils.browser);
  // check for a specific browser
  if (js.utils.browser.msie) { ... }
  if (js.utils.browser.chrome) { ... }
  if (js.utils.browser.mozilla) { ... }
  if (js.utils.browser.opera) { ... }
```

### isDOM *(object)*
Determines if a object is DOM element.<br>
**Returns** `Boolean`
* **object:** `Object` to validate

```javascript
  var _dom = document.getElementById("txtName");
  if (js.utils.isDOM(_dom)) { ... }
```

### isEvent *(object)*
Determines if the entry parameter is a normalized [Event Object](http://api.jquery.com/category/events/event-object/).<br>
**Returns** `Boolean`
* **object:** `Object` to validate

```javascript
  $(":button").on("click", function(e) {
    console.log(js.utils.isEvent(e));
  });
```

### isFunction *(object)*
Determines if the entry parameter is a function.<br>
**Returns** `Boolean`
* **object:** `Object` to validate

```javascript
  var fn = {};
  if (js.utils.isFunction(fn)) { fn(); }
  fn = null;
  if (js.utils.isFunction(fn)) { fn(); }
  fn = "function";
  if (js.utils.isFunction(fn)) { fn(); }
  fn = function() { alert("is function"); };
  if (js.utils.isFunction(fn)) { fn(); }
```

### fnStringify *(json)*
This is a facade of `JSON.stringify` and provides support in old browsers.<br>
fnStringify serializes a *JSON* object and returns its string representation.<br>
**Returns** `String`
* **json:** `JSON` object to be serialized

```javascript
  var jsonPerson = {
      name: "David",
      sex: "male",
      age: 30
  };
  console.log(js.utils.fnStringify(jsonPerson));
  // '{"name":"David","age":30,"sex":"male"}'

  // We use jQuery.extend to merge the contents of
  // two or more objects together into the first object.
  var jsonNew = $.extend({ alias: 'jherax' }, jsonPerson);
  console.log(js.utils.fnStringify(jsonNew));
```

### fnGetDate ()
Gets the text of current date in **es-CO** culture.<br>
**Returns** `Object` with the following properties:
```javascript
{
  date: String //gets the date in dd/MM/yyyy format
  time: String //gets the time in HH:mm:ss format
  dateTime: String //date in dd/MM/yyyy HH:mm:ss format
}
```
```javascript
  var d = js.utils.fnGetDate();
  $("#span-time").html(d.date +" <b>"+ d.time +"</b>");
```

### fnGetHtmlText *(index, value)*
Gets the text as html encoded.<br>
This is a delegate for [jQuery.val()](http://api.jquery.com/val/#val2) or [jQuery.text()](http://api.jquery.com/text/#text2)<br>
**Returns** `String` with encoded html text
```html
  <textarea rows="4"></textarea>
  <textarea rows="6" class="target"></textarea>
  <div id="demo-wrapper">
    <h3>fnGetHtmlText</h3>
    <p><u>Demo for delegated function</u></p>
  </div>
```
```javascript
  var html = $("#demo-wrapper").html();
  console.log(html);
  $("textarea").val($.trim(html));
  $(".target").val(js.utils.fnGetHtmlText);
  // invoke the function programmatically
  console.log(js.utils.fnGetHtmlText(0, html));
```

### fnGetSelectedText ()
Gets the selected text in the document.<br>
**Returns** `Object` with the following properties:
```javascript
{
  text: String //selected text (whitespace removed from the beginning and end of text)
  slice: String //complement of selected text (if active element is category:text)
  start: Number //initial cursor position (if active element is category:text)
  end: Number //final cursor position (if active element is category:text)
}
```
<div align="right">Take a look at <a href="#categorytext">category:text</a>&nbsp;</div>
```javascript
  var sel = js.utils.fnGetSelectedText();
  if (sel.text !== "") alert(sel.text);
  console.log(sel);
```

### fnGetCaretPosition *(dom)*
Gets the cursor position in the text.<br>
**Returns** `Number`
* **dom:** `DOM` active element [category:text][category.text]

```javascript
  var text = document.getElementById("txtName");
  text.value = "Hello World!";
  var pos = js.utils.fnGetCaretPosition(text);
  console.log(pos);
```

### fnSetCaretPosition *(dom, position)*
Sets the cursor position in the text.<br>
* **dom:** `DOM` element [category:text][category.text]
* **position** `Number` of the position where the cursor is set

```javascript
  var text = $("#txtName").get(0);
  text.value = "Hello World!";
  text.focus();
  js.utils.fnSetCaretPosition(text, 5);
  //cursor must be positioned after "Hello"
```

### fnEscapeRegExp *(text)*
Escaping user input to be treated as a literal string within a regular expression.<br>
**Returns** `String` or `null` if *text* parameter is not a string
* **text:** `String` to escape characters

```javascript
  var re1 = new RegExp("[abc]+\\d"); //treats the string as a regular expression pattern
  var re2 = new RegExp(js.utils.fnEscapeRegExp("[abc]+\\d")); //treats the string as a literal
  console.log("re1: " + re1.test("ac1") + ", regexp: " + re1.source); //regexp: /[abc]+\d/
  console.log("re2: " + re2.test("ac1") + ", regexp: " + re2.source); //regexp: /\[abc\]\+\\d/
```

### fnCapitalize *(object, type)*
Transforms the text to capital letter. (Some articles are lowercased according to **es-CO** culture)<br>
This function also removes all newlines, spaces, and tabs from the beginning and end of the supplied string.<br>
If the whitespace characters occur in the middle of the string, also they are removed.<br>
**Returns** `String`
* **object:** `String` or `DOM` element [category:text][category.text]
* **type:** `String` specifying the text transformation. Can be one of the following values:
  * `word` transform to lowercase and then turns the first letter of each word into uppercase
  * `title` turns the first letter of each word into uppercase
  * `lower` transform to lowercase
  * `upper` transform to uppercase

```javascript
  var test = "  \t  hello  to  THE \t  wOrLD  \n   ";
  console.log("word : " + js.utils.fnCapitalize(test, "word"));
  console.log("title: " + js.utils.fnCapitalize(test, "title"));
  console.log("lower: " + js.utils.fnCapitalize(test, "lower"));
  console.log("upper: " + js.utils.fnCapitalize(test, "upper"));
```

### fnNumericFormat *(object)*
Sets the numeric format according to **es-CO** culture.<br>
Places the decimal`.` and thousand`,` separator.<br>
**Returns** `String` with the formatted number
* **object:** `String` or `DOM` element [category:text][category.text]

```javascript
  var num = "123456789,47.15";
  console.log(js.utils.fnNumericFormat(num)); //sends string
  var dom = $("#txtName").val(num).get(0);
  js.utils.fnNumericFormat(dom) //sends DOM
  console.log(dom.value);
```

### fnIsValidFormat *(object, type)*
Validates the format of text, depending on the type supplied.<br>
**Note:** Date validations are performed according to **es-CO** culture.<br>
**Returns** `Boolean`
* **object:** `String` or `DOM` element [category:text][category.text]
* **type:** `String` specifying the type of validation. Can be one of the following values:
  * `d` validates the date format - dd/MM/yyyy
  * `t` validates the time format - HH:mm:ss
  * `dt` validates date format - dd/MM/yyyy HH:mm:ss
  * `email` validates an email address
  * `pass` validates the password strength (must have 8-20 characters, one+ uppercase, one+ number)
  * `lat` validates the latitude
  * `lon` validates the longitude

```javascript
  var _dateTime = "31/10/2013 16:10:00";
  var _email = "jherax-12gmail.com";
  var _pass = "insufficient";
  console.log(js.utils.fnIsValidFormat(_dateTime, "dt"));
  console.log(js.utils.fnIsValidFormat(_email, "email"));
  console.log(js.utils.fnIsValidFormat(_pass, "pass"));
```

### fnIsValidDate *(dom, options)*
Evaluates whether the value of text is a date or not.<br>
The validation outcome will be shown in a tooltip.<br>
Tooltip has a dependency on [jQuery.UI][jQuery.ui]<br>
**Note:** Date validations are performed according to **es-CO** culture.<br>
**Important:** You can set up the format error message through the property:<br>
`js.utils.`<b><code>fnIsValidDate.formatError</code></b><br>
**Returns** `Boolean`
* **dom:** `DOM` element [category:text][category.text]
* **options:** `Object` that provides the following settings:

```javascript
{
  compareTo: Date|String //date against which to compare the entry value (Default: new Date())
  isFuture: Boolean //determines whether entry date must be greater than [compareTo] (Default:false)
  warning: String //message indicating that entry date did not meet the requirements
}
```
```javascript
  //this can be specified in a master page or using a singleton
  js.utils.fnIsValidDate.formatError = "The date format is incorrect";
  
  //validates the form
  $("#btnSendForm").on("click", function() {
  
  	var dBirthday = $("#txtBirthday").get(0);
  	dBirthday.value = js.utils.fnGetDate().date;
  	var dDriverLic = $("#txtDriverLic").val("28/02/2010").get(0);
  
  	if (!js.utils.fnIsValidDate(dDriverLic, {
  		warning: "The driver's license expedition can't be greater than today"
  	})) return false;
  
  	if (!js.utils.fnIsValidDate(dBirthday, {
  		compareTo: dDriverLic.value,
  		warning: "Your birthday can't be greater than driver's license expedition"
  	})) return false;
  
  });
```

### fnShowTooltip *(dom, message)*
Shows a tooltip ***message*** at the right side of the ***dom*** element and focuses that element.<br>
This function is very useful when need to notify the validation outcome.<br>
It has a dependency on [jQuery.UI][jQuery.ui] and also has a [css class][jherax.css] `.vld-tooltip`<br>
**Returns** `Boolean`, always returns `false`
* **message:** `String` with the text to show
* **dom:** `DOM` element

```javascript
  var _email = document.getElementById("txtEmail");
  if (!js.utils.fnIsValidFormat(_email, "email")) {
    return js.utils.fnShowTooltip(_email, "The email address is not valid");
  }
```

### fnShowDialog *(options)*
TODO

### fnLoading *(options)*
Shows a overlay screen with the "loading" indicator at the center.<br>
The progress animation is performed through CSS3, so you must add the [css class][jherax.css]:<br>
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
    js.utils.fnLoading();
    setTimeout(function() {
      js.utils.fnLoading({ hide:true });
    }, 8000);
  });
```

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
	  js.utils.fnSetFocus();
  });
```

jQuery plugins
--------------
This is a set of utilities for [jQuery](http://jquery.com/).<br>
jQuery is a fast, small, and feature-rich JavaScript library. It makes things like HTML document traversal and manipulation, event handling, animation, and Ajax much simpler with an easy API that works cross-browser.<br>
If you want to learn more about jQuery, here is a full guide: [How jQuery Works](http://learn.jquery.com/about-jquery/how-jquery-works/).

### jQuery.fnCenter ()
Sets the collection of jquery objects in the center of screen.<br>
Elements are centered using fixed position.<br>
**Returns** `jQuery`
```javascript
  var div = $('<div id="divHello" />').css({
    'padding': '20px',
    'background': '#ccc',
    'borderRadius': '5px'
  }).appendTo("body").html("<h4>Hello jQuery</h4>");
  div.fnCenter();
```

### jQuery.fnMaxLength *(length)*
Limits the max length of characters in the elements [category:text][category.text]<br>
A tooltip will be placed on the right side of input element showing the characters remaining.<br>
It has a dependency on [jQuery.UI][jQuery.ui] and also has a [css class][jherax.css] `.vld-tooltip`<br>
**Returns** `jQuery`
* **length:** `Number` specifying the max length of characters

```javascript
  $("#txtName").fnMaxLength(20);
  $(".numbers").fnMaxLength(10);
```

### jQuery.fnCapitalize *(type)*
This is the jQuery version of [fnCapitalize](#fncapitalize-object-type).<br>
Transforms the text to capital letter. (Some articles are lowercased according to **es-CO** culture)<br>
The plugin also removes all newlines, spaces, and tabs from the beginning and end of the string.<br>
If the whitespace characters occur in the middle of the string, also they are removed.<br>
**Note:** The text is transformed when the `blur` event occurs.<br>
**Returns** `jQuery`
* **type:** `String` specifying the text transformation. Can be one of the following values:
  * `word` transform to lowercase and then turns the first letter of each word into uppercase
  * `title` turns the first letter of each word into uppercase
  * `lower` transform to lowercase
  * `upper` transform to uppercase

```javascript
  var text = "  \t  hello \t\t  jQuery\t\n ";
  console.log(text);
  var name = $("#txtName").val(text);
  name.fnCapitalize("title").focus();
  //raise blur event to transform text
```

### jQuery.fnNumericFormat ()
This is the jQuery version of [fnNumericFormat](#fnnumericformat-object).<br>
Sets the numeric format according to **es-CO** culture.<br>
Places the decimal`.` and thousand`,` separator.<br>
**Note:** Text is formatted when the `keyup, blur` events occurs.<br>
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

### jQuery.fnEasyValidate *(options)*
Validates the form fields with css class `.vld-required` through a submit button.<br>
It has a dependency on [jQuery.UI][jQuery.ui] for the validation notification.<br>
If you wish to validate only a set of elements in the form, you can specify a **validation group** by adding the `data-validation` attribute to the elements to validate and also to the submit button.<br>
**Returns** `jQuery`
* **options:** `Object` that provides the following settings:

```javascript
{
  fnvalidator: Function //Performs a custom validation and must return true or false
  firstItemInvalid: Boolean //Validates first item of <select> as an invalid option (Default: true)
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
        return js.utils.fnShowTooltip(num, "Price must be greater than $999"); //cancel submit
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
[js-utils]: https://github.com/jherax/js-utils.git
[jQuery.js]: http://code.jquery.com/jquery-1.10.2.min.js
[jQuery.ui]: http://ajax.googleapis.com/ajax/libs/jqueryui/1.9.2/jquery-ui.min.js
[category.text]: #categorytext
[jherax.css]: https://github.com/jherax/js-utils/tree/master/assets/css/jherax.css
[jherax.js]: https://github.com/jherax/js-utils/tree/master/assets/js/jherax.js
