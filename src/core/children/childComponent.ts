import { ChildComponentOptions } from './childComponentOptions';
import { Component } from '../component';
import { RootComponentFacade } from '../rootComponentFacade';
import { ComponentEventType } from '../componentEvent';
import { ContainerCommunicationHandler, ContainerCommunicationHandlerMethods } from './communications/index';

export abstract class ChildComponent extends Component {
  private rootFacade: RootComponentFacade | null;
  private communicationHandler: ContainerCommunicationHandler | null;
  private contentDisposePromise: Promise<void> | null;
  private contentDisposePromiseResolver: (() => void) | null;

  constructor(window: Window, options: ChildComponentOptions, rootFacade: RootComponentFacade) {
    super(window, options);
    this.rootFacade = rootFacade;
    this.communicationHandler = null;
    this.contentDisposePromise = null;
    this.contentDisposePromiseResolver = null;
  }

  protected abstract getCommunicationHandlerCore(methods: ContainerCommunicationHandlerMethods): ContainerCommunicationHandler;

  protected getCommunicationHandler(): ContainerCommunicationHandler {
    const methods = new ContainerCommunicationHandlerMethods();
    methods.callMounterHandler = () => this.callHandler(ComponentEventType.Mounted);
    methods.callBeforeUpdateHandler = () => this.callHandler(ComponentEventType.BeforeUpdate);
    methods.callUpdatedHandler = () => this.callHandler(ComponentEventType.Updated);
    methods.contentBeginDisposed = () => this.contentBeginDisposed();
    methods.contentDisposed = () => this.contentDisposed();
    return this.getCommunicationHandlerCore(methods);
  }

  protected getOptions(): ChildComponentOptions {
    return <ChildComponentOptions>super.getOptions();
  }

  private contentBeginDisposed(): void {
    if (this.contentDisposePromise !== null)
      return; // Dispose has already started.

    this.setContentDisposePromise();
    // Inform parent the content is beeing disposed.
    (<RootComponentFacade>this.rootFacade).signalDisposed(this);
  }

  private startDisposingContent(): void {
    if (this.contentDisposePromise !== null)
      return; // Dispose has already started.

    this.setContentDisposePromise();

    // This should trigger the child component dispose.
    (<ContainerCommunicationHandler>this.communicationHandler).requestContentDispose();
  }

  private setContentDisposePromise(): void {
    if (this.contentDisposePromise !== null)
      return;

    this.contentDisposePromise = Promise
      .race<void>([
        new Promise<void>((resolver, rejecter) => {
          this.contentDisposePromiseResolver = resolver;
        }),
        new Promise<void>((resolveTimeout, rejectTimeout) => {
          this
            .getWindow()
            .setTimeout(
              () => rejectTimeout(`Child dispose timeout.`),
              this.getOptions().contentDisposeTimeout
            );
        })
      ])
      .catch((err) => {
        this.callErrorHandler(err);
      });
  }

  private contentDisposed(): void {
    if (this.contentDisposePromiseResolver === null) {
      // For some reason we got the disposed call without getting the 'beginDispose' call.
      this.contentDisposePromise = Promise.resolve();
      (<RootComponentFacade>this.rootFacade).signalDisposed(this);
    } else {
      this.contentDisposePromiseResolver();
    }
  }

  protected initializeCore(): Promise<void> {
    if (!this.communicationHandler) {
      this.communicationHandler = this.getCommunicationHandler();
    }
    return super.initializeCore();
  }

  protected async disposeCore(): Promise<void> {
    this.startDisposingContent();
    await (<Promise<void>>this.contentDisposePromise);

    if (this.communicationHandler) {
      this.communicationHandler.dispose();
      this.communicationHandler = null;
    }
    this.contentDisposePromiseResolver = null;
    this.contentDisposePromise = null;
    await super.disposeCore();
  }
}
