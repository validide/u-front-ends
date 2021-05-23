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
import { MockCommunicationsManager } from '../../../mocks/mockCommunicationsManager';
import { CommunicationsEvent, CommunicationsEventKind } from '../../../../src';
import { createCustomEvent } from '../../../../src/dom/document/createCustomEvent';
import { getDelayPromise, values_falsies } from '../../../utils';

export function test_CommunicationsManager() {
  describe('CommunicationsManager', () => {
    let _jsDom: JSDOM;
    let _win: Window;
    let _mngr: MockCommunicationsManager;
    const _eventType = 'some_event_type';

    beforeEach(() => {
      _jsDom = new JSDOM(undefined, {
        url: 'http://localhost:8080/',
        runScripts: 'dangerously'
      });
      if (!_jsDom.window?.document?.defaultView)
        throw new Error('Setup failure!');
      _win = _jsDom.window.document.defaultView;
      _mngr = new MockCommunicationsManager(_win.document.body, _eventType, _win.document.body, _eventType);
    });

    afterEach(() => {
      _mngr.dispose();
      _win.close();
      _jsDom.window.close();
    });

    it('calling dispose multiple times does not fail', () => {
      expect(() => {
        _mngr.dispose();
        _mngr.dispose();
        (_mngr as any).disposed = false;
        _mngr.dispose();
      }).not.to.throw();
    });

    it('calling initialize multiple times does not fail', () => {
      expect(() => {
        _mngr.initialize();
        _mngr.initialize();
      }).not.to.throw();

      expect(_mngr.receiving).to.be.true;
    });

    it('calling initialize after dispose not fail but does not receive', () => {
      expect(() => {
        _mngr.initialize();
        _mngr.dispose();
        _mngr.initialize();
      }).not.to.throw();

      expect(_mngr.receiving).to.be.false;
    });

    it('calling initialize without an inbound enpoint does not fail but does not receive', () => {
      const mngr = new MockCommunicationsManager(null as unknown as HTMLElement, _eventType, _win.document.body, _eventType);
      expect(() => {
        mngr.initialize();
        mngr.initialize();
      }).not.to.throw();

      expect(mngr.receiving).to.be.false;
    });

    it('calling send without an outbound enpoint does not fail but does not send', () => {
      const mngr = new MockCommunicationsManager(_win.document.body, _eventType, null as unknown as HTMLElement, _eventType);
      expect(() => {
        mngr.send(new CommunicationsEvent(CommunicationsEventKind.BeforeDispose));
      }).not.to.throw();

      expect(mngr.sentEvents.length).to.eq(0);
    });

    it('calling send will send an event', () => {
      const evt = new CommunicationsEvent(CommunicationsEventKind.BeforeDispose);
      expect(() => {
        _mngr.send(evt);
      }).not.to.throw();

      expect(_mngr.sentEvents.length).to.eq(1);
      expect(_mngr.sentEvents[0]).to.eq(evt);
    });

    it('will handle event if handler is set', async () => {
      const evts: CommunicationsEvent[] = [];
      _mngr.initialize();
      _mngr.setEventReceivedCallback((e: CommunicationsEvent) => { evts.push(e); });

      const evt = new CommunicationsEvent(CommunicationsEventKind.BeforeDispose);
      _win.document.body.dispatchEvent(createCustomEvent(_win.document, _eventType, { detail: evt }));

      await getDelayPromise(1); // Wait for JSDOM to send the event

      expect(_mngr.receivedEvents.length).to.eq(1);
      expect(evts.length).to.eq(1);
    });

    it('will not handle event if handler is not set', async () => {
      _mngr.initialize();
      const evt = new CommunicationsEvent(CommunicationsEventKind.BeforeDispose);
      _win.document.body.dispatchEvent(createCustomEvent(_win.document, _eventType, { detail: evt }));

      await getDelayPromise(1); // Wait for JSDOM to send the event

      expect(_mngr.receivedEvents.length).to.eq(0);
    });

    values_falsies.forEach(f => {
      it(`will not handle event if "${f}"`, async () => {
        const evts: CommunicationsEvent[] = [];
        _mngr.initialize();
        _mngr.setEventReceivedCallback((e: CommunicationsEvent) => { evts.push(e); });

        _win.document.body.dispatchEvent(createCustomEvent(_win.document, _eventType, { detail: f }));

        await getDelayPromise(1); // Wait for JSDOM to send the event

        expect(_mngr.receivedEvents.length).to.eq(1);
        expect(_mngr.receivedEvents[0]).to.eq(f === undefined ? null : f);
        expect(evts.length).to.eq(0);
      });
    });
  });
}
