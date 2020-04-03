import { AdapterEvent } from '../../adapterEvent';
import { CommandHandlerType } from '../../baseAdapter';

export class InWindowEventFacade {

  public attachCommandHandler(el: HTMLElement | null, handler: CommandHandlerType): void {
    if (!el)
      return;

    el.addEventListener(AdapterEvent.EVENT_TYPE, handler, false);
  }

  public detachCommandHandler(el: HTMLElement | null, handler: CommandHandlerType): void {
    if (!el)
      return;

    el.addEventListener(AdapterEvent.EVENT_TYPE, handler, false);
  }

  public getAdapterEvent(e: Event): AdapterEvent | null {
    if (!e || e.type !== AdapterEvent.EVENT_TYPE)
      return null;

    return <AdapterEvent>(<CustomEvent>e).detail;
  }

  public dispatchEvent<T>(el: HTMLElement | null, detail: T): void {
    if (!el)
      return;

    el.dispatchEvent(new CustomEvent(AdapterEvent.EVENT_TYPE, { detail: detail }));
  }

}
