import { ComponentOptions } from "../componentOptions";
import { ChildComponentType } from "./childComponentType";

/**
 * Child component options.
 */
export class ChildComponentOptions extends ComponentOptions {
  public type: ChildComponentType = ChildComponentType.InWindow;
  /**
   * The the interval to wait for the component before triggering an error and the 'disposed' event.
   */
  public contentDisposeTimeout = 3000;
}
