import { ComponentEventHandler, ComponentEventType } from './componentEvent';
import { ResourceConfiguration } from './resourceConfiguration';

export class ComponentEventHandlers {
  [ComponentEventType.BeforeCreate]?: ComponentEventHandler;
  [ComponentEventType.Created]?: ComponentEventHandler;
  [ComponentEventType.BeforeMount]?: ComponentEventHandler;
  [ComponentEventType.Mounted]?: ComponentEventHandler;
  [ComponentEventType.BeforeUpdate]?: ComponentEventHandler;
  [ComponentEventType.Updated]?: ComponentEventHandler;
  [ComponentEventType.BeforeDestroy]?: ComponentEventHandler;
  [ComponentEventType.Destroyed]?: ComponentEventHandler;
  [ComponentEventType.Error]?: ComponentEventHandler;
}

export class ComponentOptions {
  public parent: string | HTMLElement = 'body';
  public tag: string = 'div';
  public handlers: ComponentEventHandlers = new ComponentEventHandlers();
  public resources: Array<ResourceConfiguration> = [];
}
