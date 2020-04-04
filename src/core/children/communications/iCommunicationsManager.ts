import { CommunicationEvent } from './communicationEvent';

export interface ICommunicationsManager {
  readEvent(e:Event): CommunicationEvent | null;
  dispatchEvent<T>(information: T): void;
  dispose(): void;
}
