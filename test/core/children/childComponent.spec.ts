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
import { JSDOM } from 'jsdom';
import { expect } from 'chai';
import { ChildComponentOptions, RootComponentFacade, noop, ContainerCommunicationHandler } from '../../../src';
import { MockChildComponent, MockContainerCommunicationHandler } from '../../mocks/mockChildComponentFactory';

export function test_ChildComponent() {
  describe('ChildComponent', () => {
    let _jsDom: JSDOM;
    let _win: Window;
    let _options: ChildComponentOptions;

    beforeEach(() => {
      _jsDom = new JSDOM(undefined, { url: 'http://localhost:8080/' });
      if (!_jsDom.window?.document?.defaultView)
        throw new Error('Setup failure!');
      _win = _jsDom.window.document.defaultView;
      _options = new ChildComponentOptions();
    });

    afterEach(() => {
      _win.close();
      _jsDom.window.close();
    });

    it('does not re-create the communication handler if mountCore is called twice', async () => {
      _options.tag= 'ce-mountCore-test';
      const mock = new MockChildComponent(_win, _options, new RootComponentFacade(noop));
      await mock.initialize();
      await mock.mount();

      expect(mock.callsTo_getCommunicationHandlerCore).to.eq(1);

      // Mess with the componenet to re-mount it
      mock.isMounted = false;

      await mock.mount();

      expect(mock.callsTo_getCommunicationHandlerCore).to.eq(1);
    });

    it('timesout when disposing if no signal received from content', async () => {
      const errors: Error[] = [];
      _options.tag= 'ce-dipose-tests';
      _options.contentDisposeTimeout = 10;
      _options.handlers.error =evt => {
        if(evt.error) {
          errors.push(evt.error);
        }
      };
      const mock = new MockChildComponent(_win, _options, new RootComponentFacade(noop));
      await mock.initialize();
      await mock.mount();

      await mock.dispose();

      expect(errors.length).to.eq(1);
      expect(errors[0].message).to.eq('Child dispose timeout.');
    });

    it('timesout when disposing if no signal received from content', async () => {
      const errors: Error[] = [];
      _options.tag= 'ce-dipose-tests';
      _options.contentDisposeTimeout = 10;
      _options.handlers.error =evt => {
        if(evt.error) {
          errors.push(evt.error);
        }
      };
      const mock = new MockChildComponent(_win, _options, new RootComponentFacade(noop));
      await mock.initialize();
      await mock.mount();

      await mock.dispose();

      expect(errors.length).to.eq(1);
      expect(errors[0].message).to.eq('Child dispose timeout.');
    });

    it('"contentBeginDisposed" calls parent only once', async () => {
      _options.tag= 'ce-dipose-tests';
      let disposedRootCalls = 0;
      const mock = new MockChildComponent(_win, _options, new RootComponentFacade(() => {disposedRootCalls++;}));
      await mock.initialize();
      await mock.mount();

      mock.comunicationMethods.beforeDispose();
      mock.comunicationMethods.beforeDispose();
      expect(disposedRootCalls).to.eq(1);
    });

    it('multiple dispose calls result in single requestContentDispose', async () => {
      _options.tag= 'ce-dipose-tests';
      _options.contentDisposeTimeout = 7;
      const mock = new MockChildComponent(_win, _options, new RootComponentFacade(noop));
      await mock.initialize();
      await mock.mount();

      try {
        const all = Promise.all([
          mock.disposeCore(),
          mock.disposeCore()
        ]);

        // await getDelayPromise(3);

        mock.comunicationMethods.disposed(); // Signal the dispose
        await all;
      } catch (error) {
        // We are doing a bad thing so bad things will come to us.
      }

      const mockHandler = mock.public_containerCommunicationHandler as MockContainerCommunicationHandler;
      expect(mockHandler.calls_requestContentDispose).to.eq(1);
    });

    it('calls root in case the call content disposed is signaled before the begin dispose', async () => {
      _options.tag= 'ce-dipose-tests';
      _options.contentDisposeTimeout = 7;
      let disposedRootCalls = 0;
      const mock = new MockChildComponent(_win, _options, new RootComponentFacade(() => {disposedRootCalls++;}));
      await mock.initialize();
      await mock.mount();

      mock.comunicationMethods.disposed(); // Signal the dispose

      expect(disposedRootCalls).to.eq(1);
    });

    it('receives events from content', async () => {
      let mounted = false;
      let beforeUpdate = false;
      let updated = false;
      let data: any = null;
      _options.tag= 'ce-dipose-tests';
      _options.handlers.mounted = () => {mounted = true;};
      _options.handlers.beforeUpdate = () => {beforeUpdate = true;};
      _options.handlers.updated = () => {updated = true;};
      _options.handlers.data = evt => {data = evt.data;};

      const mock = new MockChildComponent(_win, _options, new RootComponentFacade(noop));
      await mock.initialize();
      const mount = mock.mount();

      mock.comunicationMethods.mounted();

      await mount;

      const testData = {'foo': 'bar'};
      mock.comunicationMethods.data(testData);
      mock.comunicationMethods.beforeUpdate();
      mock.comunicationMethods.updated();

      expect(mounted).to.be.true;
      expect(beforeUpdate).to.be.true;
      expect(updated).to.be.true;
      expect(data).to.eq(testData);
    });

    it('calls commounication handler on sendData', async () => {
      const mock = new MockChildComponent(_win, _options, new RootComponentFacade(noop));
      await mock.initialize();
      await mock.mount();

      let called = false;
      (mock.public_containerCommunicationHandler as ContainerCommunicationHandler).sendData = () => { called = true; };
      mock.sendData(null);

      expect(called).to.be.true;
    });

    it('should not fail when calling sendData without a handler', () => {
      const mock = new MockChildComponent(_win, _options, new RootComponentFacade(noop));

      expect(() => mock.sendData(null)).not.to.throw();
      expect(mock.public_containerCommunicationHandler).to.be.null;
    });

  });
}
