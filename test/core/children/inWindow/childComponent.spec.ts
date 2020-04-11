import 'mocha';
import { JSDOM } from 'jsdom';
import { expect } from 'chai';
import { InWindowChildComponent, ChildComponentOptions, RootComponentFacade, noop, ChildComponent, Component, InWindowChildComponentOptions, ContainerCommunicationHandlerMethods, InWindowContainerCommunicationHandler } from '../../../../src';
import { MockInWindowChildComponent} from '../../../mocks/mockInWindowChildComponent'

export function test_InWindowChildComponent() {
  describe('InWindowChildComponent', () => {
    let _jsDom: JSDOM;
    let _win: Window;
    let _opt: InWindowChildComponentOptions;
    let _rootFacade: RootComponentFacade;
    let _child: MockInWindowChildComponent;

    beforeEach(() => {
      _jsDom = new JSDOM(undefined, {
        url: 'http://localhost:8080/',
        runScripts: 'dangerously'
      });
      if (!_jsDom.window?.document?.defaultView)
        throw new Error('Setup failure!');
      _win = _jsDom.window.document.defaultView;
      _opt = new InWindowChildComponentOptions();
      _rootFacade = new RootComponentFacade(noop);
      _child = new MockInWindowChildComponent(_win, _opt, _rootFacade);
    });

    afterEach(() => {
      _child = <MockInWindowChildComponent><unknown>null;
      _win.close();
      _jsDom.window.close();
    })

    it('should be a instance of Component/ChildComponent/InWindowChildComponent', () => {
      expect(_child).to.be.an.instanceof(InWindowChildComponent);
      expect(_child).to.be.an.instanceof(ChildComponent);
      expect(_child).to.be.an.instanceof(Component);
    })

    it('should have options of InWindowChildComponentOptions type', () => {
      expect(_child.getOptions()).to.be.an.instanceof(InWindowChildComponentOptions);
      expect(_child.getOptions()).to.be.an.instanceof(ChildComponentOptions);
    })

    it('should return a communication hndler that is of type InWindowContainerCommunicationHandler', () => {
      expect(_child.getCommunicationHandlerCore(new ContainerCommunicationHandlerMethods()))
      .to.be.an.instanceof(InWindowContainerCommunicationHandler);
    })

    it('should throw if an injection function is not provided', async () => {
      _opt.inject = undefined;
      try {
        await _child.mountCore();
        expect(false).to.be.true;
      } catch (error) {
        expect((<Error>error).message).to.eq('Inject method not defined!');
      }
    })


    it('should throw if an injection function is not provided', async () => {
      let root: HTMLElement | null = null;
      _opt.inject = (el: HTMLElement) => { root = el; }
      await _child.initialize();
      await _child.mount();

      expect(_child.getRootEl()).to.eq(root);
    })
  });
}
