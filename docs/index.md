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
var root = new ufe.RootComponent(window, configuration);

// Initialize the root.
await root.initialize();

// Mount the root.
await root.mount();

```

### JavaScript Component
For the JavaScript component integration we will assume we have a `MyCounterJavaScript` class that we wish to integrate.

To achieve the integration we will:
* derive the base component
* override the `initialize` method
* override the `inc` and `dev` methods to send notifications to the root component
* create a `disposeHandler` to handle the request to dispose the component

``` javascript

  class MyCounterJavaScriptWrapper extends MyCounterJavaScript {

    constructor(parentEl) {
      super(parentEl);
    }

    initialize() {
      super.initialize();

      // Create a new communication manager
      // Most of this is initialization is boilerplate code
      var manager = new ufe.HTMLElementCommunicationsManager(
        this.parentEl,
        ufe.CommunicationsEvent.CONTAINER_EVENT_TYPE,
        this.parentEl,
        ufe.CommunicationsEvent.CONTENT_EVENT_TYPE
      );
      // Initialize the manager
      manager.initialize();


      // Configure the methods to communicate/handle parent messages
      var contentMethods = new ufe.ContentCommunicationHandlerMethods();

      // This is the method that will be triggered when the parent signals to the component to begin disposing
      contentMethods.dispose = () => this.disposeHandler();

      // Create a communications handler and preserve a reference to it
      this.communicationHandler = new ufe.InWindowContentCommunicationHandler(manager, contentMethods);

      // Simulate a delay in the initialization
      window.setTimeout(() => {
        this.communicationHandler.dispatchMounted(); // Signal to the parent that the component has finished mounting
      }, 1_000);
    }

    inc() {
      // Signal that we are processing stuff
      this.communicationHandler.dispatchBeforeUpdate();

      // Call the base increment method
      super.inc();

      // Simulate call to server or other long running operation
      setTimeout(() => {

        // Signal that we are done processing stuff
        this.communicationHandler.dispatchUpdated();
      }, 1_000);
    }

    dec() {
      // Signal that we are processing stuff
      this.communicationHandler.dispatchBeforeUpdate();

      // Call the base decrement method
      super.dec();

      // Simulate call to server or other long running operation
      setTimeout(() => {

        // Signal that we are done processing stuff
        this.communicationHandler.dispatchUpdated();
      }, 1_000);
    }

    // The method we will call when the root component signals that we should finish what we are doing and prepare to be disposed
    disposeHandler() {
      // Signal the dispose to the root component
      this.communicationHandler.dispatchBeforeDispose();

      // Give the root component a chance to react
      setTimeout(() => { this.dispose(); }, 1_000)
    }

    dispose() {
      // Dispose any resources you might have allocated in the wrapper

      // Signal to the parent that we are done and can be disposed
      this.communicationHandler.dispatchDisposed();

      // Dispose and clear the handler
      this.communicationHandler.dispose();
      this.communicationHandler = null;

      console.log('MyCounterJavaScriptWrapper Disposed. Count: ' + this.count);
      // Call the super's dispose method
      super.dispose();
    }
  }

```

In order to register the component configuration with the root we need to create a `InWindowChildComponentOptions` object and configure the resources we need the load for the component:
* JavaScript files containing the code.
* Any necessary CSS.
* Any 3rd party dependencies that are specific to the component.

Full code:
* `docs/demo/js/demo-counter-js.js` - the component and derived wrapper component.
* `docs/demo/js/demo.js` - check the `CLASSIC JAVASCRIPT WRAPPER` section for the component configuration.

### Custom Element
For the CustomElement component integration we will assume we have a `MyCounterElement` class that we wish to integrate.

To achieve the integration we will:
* derive the base component
* override the `initialize` method
* override the `inc` and `dev` methods to send notifications to the root component
* create a `disposeHandler` to handle the request to dispose the component


``` javascript

class MyCounterElementWrapper extends MyCounterElement {

    constructor() {
      super();
      this.communicationHandler = null;
      this.submitHandler = null;

      this.initialize();
    }

