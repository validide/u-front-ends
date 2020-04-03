import { ChildComponent } from '../childComponent';
import { RootComponentFacade } from '../../rootComponentFacade';
import { ChildComponentOptions } from '../childComponentOptions';
import { WrapperAdapter, WrapperAdapterMethods } from '../../wrapperAdapter';
import { InWindowWrapperAdapter } from './inWindowWrapperAdapter';

export class InWindowChildComponent extends ChildComponent {
  constructor(window: Window, options: ChildComponentOptions, rootFacade: RootComponentFacade) {
    super(window, options, rootFacade);
  }

  protected getWrapperAdapterCore(methods: WrapperAdapterMethods): WrapperAdapter {
    return new InWindowWrapperAdapter(<HTMLElement>this.rootElement, methods);
  }

  protected async mountCore(): Promise<void> {
    this.getOptions().inject(<HTMLElement>this.rootElement);
    await super.mountCore();
  }
}
