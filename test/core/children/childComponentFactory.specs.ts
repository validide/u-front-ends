import 'mocha';
import {JSDOM} from 'jsdom';
import { expect } from 'chai';
import { ChildComponentOptions, ChildComponentType, ChildComponentFactory, RootComponentFacade, noop, InWindowChildComponent, CrossWindowChildComponent } from '../../../src';

export function test_ChildComponentFactory() {
  describe('ChildComponentFactory', () => {
    let _jsDom: JSDOM;
    let _win: Window;

    beforeEach(() => {
      _jsDom = new JSDOM(undefined, { url: 'http://localhost:8080/' });
      if (!_jsDom.window?.document?.defaultView)
        throw new Error('Setup failure!');
      _win = _jsDom.window.document.defaultView;
    });

    afterEach(() => {
      _win.close();
      _jsDom.window.close();
    });

    it('should throw if type is unknown', () => {
      const factory = new ChildComponentFactory();
      const opt = new ChildComponentOptions();
      opt.type = ('unknonw_type' as ChildComponentType);

      expect(
        () => factory.createComponent(_win, opt, new RootComponentFacade(noop))
      ).to.throw(`The "${opt.type}" is not configured.`);
    });

    it('should return an InWindowComponent', () => {
      const factory = new ChildComponentFactory();
      const opt = new ChildComponentOptions();
      opt.type = ChildComponentType.InWindow;

      const child = factory.createComponent(_win, opt, new RootComponentFacade(noop));
      expect(child).to.be.an.instanceOf(InWindowChildComponent);
    });

    it('should return a CrossWindowComponent', () => {
      const factory = new ChildComponentFactory();
      const opt = new ChildComponentOptions();
      opt.type = ChildComponentType.CrossWindow;

      const child = factory.createComponent(_win, opt, new RootComponentFacade(noop));
      expect(child).to.be.an.instanceOf(CrossWindowChildComponent);
    });
  });
}



