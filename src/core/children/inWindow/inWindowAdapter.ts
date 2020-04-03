import { AdapterEvent } from '../../adapterEvent';
import { CommandHandlerType } from '../../baseAdapter';
import { ContentAdapter } from '../../contentAdapter';
import { InWindowEventFacade } from '.';

export class InWindowContentAdapter extends ContentAdapter {
  private el: HTMLElement | null;
  private eventFacade: InWindowEventFacade | null;

  constructor(el: HTMLElement, disposeCommandCallback: () => void) {
    super(disposeCommandCallback);
    this.el = el;
    this.eventFacade = new InWindowEventFacade();
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

  public disposeCore(): void {
    this.el = null;
    this.eventFacade = null;
  }
}
