import 'mocha';
import { test_Component } from './component.spec';
import { test_ComponentEvent } from './componentEvent.spec';
import { test_ResourceConfiguration } from './resourceConfiguration.spec';
import { test_RootComponent } from './rootComponent.spec';
import { test_RootComponentFacade } from './rootComponentFacade';
import { test_RootComponentOptions } from './rootComponentOptions.spec';
import { test_Children } from './children/index.spec';

export function test_core() {
  describe('CORE', () => {
    test_ComponentEvent();
    test_Component();
    test_ResourceConfiguration();
    test_RootComponent();
    test_RootComponentFacade();
    test_RootComponentOptions();
    test_Children();
  })
}
