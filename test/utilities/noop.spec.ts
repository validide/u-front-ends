import 'mocha';
import { expect } from 'chai';
import { noop } from '../../src/utilities/noop';

export function test_noop() {
  describe('noop', () => {

    it('should return void', () => {
      expect(noop()).to.be.undefined;
    })
  })
}
