export type ChildContentDisposeAction = () => Promise<void>;

export class ChildContentBridge {
  public signalMounted: () => void;
  public signalBeforeUpdate: () => void;
  public signalUpdated: () => void;
  public signalDispose: () => void;
  public setDisposeAction: (Action: ChildContentDisposeAction) => void;

  constructor(
    signalMounted: () => void,
    signalBeforeUpdate: () => void,
    signalUpdated: () => void,
    signalDispose: () => void,
    setDisposeAction: (Action: ChildContentDisposeAction) => void
  ) {
    this.signalMounted = signalMounted;
    this.signalBeforeUpdate = signalBeforeUpdate;
    this.signalUpdated = signalUpdated;
    this.signalDispose = signalDispose;
    this.setDisposeAction = setDisposeAction;
  }
}
