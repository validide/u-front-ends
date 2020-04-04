import { ChildComponentType } from './childComponentType';
import { ComponentOptions } from '../componentOptions';

export class ChildComponentOptions extends ComponentOptions {
  public type: ChildComponentType = ChildComponentType.InWindow;
  public contentDisposeTimeout: number = 3000;
  public inject: (el: HTMLElement) => void = () => { throw new Error('Inject method not defined!'); };

  constructor() {
    super();
  }
}
