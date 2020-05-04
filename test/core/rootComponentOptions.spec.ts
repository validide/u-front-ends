import 'mocha';
import { expect } from 'chai';
import { RootComponentOptions } from '../../src';
// tslint:disable: no-unused-expression

export function test_RootComponentOptions() {
  describe('RootComponentOptions', () => {
    it('should have the following properties and default values', () => {
      const conf = new RootComponentOptions();
      expect(conf.childFactory).to.not.be.null;
      expect(conf.handlers).to.not.be.null;
      expect(conf.resources).to.not.be.null;
      expect(conf.resources.length).to.eq(0);
      expect(conf.tag).to.eq('script');
      expect(conf.parent).to.eq('body');
    });
  });
}
