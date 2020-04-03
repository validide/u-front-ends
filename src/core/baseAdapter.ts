import { AdapterEvent } from './adapterEvent';

export type CommandHandlerType = ((e: Event) => void);

export abstract class BaseAdapter {
  private eventHander: CommandHandlerType | null;
  private disposed: boolean;

  constructor() {
    this.eventHander = this.handleEvent.bind(this);
    this.attachCommandHandler(this.eventHander);
    this.disposed = false;
  }

  protected abstract attachCommandHandler(handler: CommandHandlerType): void;
  protected abstract detachCommandHandler(handler: CommandHandlerType): void;
  protected abstract getAdapterEvent(e:Event): AdapterEvent | null;
  protected abstract dispatchEvent<T>(information: T): void;
  protected abstract handleEventCore(e: AdapterEvent): void
  protected abstract disposeCore(): void;

  private handleEvent(e: Event): void {
    const evt = this.getAdapterEvent(e);
    if (!evt)
      return;

    this.handleEventCore(evt);
  }

  public dispose(): void {
    if (this.disposed)
      return;

    this.disposed = true;
    if (this.eventHander) {
      this.detachCommandHandler(this.eventHander);
      this.eventHander = null;
    }

    this.disposeCore();
  }
}
