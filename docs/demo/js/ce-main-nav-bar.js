(function (window, app, ufe, undefined) {
  'use strict';

  var navContent = `<nav class="navbar navbar-expand-lg navbar-light bg-light">
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>
  <div class="collapse navbar-collapse" id="navbarTogglerDemo01">
    <a class="navbar-brand" href="#/">Micro Front Ends</a>
    <ul class="navbar-nav mr-auto mt-2 mt-lg-0">
      <li class="nav-item active">
        <a class="nav-link" href="#/">Home <span class="sr-only">(current)</span></a>
      </li>
      <!--<li class="nav-item">
        <a class="nav-link" href="#/">Link</a>
      </li>
      <li class="nav-item">
        <a class="nav-link disabled" href="#/" tabindex="-1" aria-disabled="true">Disabled</a>
      </li>-->
    </ul>
    <form class="form-inline my-2 my-lg-0 d-none" action="#/" id="actions">
      <button class="btn btn-outline-secondary my-2 my-sm-0" type="button" data-demo-action="busy" value="busy">Simulate Busy</button>
      <button type="button" data-demo-action="close" class="close mx-2" aria-label="Close" value="close">
        <span aria-hidden="true">&times;</span>
      </button>
    </form>
  </div>
</nav>`;

  class MainNavBar extends HTMLElement {
    constructor() {
      super();
      this.initialized = false;
    }

    connectedCallback() {
      this.init();
    }

    init() {
      if (this.initialized)
        return;

      this.initialized = true;
      this.innerHTML = navContent;
    }



    disconnectedCallback() {
      this.innerHTML = '';
    }

  }

  class ComponentBridge {

    constructor(el, disposeAction) {
      this.el = el;
      this.eventName = 'event.component_bridge.validide_micro_front_ends';
      this.disposeAction = disposeAction;
      this.el.addEventListener(this.eventName, this.disposeAction, false);
    }

    generateEventDetail(type) {
      return {
        type: type
      }
    }

    signalMounted() {
      this.el.dispatchEvent(new CustomEvent(this.eventName, generateEventDetail('mounted')));
    }
    signalBeforeUpdate () {
      this.el.dispatchEvent(new CustomEvent(this.eventName, generateEventDetail('beforeUpdate')));
    }

    signalUpdated() {
      this.el.dispatchEvent(new CustomEvent(this.eventName, generateEventDetail('updated')));
    }

    signalDispose() {
      this.el.dispatchEvent(new CustomEvent(this.eventName, generateEventDetail('???DISPOSED')));
    }

    dispose() {
      this.el.removeEventListener(this.eventName, this.disposeAction, false);
      this.disposeAction = null;
      this.eventName = null;
      this.el = null;
    }
  }

  class MainNavBarComponent extends MainNavBar {
    constructor() {
      super();
      this.el = this.firstElementChild;
      this.componentBridge = new ComponentBridge(this.el, () => this.disposeAsync());
      this.submitHandler = (e) => {
        e.preventDefault();
        var action = e.currentTarget.getAttribute('data-demo-action');
        if (action === 'close') {
          this.dispose();
        } else {
          this.componentBridge.signalBeforeUpdate();
          setTimeout(() => {
            this.componentBridge.signalUpdated();
          }, 1000)
        }
      };

      this.intiActions();
    }

    intiActions() {
      var els = this.el.querySelectorAll('[data-demo-action]');
      for (var index = 0; index < els.length; index++) {
        els[index].addEventListener('click', this.submitHandler);
      }
      this.el.querySelector('form').classList.remove('d-none');

      // Simulate a delay to consider exts processing
      window.setTimeout(() => {
        this.componentBridge.signalMounted();
      }, 1000);
    }

    dispose() {
      this.componentBridge.signalDispose();
      this.disposeCore();
    }

    disposeCore() {
      var els = this.el.querySelectorAll('[data-demo-action]');
      for (var index = 0; index < els.length; index++) {
        els[index].removeEventListener('click', this.submitHandler);
      }

      this.submitHandler = null;
      this.componentBridge.dispose();
      this.componentBridge = null;
      this.el = null;
      super.dispose();
      console.log('MainNavBarComponent -> finished');
    }

    disposeAsync() {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          this.disposeCore();
          resolve();
        }, 1000)
      });
    }
  }

  app.jsComponents['MainNavBarComponent'] = MainNavBarComponent;
})(window, window.app, window.validide_uFrontEnds, void 0);
