import { CommunicationsEvent } from './event';

export abstract class CommunicationsManager {
  private initialized: boolean;
  private disposed: boolean;

  /**
   * Constructor.
   */
  constructor() {
    this.initialized = false;
    this.disposed = false;
  }

  /**
   * Initialize the manager.
   */
  // tslint:disable-next-line: no-empty
  protected initializeCore(): void { }

  /**
   * Clean any resources before the manager is disposed.
   */
  // tslint:disable-next-line: no-empty
  protected disposeCore(): void { }

  /**
   * Send a message.
   * @param event The message.
   */
  public abstract send(event: CommunicationsEvent): void;

  /**
   * The the callback to handle any incoming messages.
   * @param callback The callback.
   */
  public abstract setEventReceivedCallback(callback: (event: CommunicationsEvent) => void): void;

  /**
   * Initialize the manager.
   */
  public initialize(): void {
    if (this.initialized)
      return;

    this.initialized = true;
    this.initializeCore();
  }

  /**
   * Dispose of the manager.
   */
  public dispose(): void {
    if (this.disposed)
      return;

    this.disposed = true;
    this.disposeCore();
  }
}

/**
 * Communications manager base class.
 */
export abstract class CommunicationsManagerOf<TEndpoint> extends CommunicationsManager {
  private inboundEndpoint: TEndpoint | null;
  protected inboundEventType: string;
  private outboundEndpoint: TEndpoint | null;
  protected outboundEventType: string;
  private eventHandler: ((e: Event) => void) | null;
  private onEventReceived: ((event: CommunicationsEvent) => void) | null;

  /**
   * Constructor
   * @param inboundEndpoint The endpoint for receiving messages.
   * @param inboundEventType The types of messages to receive.
   * @param outboundEndpoint The endpoint to sent messages.
   * @param outboundEventType The messages to send.
   */
  constructor(
    inboundEndpoint: TEndpoint,
    inboundEventType: string,
    outboundEndpoint: TEndpoint,
    outboundEventType: string
  ) {
    super();
    this.inboundEndpoint = inboundEndpoint;
    this.inboundEventType = inboundEventType;
    this.outboundEndpoint = outboundEndpoint;
    this.outboundEventType = outboundEventType;
    this.onEventReceived = null;
    this.eventHandler = (e: Event) => { this.handleEvent(e); };
  }

  /**
   * Handle the received events.
   * @param e The received event.
   */
  private handleEvent(e: Event): void {
    if (!this.onEventReceived)
      return;

    const evt = this.readEvent(e);
    if (evt) {
      this.onEventReceived(evt);
    }
  }

  /**
   * @inheritdoc
   */
  protected initializeCore(): void {
    if (this.inboundEndpoint && this.eventHandler) {
      this.startReceiving(this.inboundEndpoint, this.eventHandler);
    }
    super.initializeCore();
  }

  /**
   * @inheritdoc
   */
  protected disposeCore(): void {
    if (this.inboundEndpoint && this.eventHandler) {
      this.stopReceiving(this.inboundEndpoint, this.eventHandler);
    }
    this.eventHandler = null;
    this.onEventReceived = null;
    this.inboundEndpoint = null;
    super.disposeCore();
  }

  /**
   * Start to receive messages
   * @param inboundEndpoint The inbound endpoint
   * @param handler The event handler
   */
  protected abstract startReceiving(inboundEndpoint: TEndpoint, handler: (e: Event) => void): void;

  /**
   * Stop receiving messages
   * @param inboundEndpoint The inbound endpoint
   * @param handler The event handler
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
   * @inheritdoc
   */
  public send(event: CommunicationsEvent): void {
    if (this.outboundEndpoint) {
      this.sendEvent(this.outboundEndpoint, event);
    }
  }

  /**
   * @inheritdoc
   */
  public setEventReceivedCallback(callback: (event: CommunicationsEvent) => void) {
    this.onEventReceived = callback;
  }
}
