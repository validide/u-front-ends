import { RootComponentFacade } from '../rootComponentFacade';
import { ChildComponent } from './childComponent';
import { ChildComponentOptions } from './childComponentOptions';
import { ChildComponentType } from './childComponentType';
import { InWindowChildComponent } from './inWindow/inWindowChildComponent';
import { CrossWindowChildComponent, CrossWindowChildComponentOptions } from './crossWindow/index';

export class ChildComponentFactory {
  public createComponent(window: Window, options: ChildComponentOptions, rootFacade: RootComponentFacade): ChildComponent {
    switch (options.type) {
      case ChildComponentType.InWindow:
        return new InWindowChildComponent(window, options, rootFacade);
      case ChildComponentType.CrossWindow:
          return new CrossWindowChildComponent(window, <CrossWindowChildComponentOptions>options, rootFacade);
      default:
        throw new Error(`The "${options.type}" is not configured.`)
    }
  }
}
