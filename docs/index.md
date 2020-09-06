# Micro Front Ends
A simple framework for integrating multiple [micro front-ends](https://martinfowler.com/articles/micro-frontends.html) at browser level.

## Installation
You can use the framework by:
- installing it from NPM and importing it in your files


``` javascript
import * as ufe from '@validide/u-front-ends';

const root = new ufe.RootComponent(...);

```


- importing directly in the browser the bundle and using it similar to:


``` javascript
(function (window, ufe, undefined) {
  'use strict';

  var root = new ufe.RootComponent(...);

})(window, window.validide_uFrontEnds, void 0);
```

## Basic parts
The basic building blocks for the framework are:
- `RootComponent` - the root of the application. This is the component responsible for mounting and un-mounting(disposing) the child components.
- `ChildComponent`- the actual micro front-ends wrapper class, that should facilitate the integration on new or existing applications/components. This is an abstract class with the following implementations:
  - `InWindowChildComponent` - a wrapped class meant to be used for integrating JavaScript based components/plugins or HTML5 Custom Elements.
  - `CrossWindowChildComponent` - a wrapped class meant to be used for integrating components or applications using an IFRAME element.

All of the components inherit from the `Component` class allowing them to load any necessary resources (scripts or styles) and trigger a number of events configured through the `ComponentOptions` and derived classes.


## Sample
The following sample will go through the basic steps of initializing and loading different implementations of a counter.

### Initializing and mount the root
``` javascript
// Create a new root configuration.
var configuration = new ufe.RootComponentOptions();

// Register any event handler you might need.
configuration.handlers['data'] = function(event) { };

// Register CSS that should be loaded by the component.
var bootstrapCss = new ufe.ResourceConfiguration();
bootstrapCss.url = 'https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css';
bootstrapCss.isScript = false;
bootstrapCss.attributes = {
  'rel': 'stylesheet',
  'crossorigin': 'anonymous',
  'integrity': 'sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh'
};
configuration.resources.push(bootstrapCss);

// Register JS that should be loaded by the component.
var jqueryJs = new ufe.ResourceConfiguration();
jqueryJs.url = 'https://code.jquery.com/jquery-3.4.1.slim.min.js';
jqueryJs.isScript = true;
jqueryJs.attributes = {
  'crossorigin': 'anonymous',
  'integrity': 'sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n'
};
jqueryJs.skip = function() { return !!window.$; }; // If we already have jQuery installed skip the script installation.
configuration.resources.push(jqueryJs);

// Create a new instance of the root component.
var mfe = new ufe.RootComponent(window, configuration);

// Initialize the root.
await mfe.initialize();

// Mount the root.
await mfe.mount();

```

### Pure JavaScript
### Custom Element
### Iframe
