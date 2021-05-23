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
