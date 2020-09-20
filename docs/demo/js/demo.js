(function (window, ufe, undefined) {
  'use strict';

  // ======================================== ROOT INITIALIZATION START ========================================
  // The event handler that will handle all the events.
  var globalEventHandler = function (evt) {
    // console.log(evt);
    switch (evt.type) {
      case 'beforeCreate':
        break;
      case 'created':
        evt.el.parentElement.classList.add('loading');
        break;
      case 'beforeMount':
        break;
      case 'mounted':
        evt.el.parentElement.classList.remove('loading');
        break;
      case 'beforeUpdate':
        evt.el.parentElement.classList.add('loading');
        break;
      case 'updated':
        evt.el.parentElement.classList.remove('loading');
        break;
      case 'beforeDestroy':
        evt.el.parentElement.classList.add('loading');
        break;
      case 'destroyed':
        break;
      case 'error':
        console.error(evt.error);
        break;
      case 'data':
        console.log('Data event:', JSON.stringify(evt.data));
        break;
      default:
        alert('Unknown event: ' + evt.type);
    }
  }

  var globalHandlers = new ufe.ComponentEventHandlers();
  globalHandlers['beforeCreate'] = globalEventHandler;
  globalHandlers['created'] = globalEventHandler;
  globalHandlers['beforeMount'] = globalEventHandler;
  globalHandlers['mounted'] = globalEventHandler;
  globalHandlers['beforeUpdate'] = globalEventHandler;
  globalHandlers['updated'] = globalEventHandler;
  globalHandlers['beforeDestroy'] = globalEventHandler;
  globalHandlers['destroyed'] = globalEventHandler;
  globalHandlers['error'] = globalEventHandler;
  globalHandlers['data'] = globalEventHandler;


  var configuration = new ufe.RootComponentOptions();
  configuration.handlers = Object.assign({}, globalHandlers);

  var bootstrapCss = new ufe.ResourceConfiguration();
  bootstrapCss.url = 'https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css';
  bootstrapCss.isScript = false;
  bootstrapCss.attributes = {
    'rel': 'stylesheet',
    'crossorigin': 'anonymous',
    'integrity': 'sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh'
  };
  configuration.resources.push(bootstrapCss);

  var jqueryJs = new ufe.ResourceConfiguration();
  jqueryJs.url = 'https://code.jquery.com/jquery-3.4.1.slim.min.js';
  jqueryJs.isScript = true;
  jqueryJs.attributes = {
    'crossorigin': 'anonymous',
    'integrity': 'sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n'
  };
  configuration.resources.push(jqueryJs);

  var popperJs = new ufe.ResourceConfiguration();
  popperJs.url = 'https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js';
  popperJs.isScript = true;
  popperJs.attributes = {
    'crossorigin': 'anonymous',
    'integrity': 'sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo'
  };

  configuration.resources.push(popperJs);

  var bootstrapJs = new ufe.ResourceConfiguration();
  bootstrapJs.url = 'https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js';
  bootstrapJs.isScript = true;
  bootstrapJs.attributes = {
    'crossorigin': 'anonymous',
    'integrity': 'sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6'
  };
  configuration.resources.push(bootstrapJs);

  var root = new ufe.RootComponent(window, configuration);
  // ======================================== ROOT INITIALIZATION END ========================================

  // ======================================== CLASSIC JAVASCRIPT WRAPPER START ========================================
  var jsComponentId = '';
  var jsComponent = new ufe.InWindowChildComponentOptions();
  jsComponent.handlers = Object.assign({}, globalHandlers, {
    'created': function (e) {
      // Manipulate the component location
      e.el.parentElement.insertBefore(e.el, e.el.parentElement.firstChild);
      // The CSS is scoped to the 'js-counter' so we need to add the class on the component
      e.el.classList.add('js-counter');

      // Call the global handler
      globalHandlers['created'](e);
    },
    'destroyed': function (e) {
      // Clear the Id so we know it was disposed
      jsComponentId = '';

      // Call the global handler
      globalHandlers['destroyed'](e);
    }
  });
  jsComponent.tag = 'div';
  jsComponent.inject = function (el) {
    new window.demo_components.MyCounterJavaScriptWrapper(el);
  }
  jsComponent.parent = '#js-container'; // Specify where the child should be injected
  var jsComponentScript = new ufe.ResourceConfiguration();
  jsComponentScript.url = './js/demo-counter-js.js';
  jsComponentScript.isScript = true;
  jsComponentScript.skip = function () {
    return !!(window.demo_components && window.demo_components.MyCounterJavaScriptWrapper);
  }
  jsComponent.resources.push(jsComponentScript);
  var stylesLoaded = false;
  var jsComponentStyles = new ufe.ResourceConfiguration();
  jsComponentStyles.url = './css/demo-counter-js.css';
  jsComponentStyles.isScript = false;
  jsComponentStyles.skip = function () {
    // We could do something smarter to detect if the styles were already loaded
    if(stylesLoaded) {
      return true;
    } else {
      stylesLoaded = true;
      return false;
    }
  }
  jsComponent.resources.push(jsComponentStyles);
  // ======================================== CLASSIC JAVASCRIPT WRAPPER END ========================================

  // ======================================== CUSTOM ELEMENT WRAPPER START ========================================
  var ceComponentId = '';
  var ceComponent = new ufe.InWindowChildComponentOptions();
  ceComponent.handlers = Object.assign({}, globalHandlers, {
    'created': function (e) {
      // Manipulate the component location
      e.el.parentElement.insertBefore(e.el, e.el.parentElement.firstChild);

      // Call the global handler
      globalHandlers['created'](e);
    },
    'destroyed': function (e) {
      // Clear the Id so we know it was disposed
      ceComponentId = '';

      // Call the global handler
      globalHandlers['destroyed'](e);
    }
  });
  ceComponent.tag = 'my-counter-wrapper';
  ceComponent.inject = function (el) { }
  ceComponent.parent = '#ce-container'; // Specify where the child should be injected
  var ceComponentScript = new ufe.ResourceConfiguration();
  ceComponentScript.url = './js/demo-counter-ce.js';
  ceComponentScript.isScript = true;
  ceComponentScript.skip = function () {
    return !!window.customElements.get('my-counter-wrapper');
  }
  ceComponent.resources.push(ceComponentScript);
  // ======================================== CUSTOM ELEMENT WRAPPER END ========================================

  // ======================================== EMBEDDED WRAPPER START ========================================
  var embeddedComponentId = '';
  var embeddedComponent = new ufe.CrossWindowChildComponentOptions();
  embeddedComponent.url ='./demo-counter-embedded.html'
  embeddedComponent.handlers = Object.assign({}, globalHandlers, {
    'created': function (e) {
      // Manipulate the component location
      e.el.parentElement.insertBefore(e.el, e.el.parentElement.firstChild);

      // Call the global handler
      globalHandlers['created'](e);
    },
    'destroyed': function (e) {
      // Clear the Id so we know it was disposed
      embeddedComponentId = '';

      // Call the global handler
      globalHandlers['destroyed'](e);
    }
  });
  embeddedComponent.embeddedAttributes = {
    'allowtransparency': 'true',
    'frameborder': 0
  };
  embeddedComponent.parent = '#embedded-container'; // Specify where the child should be injected
  // ======================================== EMBEDDED WRAPPER END ========================================

  async function toggleJavaScriptComponent(rootComponent) {
    if (jsComponentId) {
      // We have the child component mounted so we need to remove it
      await rootComponent.removeChild(jsComponentId);
      jsComponentId = '';
    } else {
      // We do not have the child component mounted so we need to add it
      jsComponentId = await rootComponent.addChild(jsComponent);
    }
  }

  async function toggleCustomElementComponent(rootComponent) {
    if (ceComponentId) {
      // We have the child component mounted so we need to remove it
      await rootComponent.removeChild(ceComponentId);
      ceComponentId = '';
    } else {
      // We do not have the child component mounted so we need to add it
      ceComponentId = await rootComponent.addChild(ceComponent);
    }
  }

  async function toggleEmbeddedComponent(rootComponent) {
    if (embeddedComponentId) {
      // We have the child component mounted so we need to remove it
      await rootComponent.removeChild(embeddedComponentId);
      embeddedComponentId = '';
    } else {
      // We do not have the child component mounted so we need to add it
      embeddedComponentId = await rootComponent.addChild(embeddedComponent);
    }
  }

  function init() {



    root
      .initialize()
      .then(function (rootRes) {
        return rootRes.mount();
      })
      .then(function (rootRes) {
        document.getElementById('content').classList.remove('d-none');

        document.getElementById('toggler-js').addEventListener('click', async function (e) {
          e.preventDefault();
          await toggleJavaScriptComponent(rootRes);
        });

        document.getElementById('toggler-ce').addEventListener('click', async function (e) {
          e.preventDefault();
          await toggleCustomElementComponent(rootRes);
        });

        document.getElementById('toggler-embedded').addEventListener('click', async function (e) {
          e.preventDefault();
          await toggleEmbeddedComponent(rootRes);
        });

      });
  }

  window.app = {
    init: init
  };
})(window, window.validide_uFrontEnds, void 0);

