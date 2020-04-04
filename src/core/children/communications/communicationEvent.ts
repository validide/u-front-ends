import { getUuidV4 } from "../../../utilities/random";

export enum CommunicationEventKind {
  Mounted = 'mounted',
  BeforeUpdate = 'beforeUpdate',
  Updated = 'updated',
  BeforeDispose = 'beforeDispose',
  Disposed = 'disposed'
}

export class CommunicationEvent {
  public static readonly CONTENT_EVENT_TYPE: string = 'content_event.communication.children.validide_micro_front_ends';
  public static readonly CONTAINER_EVENT_TYPE: string = 'container_event.communication.children.validide_micro_front_ends';

  public kind: CommunicationEventKind;
  public uuid: string;
  public timestamp: number;
  public contentId: string;
  public data: any;

  constructor(kind: CommunicationEventKind) {
    this.kind = kind;
    this.uuid = getUuidV4()
    this.timestamp = new Date().getTime();
    this.contentId = '';
  }
}
