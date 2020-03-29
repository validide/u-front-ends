import { ChildComponent } from '../childComponent';
import { ScriptChildComponentOptions } from './scriptChildComponentOptions';
import { RootComponentFacade } from '../../root/rootComponentFacade';

export class ScriptChildComponent extends ChildComponent {
  constructor(window: Window, options: ScriptChildComponentOptions, rootFacade: RootComponentFacade) {
    super(window, options, rootFacade);
  }

  protected async mountCore(): Promise<void> {
    const options = <ScriptChildComponentOptions>this.getOptions();
    options.injectBridge(this.getChildContentBridge());
    await super.mountCore();
  }
}
