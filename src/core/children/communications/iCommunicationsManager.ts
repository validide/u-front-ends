import { CommunicationEvent } from './communicationEvent';

/**
 * Comunication manager.
 */
export interface ICommunicationsManager {
  /**
   * Read an event and extract the CommunicationEvent.
   * @param e The raw event.
   */
  readEvent(e:Event): CommunicationEvent | null;
  /**
   * Dispatch an event with the given information.
   * @param information The information to dispatch.
   */
  dispatchEvent<T>(information: T): void;
  /**
   * Dispose the manager.
   */
  dispose(): void;
}
