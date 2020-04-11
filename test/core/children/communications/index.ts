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
  })
}
