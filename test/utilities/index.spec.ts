import 'mocha';
import { test_getHashCode } from './getHashCode.spec';
import { test_getRandomString } from './getRandomString.spec';
import { test_noop } from './noop.spec';

export function test_utilities() {
  describe('UTILITIES', () => {
    test_getHashCode();
    test_getRandomString();
    test_noop();
  })
}
