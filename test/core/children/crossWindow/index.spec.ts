import { test_CrossWindowChildComponentOptions } from './childComponentOptions.spec';
import { test_CrossWindowChildComponent } from './childComponent.spec';
import { test_CrossWindowContentCommunicationHandler } from './contentCommunicationHandler.spec';
import { test_CrossWindowContainerCommunicationHandler } from './containerCommunicationHandler.spec';

export function test_CrossWindowChildren() {
  describe('CrossWindow', () => {
    test_CrossWindowChildComponentOptions();
    test_CrossWindowChildComponent();
    test_CrossWindowContentCommunicationHandler();
    test_CrossWindowContainerCommunicationHandler();
  });
}
