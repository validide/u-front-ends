import {CrossWindowChildComponent, CrossWindowChildComponentOptions, ContainerCommunicationHandlerMethods, ContainerCommunicationHandler} from '../../src';

export class MockCrossWindowChildComponent extends CrossWindowChildComponent {
  public mountCore(): Promise<void> {
    return super.mountCore()
  }

  public getOptions(): CrossWindowChildComponentOptions {
    return super.getOptions();
  }

  public getCommunicationHandlerCore(methods: ContainerCommunicationHandlerMethods): ContainerCommunicationHandler {
    return super.getCommunicationHandlerCore(methods);
  }

  public getRootEl(): HTMLElement {
    return <HTMLElement>this.rootElement;
  }
}
