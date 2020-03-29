import 'mocha';
import { test_Component } from './component.spec';
import { test_ComponentEvent } from './componentEvent.spec';

export function test_base() {
  describe('BASE', () => {
    test_ComponentEvent();
    test_Component();
  })
}
