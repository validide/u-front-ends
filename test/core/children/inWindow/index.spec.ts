import { test_InWindowChildComponentOptions } from './childComponentOptions.spec';
import { test_InWindowContainerCommunicationHandler } from './containerCommunicationHandler.spec';
import { test_InWindowContentCommunicationHandler } from './contentCommunicationHandler.spec';
import { test_InWindowChildComponent } from './childComponent.spec';

export function test_InWindowChildren() {
  describe('InWindow', () => {
    test_InWindowChildComponentOptions();
    test_InWindowContainerCommunicationHandler();
    test_InWindowContentCommunicationHandler();
    test_InWindowChildComponent();
  })
}
