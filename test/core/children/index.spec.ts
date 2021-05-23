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
  });
}
