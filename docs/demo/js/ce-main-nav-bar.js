(function (window, app, ufe, undefined) {
  'use strict';

  var navContent = `<nav class="navbar navbar-expand-lg navbar-light navbar-dark bg-dark">
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
      if (this.isConnected) {
        this.init();
      }
    }

    init() {
      if (this.initialized)
        return;

      this.initialized = true;
      this.initCore();
    }

    initCore() {
      this.classList.add('d-block');
      this.innerHTML = navContent;
    }



    disconnectedCallback() {
      this.dispose()
    }

    dispose() {
      if (!this.initialized)
        return;

      this.initialized = false;
      this.disposeCore();
    }

    disposeCore() {
      this.innerHTML = '';
      this.classList.remove('d-block');
    }
  }



  class MainNavBarComponent extends MainNavBar {
    constructor() {
      super();
      this.el = null;
      this.communicationHandler = null;
      this.submitHandler = null;
    }





    initCore() {
      super.initCore();

      this.el = this.firstElementChild;
      this.communicationHandler = new ufe.InWindowContentCommunicationHandler(this, () => this.dispose());
      this.submitHandler = (e) => {
        e.preventDefault();
        var action = e.currentTarget.getAttribute('data-demo-action');
        if (action === 'close') {
          this.dispose();
        } else {
          this.communicationHandler.dispatchBeforeUpdate();
          setTimeout(() => {
            this.communicationHandler.dispatchUpdated();
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
        this.communicationHandler.dispatchMounted();
      }, 1000);
    }

    disposeCore() {
      this.communicationHandler.dispatchBeforeDispose();
      setTimeout(() => {
        this.disposeCustomElement();
      }, 1000)
    }

    disposeCustomElement() {
      var els = this.el.querySelectorAll('[data-demo-action]');
      for (var index = 0; index < els.length; index++) {
        els[index].removeEventListener('click', this.submitHandler);
      }

      this.submitHandler = null;
      this.communicationHandler.dispatchDisposed();
      this.communicationHandler.dispose();
      this.communicationHandler = null;
      this.el = null;
      super.disposeCore();
      console.log('MainNavBarComponent CE -> finished');
    }

    connectedCallback() {
      // We are moving the element after creating it so we need to:
      // - delay the conect actions a bit
      // - execute the actions only if we are connected

      window.setTimeout(()=> {
        super.connectedCallback();
      }, 5);
    }

    disconnectedCallback() {

      // We are moving the element after creating it so we need to:
      // - delay the disconect actions a bit
      // - execute the actions only if we were not re-connected
      window.setTimeout(() => {
        if (!this.isConnected) {
          super.disconnectedCallback()
        }
      }, 5)
    }
  }

  app.inWindow['MainNavBarComponentCE'] = MainNavBarComponent;
})(window, window.app, window.validide_uFrontEnds, void 0);
