import 'mocha';
import { JSDOM } from 'jsdom';
import { expect } from 'chai';
import { BaseComponent } from '../../src';
import { values_falsies } from '../utils';

class Component extends BaseComponent {
  public timesDisposedCalled: number;
  constructor(window: Window) {
    super(window);
    this.timesDisposedCalled = 0;
  }

  public getWindowAccessor(): Window {
    return this.getWindow();
  }

  public getDocumentAccessor(): Document {
    return this.getDocument();
  }

  protected disposeCore(): void {
    this.timesDisposedCalled++;
    super.disposeCore();
  }
}

export function test_baseComponent() {
  describe('baseComponent', () => {
    let _jsDom: JSDOM;
    let _win: Window;

    beforeEach(() => {
      _jsDom = new JSDOM(undefined, { url: 'http://localhost:81/' });
      if (!_jsDom.window?.document?.defaultView)
        throw new Error('Setup failure!');
      _win = _jsDom.window.document.defaultView;
    });

    afterEach(() => {
      _win.close();
      _jsDom.window.close();
    })

    values_falsies.forEach((f: any) => {
      it(`passing a falsie as a window reference throws - ${f}`, () => {
        expect(() => new Component(<any>f)).to.throw('Missing "window" reference.');
      })
    });

    it(`does not throw if a valid window reference is passed`, () => {
      expect(() => new Component(_win)).not.to.throw('Missing "window" reference.');
    })

    it(`calling dispose multiple times has same effect as calling once`, () => {
      const comp = new Component(_win);
      expect(comp.timesDisposedCalled).to.eq(0);

      comp.dispose();
      expect(comp.timesDisposedCalled).to.eq(1);
      comp.dispose();
      expect(comp.timesDisposedCalled).to.eq(1);
      comp.dispose();
      expect(comp.timesDisposedCalled).to.eq(1);
    })

    it(`can access to "BaseComponent" window reference`, () => {
      const comp = new Component(_win);
      expect(comp.getWindowAccessor()).to.eq(_win);
    })

    it(`can access to "BaseComponent" document reference`, () => {
      const comp = new Component(_win);
      expect(comp.getDocumentAccessor()).to.eq(_win.document);
    })
  })
}
