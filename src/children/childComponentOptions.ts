import { ComponentOptions } from '../base/index';
import { ChildComponentType } from './childComponentType';

export class ChildComponentOptions extends ComponentOptions {
  public type: ChildComponentType = ChildComponentType.Script;
  public contentDisposeTimeout: number = 3000;
  constructor() {
    super();
  }
}
