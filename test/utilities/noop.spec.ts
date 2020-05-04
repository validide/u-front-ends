import 'mocha';
import { expect } from 'chai';
import { noop } from '../../src/utilities/noop';
// tslint:disable: no-unused-expression

export function test_noop() {
  describe('noop', () => {

    it('should return void', () => {
      expect(noop()).to.be.undefined;
    });
  });
}
