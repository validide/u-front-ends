import 'mocha';
import { ComponentEvent, ComponentEventType } from '../../src/index';
import { expect } from 'chai';
import { JSDOM } from 'jsdom';
// tslint:disable: no-unused-expression

export function test_ComponentEvent() {
  describe('ComponentEvent', () => {
    let _jsDom: JSDOM;
    let _win: Window;

    beforeEach(() => {
      _jsDom = new JSDOM(undefined, { url: 'http://localhost:8080/' });
      if (!_jsDom.window?.document?.defaultView)
        throw new Error('Setup failure!');
      _win = _jsDom.window.document.defaultView;
    });

    afterEach(() => {
      _win.close();
      _jsDom.window.close();
    });

    it('should require all values be passed to constructor', () => {
      const el = _win.document.createElement('div');
      const value = new ComponentEvent(
        'id',
        ComponentEventType.Created,
        el,
        _win.document.body,
        null
      );

      expect(value.id).to.eq('id');
      expect(value.type).to.eq(ComponentEventType.Created);
      expect(value.el).to.eq(el);
      expect(value.parentEl).to.eq(_win.document.body);
      expect(value.error).to.be.null;
    });
  });
}
