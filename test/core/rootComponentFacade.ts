import 'mocha';
import { expect } from 'chai';
import { RootComponentFacade } from '../../src';
// tslint:disable: no-unused-expression

export function test_RootComponentFacade() {
  describe('RootComponentFacade', () => {
    it('should have the following properties and default values', () => {
      // tslint:disable-next-line: no-empty
      const fn = () => {};
      const conf = new RootComponentFacade(fn);
      expect(conf.signalDisposed).to.not.be.null;
      expect(conf.signalDisposed).to.eq(fn);
    });
  });
}
