import 'mocha';
import { expect } from 'chai';
import { ChildComponentOptions, ChildComponentType } from '../../../src';
// tslint:disable: no-unused-expression

export function test_ChildComponentOptions() {
  describe('ChildComponentOptions', () => {
    it('should have the following properties and default values', () => {
      const conf = new ChildComponentOptions();
      expect(conf.type).to.eq(ChildComponentType.InWindow);
      expect(conf.contentDisposeTimeout).to.eq(3000);
      expect(conf.handlers).to.not.be.null;
      expect(conf.resources).to.not.be.null;
      expect(conf.resources.length).to.eq(0);
      expect(conf.tag).to.eq('div');
      expect(conf.parent).to.eq('body');
    });
  });
}
