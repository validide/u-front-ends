export enum ComponentEventType {
  BeforeCreate = 'beforeCreate',
  Created = 'created',
  BeforeMount = 'beforeMount',
  Mounted = 'mounted',
  BeforeUpdate = 'beforeUpdate',
  Updated = 'updated',
  BeforeDestroy = 'beforeDestroy',
  Destroyed = 'destroyed',
  Error = 'error'
}

export type ComponentEventHandler = (event: ComponentEvent) => void;

export class ComponentEvent {
  public id: string;
  public type: ComponentEventType;
  public el: HTMLElement | null;
  public parentEl: HTMLElement;
  public error: Error | null;
  public timestamp: Date;

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
