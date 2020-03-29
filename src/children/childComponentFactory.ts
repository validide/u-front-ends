import { ChildComponentOptions } from './childComponentOptions';
import { ChildComponent } from './childComponent';
import { ChildComponentType } from './childComponentType';
import { ScriptChildComponent } from './script/index';
import { ScriptChildComponentOptions } from './script/scriptChildComponentOptions';
import { RootComponentFacade } from '../index';

export class ChildComponentFactory {
  public createComponent(window: Window, options: ChildComponentOptions, rootFacade: RootComponentFacade): ChildComponent {
    switch (options.type) {
      case ChildComponentType.Script:
        return new ScriptChildComponent(window, <ScriptChildComponentOptions>options, rootFacade);
      default:
        throw new Error(`The "${options.type}" is not configured.`)
    }
  }
}
