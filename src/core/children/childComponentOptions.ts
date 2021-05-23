import { ChildComponentType } from './childComponentType';
import { ComponentOptions } from '../componentOptions';

/**
 * Child component options.
 */
export class ChildComponentOptions extends ComponentOptions {
  public type: ChildComponentType = ChildComponentType.InWindow;
  /**
   * The the interval to wait for the component before triggering an error and the 'disposed' event.
   */
  public contentDisposeTimeout = 3000;

  constructor() {
    super();
  }
}
