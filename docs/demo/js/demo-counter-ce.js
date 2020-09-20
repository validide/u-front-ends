(function (window, ufe, undefined) {
  'use strict';

  // https://webcomponents.dev/blog/all-the-ways-to-make-a-web-component/
  class MyCounterElement extends HTMLElement {
    constructor() {
      super();
      this.count = 0;

      const style = `
      * {
        font-size: 200%;
      }

      span {
        width: 4rem;
        display: inline-block;
        text-align: center;
      }

      button {
        width: 64px;
        height: 64px;
        border: none;
        border-radius: 10px;
        background-color: seagreen;
        color: white;
      }
    `;

      const html = `
      <button id="dec">-</button>
      <span>${this.count}</span>
      <button id="inc">+</button>
    `;

      this.attachShadow({ mode: 'open' });
      this.shadowRoot.innerHTML = `
    <style>
      ${style}
    </style>
    ${html}
    `;

      this.buttonInc = this.shadowRoot.getElementById('inc');
      this.buttonDec = this.shadowRoot.getElementById('dec');
      this.spanValue = this.shadowRoot.querySelector('span');

      this.inc = this.inc.bind(this);
      this.dec = this.dec.bind(this);
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

    connectedCallback() {
      this.buttonInc.addEventListener('click', this.inc);
      this.buttonDec.addEventListener('click', this.dec);
    }

    disconnectedCallback() {
      this.buttonInc.removeEventListener('click', this.inc);
      this.buttonDec.removeEventListener('click', this.dec);
    }
  }

  window.customElements.define('my-counter', MyCounterElement);


  class MyCounterElementWrapper extends MyCounterElement {

    constructor() {
      super();
      this.communicationHandler = null;
      this.submitHandler = null;

      this.initialize();
    }

    initialize() {
      var manager = new ufe.HTMLElementCommunicationsManager(
        this,
        ufe.CommunicationsEvent.CONTAINER_EVENT_TYPE,
        this,
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
      setTimeout(() => { this.disposeComponent(); }, 1_000)
    }

    disposeComponent() {
      // Dispose any resources you might have allocated in the wrapper
      this.communicationHandler.dispatchDisposed();
      this.communicationHandler.dispose();
      this.communicationHandler = null;

      console.log('MyCounterElementWrapper Disposed. Count: ' + this.count);
      // Call the super's dispose method if you have one
      // super.dispose();
    }

    connectedCallback() {
      // We are moving the element after creating it so we need to:
      // - delay the connect actions a bit

      window.setTimeout(()=> {
        super.connectedCallback();
      }, 5);
    }

    disconnectedCallback() {

      // We are moving the element after creating it so we need to:
      // - delay the disconnect actions a bit
      // - execute the actions only if we were not re-connected
      window.setTimeout(() => {
        if (!this.isConnected) {
          super.disconnectedCallback()
        }
      }, 5)
    }
  }

  window.customElements.define('my-counter-wrapper', MyCounterElementWrapper);

})(window, window.validide_uFrontEnds, void 0);
