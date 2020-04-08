import 'mocha';
import { JSDOM } from 'jsdom';
import { expect } from 'chai';
import { RootComponent, RootComponentOptions, ChildComponentOptions } from '../../src';
import { values_falsies, getDelayPromise } from '../utils';
import { MockChildComponentFactory, MockChildComponent } from '../mocks/mockChildComponentFactory';

export function test_RootComponent() {
  describe('RootComponent', () => {
    let _jsDom: JSDOM;
    let _win: Window;
    let _options: RootComponentOptions;
    let _childOptions: ChildComponentOptions;

    beforeEach(() => {
      _jsDom = new JSDOM(undefined, { url: 'http://localhost:8080/' });
      if (!_jsDom.window?.document?.defaultView)
        throw new Error('Setup failure!');
      _win = _jsDom.window.document.defaultView;
      _options = new RootComponentOptions();
      _options.childFactory = new MockChildComponentFactory();
      _childOptions = new ChildComponentOptions();
    });

    afterEach(() => {
      _win.close();
      _jsDom.window.close();
    })

    describe('Constructor', () => {

      values_falsies.forEach((f: any) => {
        it(`passing a falsie as the "window" argument throws - ${f}`, () => {
          expect(() => new RootComponent(<any>f, _options)).to.throw('Missing "window" argument.');
        })
      });

      values_falsies.forEach((f: any) => {
        it(`passing a falsie as the "options" argument throws - ${f}`, () => {
          expect(() => new RootComponent(_win, <any>f)).to.throw('Missing "options" argument.');
        })
      });

      it(`does not throw if valid arguments are provided`, () => {
        expect(() => new RootComponent(_win, _options)).not.to.throw('Missing "window" argument.');
      })

    })

    describe('mount', () => {
      it('should raise the mount event', async () => {
        let mounted = false;
        const options = new RootComponentOptions();
        options.handlers.mounted = () => {mounted = true;};
        const root = new RootComponent(_win, options);
        await root.initialize();
        await root.mount();

        expect(mounted).to.be.true;
        expect(_win.document.getElementById(root.id)).to.not.be.null;
        expect((<HTMLElement>_win.document.getElementById(root.id)).tagName).to.eq('SCRIPT');
      })
    })

    describe('addChild', () => {
      it('should throw an error if not initialized', async () => {
        const root = new RootComponent(_win, _options);
        try {
          await root.addChild(_childOptions)
        } catch (error) {
          expect((<Error>error).message).to.eq('Wait for the component to initilize before starting to add children.')
        }
      })

      it('should throw an error if not initialized', async () => {
        const root = new RootComponent(_win, _options);
        try {
          await root.initialize();
          await root.addChild(_childOptions)
        } catch (error) {
          expect((<Error>error).message).to.eq('Wait for the component to mount before starting to add children.');
        }
      })

      it('should add child and return the child id', async () => {
        const root = new RootComponent(_win, _options);
        await root.initialize();
        await root.mount();
        const id = await root.addChild(_childOptions)
        expect(_win.document.getElementById(id)).to.not.be.null;
        expect((<HTMLElement>_win.document.getElementById(id)).tagName).to.eq('DIV');
      })
    })

    describe('get child', () => {
      values_falsies.concat('aaaa').forEach(f => {
        it(`return null if not existing ${f}`, () => {
          const root = new RootComponent(_win, _options);
          expect(root.getChild(<string><unknown>f)).to.be.null;
        })
      })
    })

    describe('remove child', () => {
      it('should not throw if ID does not exist', async () => {
        const root = new RootComponent(_win, _options);
        expect(async () => await root.removeChild('some_id_that_does_not_exit'))
            .not.to.throw();
      })

      it('should remove child', async () => {
        const root = new RootComponent(_win, _options);
        await root.initialize();
        await root.mount();
        const childOpts = _childOptions;
        const id = await root.addChild(childOpts);

        await root.removeChild(id);

        expect(_win.document.getElementById(id)).to.be.null;
      })

      it('should handle child dispose request', async () => {
        const root = new RootComponent(_win, _options);
        await root.initialize();
        await root.mount();
        const childOpts = _childOptions;
        const id = await root.addChild(childOpts);

        const child = root.getChild(id);
        expect(child).to.not.be.null;

        (<MockChildComponent>child).signalDisposeToParent();
        // This is not imediate
        expect(_win.document.getElementById(id)).to.not.be.null;

        await getDelayPromise(5);

        expect(_win.document.getElementById(id)).to.be.null;
      })
    })
  })
}
