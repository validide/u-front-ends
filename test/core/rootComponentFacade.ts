import 'mocha';
import { expect } from 'chai';
import { RootComponentFacade } from '../../src';

export function test_RootComponentFacade() {
  describe('RootComponentFacade', () => {
    it('should have the following properties and default values', () => {
      const fn = () => {};
      const conf = new RootComponentFacade(fn);
      expect(conf.signalDisposed).to.not.be.null;
      expect(conf.signalDisposed).to.eq(fn);
    })
  });
}
