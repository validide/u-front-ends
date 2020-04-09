import { test_ChildComponentOptions } from './childComponentOptions.spec';
import { test_ChildComponentFactory } from './childComponentFactory.specs';
import { test_ChildComponent } from './childComponent.spec';

export function test_Children() {
  test_ChildComponentOptions();
  test_ChildComponentFactory();
  test_ChildComponent()
}
