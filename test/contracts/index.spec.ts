import 'mocha';
import { test_baseComponent } from './baseComponent.spec';

export function test_contracts() {
  describe('CONTRACTS', () => {
    test_baseComponent();
  })
}
