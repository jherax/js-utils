[JSU Library][jsu-library]
========

This is a library of utilities for JavaScript and jQuery, which includes tools for data validation, text formatting, tooltips, positioning elements, JSON manipulation, cloning objects, sorting arrays, resource injection, among others.

Documentation
-------------
Go to documentation site to see the API reference and examples:<br>
  - [http://jherax.github.io/?lang=english](http://jherax.github.io/?lang=english#jsu-library)
  - [http://jherax.github.io/?lang=spanish](http://jherax.github.io/?lang=spanish#jsu-library)

Getting Started
---------------
The library has a dependency on [jQuery 1.8+][jQuery.js] which must be loaded before jsu-library.<br>
It also requires some [CSS][jherax.css] rules for methods showing **tooltips**, **loadings**, and others.

If [jQuery.ui.position](http://api.jqueryui.com/position/) is available, all tooltips will be positioned using [jQuery.ui](https://github.com/jquery/jquery-ui), otherwise an internal implementation for [positioning](#jqueryposition-options) will be used.

Quick view
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
