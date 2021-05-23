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
    });
  });
}
