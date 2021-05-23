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
import { noop } from '../../src/utilities/noop';

export function test_noop() {
  describe('noop', () => {

    it('should return void', () => {
      expect(noop()).to.be.undefined;
    });
  });
}
