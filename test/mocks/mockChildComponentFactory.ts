import { ChildComponentFactory, ChildComponentOptions, RootComponentFacade, ChildComponent, ContainerCommunicationHandlerMethods, ContainerCommunicationHandler, HTMLElementCommunicationsManager, CommunicationsEvent, Component } from "../../src";

export class MockChildComponentFactory extends ChildComponentFactory {
  public createComponent(window: Window, options: ChildComponentOptions, rootFacade: RootComponentFacade): Component {
    return new MockChildComponent(window, options, rootFacade)
  }
}


export class MockChildComponent extends ChildComponent<HTMLElement> {
  _rootFacade: RootComponentFacade;
  public callsTo_getCommunicationHandlerCore: number = 0;
  public comunicationMethods: ContainerCommunicationHandlerMethods = new ContainerCommunicationHandlerMethods();
  public public_containerCommunicationHandler: ContainerCommunicationHandler<HTMLElement> | null = null;

  constructor(window: Window, options: ChildComponentOptions, rootFacade: RootComponentFacade) {
    super(window, options, rootFacade);
    this._rootFacade = rootFacade;
  }

  protected getCommunicationHandlerCore(methods: ContainerCommunicationHandlerMethods): ContainerCommunicationHandler<HTMLElement> {
    this.callsTo_getCommunicationHandlerCore++;
    this.comunicationMethods = methods;

    if ((<HTMLElement>this.rootElement).tagName.toLowerCase() === 'ce-dipose-tests-null-handler'){
      return <ContainerCommunicationHandler<HTMLElement>><unknown>null;
    }

    this.public_containerCommunicationHandler = new MockContainerCommunicationHandler(
      new HTMLElementCommunicationsManager(
        <HTMLElement>this.rootElement,
        CommunicationsEvent.CONTENT_EVENT_TYPE,
        <HTMLElement>this.rootElement,
        CommunicationsEvent.CONTAINER_EVENT_TYPE
      ),
      methods
    );
    return this.public_containerCommunicationHandler;
  }

  public disposeCore(): Promise<void> {
    if ((<HTMLElement>this.rootElement).tagName.toLowerCase() === 'ce-dipose-tests'){
      return super.disposeCore();
    }
    return Promise.resolve()
  }

  public signalDisposeToParent() {
    this._rootFacade.signalDisposed(this);
  }
}

export class MockContainerCommunicationHandler extends ContainerCommunicationHandler<HTMLElement> {
  public calls_requestContentDispose = 0;
  public requestContentDispose() {
    this.calls_requestContentDispose++;
    super.requestContentDispose();
  }
}
