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
import { JSDOM } from 'jsdom';
import { expect } from 'chai';
import { CommunicationsEvent, CommunicationsEventKind } from '../../../../src';
import { createCustomEvent } from '../../../../src/dom/document/createCustomEvent';
import { values_falsies } from '../../../utils';
import { MockHTMLElementCommunicationsManager } from '../../../mocks/mockHTMLElementCommunicationsManager';

export function test_HTMLElementCommunicationsManager() {
  describe('HTMLElementCommunicationsManager', () => {
    let _jsDom: JSDOM;
    let _win: Window;
    let _mngr: MockHTMLElementCommunicationsManager;
    const _eventType = 'some_event_type';

    beforeEach(() => {
      _jsDom = new JSDOM(undefined, {
        url: 'http://localhost:8080/',
        runScripts: 'dangerously'
      });
      if (!_jsDom.window?.document?.defaultView)
        throw new Error('Setup failure!');
      _win = _jsDom.window.document.defaultView;
      _mngr = new MockHTMLElementCommunicationsManager(_win.document.body, _eventType, _win.document.body, _eventType);
    });

    afterEach(() => {
      _win.close();
      _jsDom.window.close();
      _mngr.dispose();
    });

    it('calling send to an endpoint that is not attached will not fail but will not send', () => {
      const ep = _win.document.createElement('div');
      const events: Event[] = [];
      ep.addEventListener(_eventType, (e:Event ) => {events.push(e);});
      Object.defineProperty(ep, 'ownerDocument', {
        value: undefined,
        writable: false
      });
      expect(() => {
        _mngr.sendEvent(ep ,new CommunicationsEvent(CommunicationsEventKind.BeforeDispose));
      }).not.to.throw();

      expect(events.length).to.eq(0);
    });

    it('calling send to an endpoint will send', () => {
      const ep = _win.document.createElement('div');
      const events: Event[] = [];
      const det = new CommunicationsEvent(CommunicationsEventKind.BeforeDispose);
      ep.addEventListener(_eventType, (e:Event ) => {events.push(e);});


      expect(() => {
        _mngr.sendEvent(ep, det);
      }).not.to.throw();

      expect(events.length).to.eq(1);
      expect(events[0].type).to.eq(_eventType);
      expect((events[0] as CustomEvent).detail).to.eq(det);
    });

    values_falsies.forEach(f=> {
      it(`should return null is reading "${f}" as event`, () => {
        expect(_mngr.readEvent(f as unknown as Event)).to.be.null;
      });
    });

    values_falsies.forEach(f=> {
      it(`should return null is sending "${f}" as detail`, () => {
        expect(_mngr.readEvent(createCustomEvent(_win.document, _eventType, { detail: f}))).to.be.null;
      });
    });

    it('read an event and return the correct data', () => {
      const evt = new CommunicationsEvent(CommunicationsEventKind.BeforeDispose);

      expect(_mngr.readEvent(_win.document.createEvent('MouseEvent'))).to.be.null;
      expect(_mngr.readEvent(createCustomEvent(_win.document, _eventType + '_wrong_type', { detail: evt}))).to.be.null;
      expect(_mngr.readEvent(createCustomEvent(_win.document, _eventType, { detail: evt}))).to.eq(evt);
    });

    it('attach and detach handler', () => {
      const events: Event[] = [];
      const handler = (e:Event ) => {events.push(e);};
      const det = new CommunicationsEvent(CommunicationsEventKind.BeforeDispose);
      const ep = _win.document.createElement('div');

      ep.dispatchEvent(createCustomEvent(_win.document, _eventType, { detail: det}));
      expect(events.length).to.eq(0);

      _mngr.startReceiving(ep, handler);
      ep.dispatchEvent(createCustomEvent(_win.document, _eventType, { detail: det}));

      expect(events.length).to.eq(1);
      expect(events[0].type).to.eq(_eventType);
      expect((events[0] as CustomEvent).detail).to.eq(det);

      _mngr.stopReceiving(ep, handler);
      ep.dispatchEvent(createCustomEvent(_win.document, _eventType, { detail: det}));

      expect(events.length).to.eq(1);
      expect(events[0].type).to.eq(_eventType);
      expect((events[0] as CustomEvent).detail).to.eq(det);

    });

  });
}
