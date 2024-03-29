/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable prefer-arrow/prefer-arrow-functions */
import 'mocha';
import { AbortablePromise, FetchOptions, JSDOM, ResourceLoader } from 'jsdom';
import { expect } from 'chai';
import { Component, ComponentEvent, ComponentEventType, ResourceConfiguration } from '../../src';
import { values_falsies, getDelayPromise } from '../utils';
import { ComponentOptions, ComponentEventHandlers } from '../../src/core/componentOptions';
class CustomResourceLoader extends ResourceLoader {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  fetch(url: string, options: FetchOptions): AbortablePromise<Buffer> | null {
    // return Promise.resolve(Buffer.from(`console.log('${url}');`));
    return Promise.resolve(Buffer.from('')) as AbortablePromise<Buffer>;
  }
}

class StubComponent extends Component {
  public timesDisposedCalled: number;
  public timesInitializedCalled: number;
  public timesMountedCalled: number;
  public throwError = false;
  public testError: Error = new Error('Test Error!');
  constructor(window: Window, options: ComponentOptions) {
    super(window, options);
    this.timesDisposedCalled = 0;
    this.timesInitializedCalled = 0;
    this.timesMountedCalled = 0;
  }

  public getWindowAccessor(): Window {
    return this.getWindow();
  }

  public getDocumentAccessor(): Document {
    return this.getDocument();
  }

  public getOptionsAccessor(): ComponentOptions {
    return this.getOptions();
  }

  public rootElementAccessor(): HTMLElement | null {
    return this.rootElement;
  }

  public callHandler(type: ComponentEventType): void {
    return super.callHandler(type);
  }

  protected async initializeCore(): Promise<void> {
    this.timesInitializedCalled++;
    if (this.throwError)
      throw this.testError;

    await getDelayPromise();

    await super.initializeCore();
  }

  protected async mountCore(): Promise<void> {
    this.timesMountedCalled++;
    if (this.throwError)
      throw this.testError;

    await getDelayPromise();

    await super.mountCore();

    await getDelayPromise();

    super.callHandler(ComponentEventType.Mounted);
  }

  protected async disposeCore(): Promise<void> {
    this.timesDisposedCalled++;
    if (this.throwError)
      throw this.testError;

    await getDelayPromise();

    await super.disposeCore();
  }

  public async simulateUpdate(): Promise<Component> {
    this.callHandler(ComponentEventType.BeforeUpdate);

    await getDelayPromise();

    this.callHandler(ComponentEventType.Updated);
    return this;
  }
}

