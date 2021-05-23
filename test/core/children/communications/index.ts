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
import { test_ContainerCommunicationHandler } from './containerHandler.spec';
import { test_ContentCommunicationHandler } from './contentHandler.spec';
import { test_CrossWindowCommunicationsManager } from './crossWindowManager.spec';
import { test_HTMLElementCommunicationsManager } from './htmlElementManager.spec';
import { test_CommunicationsManager } from './manager.spec';

export function test_Communications() {
  describe('Communications', () => {
    test_CommunicationsManager();
    test_HTMLElementCommunicationsManager();
    test_CrossWindowCommunicationsManager();
    test_ContainerCommunicationHandler();
    test_ContentCommunicationHandler();
  });
}
