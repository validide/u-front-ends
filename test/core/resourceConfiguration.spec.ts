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
import { ResourceConfiguration } from '../../src/core/resourceConfiguration';

export function test_ResourceConfiguration() {
  describe('ResourceConfiguration', () => {
    it('should have the following properties and default values', () => {
      const conf = new ResourceConfiguration();
      expect(conf.url).to.eq('');
      expect(conf.attributes).to.be.undefined;
      expect(conf.isScript).to.eq(true);
      expect(conf.skip()).to.eq(false);
    });
  });
}
