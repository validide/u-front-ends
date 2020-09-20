(function (window, ufe, undefined) {
  'use strict';

  class MyCounterJavaScript {
    constructor(parentEl) {
      this.parentEl = parentEl;
      this.count = 0;

      this.initialize();
    }

    initialize() {
      this.parentEl.innerHTML = `
        <button id="dec">-</button>
        <span>${this.count}</span>
        <button id="inc">+</button>
      `;
      this.buttonInc = this.parentEl.querySelector('#inc');
      this.buttonDec = this.parentEl.querySelector('#dec');
      this.spanValue = this.parentEl.querySelector('span');

      this.incCb = this.inc.bind(this);
      this.decCb = this.dec.bind(this);

      this.buttonInc.addEventListener('click', this.incCb, false);
      this.buttonDec.addEventListener('click', this.decCb, false);
    }

    dispose() {
      this.buttonInc.removeEventListener('click', this.incCb, false);
      this.buttonDec.removeEventListener('click', this.decCb, false);
      this.incCb = null;
      this.decCb = null;
      this.buttonInc = null;
      this.buttonDec = null;
      this.spanValue = null;
      this.parentEl.innerHTML = '';
      this.parentEl = null;
    }

    inc() {
      this.count++;
      this.update();
    }

    dec() {
      this.count--;
      this.update();
    }

    update() {
      this.spanValue.innerText = this.count;
    }
  }



  class MyCounterJavaScriptWrapper extends MyCounterJavaScript {

    constructor(parentEl) {
      super(parentEl);
    }

    initialize() {
      super.initialize();

      var manager = new ufe.HTMLElementCommunicationsManager(
        this.parentEl,
        ufe.CommunicationsEvent.CONTAINER_EVENT_TYPE,
        this.parentEl,
        ufe.CommunicationsEvent.CONTENT_EVENT_TYPE
      );
      manager.initialize();
      var contentMethods = new ufe.ContentCommunicationHandlerMethods();
      contentMethods.dispose = () => this.disposeHandler();
      this.communicationHandler = new ufe.InWindowContentCommunicationHandler(manager, contentMethods);

      // Simulate a delay in the initialization
      window.setTimeout(() => {
        this.communicationHandler.dispatchMounted(); // Signal to the parent that the component has finished mounting
      }, 1_000);
    }

    inc() {
      // Signal that we are processing stuff
      this.communicationHandler.dispatchBeforeUpdate();
      super.inc();
      // Simulate call to server or other long running operation
      setTimeout(() => {
        this.communicationHandler.dispatchUpdated();
      }, 1_000);
    }

    dec() {
      // Signal that we are processing stuff
      this.communicationHandler.dispatchBeforeUpdate();
      super.dec();
      // Simulate call to server or other long running operation
      setTimeout(() => {
        this.communicationHandler.dispatchUpdated();
      }, 1_000);
    }

    disposeHandler() {
      // Signal the dispose to the root component
      this.communicationHandler.dispatchBeforeDispose();

      // Give the root component a chance to react
      setTimeout(() => { this.dispose(); }, 1_000)
    }

    dispose() {
      // Dispose any resources you might have allocated in the wrapper
      this.communicationHandler.dispatchDisposed();
      this.communicationHandler.dispose();
      this.communicationHandler = null;

      console.log('MyCounterJavaScriptWrapper Disposed. Count: ' + this.count);
      // Call the super's dispose method
      super.dispose();
    }
  }

  window.demo_components = window.demo_components || {};
  window.demo_components.MyCounterJavaScript = MyCounterJavaScript;
  window.demo_components.MyCounterJavaScriptWrapper = MyCounterJavaScriptWrapper;

})(window, window.validide_uFrontEnds, void 0);
