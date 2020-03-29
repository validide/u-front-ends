(function (window, ufe, undefined) {
  'use strict';

  var mfeEventHadler = function (evt) {
    console.log(evt);
    if (evt.type === 'error') {
      console.error(evt.error);
      //alert('Check console!');
    }
  }

  var globalHandlers = new ufe.ComponentEventHandlers();
  globalHandlers['beforeCreate'] = mfeEventHadler;
  globalHandlers['created'] = mfeEventHadler;
  globalHandlers['beforeMount'] = mfeEventHadler;
  globalHandlers['mounted'] = mfeEventHadler;
  globalHandlers['beforeUpdate'] = mfeEventHadler;
  globalHandlers['updated'] = mfeEventHadler;
  globalHandlers['beforeDestroy'] = mfeEventHadler;
  globalHandlers['destroyed'] = mfeEventHadler;
  globalHandlers['error'] = mfeEventHadler;


  var configuration = new ufe.RootComponentOptions();
  configuration.handlers = globalHandlers;

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
    'rel': 'stylesheet',
    'crossorigin': 'anonymous',
    'integrity': 'sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n'
  };
  configuration.resources.push(jqueryJs);

  var popperJs = new ufe.ResourceConfiguration();
  popperJs.url = 'https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js';
  popperJs.isScript = true;
  popperJs.attributes = {
    'rel': 'stylesheet',
    'crossorigin': 'anonymous',
    'integrity': 'sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo'
  };

  configuration.resources.push(popperJs);

  var bootstrapJs = new ufe.ResourceConfiguration();
  bootstrapJs.url = 'https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js';
  bootstrapJs.isScript = true;
  bootstrapJs.attributes = {
    'rel': 'stylesheet',
    'crossorigin': 'anonymous',
    'integrity': 'sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6'
  };
  configuration.resources.push(bootstrapJs);

  // var js404 = new ufe.ResourceConfiguration();
  // js404.url = 'https://validide.github.io/u-front-ends/404.js';
  // js404.isScript = true;
  // configuration.resources.push(js404);

  var mfe = new ufe.RootComponent(window, configuration);

  function ready(fn) {
    if (document.readyState != 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  function bang() {
    window.location = ufe.getUrlFullPath(document, './index.html') + '#/';
  }

  function init() {
    bang();

    mfe
      .initialize()
      .then(function(root) { root.mount(); });
  }

  window.app = {
    ready: ready,
    init: init
  };
})(window, window.validide_uFrontEnds, void 0);

window.app.ready(function () {
  window.app.init();
});
