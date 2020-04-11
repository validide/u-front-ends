import { test_ChildComponentOptions } from './childComponentOptions.spec';
import { test_ChildComponentFactory } from './childComponentFactory.specs';
import { test_ChildComponent } from './childComponent.spec';
import { test_Communications } from './communications';
import { test_CrossWindowChildren } from './crossWindow/index.spec';
import { test_InWindowChildren } from './inWindow/index.spec';

export function test_Children() {
  describe('Children', () => {
    test_ChildComponentOptions();
    test_ChildComponentFactory();
    test_ChildComponent();
    test_Communications();
    test_CrossWindowChildren();
    test_InWindowChildren();
  })
}
