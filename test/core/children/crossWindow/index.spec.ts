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
