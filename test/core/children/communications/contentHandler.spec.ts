import 'mocha';
import { JSDOM } from 'jsdom';
import { expect } from 'chai';
import { MockContentCommunicationHandler } from '../../../mocks/mockContentCommunicationHandler';
import { MockCommunicationsManager } from '../../../mocks/mockCommunicationsManager';
import { CommunicationsEvent, CommunicationsEventKind, ContentCommunicationHandlerMethods } from '../../../../src';
import { createCustomEvent } from '../../../../src/dom/document/createCustomEvent';
import { values_falsies } from '../../../utils';
// tslint:disable: no-unused-expression

export function test_ContentCommunicationHandler() {
  describe('ContentCommunicationHandler', () => {
    let _jsDom: JSDOM;
    let _win: Window;
    let _mngr: MockCommunicationsManager;
    let _handler: MockContentCommunicationHandler;
    let _methods: ContentCommunicationHandlerMethods;
    let _disposeCalls = 0;
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
      _mngr.initialize();
      _methods = new ContentCommunicationHandlerMethods();
      _methods.dispose = () => { _disposeCalls++; };
      _handler = new MockContentCommunicationHandler(_mngr, _methods);
    });

    afterEach(() => {
      _handler.dispose();
      _mngr.dispose();
      _win.close();
      _jsDom.window.close();
    });

    it('should setEventReceivedCallback during construcotr call', () => {
      const evt = new CommunicationsEvent(CommunicationsEventKind.BeforeDispose);
      const cEvent = createCustomEvent(_win.document, _eventType, { detail: evt });

      _mngr.callEventReceivedCallback(cEvent);
      expect(_disposeCalls).to.eq(1);
    });

    it('should not fail if calling dispose multiple times', () => {
      expect(() => _handler.dispose()).not.to.throw();
      expect(() => _handler.dispose()).not.to.throw();
      (_handler as any).disposed = false;
      expect(() => _handler.dispose()).not.to.throw();
    });

    it('should not fail if calling send after dispose', () => {
      _handler.dispose();
      expect(() => _handler.send(new CommunicationsEvent(CommunicationsEventKind.BeforeDispose)))
        .not.to.throw();
    });

    it('should send the event', () => {
      const evt = new CommunicationsEvent(CommunicationsEventKind.BeforeDispose);
      expect(() => _handler.send(evt)).not.to.throw();
      expect(_mngr.sentEvents.length).to.eq(1);
      expect(_mngr.sentEvents[0]).to.eql(evt);
    });

    values_falsies.forEach(f => {
      it(`should not fail if calling handleEventCore without any methods("${f}")`, () => {
        const hander = new MockContentCommunicationHandler(_mngr, f as unknown as ContentCommunicationHandlerMethods);
        expect(() => hander.handleEventCore(new CommunicationsEvent(CommunicationsEventKind.BeforeDispose)))
          .not.to.throw();
      });
    });

    it('should not fail if calling handleEventCore with an unconfigured event kind', () => {
      const e = new CommunicationsEvent(CommunicationsEventKind.Updated);
      expect(() => _handler.handleEventCore(e)).to.throw(`The "${e.kind}" event is not configured.`);
    });

    it('should send an event when calling "dispatchMounted"', () => {
      expect(() => _handler.dispatchMounted()).not.to.throw();
      expect(_mngr.sentEvents.length).to.eq(1);
      expect((_mngr.sentEvents[0] as CommunicationsEvent).kind).to.eql(CommunicationsEventKind.Mounted);
    });

    it('should send an event when calling "dispatchBeforeUpdate"', () => {
      expect(() => _handler.dispatchBeforeUpdate()).not.to.throw();
      expect(_mngr.sentEvents.length).to.eq(1);
      expect((_mngr.sentEvents[0] as CommunicationsEvent).kind).to.eql(CommunicationsEventKind.BeforeUpdate);
    });

    it('should send an event when calling "dispatchUpdated"', () => {
      expect(() => _handler.dispatchUpdated()).not.to.throw();
      expect(_mngr.sentEvents.length).to.eq(1);
      expect((_mngr.sentEvents[0] as CommunicationsEvent).kind).to.eql(CommunicationsEventKind.Updated);
    });

    it('should send an event when calling "dispatchBeforeDispose"', () => {
      expect(() => _handler.dispatchBeforeDispose()).not.to.throw();
      expect(_mngr.sentEvents.length).to.eq(1);
      expect((_mngr.sentEvents[0] as CommunicationsEvent).kind).to.eql(CommunicationsEventKind.BeforeDispose);
    });

    it('should send an event when calling "dispatchDisposed"', () => {
      expect(() => _handler.dispatchDisposed()).not.to.throw();
      expect(_mngr.sentEvents.length).to.eq(1);
      expect((_mngr.sentEvents[0] as CommunicationsEvent).kind).to.eql(CommunicationsEventKind.Disposed);
    });

    it('should send data', () => {
      const data = {
        'foo': 'bar',
        nested: {
          'prop_name': 'prop_value'
        }
      };

      _handler.sendData(data);

      expect(_mngr.sentEvents.length).to.eq(1);
      expect(_mngr.sentEvents[0].kind).to.eq(CommunicationsEventKind.Data);
      expect(_mngr.sentEvents[0].data).to.eq(data);
    });

    it('should handle data event', () => {
      const data = {
        'foo': 'bar',
        nested: {
          'prop_name': 'prop_value'
        }
      };
      const e = new CommunicationsEvent(CommunicationsEventKind.Data);
      e.data = data;

      let receivedData: any = null;
      _methods.handleDataEvent = (d: any) => receivedData = d;
      _handler.handleEventCore(e);

      expect(receivedData).not.to.be.null;
      expect(receivedData).to.eq(data);
    });

    it('should not fail if data event is not configured', () => {
      const data = {
        'foo': 'bar',
        nested: {
          'prop_name': 'prop_value'
        }
      };
      const e = new CommunicationsEvent(CommunicationsEventKind.Data);
      e.data = data;

      const handler = new MockContentCommunicationHandler(_mngr, null as unknown as ContentCommunicationHandlerMethods);
      expect(() => handler.handleEventCore(e)).not.to.throw();
    });
  });
}
