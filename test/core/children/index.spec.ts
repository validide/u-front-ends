import { test_ChildComponentOptions } from './childComponentOptions.spec';
import { test_ChildComponentFactory } from './childComponentFactory.specs';
import { test_ChildComponent } from './childComponent.spec';
import { test_Communications } from './communications';

export function test_Children() {
  describe('Children', () => {
    test_ChildComponentOptions();
    test_ChildComponentFactory();
    test_ChildComponent();
    test_Communications();
  })
}
