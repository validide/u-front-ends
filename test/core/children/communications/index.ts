import { test_CommunicationsManager } from './manager.spec';
import { test_HTMLElementCommunicationsManager } from './htmlElementManager.ts.spec';
import { test_CrossWindowCommunicationsManager } from './crossWindowManager.ts.spec';

export function test_Communications() {
  describe('Communications', () => {
    test_CommunicationsManager();
    test_HTMLElementCommunicationsManager();
    test_CrossWindowCommunicationsManager();
  })
}
