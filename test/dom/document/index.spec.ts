import 'mocha';
import { test_generateUniqueId } from './generateUniqueId.spec';
import { test_getUrlFullPath } from './getUrlFullPath.spec';
import { test_getUrlOrigin } from './getUrlOrigin.spec';
import { test_loadResource } from './loadResource.spec';
import { test_createCustomEvent } from './createCustomElement.spec';

export function testDocumentModule() {
  describe('DOCUMENT MODULE', () => {
    test_getUrlOrigin();
    test_getUrlFullPath();
    test_generateUniqueId();
    test_loadResource();
    test_createCustomEvent();
  });
}
