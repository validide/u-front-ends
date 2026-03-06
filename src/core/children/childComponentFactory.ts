import type { Component } from "../component";
import type { RootComponentFacade } from "../rootComponentFacade";
import type { ChildComponentOptions } from "./childComponentOptions";
import { ChildComponentType } from "./childComponentType";
import { CrossWindowChildComponent, type CrossWindowChildComponentOptions } from "./crossWindow/index";
import { InWindowChildComponent } from "./inWindow/childComponent";

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
        throw new Error(`The "${options.type}" is not configured.`);
    }
  }
}
