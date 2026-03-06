import {
  type ContainerCommunicationHandler,
  type ContainerCommunicationHandlerMethods,
  CrossWindowChildComponent,
  type CrossWindowChildComponentOptions,
} from "../../src/index";

export class MockCrossWindowChildComponent extends CrossWindowChildComponent {
  public mountCore(): Promise<void> {
    return super.mountCore();
  }

  public getOptions(): CrossWindowChildComponentOptions {
    return super.getOptions();
  }

  public getCommunicationHandlerCore(methods: ContainerCommunicationHandlerMethods): ContainerCommunicationHandler {
    return super.getCommunicationHandlerCore(methods);
  }

  public getRootEl(): HTMLElement {
    return this.rootElement as HTMLElement;
  }
}
