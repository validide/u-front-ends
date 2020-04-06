/**
 * The data sent between the windows directly on the Message Event.
 */
export interface ICrossWindowCommunicationData<T> {
  type: string;
  detail: T
}

export interface ICrossWindowCommunicationEventData<T> {
  uuid: string;
}
