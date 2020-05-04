import 'mocha';
import { expect } from 'chai';
import { InWindowChildComponentOptions, ChildComponentType } from '../../../../src';

export function test_InWindowChildComponentOptions() {
  describe('ChildComponentOptions', () => {
    it('should have the following properties and default values', () => {
      const conf = new InWindowChildComponentOptions();
      expect(conf.type).to.eq(ChildComponentType.InWindow);
      expect(conf.contentDisposeTimeout).to.eq(3000);
      expect(conf.handlers).to.not.be.null;
      expect(conf.resources).to.not.be.null;
      expect(conf.resources.length).to.eq(0);
      expect(conf.tag).to.eq('div');
      expect(conf.parent).to.eq('body');
      expect(conf.inject).to.be.undefined;
    })
  });
}