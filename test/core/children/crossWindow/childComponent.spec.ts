import 'mocha';
import { JSDOM, ResourceLoader, FetchOptions, VirtualConsole } from 'jsdom';
import { expect } from 'chai';
import { CrossWindowChildComponent, ChildComponentOptions, RootComponentFacade, noop, ChildComponent, Component, CrossWindowChildComponentOptions, ContainerCommunicationHandlerMethods, CrossWindowContainerCommunicationHandler, ComponentEvent } from '../../../../src';
import { MockCrossWindowChildComponent} from '../../../mocks/mockCrossWindowChildComponent';
import { values_falsies, getDelayPromise } from '../../../utils';
// tslint:disable: no-unused-expression

class CustomResourceLoader extends ResourceLoader {
  fetch(url: string, options: FetchOptions) {
    return url.indexOf('error') !== -1
      ? Promise.reject(new Error('Some network error'))
      : Promise.resolve(Buffer.from(''));
  }
}

export function test_CrossWindowChildComponent() {
  describe('CrossWindowChildComponent', () => {
    let _jsDom: JSDOM;
    let _win: Window;
    let _opt: CrossWindowChildComponentOptions;
    let _rootFacade: RootComponentFacade;
    let _child: MockCrossWindowChildComponent;

    beforeEach(() => {
      const virtualConsole = new VirtualConsole();
      virtualConsole.on('jsdomError', noop);
      _jsDom = new JSDOM(undefined, {
        url: 'http://localhost:8080/',
        runScripts: 'dangerously',
        resources: new CustomResourceLoader(),
        virtualConsole: virtualConsole
      });
      if (!_jsDom.window?.document?.defaultView)
        throw new Error('Setup failure!');
      _win = _jsDom.window.document.defaultView;
      _opt = new CrossWindowChildComponentOptions();
      _rootFacade = new RootComponentFacade(noop);
      _child = new MockCrossWindowChildComponent(_win, _opt, _rootFacade);
    });

    afterEach(() => {
      _child = (null as unknown as MockCrossWindowChildComponent);
      try{
        _win.close();
        _jsDom.window.close();
      } catch {
        // Do nothing
      }
    });

    it('should be a instance of Component/ChildComponent/CrossWindowChildComponent', () => {
      expect(_child).to.be.an.instanceof(CrossWindowChildComponent);
      expect(_child).to.be.an.instanceof(ChildComponent);
      expect(_child).to.be.an.instanceof(Component);
    });

    it('should have options of CrossWindowChildComponentOptions type', () => {
      expect(_child.getOptions()).to.be.an.instanceof(CrossWindowChildComponentOptions);
      expect(_child.getOptions()).to.be.an.instanceof(ChildComponentOptions);
    });

    it('should return a communication handler that is of type InWindowContainerCommunicationHandler', async () => {
      await _child.initialize();
      const mountProm = _child.mount();
      expect(_child.getCommunicationHandlerCore(new ContainerCommunicationHandlerMethods()))
      .to.be.an.instanceof(CrossWindowContainerCommunicationHandler);
    });

    it('should throw if getCommunicationHandlerCore can not find the embeded element', async () => {
      try {
        await _child.getCommunicationHandlerCore(new ContainerCommunicationHandlerMethods());
        expect(false).to.be.true;
      } catch (error) {
        expect((error as Error).message).to.eq('No iframe with "" id found.');
      }
    });

    values_falsies.forEach(f => {
      it('should throw if getCommunicationHandlerCore can not access the contentWindow', async () => {
        let embededId: string = '';
        let originalContentWindow: any = null;
        let embed: HTMLIFrameElement | null = null;
        try {
          await _child.initialize();
          const mountProm = _child.mount();
          embed = (_child.getRootEl().querySelector('iframe') as HTMLIFrameElement);
          originalContentWindow = embed.contentWindow;
          Object.defineProperty(embed, 'contentWindow', {
            value: f,
            writable: true
          });
          embededId = embed.id;
          expect(embed.contentWindow).to.eq(f);
          await _child.getCommunicationHandlerCore(new ContainerCommunicationHandlerMethods());
          expect(false).to.be.true;
        } catch (error) {
          expect((error as Error).message).to.eq(`The iframe with "${embededId}" id does not have a "contentWindow"(${f}).`);
        } finally {
          Object.defineProperty(embed, 'contentWindow', {
            value: originalContentWindow,
            writable: true
          });

        }
      });
    });

    it('should render the iframe with the specified attributes', async () => {
      _opt.url = 'http://localhost:8080/iframe.html';
      _opt.embeddedAttributes = {
        'data-cutom-attribute': 'my-custom-attribute'
      };
      await _child.initialize();
      const mountProm = _child.mount();

      const iframe = _win.document.querySelector<HTMLIFrameElement>('[data-cutom-attribute="my-custom-attribute"]') as HTMLIFrameElement;
      expect(iframe).not.to.be.null;
      expect(iframe.src).to.eq(_opt.url);
    });

    it('should throw an error if it fails to mount', async () => {
      let error: Error | null = null;
      _opt.handlers.error = (event: ComponentEvent) => {
        if (event.error)  {
          error = event.error;
        }
      };
      _opt.url = 'http://localhost:8080/iframe-error.html';
      await _child.initialize();
      await _child.mount();
      expect(error).not.to.be.null;
      expect((error as unknown as Error).message.indexOf('Failed to load embedded element.\nError details:\n')).to.eq(0);
    });

    it('should be able to dispose even if it threw an error', async () => {
      let error: Error | null = null;
      _opt.handlers.error = (event: ComponentEvent) => {
        if (event.error)  {
          error = event.error;
        }
      };
      _opt.createEmbedElement = (el: HTMLElement) => { return undefined as unknown as HTMLElement; };
      await _child.initialize();
      await _child.mount();
      expect(error).not.to.be.null;
      expect((error as unknown as Error).message).to.eq('Failed to create embed element!');

      await _child.dispose();
      expect(_win.document.querySelectorAll('iframe').length).to.eq(0);
    });

    it('calling disposed multiple times does not trow', async () => {
      _opt.url = 'http://localhost:8080/iframe-error.html';
      await _child.initialize();
      await _child.mount();
      await _child.dispose();

      expect(_win.document.querySelectorAll('iframe').length).to.eq(0);
    });

    it('calling disposed multiple times does not trow', async () => {
      try {
        _opt.contentDisposeTimeout = 10;
        await _child.dispose();
        await _child.dispose();
        (_child as any).disposed = false;
        await _child.dispose();
      } catch (e) {
        expect(true).to.be.false; // We should not reach this point.
      }

      expect(_win.document.querySelectorAll('iframe').length).to.eq(0);
    });
  });
}
