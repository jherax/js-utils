[JSU Library][jsu-library]
========

This is a library of JavaScript / jQuery utilities, which includes tools for data validation and text formatting, plugins for tooltip, modal-windows and positioning elements, resources injection, string and JSON manipulation, object cloning, sorting arrays, and other features.

Documentation
-------------
Go to the documentation site to see the API reference and examples:<br>
  - [http://jherax.github.io/?lang=english](http://jherax.github.io/?lang=english#jsu-library)
  - [http://jherax.github.io/?lang=spanish](http://jherax.github.io/?lang=spanish#jsu-library)

Getting Started
---------------
The library has a dependency on [jQuery 1.8+][jQuery.js] which must be loaded before jsu-library.<br>
It also requires some [CSS][jherax.css] rules for functions showing **tooltips**, **loadings**, among others.

If [jQuery.ui.position](http://api.jqueryui.com/position/) is available, all tooltips will be positioned using *jQuery.ui*, otherwise an internal implementation for [positioning](#jqueryposition-options) will be used.

[fnShowDialog](http://jherax.github.io/#fnshowdialog-options) is a facade for [jQuery.ui.dialog](https://jqueryui.com/dialog/) and has a dependency on [jQuery.ui 1.9+][jQuery.ui].<br>
But if you don't want to use *jQuery.ui* as the default implementation, you can override the method by invoking the `set()` method with the new implementation, e.g. <nobr>`jsu.fnShowDialog.set("source", function (options) { ... });`</nobr>

The library has the following structure:
- `jsu:` main namespace
  - `author:` me :^)
  - `version:` the library version
  - `dependencies:` array with name of dependencies
  - `siteOrigin`: get the host part of the current url
  - `wrapper:` selector where dynamic HTML is placed
  - `createNS:` method to create safe namespaces
  - `regional:` namespace for language settings
  - `settings:` namespace for global settings

A Glance
--------
* [API Reference](http://jherax.github.io/#api-reference)
* [List of methods](http://jherax.github.io/#list-of-methods)

```javascript
  (function() {
    // None of below settings are mandatory.

    // We set the container for dynamic HTML
    jsu.wrapper = "#main-section";

    // We set the language setting
    jsu.regional.set(jsu.regional.english);
    
    // Sets the default position for all tooltips
    jsu.settings.position = {
      at: "left bottom",
      my: "left+2 top+5"
    };
    
    // Add your code...
  })();
```

Appendix
--------
### inputType.isText
It is considered *inputType.isText* any of the following `DOM` elements:
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
Developed and maintained by David Rivera (jherax [stackoverflow](http://stackoverflow.com/users/2247494/jherax) | [careers](http://careers.stackoverflow.com/jherax) | [wordpress](https://jherax.wordpress.com/))

License
-------
JSU Library is released under the MIT license. See [LICENSE](https://raw.githubusercontent.com/jherax/js-utils/master/LICENSE) file for details.

<!-- links -->
[jsu-library]: http://jherax.github.io/
[jQuery.js]: http://code.jquery.com/
[jQuery.ui]: http://ajax.googleapis.com/ajax/libs/jqueryui/1.9.2/jquery-ui.min.js
[category.text]: #categorytext
[jherax.css]: https://github.com/jherax/js-utils/tree/master/assets/css/jherax.css
[jherax.js]: https://github.com/jherax/js-utils/tree/master/assets/js/jherax.js
