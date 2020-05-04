import { ComponentOptions } from './componentOptions';
import { ChildComponentFactory } from './children/childComponentFactory';

/**
 * Options for the root component.
 */
export class RootComponentOptions extends ComponentOptions {
  /**
   * Factory class to create the child components.
   */
  public childFactory: ChildComponentFactory;
  constructor() {
    super();
    this.tag = 'script';
    this.childFactory = new ChildComponentFactory();
  }
}
