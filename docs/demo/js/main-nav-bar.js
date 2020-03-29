(function (window, app, ufe, undefined) {
  'use strict';

  var navClasses = ['d-flex', 'flex-column', 'flex-md-row', 'align-items-center', 'p-3', 'px-md-4', 'mb-3', 'bg-white', 'border-bottom', 'shadow-sm'];
  var headingClassed = ['my-0', 'mr-md-auto', 'font-weight-normal']
  class MainNavBar {
    constructor(el) {
      this.el = el;
      this.init();
    }

    init() {
      for (let index = 0; index < navClasses.length; index++) {
        this.el.classList.add(navClasses[index]);
      }

      var heading = document.createElement('h5');
      for (let index = 0; index < headingClassed.length; index++) {
        heading.classList.add(headingClassed[index]);
      }
      heading.textContent = 'Micro Front Ends';
      this.el.appendChild(heading);
    }

    dispose() {
      this.el.innerHTML = '';
      for (let index = 0; index < navClasses.length; index++) {
        this.el.classList.remove(navClasses[index]);
      }
    }
  }

  class MainNavBarComponent extends MainNavBar {
    constructor(el, componentBridge) {
      super(el);
      this.componentBridge = componentBridge;
      this.initBridge();
    }

    initBridge() {
      this.componentBridge.setDisposeAction(() => this.disposeAsync());
      this.componentBridge.signalMounted();
    }

    dispose() {
      this.componentBridge.signalDispose();
    }

    disposeCore() {
      super.dispose();
    }

    disposeAsync() {
      return new Promise((resolve, reject) => {
        this.disposeCore();
        resolve();
      });
    }
  }

  app.jsComponents['MainNavBarComponent'] = MainNavBarComponent;
})(window, window.app, window.validide_uFrontEnds, void 0);
