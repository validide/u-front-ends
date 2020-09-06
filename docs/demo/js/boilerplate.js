(function (window, ufe, undefined) {
  'use strict';

  function ready(fn) {
    if (document.readyState != 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  function bang() {
    if (window.location.href.indexOf('#') !== -1) {
      return;
    }

    var pathname = window.location.pathname;
    if (pathname === '/') {
      pathname = '/index.html';
    }
    var pathParts = pathname.split('/');

    window.location = ufe.getUrlFullPath(document, './' + pathParts[pathParts.length - 1]) + '#_/';
  }

  function init() {
    bang();
  }

  window.__boilerplate = {
    ready: ready,
    init: init
  };
})(window, window.validide_uFrontEnds, void 0);

