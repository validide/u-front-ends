/**
 * The data sent between the windows directly on the Message Event.
 */
export class CrossWindowCommunicationDataContract<T> {
  type: string;
  detail: T;

  /**
   * Constructor.
   * @param type Data type.
   * @param detail Data detail.
   */
  constructor(type: string, detail: T) {
    this.type = type;
    this.detail = detail;
  }
}
