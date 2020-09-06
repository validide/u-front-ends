(function (window, ufe, undefined) {
  'use strict';

  // The event handler that will handle all the events.
  var globalEventHandler = function (evt) {
    // console.log(evt);
    switch (evt.type) {
      case 'beforeCreate':
        break;
      case 'created':
        evt.el.classList.add('loading');
        break;
      case 'beforeMount':
        break;
      case 'mounted':
        evt.el.classList.remove('loading');
        break;
      case 'beforeUpdate':
        evt.el.classList.add('loading');
        break;
      case 'updated':
        evt.el.classList.remove('loading');
        break;
      case 'beforeDestroy':
        evt.el.classList.add('loading');
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

  var mfe = new ufe.RootComponent(window, configuration);

  function init() {
    initDemoHandlers();

    mfe
      .initialize()
      .then(function (root) {
        return root.mount();
      })
      .then(function () {
        document.getElementById('content').classList.remove('d-none');
      });
  }

  window.app = {
    init: init
  };
})(window, window.validide_uFrontEnds, void 0);

