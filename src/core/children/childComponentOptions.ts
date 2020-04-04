import { ChildComponentType } from './childComponentType';
import { ComponentOptions } from '../componentOptions';

export class ChildComponentOptions extends ComponentOptions {
  public type: ChildComponentType = ChildComponentType.InWindow;
  public contentDisposeTimeout: number = 3000;

  constructor() {
    super();
  }
}
