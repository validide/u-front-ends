export enum AdapterEventName {
  Mounted = 'mounted',
  BeforeUpdate = 'beforeUpdate',
  Updated = 'updated',
  BeforeDispose = 'beforeDispose',
  Disposed = 'disposed'
}

export class AdapterEvent {
  public static readonly EVENT_TYPE: string = 'event.adapter.validide_micro_front_ends';

  public name: AdapterEventName;

  constructor(name: AdapterEventName, eventInitDict?: EventInit) {
    this.name = name;
  }
}
