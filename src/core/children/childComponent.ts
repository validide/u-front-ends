import { ChildComponentOptions } from './childComponentOptions';
import { Component } from '../component';
import { RootComponentFacade } from '../rootComponentFacade';
import { ComponentEventType } from '../componentEvent';
import { ContainerCommunicationHandler, ContainerCommunicationHandlerMethods } from './communications/index';

/**
 * Child component base class.
 */
export abstract class ChildComponent<TEndpoint> extends Component {
  private rootFacade: RootComponentFacade | null;
  private communicationHandler: ContainerCommunicationHandler<TEndpoint> | null;
  private contentDisposePromise: Promise<void> | null;
  private contentDisposePromiseResolver: (() => void) | null;

  /**
   * Constructor.
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
   * Core method to get the comunication handler.
   * All derived classes need to implement this to retunr the correct handler implementation.
   * @param methods
   */
  protected abstract getCommunicationHandlerCore(methods: ContainerCommunicationHandlerMethods): ContainerCommunicationHandler<TEndpoint>;

  /**
   * Get the comunication handler.
   */
  protected getCommunicationHandler(): ContainerCommunicationHandler<TEndpoint> {
    const methods = new ContainerCommunicationHandlerMethods();
    methods.mounted = () => this.callHandler(ComponentEventType.Mounted);
    methods.beforeUpdate = () => this.callHandler(ComponentEventType.BeforeUpdate);
    methods.updated = () => this.callHandler(ComponentEventType.Updated);
    methods.beforeDispose = () => this.contentBeginDisposed();
    methods.disposed = () => this.contentDisposed();
    return this.getCommunicationHandlerCore(methods);
  }

  /**
   * Get the child component options.
   */
  protected getOptions(): ChildComponentOptions {
    return <ChildComponentOptions>super.getOptions();
  }

  /**
   * Handler for the signal that the component started to dispose.
   */
  private contentBeginDisposed(): void {
    if (this.contentDisposePromise !== null)
      return; // Dispose has already started.

    this.setContentDisposePromise();
    // Inform parent the content is beeing disposed.
    (<RootComponentFacade>this.rootFacade).signalDisposed(this);
  }

  /**
   * Signal the content that it will be disposed.
   */
  private startDisposingContent(): void {
    if (this.contentDisposePromise !== null)
      return; // Dispose has already started.

    this.setContentDisposePromise();

    // This should trigger the child component dispose.
    (<ContainerCommunicationHandler<TEndpoint>>this.communicationHandler).requestContentDispose();
  }

  /**
   * Set the promise that is used fof the disposing of the component.
   */
  private setContentDisposePromise(): void {
    this.contentDisposePromise = Promise
      .race<void>([
        new Promise<void>((resolver, rejecter) => {
          this.contentDisposePromiseResolver = resolver;
        }),
        new Promise<void>((resolveTimeout, rejectTimeout) => {
          this
            .getWindow()
            .setTimeout(
              () => rejectTimeout(new Error(`Child dispose timeout.`)),
              this.getOptions().contentDisposeTimeout
            );
        })
      ])
      .catch((err) => {
        this.callErrorHandler(err);
      });
  }

  /**
   * Handler for the signal that the content has finished disposing.
   */
  private contentDisposed(): void {
    if (this.contentDisposePromiseResolver === null) {
      // For some reason we got the disposed call without getting the 'beginDispose' call.
      this.contentDisposePromise = Promise.resolve();
      (<RootComponentFacade>this.rootFacade).signalDisposed(this);
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
    await (<Promise<void>>this.contentDisposePromise);

    (<ContainerCommunicationHandler<TEndpoint>>this.communicationHandler).dispose();
    this.communicationHandler = null;
    this.contentDisposePromiseResolver = null;
    this.contentDisposePromise = null;
    await super.disposeCore();
  }
}
