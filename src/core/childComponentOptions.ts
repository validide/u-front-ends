import { ChildComponentType } from './childComponentType';
import { ComponentOptions } from './componentOptions';

export class ChildComponentOptions extends ComponentOptions {
  public type: ChildComponentType = ChildComponentType.Script;
  public contentDisposeDelay: number = 50; // Dispose is called from the content before actually beeing finished so allow a delay.
  public contentDisposeTimeout: number = 3000;
  constructor() {
    super();
  }
}
