import 'mocha';
import { test_getHashCode } from './getHashCode.spec';
import { test_getRandomString } from './getRandomString.spec';

export function test_infrastructure() {
  describe('INFRASTRUCUTRE', () => {
    test_getHashCode();
    test_getRandomString();
  })
}
