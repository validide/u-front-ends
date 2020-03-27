export abstract class BaseComponent {
  protected window: Window | null;
  private disposed: boolean;

  constructor(window: Window) {
    if (!window)
      throw new Error('Missing "window" reference.');

    this.window = window;
    this.disposed = false;
  }

  protected getWindow(): Window { return <Window>this.window; }

  protected getDocument(): Document { return this.getWindow().document; }

  protected disposeCore(): void {}

  public dispose(): void {
    if (this.disposed)
      return;

    this.disposed = true;
    this.disposeCore();
    this.window = null;
  }
}
