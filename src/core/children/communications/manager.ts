import { CommunicationsEvent } from './event';

/**
 * Comunications manager base class.
 */
export abstract class CommunicationsManager<TEndpoint> {
  private inboundEndpoint: TEndpoint | null;
  protected inboundEventType: string;
  private outboundEndpoint: TEndpoint | null;
  protected outboundEventType: string;
  private eventHandler: ((e: Event) => void) | null;
  private onEventReceived: ((event:CommunicationsEvent) => void) | null;
  private initialized: boolean;
  private disposed: boolean;

  /**
   * Constructor
   * @param inboundEndpoint The endpoint for receiving messages.
   * @param inboundEventType The types of messages to receive.
   * @param outboundEndpoint The endpoint to sent mesages.
   * @param outboundEventType The messages to send.
   */
  constructor(
    inboundEndpoint: TEndpoint,
    inboundEventType: string,
    outboundEndpoint: TEndpoint,
    outboundEventType: string
  ) {
    this.inboundEndpoint = inboundEndpoint;
    this.inboundEventType = inboundEventType;
    this.outboundEndpoint = outboundEndpoint;
    this.outboundEventType = outboundEventType;
    this.onEventReceived = null;
    this.eventHandler = (e:Event) => this.handleEvent(e);
    this.initialized = false;
    this.disposed = false;
  }

  /**
   * Handle the received events.
   * @param e The recevied event.
   */
  private handleEvent(e: Event): void {
    const evt = this.readEvent(e);
    if (evt && this.onEventReceived)
      this.onEventReceived(evt);
  }

  /**
   * Initialize the manager.
   */
  protected initializeCore(): void {}

  /**
   * Clean any resources before the manager is disposed.
   */
  protected disposeCore(): void {}

  /**
   * Start to receive messages
   * @param inboundEndpoint The inbound endpoint
   * @param handler The event hander
   */
  protected abstract startReceiving(inboundEndpoint: TEndpoint, handler: (e: Event) => void): void;

  /**
   * Stop receiveing messages
   * @param inboundEndpoint The inbound endpoint
   * @param handler The event hander
   */
  protected abstract stopReceiving(inboundEndpoint: TEndpoint, handler: (e: Event) => void): void;

  /**
   * Read the event and extract the message.
   * @param e
   */
  protected abstract readEvent(e: Event): CommunicationsEvent | null;
  /**
   * Send a message.
   * @param outboundEndpoint The outbound endpoint.
   * @param event The message.
   */
  protected abstract sendEvent(outboundEndpoint: TEndpoint, event: CommunicationsEvent): void;

  /**
   * Send a message.
   * @param event The message.
   */
  public send(event: CommunicationsEvent): void{
    if (this.outboundEndpoint) {
      this.sendEvent(this.outboundEndpoint, event);
    }
  }

  /**
   * The the callback to handle any incomming messages.
   * @param callback The callback.
   */
  public setEventReceivedCallback(callback: (event:CommunicationsEvent) => void) {
    this.onEventReceived = callback;
  }

  /**
   * Initialize the manager.
   */
  public initialize(): void {
    if (this.initialized)
      return;

    this.initialized = true;
    this.initializeCore();
    if (this.inboundEndpoint && this.eventHandler) {
      this.startReceiving(this.inboundEndpoint, this.eventHandler);
    }
  }

  /**
   * Dispose of the manager.
   */
  public dispose(): void {
    if (this.disposed)
      return;

    this.disposed = true;
    this.initialized = true;
    if (this.inboundEndpoint && this.eventHandler) {
      this.stopReceiving(this.inboundEndpoint, this.eventHandler);
    }
    this.eventHandler = null;
    this.onEventReceived = null;
    this.inboundEndpoint = null;
  }
}
