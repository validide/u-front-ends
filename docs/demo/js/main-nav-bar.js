(function (window, app, ufe, undefined) {
  'use strict';

  var navContent = `<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
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
</div>`;

  var navClasses = ['navbar', 'navbar-expand-lg', 'navbar-light', 'bg-light'];
  class MainNavBar {
    constructor(el) {
      this.el = el;
      this.init();
    }

    init() {
      for (let index = 0; index < navClasses.length; index++) {
        this.el.classList.add(navClasses[index]);
      }
      this.el.innerHTML = navContent;
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
      this.componentBridge.setDisposeAction(() => this.disposeAsync());
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
      this.componentBridge = null;
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
