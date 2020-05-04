import 'mocha';
import { testDocumentModule } from './document/index.spec';

export function test_dom() {
  describe('DOM', () => {
    testDocumentModule();
  });
}