    initialize() {
      // Create a new communication manager
      // Most of this is initialization is boilerplate code
      var manager = new ufe.HTMLElementCommunicationsManager(
        this,
        ufe.CommunicationsEvent.CONTAINER_EVENT_TYPE,
        this,
        ufe.CommunicationsEvent.CONTENT_EVENT_TYPE
      );

      // Initialize the manager
      manager.initialize();

      // Configure the methods to communicate/handle parent messages
      var contentMethods = new ufe.ContentCommunicationHandlerMethods();

      // This is the method that will be triggered when the parent signals to the component to begin disposing
      contentMethods.dispose = () => this.disposeHandler();

      // Create a communications handler and preserve a reference to it
      this.communicationHandler = new ufe.InWindowContentCommunicationHandler(manager, contentMethods);

      // Simulate a delay in the initialization
      window.setTimeout(() => {
        this.communicationHandler.dispatchMounted(); // Signal to the parent that the component has finished mounting
      }, 1_000);

    }

    inc() {
      // Signal that we are processing stuff
      this.communicationHandler.dispatchBeforeUpdate();

      // Call the base increment method
      super.inc();

      // Simulate call to server or other long running operation
      setTimeout(() => {

        // Signal that we are done processing stuff
        this.communicationHandler.dispatchUpdated();
      }, 1_000);
    }

    dec() {
      // Signal that we are processing stuff
      this.communicationHandler.dispatchBeforeUpdate();

      // Call the base decrement method
      super.dec();

      // Simulate call to server or other long running operation
      setTimeout(() => {

        // Signal that we are done processing stuff
        this.communicationHandler.dispatchUpdated();
      }, 1_000);
    }

    // The method we will call when the root component signals that we should finish what we are doing and prepare to be disposed
    disposeHandler() {
      // Signal the dispose to the root component
      this.communicationHandler.dispatchBeforeDispose();

      // Give the root component a chance to react
      setTimeout(() => { this.disposeComponent(); }, 1_000)
    }

    disposeComponent() {
      // Dispose any resources you might have allocated in the wrapper

      // Signal to the parent that we are done and can be disposed
      this.communicationHandler.dispatchDisposed();

      // Dispose and clear the handler
      this.communicationHandler.dispose();
      this.communicationHandler = null;

      console.log('MyCounterElementWrapper Disposed. Count: ' + this.count);
      // Call the super's dispose method if you have one
      // super.dispose();
    }

    connectedCallback() {
      // We are moving the element after creating it so we need to:
      // - delay the connect actions a bit

      window.setTimeout(()=> {
        super.connectedCallback();
      }, 5);
    }

    disconnectedCallback() {

      // We are moving the element after creating it so we need to:
      // - delay the disconnect actions a bit
      // - execute the actions only if we were not re-connected
      window.setTimeout(() => {
        if (!this.isConnected) {
          super.disconnectedCallback()
        }
      }, 5)
    }
  }

```

In order to register the component configuration with the root we need to create a `InWindowChildComponentOptions` object and configure the resources we need the load for the component:
* JavaScript files containing the code.
* Any necessary CSS.
* Any 3rd party dependencies that are specific to the component.

Full code:
* `docs/demo/js/demo-counter-ce.js` - the component and derived wrapper component.
* `docs/demo/js/demo.js` - check the `CUSTOM ELEMENT WRAPPER` section for the component configuration.


### Iframe
For the Iframe component integration we will assume we have a page that we wish to integrate.

To achieve the integration we will:
* check if we are loaded as a child page `window.parent !== window` and only perform the extra initialization if this case
* initialize a `CrossWindowCommunicationsManager`
* initialize a `CrossWindowContentCommunicationHandler`
* create a `dispose` method to handle the request to dispose the component

For simplicity the embedded sample relies on the simple custom element counter component which does not provide a way of notifying about the 'busy' state. In consequence the integration with the root component is not able to provide this feedback.
The feedback is still achievable but for this we would need to extend the base component to trigger some sort of 'busy' events and by listening to these the `communicationHandler` could feedback this to the root component.

In order to register the component configuration with the root we need to create a `CrossWindowChildComponentOptions` object and configure the resources we need the load for the component:
* JavaScript files containing the code.
* Any necessary CSS.
* Any 3rd party dependencies that are specific to the component.

Full code:
* `docs/demo/demo-counter-embedded.html` - the component and derived wrapper component.
* `docs/demo/js/demo.js` - check the `EMBEDDED WRAPPER` section for the component configuration.


### Source files for demo
The source files for the demo can be found in the `docs/demo` folder.
