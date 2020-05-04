import 'mocha';
import { expect } from 'chai';
import { ResourceConfiguration } from '../../src/core/resourceConfiguration';
// tslint:disable: no-unused-expression

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
