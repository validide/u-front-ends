import { ChildComponentOptions } from './childComponentOptions';
import { Component } from '../component';
import { RootComponentFacade } from '../rootComponentFacade';
import { ComponentEventType } from '../componentEvent';
import { ContainerCommunicationHandler, ContainerCommunicationHandlerMethods } from './communications/index';

/**
 * Child component base class.
 */
export abstract class ChildComponent extends Component {
  private rootFacade: RootComponentFacade | null;
  private communicationHandler: ContainerCommunicationHandler | null;
  private contentDisposePromise: Promise<void> | null;
  private contentDisposePromiseResolver: (() => void) | null;

  /**
   * Constructor.
   *
   * @param window The window reference.
   * @param options The child options.
   * @param rootFacade The facade to the root component.
   */
  constructor(window: Window, options: ChildComponentOptions, rootFacade: RootComponentFacade) {
    super(window, options);
    this.rootFacade = rootFacade;
    this.communicationHandler = null;
    this.contentDisposePromise = null;
    this.contentDisposePromiseResolver = null;
  }

  /**
   * Core method to get the communication handler.
   * All derived classes need to implement this to return the correct handler implementation.
   *
   * @param methods
   */
  protected abstract getCommunicationHandlerCore(methods: ContainerCommunicationHandlerMethods): ContainerCommunicationHandler;

  /**
   * Get the communication handler.
   */
  protected getCommunicationHandler(): ContainerCommunicationHandler {
    const methods = new ContainerCommunicationHandlerMethods();
    methods.mounted = () => this.callHandler(ComponentEventType.Mounted);
    methods.beforeUpdate = () => this.callHandler(ComponentEventType.BeforeUpdate);
    methods.updated = () => this.callHandler(ComponentEventType.Updated);
    methods.data = (data: any) => this.callHandler(ComponentEventType.Data, data);
    methods.beforeDispose = () => this.contentBeginDisposed();
    methods.disposed = () => this.contentDisposed();
    return this.getCommunicationHandlerCore(methods);
  }

  /**
   * Get the child component options.
   */
  protected getOptions(): ChildComponentOptions {
    return super.getOptions() as ChildComponentOptions;
  }

  /**
   * Handler for the signal that the component started to dispose.
   */
  private contentBeginDisposed(): void {
    if (this.contentDisposePromise !== null)
      return; // Dispose has already started.

    this.setContentDisposePromise();
    // Inform parent the content is being disposed.
    (this.rootFacade as RootComponentFacade).signalDisposed(this);
  }

  /**
   * Signal the content that it will be disposed.
   */
  private startDisposingContent(): void {
    if (this.contentDisposePromise !== null)
      return; // Dispose has already started.

    this.setContentDisposePromise();

    // This should trigger the child component dispose.
    (this.communicationHandler as ContainerCommunicationHandler).requestContentDispose();
  }

  /**
   * Set the promise that is used fof the disposing of the component.
   */
  private setContentDisposePromise(): void {
    this.contentDisposePromise = Promise
      .race<void>([
      new Promise<void>(resolver => {
        this.contentDisposePromiseResolver = resolver;
      }),
      new Promise<void>((resolveTimeout, rejectTimeout) => {
        this
          .getWindow()
          .setTimeout(
            () => rejectTimeout(new Error('Child dispose timeout.')),
            this.getOptions().contentDisposeTimeout
          );
      })
    ])
      .catch(err => {
        this.callErrorHandler(err as Error);
      });
  }

  /**
   * Handler for the signal that the content has finished disposing.
   */
  private contentDisposed(): void {
    if (this.contentDisposePromiseResolver === null) {
      // For some reason we got the disposed call without getting the 'beginDispose' call.
      this.contentDisposePromise = Promise.resolve();
      (this.rootFacade as RootComponentFacade).signalDisposed(this);
    } else {
      this.contentDisposePromiseResolver();
    }
  }


  /**
   * @@inheritdoc
   */
  protected mountCore(): Promise<void> {
    if (!this.communicationHandler) {
      this.communicationHandler = this.getCommunicationHandler();
    }
    return super.mountCore();
  }

  /**
   * @@inheritdoc
   */
  protected async disposeCore(): Promise<void> {
    this.startDisposingContent();
    await (this.contentDisposePromise as Promise<void>);

    (this.communicationHandler as ContainerCommunicationHandler).dispose();
    this.communicationHandler = null;
    this.contentDisposePromiseResolver = null;
    this.contentDisposePromise = null;
    await super.disposeCore();
  }

  /**
   * Send data.
   *
   * @param data The data to send.
   */
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public sendData(data: any): void{
    this.communicationHandler?.sendData(data);
  }
}
