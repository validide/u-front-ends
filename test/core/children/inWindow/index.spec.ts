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
  });
}
