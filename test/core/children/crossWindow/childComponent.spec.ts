import 'mocha';
import { JSDOM } from 'jsdom';
import { expect } from 'chai';
import { CrossWindowChildComponent, ChildComponentOptions, RootComponentFacade, noop, ChildComponent, Component, CrossWindowChildComponentOptions, ContainerCommunicationHandlerMethods, CrossWindowContainerCommunicationHandler } from '../../../../src';
import { MockCrossWindowChildComponent} from '../../../mocks/mockCrossWindowChildComponent'

export function test_CrossWindowChildComponent() {
  describe('CrossWindowChildComponent', () => {
    let _jsDom: JSDOM;
    let _win: Window;
    let _opt: CrossWindowChildComponentOptions;
    let _rootFacade: RootComponentFacade;
    let _child: MockCrossWindowChildComponent;

    beforeEach(() => {
      _jsDom = new JSDOM(undefined, {
        url: 'http://localhost:8080/',
        runScripts: 'dangerously'
      });
      if (!_jsDom.window?.document?.defaultView)
        throw new Error('Setup failure!');
      _win = _jsDom.window.document.defaultView;
      _opt = new CrossWindowChildComponentOptions();
      _rootFacade = new RootComponentFacade(noop);
      _child = new MockCrossWindowChildComponent(_win, _opt, _rootFacade);
    });

    afterEach(() => {
      _child = <MockCrossWindowChildComponent><unknown>null;
      _win.close();
      _jsDom.window.close();
    })

    it('should be a instance of Component/ChildComponent/CrossWindowChildComponent', () => {
      expect(_child).to.be.an.instanceof(CrossWindowChildComponent);
      expect(_child).to.be.an.instanceof(ChildComponent);
      expect(_child).to.be.an.instanceof(Component);
    })

    it('should have options of CrossWindowChildComponentOptions type', () => {
      expect(_child.getOptions()).to.be.an.instanceof(CrossWindowChildComponentOptions);
      expect(_child.getOptions()).to.be.an.instanceof(ChildComponentOptions);
    })

    it('should return a communication handler that is of type InWindowContainerCommunicationHandler', async () => {
      await _child.initialize();
      const mountProm = _child.mount()
      expect(_child.getCommunicationHandlerCore(new ContainerCommunicationHandlerMethods()))
      .to.be.an.instanceof(CrossWindowContainerCommunicationHandler);
    })

    // it('should throw if an injection function is not provided', async () => {
    //   _opt.inject = undefined;
    //   try {
    //     await _child.mountCore();
    //     expect(false).to.be.true;
    //   } catch (error) {
    //     expect((<Error>error).message).to.eq('Inject method not defined!');
    //   }
    // })


    // it('should throw if an injection function is not provided', async () => {
    //   let root: HTMLElement | null = null;
    //   _opt.inject = (el: HTMLElement) => { root = el; }
    //   await _child.initialize();
    //   await _child.mount();

    //   expect(_child.getRootEl()).to.eq(root);
    // })
  });
}