export function test_Component() {
  describe('Component', () => {
    let _jsDom: JSDOM;
    let _win: Window;
    const _options: ComponentOptions = new ComponentOptions();

    beforeEach(() => {
      const loader = new CustomResourceLoader();
      _jsDom = new JSDOM(undefined, {
        url: 'http://localhost:8080/',
        runScripts: 'dangerously',
        resources: loader
      });
      if (!_jsDom.window?.document?.defaultView)
        throw new Error('Setup failure!');
      _win = _jsDom.window.document.defaultView;
    });

    afterEach(() => {
      _win?.close();
      _jsDom.window.close();
    });

    describe('Constructor', () => {

      values_falsies.forEach((f: any) => {
        it(`passing a falsie as the "window" argument throws - ${f}`, () => {
          expect(() => new StubComponent(f as unknown as Window, _options)).to.throw('Missing "window" argument.');
        });
      });

      values_falsies.forEach((f: any) => {
        it(`passing a falsie as the "options" argument throws - ${f}`, () => {
          expect(() => new StubComponent(_win, f as unknown as ComponentOptions)).to.throw('Missing "options" argument.');
        });
      });

      it('does not throw if valid arguments are provided', () => {
        expect(() => new StubComponent(_win, _options)).not.to.throw('Missing "window" argument.');
      });

    });

    describe('Protected', () => {

      it('can access the "Component" window reference', () => {
        const comp = new StubComponent(_win, _options);
        expect(comp.getWindowAccessor()).to.eq(_win);
      });

      it('can access the "Component" document reference', () => {
        const comp = new StubComponent(_win, _options);
        expect(comp.getDocumentAccessor()).to.eq(_win.document);
      });

      it('can access the "Component" options reference', () => {
        const comp = new StubComponent(_win, _options);
        expect(comp.getOptionsAccessor()).to.eq(_options);
      });

      it(`callHandler throws when using the ${ComponentEventType.Error}`, () => {
        const comp = new StubComponent(_win, _options);

        expect(() => comp.callHandler(ComponentEventType.Error))
          .to
          .throw(`For calling the "${ComponentEventType.Error}" handler use the "callErrorHandler" method.`);
      });

      it('callHandler calls correct handler', () => {
        let called = false;
        const options = new ComponentOptions();
        options.handlers.beforeUpdate = (evt: ComponentEvent) => {
          if (evt.type === ComponentEventType.BeforeUpdate) {
            called = true;
          }
        };

        const comp = new StubComponent(_win, options);
        comp.callHandler(ComponentEventType.BeforeUpdate);
        expect(called).to.be.true;
      });

      it('callHandler calls error handler if other handler fails', () => {
        let called = false;
        const options = new ComponentOptions();
        options.handlers.beforeUpdate = () => {
          throw new Error('Test Error!');

        };
        options.handlers.error = (evt: ComponentEvent) => {
          if (evt.type === ComponentEventType.Error) {
            called = true;
          }
        };

        const comp = new StubComponent(_win, options);
        comp.callHandler(ComponentEventType.BeforeUpdate);
        expect(called).to.be.true;
      });

    });

    describe('Initialize', () => {
      it('Creates the root element', async () => {
        const opt = new ComponentOptions();
        opt.handlers = (undefined as unknown as ComponentEventHandlers);
        const resource = new ResourceConfiguration();
        resource.isScript = true;
        resource.url = 'http://localhost:8080/test.js';
        resource.skip = () => false;
        opt.resources.push(resource);
        const comp = new StubComponent(_win, opt);

        expect(comp.id).to.be.empty;
        await comp.initialize();
        expect(comp.id).to.not.be.empty;
        expect(comp.timesInitializedCalled).to.eq(1);
        expect(_win.document.getElementById(comp.id)).to.not.be.null;
        expect(_win.document.getElementById(comp.id)).to.eq(comp.rootElementAccessor());
        expect(_win.document.querySelector('script[src="http://localhost:8080/test.js"]')).to.not.be.null;
      });

      it('Creates the root element within parent', async () => {
        const parent = _win.document.createElement('my-parent');
        _win.document.body.appendChild(parent);
        const opt = new ComponentOptions();
        opt.parent = parent;
        const comp = new StubComponent(_win, opt);

        expect(comp.id).to.be.empty;
        await comp.initialize();
        expect(comp.id).to.not.be.empty;
        expect(comp.timesInitializedCalled).to.eq(1);
        expect(_win.document.getElementById(comp.id)).to.not.be.null;
        expect(_win.document.getElementById(comp.id)).to.eq(comp.rootElementAccessor());
        expect(parent).to.eq(comp.rootElementAccessor()?.parentElement);
      });

      it('Creates the root element', async () => {
        const comp = new StubComponent(_win, _options);

        expect(comp.id).to.be.empty;
        await comp.initialize();
        expect(comp.id).to.not.be.empty;
        expect(comp.timesInitializedCalled).to.eq(1);
        expect(_win.document.getElementById(comp.id)).to.not.be.null;
        expect(_win.document.getElementById(comp.id)).to.eq(comp.rootElementAccessor());
      });

      it('Does not executed twice', async () => {
        const comp = new StubComponent(_win, _options);

        expect(comp.id).to.be.empty;
        await comp.initialize();
        expect(comp.timesInitializedCalled).to.eq(1);

        await comp.initialize();
        expect(comp.timesInitializedCalled).to.eq(1);

        await comp.initialize();
        expect(comp.timesInitializedCalled).to.eq(1);
      });

      it('Does not create the parent element even if "initialize" is executed twice', async () => {
        const comp = new StubComponent(_win, _options);

        expect(comp.id).to.be.empty;

        await comp.initialize();
        expect(comp.timesInitializedCalled).to.eq(1);

        comp.isInitialized = false; // One should not mess arround with these.
        await comp.initialize();
        expect(comp.timesInitializedCalled).to.eq(2);


        await comp.initialize();
        expect(comp.timesInitializedCalled).to.eq(2);
        expect(comp.id).to.not.be.empty;
        expect(_win.document.getElementById(comp.id)).to.not.be.null;
        expect(_win.document.getElementById(comp.id)).to.eq(comp.rootElementAccessor());
        expect(_win.document.querySelectorAll('div').length).to.eq(1);
      });

      values_falsies
        .concat(['some-random-id'])
        .forEach(f => {
          it(`Throws if the parent is missing: ${f}`, async () => {
            const options = new ComponentOptions();
            let err: Error | null = null;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            let errHandlerCalled = true;
            options.parent = (f as unknown as string);
            options.handlers.error = () => {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              errHandlerCalled = true;
            };
            (_win as any).console.log = (msg: any) => {
              err = (msg as Error);
            };
            const comp = new StubComponent(_win, options);

            await comp.initialize();

            expect((err as unknown as Error).message).to.eq(`Failed to find parent "${f}".`);
          });
        });

    });

    describe('Mount', () => {

      it('Raises error if called before "initialize"', async () => {
        const options = new ComponentOptions();
        let err: Error | null = null;
        options.handlers.error = (e: ComponentEvent) => {
          err = e.error;
        };
        const comp = new StubComponent(_win, options);

        await comp.mount();
        expect((err as unknown as Error).message).to.eq('Call "initialize" before calling "mount".');
      });

      it('Calling multiple times has no effect', async () => {
        const comp = new StubComponent(_win, _options);

        await comp.initialize();
        expect(comp.timesMountedCalled).to.eq(0);

        await comp.mount();
        expect(comp.timesMountedCalled).to.eq(1);

        await comp.mount();
        expect(comp.timesMountedCalled).to.eq(1);

        await comp.mount();
        expect(comp.timesMountedCalled).to.eq(1);
      });

      it('Calling and failing raises an error', async () => {
        let err: Error | null = null;
        const opt = new ComponentOptions();
        opt.handlers.error = (evt: ComponentEvent) => {
          err = evt.error;
        };

        const comp = new StubComponent(_win, opt);
        comp.throwError = true;

        await comp.initialize();
        await comp.mount();
        expect(err as unknown as Error).to.eq(comp.testError);
      });

    });

    describe('Dipose', () => {

      it('calling dispose multiple times has same effect as calling once', async () => {
        const comp = new StubComponent(_win, _options);
        expect(comp.timesDisposedCalled).to.eq(0);

        await comp.initialize();
        await comp.mount();

        const id = comp.id;

        await comp.dispose();
        expect(comp.timesDisposedCalled).to.eq(1);
        expect(_win.document.getElementById(id)).to.be.null;
        expect(comp.rootElementAccessor()).to.be.null;
        await comp.dispose();
        expect(comp.timesDisposedCalled).to.eq(1);
        await comp.dispose();
        expect(comp.timesDisposedCalled).to.eq(1);
      });

      it('calling dispose without initialize or mount does not throw', async () => {
        const comp = new StubComponent(_win, _options);
        expect(comp.timesDisposedCalled).to.eq(0);

        await comp.dispose();
        expect(comp.timesDisposedCalled).to.eq(1);
        await comp.dispose();
        expect(comp.timesDisposedCalled).to.eq(1);
      });

      it('calling dispose does not fail if disposeCore throws', async () => {
        const options = new ComponentOptions();
        const comp = new StubComponent(_win, options);
        let errorEvent: ComponentEvent | null = null;
        options.handlers = options.handlers || new ComponentEventHandlers();
        options.handlers.error = (evt: ComponentEvent) => {
          errorEvent = evt;
        };
        comp.throwError = true;

        await comp.dispose();
        expect(comp.timesDisposedCalled).to.eq(1);
        expect(errorEvent).not.to.be.null;
        expect(((errorEvent as unknown) as ComponentEvent).type).to.eq(ComponentEventType.Error);
        expect(((errorEvent as unknown) as ComponentEvent).error).to.eq(comp.testError);
      });

    });

    describe('Events', () => {

      it('Should fire the following events', async () => {
        const parent = _win.document.createElement('div');
        _win.document.body.appendChild(parent);
        const opt = new ComponentOptions();
        opt.parent = parent;
        let timesCallHandlerCalled = 0;
        const events: { [key: string]: ComponentEvent[] } = {};
        const handler = (evt: ComponentEvent) => {
          timesCallHandlerCalled++;
          if (!events[evt.type.toString()]) {
            events[evt.type.toString()] = new Array<ComponentEvent>();
          }
          events[evt.type.toString()].push(evt);
        };
        opt.handlers.beforeCreate = handler;
        opt.handlers.beforeMount = handler;
        opt.handlers.beforeUpdate = handler;
        opt.handlers.beforeDestroy = handler;
        opt.handlers.created = handler;
        opt.handlers.mounted = handler;
        opt.handlers.updated = handler;
        opt.handlers.destroyed = handler;
        opt.handlers.error = handler;

        const comp = new StubComponent(_win, opt);

        // INITIALIZE
        let prom: Promise<any> = comp.initialize();

        expect(events[ComponentEventType.BeforeCreate.toString()].length).to.eq(1);
        expect(timesCallHandlerCalled).to.eq(1);

        await prom;

        expect(events[ComponentEventType.Created.toString()].length).to.eq(1);
        expect(timesCallHandlerCalled).to.eq(2);

        // MOUNT
        prom = comp.mount();

        expect(events[ComponentEventType.BeforeMount.toString()].length).to.eq(1);
        expect(timesCallHandlerCalled).to.eq(3);

        await prom;

        expect(events[ComponentEventType.Mounted.toString()].length).to.eq(1);
        expect(timesCallHandlerCalled).to.eq(4);

        // UPDATE
        prom = comp.simulateUpdate();

        expect(events[ComponentEventType.BeforeUpdate.toString()].length).to.eq(1);
        expect(timesCallHandlerCalled).to.eq(5);

        await prom;

        expect(events[ComponentEventType.Updated.toString()].length).to.eq(1);
        expect(timesCallHandlerCalled).to.eq(6);

        // DISPOSE
        prom  = comp.dispose();

        expect(events[ComponentEventType.BeforeDestroy.toString()].length).to.eq(1);
        expect(timesCallHandlerCalled).to.eq(7);

        await prom;

        expect(events[ComponentEventType.Destroyed.toString()].length).to.eq(1);
        expect(timesCallHandlerCalled).to.eq(8);

      });

    });

    describe('Misc', () => {
      it('if error handler fails we log using the "log" method', async () => {
        const consoleLog = new Array<any>();
        const options = new ComponentOptions();
        const err = new Error('Error Handler Error');
        const comp = new StubComponent(_win, options);
        options.handlers = options.handlers || new ComponentEventHandlers();
        options.handlers.error = () => {
          throw err;
        };
        comp.throwError = true;
        (_win as any).console.log = (message?: any, ...optionalParams: any[]) => {
          consoleLog.push({ message: message, optionalParams: optionalParams });
        };

        await comp.dispose();

        expect(comp.timesDisposedCalled).to.eq(1);
        expect(consoleLog.length).to.eq(1);
        expect(consoleLog[0].message).to.eq(err);
      });

      it('if error is not registered we log using the "log" method - 1', async () => {
        const consoleLog = new Array<any>();
        const options = new ComponentOptions();
        const comp = new StubComponent(_win, options);
        options.handlers = options.handlers || new ComponentEventHandlers();
        comp.throwError = true;
        (_win as any).console.log = (message?: any, ...optionalParams: any[]) => {
          consoleLog.push({ message: message, optionalParams: optionalParams });
        };

        await comp.dispose();

        expect(comp.timesDisposedCalled).to.eq(1);
        expect(consoleLog.length).to.eq(1);
        expect(consoleLog[0].message).to.eq(comp.testError);
      });

      it('if error is not registered we log using the "log" method - 2', async () => {
        const consoleLog = new Array<any>();
        const options = new ComponentOptions();
        options.handlers = (undefined as unknown as ComponentEventHandlers);
        const comp = new StubComponent(_win, options);
        comp.throwError = true;
        (_win as any).console.log = (message?: any, ...optionalParams: any[]) => {
          consoleLog.push({ message: message, optionalParams: optionalParams });
        };

        await comp.dispose();

        expect(comp.timesDisposedCalled).to.eq(1);
        expect(consoleLog.length).to.eq(1);
        expect(consoleLog[0].message).to.eq(comp.testError);
      });

      it('doe not fail in log method if "log" method is missing', async () => {
        const comp = new StubComponent(_win, _options);
        comp.throwError = true;
        ((_win as any).console ).log = undefined;

        await comp.dispose();

        expect(comp.timesDisposedCalled).to.eq(1);
      });

      it('doe not fail in log method if "console" is missing', async () => {
        const comp = new StubComponent(_win, _options);
        comp.throwError = true;
        (_win as any).console = undefined;

        await comp.dispose();

        expect(comp.timesDisposedCalled).to.eq(1);
      });

      it('doe not fail in log method if "window" is missing', async () => {
        const comp = new StubComponent(_win, _options);
        comp.throwError = true;
        (comp as any).window = undefined;

        await comp.dispose();

        expect(comp.timesDisposedCalled).to.eq(1);
      });
    });
  });
}
