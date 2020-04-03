import { RootComponentFacade } from '../rootComponentFacade';
import { ChildComponent } from './childComponent';
import { ChildComponentOptions } from './childComponentOptions';
import { ChildComponentType } from './childComponentType';
import { InWindowChildComponent } from './inWindow';

export class ChildComponentFactory {
  public createComponent(window: Window, options: ChildComponentOptions, rootFacade: RootComponentFacade): ChildComponent {
    switch (options.type) {
      case ChildComponentType.InWindow:
        return new InWindowChildComponent(window, options, rootFacade);
      default:
        throw new Error(`The "${options.type}" is not configured.`)
    }
  }
}
