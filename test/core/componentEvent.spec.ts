/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable prefer-arrow/prefer-arrow-functions */
import 'mocha';
import { ComponentEvent, ComponentEventType } from '../../src/index';
import { expect } from 'chai';
import { JSDOM } from 'jsdom';

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
