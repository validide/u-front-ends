(function (window, ufe, undefined) {
  'use strict';

  var mfeEventHadler = function (evt) {
    console.log(evt);
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
      default:
        alert('Unknown event: ' + evt.type);
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

  var mainNavBar = new ufe.ChildComponentOptions();
  mainNavBar.handlers = Object.assign({}, globalHandlers, {
    'created': function (e) {
      e.el.parentElement.insertBefore(e.el, e.el.parentElement.firstChild);

      globalHandlers['created'](e);
    },
    'destroyed': function(e) {
      navbarId = '';
      globalHandlers['destroyed'](e);
    }
  });
  mainNavBar.inject = function (el) {
    new app.inWindow['MainNavBarComponent'](el);
  }
  mainNavBar.skipResourceLoading = function () {
    return !!app.inWindow['MainNavBarComponent'];
  }
  var mainNavBarScript = new ufe.ResourceConfiguration();
  mainNavBarScript.url = './js/main-nav-bar.js';
  mainNavBarScript.isScript = true;
  mainNavBar.resources.push(mainNavBarScript);


  var navbarId = '';
  var clickHandlers = {
    'addNavBar': function (e) {
      if (navbarId)
        return;

      navbarId = mfe.addChild(mainNavBar);
    },
    'removeNavBar': function (e) {
      if (!navbarId)
        return;

      mfe.removeChild(navbarId);
      navbarId = '';
    },

  }

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

  function initDemoHandlers() {
    var els = document.querySelectorAll('[data-demo-action]');
    for (var index = 0; index < els.length; index++) {
      var element = els[index];
      element.addEventListener('click', function (e) {
        e.preventDefault();
        clickHandlers[e.currentTarget.getAttribute('data-demo-action')](e);
      })
    }

  }

  function init() {
    bang();
    initDemoHandlers();

    mfe
      .initialize()
      .then(function (root) { return root.mount(); })
      .then(function (root) {
        navbarId = root.addChild(mainNavBar);

        document.getElementById('content').classList.remove('d-none');
      });
  }

  window.app = {
    ready: ready,
    init: init,
    inWindow: {},
  };
})(window, window.validide_uFrontEnds, void 0);

window.app.ready(function () {
  window.app.init();
});
