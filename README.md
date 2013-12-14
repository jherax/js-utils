[JSU Library][jsu-library]
========

This is a library of JavaScript / jQuery utilities, which includes tools for data validation and text formatting, plugins for tooltip, modal-windows and positioning elements, resources injection, string and JSON manipulation, object cloning, sorting arrays, and other features.

Documentation
-------------
Go to the documentation site to see the API reference and examples:<br>
* **http://jherax.github.io/#jsu-library**

Getting Started
---------------
The library has a dependency on [jQuery 1.8+][jQuery.js] which must be loaded before [jsu-library][jherax.js].<br>
It also requires some [CSS][jherax.css] rules for functions showing **tooltips**, **loadings**, among others.

If [jQuery.ui.position](http://api.jqueryui.com/position/) is available, all tooltips will be positioned using *jQuery.ui,* otherwise an internal implementation for [positioning](#jqueryposition-options) will be used.

[fnShowDialog](#fnshowdialog-options) is a facade for [jQuery.ui.dialog](https://jqueryui.com/dialog/) and has a dependency on [jQuery.ui 1.9+][jQuery.ui].<br>
But if you don't want to use *jQuery.ui,* as the default implementation, you can override the method by specifying&nbsp;the `source` property with the new implementation, e.g.<br>
`jsu.fnShowDialog.source = function (options) { ... }`

The library has the following structure:
- `jsu:` main namespace
  - `author:` me :^)
  - `version:` release number
  - `dependencies:` array with name of dependencies
  - `createNS:` utility to create safe namespaces
  - `wrapper:` selector where dynamic HTML is placed
  - `regional:` namespace for language settings
  - `settings:` namespace for global settings

A Glance
--------
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
    
    // Add your code for plugins init, event handlers, etc...
  })();
```

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
[jsu-library]: http://jherax.github.io/
[jQuery.js]: http://code.jquery.com/
[jQuery.ui]: http://ajax.googleapis.com/ajax/libs/jqueryui/1.9.2/jquery-ui.min.js
[category.text]: #categorytext
[jherax.css]: https://github.com/jherax/js-utils/tree/master/assets/css/jherax.css
[jherax.js]: https://github.com/jherax/js-utils/tree/master/assets/js/jherax.js
