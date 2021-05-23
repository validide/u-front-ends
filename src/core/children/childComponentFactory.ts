import { RootComponentFacade } from '../rootComponentFacade';
import { ChildComponentOptions } from './childComponentOptions';
import { ChildComponentType } from './childComponentType';
import { InWindowChildComponent } from './inWindow/childComponent';
import { CrossWindowChildComponent, CrossWindowChildComponentOptions } from './crossWindow/index';
import { Component } from '../component';

/**
 * Factory to create child components.
 */
export class ChildComponentFactory {
  /**
   * Create a child component.
   *
   * @param window The window reference.
   * @param options The child component options.
   * @param rootFacade The facade for the root component.
   */
  public createComponent(window: Window, options: ChildComponentOptions, rootFacade: RootComponentFacade): Component {
    switch (options.type) {
      case ChildComponentType.InWindow:
        return new InWindowChildComponent(window, options, rootFacade);
      case ChildComponentType.CrossWindow:
        return new CrossWindowChildComponent(window, options as CrossWindowChildComponentOptions, rootFacade);
      default:
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        throw new Error(`The "${options.type}" is not configured.`);
    }
  }
}
