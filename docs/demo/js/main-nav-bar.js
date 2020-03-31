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

  class MainNavBar {
    constructor(el) {
      this.el = el;
      this.init();
    }

    init() {
      this.el.innerHTML = navContent;
    }

    dispose() {
      this.el.innerHTML = '';
    }
  }

  class MainNavBarComponent extends MainNavBar {
    constructor(el, componentBridge) {
      super(el);
      this.componentBridge = componentBridge;
      this.componentBridge.setDisposeCommandListener(() => this.dispose());
      this.submitHandler = (e) => {
        e.preventDefault();
        var action = e.currentTarget.getAttribute('data-demo-action');
        if (action === 'close') {
          this.dispose();
        } else {
          this.componentBridge.dispatchBeforeUpdate();
          setTimeout(() => {
            this.componentBridge.dispatchUpdated();
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
        this.componentBridge.dispatchMounted();
      }, 1000);
    }

    dispose() {
      this.componentBridge.dispatchBeforeDispose();
      setTimeout(() => {
        this.disposeCore();
      }, 1000)
    }

    disposeCore() {
      var els = this.el.querySelectorAll('[data-demo-action]');
      for (var index = 0; index < els.length; index++) {
        els[index].removeEventListener('click', this.submitHandler);
      }

      this.submitHandler = null;
      this.componentBridge.dispatchDisposed();
      this.componentBridge = null;
      super.dispose();
      console.log('MainNavBarComponent -> finished');
    }
  }

  app.jsComponents['MainNavBarComponent'] = MainNavBarComponent;
})(window, window.app, window.validide_uFrontEnds, void 0);
