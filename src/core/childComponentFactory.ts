import { RootComponentFacade } from './rootComponentFacade';
import { ChildComponent } from './childComponent';
import { ChildComponentOptions } from './childComponentOptions';
import { ChildComponentType } from './childComponentType';
import { ScriptChildComponent } from './children/script/index';
import { ScriptChildComponentOptions } from './children/script/scriptChildComponentOptions';

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
