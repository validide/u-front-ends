import { getUuidV4 } from '../../../utilities/random';
/**
 * Kind of events used to comunicate between content and container component.
 */
export enum CommunicationsEventKind {
  Mounted = 'mounted',
  BeforeUpdate = 'beforeUpdate',
  Updated = 'updated',
  BeforeDispose = 'beforeDispose',
  Disposed = 'disposed',
  Data = 'data'
}

/**
 * Event used to comunicate between content and container component.
 */
export class CommunicationsEvent {
  /**
   * The type of event dispatched by the child component.
   */
  public static readonly CONTENT_EVENT_TYPE: string = 'content_event.communication.children.validide_micro_front_ends';
  /**
   * The type of event dispatched by the content.
   */
  public static readonly CONTAINER_EVENT_TYPE: string = 'container_event.communication.children.validide_micro_front_ends';

  /**
   * The kind of event.
   */
  public kind: CommunicationsEventKind;
  /**
   * Unique idnetifyer.
   */
  public uuid: string;
  /**
   * Timestamp.
   */
  public timestamp: number;
  /**
   * Content Id - can be used to identify the event source.
   */
  public contentId: string;
  /**
   * Event data.
   */
  public data: any;

  /**
   * Constructor.
   * @param kind The kind of event.
   */
  constructor(kind: CommunicationsEventKind) {
    this.kind = kind;
    this.uuid = getUuidV4()
    this.timestamp = new Date().getTime();
    this.contentId = '';
  }
}
