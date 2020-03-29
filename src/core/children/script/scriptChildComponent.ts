import { ChildComponent } from '../../childComponent';
import { RootComponentFacade } from '../../rootComponentFacade';
import { ScriptChildComponentOptions } from './scriptChildComponentOptions';

export class ScriptChildComponent extends ChildComponent {
  constructor(window: Window, options: ScriptChildComponentOptions, rootFacade: RootComponentFacade) {
    super(window, options, rootFacade);
  }

  protected async mountCore(): Promise<void> {
    const options = <ScriptChildComponentOptions>this.getOptions();
    options.inject(<HTMLElement>this.rootElement, this.getChildContentBridge());
    await super.mountCore();
  }
}
