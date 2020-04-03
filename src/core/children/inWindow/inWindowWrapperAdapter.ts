import { AdapterEvent, AdapterEventName } from '../../adapterEvent';
import { CommandHandlerType } from '../../baseAdapter';
import { WrapperAdapter, WrapperAdapterMethods } from '../../wrapperAdapter';
import { InWindowEventFacade } from './inWindowEventFacade';

export class InWindowWrapperAdapter extends WrapperAdapter {
  private eventFacade: InWindowEventFacade | null;

  constructor(el: HTMLElement, wrapperMethods: WrapperAdapterMethods) {
    super(el, wrapperMethods);
    this.eventFacade = new InWindowEventFacade();
  }

  public requestContentDispose(): void {
    this.dispatchEvent(new AdapterEvent(AdapterEventName.BeforeDispose));
  }

  protected attachCommandHandler(handler: CommandHandlerType): void {
    (<InWindowEventFacade>this.eventFacade).dispatchEvent(this.el, handler);
  }

  protected detachCommandHandler(handler: CommandHandlerType): void {
    (<InWindowEventFacade>this.eventFacade).detachCommandHandler(this.el, handler);
  }


  protected getAdapterEvent(e: Event): AdapterEvent | null {
    return (<InWindowEventFacade>this.eventFacade).getAdapterEvent(e);
  }

  protected dispatchEvent<T>(detail: T): void {
    (<InWindowEventFacade>this.eventFacade).dispatchEvent(this.el, detail);
  }

  protected disposeCore(): void {
    this.eventFacade = null;
    super.disposeCore();
  }
}
