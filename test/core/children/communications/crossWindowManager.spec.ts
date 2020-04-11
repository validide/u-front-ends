import 'mocha';
import { JSDOM } from 'jsdom';
import { expect } from 'chai';
import { CommunicationsEvent, CommunicationsEventKind, getUrlOrigin, CrossWindowCommunicationDataContract } from '../../../../src';
import { createCustomEvent } from '../../../../src/dom/document/createCustomEvent';
import { getDelayPromise, values_falsies } from '../../../utils';
import { MockCrossWindowCommunicationsManager } from '../../../mocks/mockCrossWindowCommunicationsManager';

export function test_CrossWindowCommunicationsManager() {
  describe('CrossWindowCommunicationsManager', () => {
    let _jsDom: JSDOM;
    let _win: Window;
    let _mngr: MockCrossWindowCommunicationsManager;
    const _eventType = 'some_event_type';

    beforeEach(() => {
      _jsDom = new JSDOM(undefined, {
        url: 'http://localhost:8080/',
        runScripts: 'dangerously'
      });
      if (!_jsDom.window?.document?.defaultView)
        throw new Error('Setup failure!');
      _win = _jsDom.window.document.defaultView;
      _mngr = new MockCrossWindowCommunicationsManager(
        _win,
        _eventType,
        _win,
        _eventType,
        _win.origin
      );
    });

    afterEach(() => {
      _win.close();
      _jsDom.window.close();
      _mngr.dispose();
    })

    it('calling send to an endpoint will send', async () => {
      const events: Array<Event> = [];
      const det = new CommunicationsEvent(CommunicationsEventKind.BeforeDispose);
      const data = new CrossWindowCommunicationDataContract<CommunicationsEvent>(
        _eventType,
        det
      );
      _win.addEventListener('message', (e: Event) => { events.push(e); });


      expect(() => {
        _mngr.sendEvent(_win, det);
      }).not.to.throw();

      await getDelayPromise(1)

      expect(events.length).to.eq(1);
      expect(events[0].type).to.eq('message');
      expect((<MessageEvent>events[0]).data).to.eql(data);
    })

    values_falsies.forEach(f => {
      it(`should return null is reading "${f}" as event`, () => {
        expect(_mngr.readEvent(<Event><unknown>f)).to.be.null;
      })
    })

    values_falsies.forEach(f => {
      it(`should return null is sending "${f}" as detail`, () => {
        expect(_mngr.readEvent(createCustomEvent(_win.document, _eventType, { detail: f }))).to.be.null;
      })
    })

    it('read an event and return null if not MessageEvent', () => {
      expect(_mngr.readEvent(_win.document.createEvent('MouseEvent'))).to.be.null;
    })

    it('read an event and return null if the origin is not the same', () => {
      const evt = new CommunicationsEvent(CommunicationsEventKind.BeforeDispose);
      const data = new CrossWindowCommunicationDataContract<CommunicationsEvent>(
        _eventType,
        evt
      );


      const message_with_wrong_origin = _win.document.createEvent('MessageEvent');
      Object.defineProperty(message_with_wrong_origin, 'origin', {
        value: 'LALA',
        writable: false
      });
      Object.defineProperty(message_with_wrong_origin, 'data', {
        value: data,
        writable: false
      });
      expect(message_with_wrong_origin.origin).to.not.eq(_win.origin);
      expect(_mngr.readEvent(message_with_wrong_origin)).to.be.null;
    })

    it('read an event and return null if the data is null', () => {
      const message_with_wrong_inner_type = _win.document.createEvent('MessageEvent');
      Object.defineProperty(message_with_wrong_inner_type, 'origin', {
        value: _win.origin,
        writable: false
      });
      Object.defineProperty(message_with_wrong_inner_type, 'data', {
        value: null,
        writable: false
      });
      expect(message_with_wrong_inner_type.origin).to.eq(_win.origin);
      expect(_mngr.readEvent(message_with_wrong_inner_type)).to.be.null;
    })

    it('read an event and return null if the Event type is not correct', () => {
      const evt = new CommunicationsEvent(CommunicationsEventKind.BeforeDispose);
      const message_with_wrong_inner_type = _win.document.createEvent('MessageEvent');
      Object.defineProperty(message_with_wrong_inner_type, 'origin', {
        value: _win.origin,
        writable: false
      });
      Object.defineProperty(message_with_wrong_inner_type, 'data', {
        value: new CrossWindowCommunicationDataContract<CommunicationsEvent>(
          _eventType + '_wrong',
          evt
        ),
        writable: false
      });
      expect(message_with_wrong_inner_type.origin).to.eq(_win.origin);
      expect(_mngr.readEvent(message_with_wrong_inner_type)).to.be.null;
    })

    values_falsies.forEach(f => {
      it(`read an event and return null if the detail is "${f}"`, () => {
        const message_with_wrong_inner_type = _win.document.createEvent('MessageEvent');
        Object.defineProperty(message_with_wrong_inner_type, 'origin', {
          value: _win.origin,
          writable: false
        });
        Object.defineProperty(message_with_wrong_inner_type, 'data', {
          value: new CrossWindowCommunicationDataContract<CommunicationsEvent>(
            _eventType,
            <CommunicationsEvent><unknown>f
          ),
          writable: false
        });
        expect(message_with_wrong_inner_type.origin).to.eq(_win.origin);
        expect(_mngr.readEvent(message_with_wrong_inner_type)).to.be.null;
      })
    })

    it('read an event and return the correct data', () => {
      const evt = new CommunicationsEvent(CommunicationsEventKind.BeforeDispose);
      const data = new CrossWindowCommunicationDataContract<CommunicationsEvent>(
        _eventType,
        evt
      );


      const correct_message = _win.document.createEvent('MessageEvent');
      Object.defineProperty(correct_message, 'origin', {
        value: _win.origin,
        writable: false
      });
      Object.defineProperty(correct_message, 'data', {
        value: data,
        writable: false
      });
      expect(correct_message.origin).to.eq(_win.origin);
      expect(_mngr.readEvent(correct_message)).to.eql(evt);
    })

    it('attach and detach handler', async () => {
      const events: Array<Event> = [];
      const handler = (e: Event) => { events.push(e); };
      const evt = new CommunicationsEvent(CommunicationsEventKind.BeforeDispose);
      const data = new CrossWindowCommunicationDataContract<CommunicationsEvent>(
        _eventType,
        evt
      );


      const correct_message = _win.document.createEvent('MessageEvent');
      Object.defineProperty(correct_message, 'origin', {
        value: _win.origin,
        writable: false
      });
      Object.defineProperty(correct_message, 'data', {
        value: data,
        writable: false
      });
      expect(correct_message.origin).to.eq(_win.origin);


      _win.postMessage(data, _win.origin);
      await getDelayPromise(1)
      expect(events.length).to.eq(0);

      _mngr.startReceiving(_win, handler);
      _win.postMessage(data, _win.origin);

      await getDelayPromise(1)
      expect(events.length).to.eq(1);
      expect(events[0].type).to.eq('message');
      expect((<MessageEvent>events[0]).data).to.eql(data);

      _mngr.stopReceiving(_win, handler);
      _win.postMessage(data, _win.origin);

      await getDelayPromise(1)
      expect(events.length).to.eq(1);
    })

  });
}
