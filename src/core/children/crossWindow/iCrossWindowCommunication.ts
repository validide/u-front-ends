export interface ICrossWindowCommunicationData<T> {
  type: string;
  detail: T
}

export interface ICrossWindowCommunicationEventData<T> {
  uuid: string;
}
