[JSU Library][jsu-library]
========

This is a library of utilities for JavaScript and jQuery, which includes tools for data validation, text formatting, tooltips, positioning elements, JSON manipulation, cloning objects, sorting arrays, resource injection, among others.

## Documentation

Go to the API reference site and see some examples:

  - [jherax.github.io/?lang=english](http://jherax.github.io/?lang=english#jsu-library)
  - [jherax.github.io/?lang=spanish](http://jherax.github.io/?lang=spanish#jsu-library)

## Getting Started

The library has a dependency on [jQuery 1.8+][jQuery.js] which must be loaded before jsu-library.<br>
It also requires some [CSS][jherax.css] rules for methods showing **tooltips**, **loadings**, and others.

If [jQuery.ui.position](http://api.jqueryui.com/position/) is available, all tooltips will be positioned using [jQuery.ui](https://github.com/jquery/jquery-ui), otherwise an internal implementation for [positioning](#jqueryposition-options) will be used.

## Quick view

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

## Versioning

This projects adopts the [Semantic Versioning](http://semver.org/) (SemVer) guidelines:

```
<MAJOR>.<MINOR>.<PATCH>
```

Given a version number MAJOR.MINOR.PATCH, increment the:

1. MAJOR version when you make incompatible API changes
2. MINOR version when you add functionality in a backwards-compatible manner
3. PATCH version when you make backwards-compatible bug fixes.

## Issues

To report an issue and keep traceability of bug-fixes, please report to:

* https://github.com/jherax/js-utils/issues

## Changelog

Details changes for each release are documented [here](CHANGELOG.md).

## Author

Developed and maintained by David Rivera (jherax [stackoverflow](http://stackoverflow.com/users/2247494/jherax) | [wordpress](https://jherax.wordpress.com/))

## License

This project has been released under the [MIT](https://opensource.org/licenses/MIT) license. 
This license applies ONLY to the source of this repository and does not extend to any other distribution, 
or any other 3rd party libraries used in a repository. See [LICENSE](LICENSE) file for more information.

<!-- links -->
[jsu-library]: http://jherax.github.io/
[jQuery.js]: http://code.jquery.com/
[jQuery.ui]: http://ajax.googleapis.com/ajax/libs/jqueryui/1.9.2/jquery-ui.min.js
[category.text]: #categorytext
[jherax.css]: https://github.com/jherax/js-utils/tree/master/assets/css/jherax.css
[jherax.js]: https://github.com/jherax/js-utils/tree/master/assets/js/jherax.js
