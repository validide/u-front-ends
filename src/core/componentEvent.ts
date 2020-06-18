/**
 * Lifecycle event types.
 */
export enum ComponentEventType {
  BeforeCreate = 'beforeCreate',
  Created = 'created',
  BeforeMount = 'beforeMount',
  Mounted = 'mounted',
  BeforeUpdate = 'beforeUpdate',
  Updated = 'updated',
  BeforeDestroy = 'beforeDestroy',
  Destroyed = 'destroyed',
  Error = 'error',
  Data = 'data'
}

/**
 * Handler type for a component event.
 */
export type ComponentEventHandler = (event: ComponentEvent) => void;

/**
 * Evnts triggered by the components
 */
export class ComponentEvent {
  public id: string;
  public type: ComponentEventType;
  public el: HTMLElement | null;
  public parentEl: HTMLElement;
  public error: Error | null;
  public timestamp: Date;
  public data: any;

  /**
   * Constructor.
   * @param id Component unique idnetifyer.
   * @param type The type of event.
   * @param el The componenet root element.
   * @param parentEl The parent element of the component.
   * @param error The error data in case this is an error event.
   */
  constructor(
    id: string,
    type: ComponentEventType,
    el: HTMLElement | null,
    parentEl: HTMLElement,
    error: Error | null
  ) {
    this.id = id;
    this.type = type;
    this.el = el;
    this.parentEl = parentEl;
    this.error = error;
    this.timestamp = new Date();
  }
}
