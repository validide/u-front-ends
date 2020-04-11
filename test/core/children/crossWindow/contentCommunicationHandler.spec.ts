import 'mocha';
import { JSDOM } from 'jsdom';
import { expect } from 'chai';
import { MockCrossWindowContentCommunicationHandler } from '../../../mocks/mockCrossWindowContentCommunicationHandler';
import { CrossWindowContentCommunicationHandler, noop, CommunicationsEvent, CommunicationsEventKind } from '../../../../src';
import { MockCrossWindowCommunicationsManager } from '../../../mocks/mockCrossWindowCommunicationsManager';

export function test_CrossWindowContentCommunicationHandler() {
  describe('CrossWindowContentCommunicatinsHandler', () => {
    let _jsDom: JSDOM;
    let _win: Window;
    let _mngr: MockCrossWindowCommunicationsManager;
    let _handler: MockCrossWindowContentCommunicationHandler;
    let _disposeCall = 0;
    const _eventType = 'some_event_type';

    beforeEach(() => {
      _jsDom = new JSDOM(undefined, {
        url: 'http://localhost:8080/',
        runScripts: 'dangerously'
      });
      if (!_jsDom.window?.document?.defaultView)
        throw new Error('Setup failure!');
      _win = _jsDom.window.document.defaultView;
      _mngr = new MockCrossWindowCommunicationsManager(_win, _eventType, _win, _eventType, _win.origin);
      _mngr.initialize();
      _disposeCall = 0;
      _handler = new MockCrossWindowContentCommunicationHandler(_mngr, () => { _disposeCall++; });
    });

    afterEach(() => {
      _handler.dispose();
      _mngr.dispose();
      _win.close();
      _jsDom.window.close();
    })

    it('requires a handler and methods as parameters', () => {
      expect(() => new CrossWindowContentCommunicationHandler(
        _mngr,
        noop
      )).not.to.throw();
    })

    it('does not send out events untill it receives the embedId - except for MountedEvents', () => {
      _handler.send(new CommunicationsEvent(CommunicationsEventKind.BeforeUpdate));

      expect(_mngr.sentEvents.length).to.eq(0);

      _handler.send(new CommunicationsEvent(CommunicationsEventKind.Mounted));
      expect(_mngr.sentEvents.length).to.eq(1);
    })

    it('sends events with a contentId equal to the embedId it received', async () => {
      _handler.send(new CommunicationsEvent(CommunicationsEventKind.Mounted));
      expect(_mngr.sentEvents.length).to.eq(1);
      expect(_mngr.sentEvents[0].contentId).to.eq('');

      const embedEvt = new CommunicationsEvent(CommunicationsEventKind.Mounted);
      embedEvt.contentId = 'test';
      await _mngr.simulateReceiveEvent(_mngr.wrapEvent(embedEvt, _eventType));

      expect(_mngr.sentEvents.length).to.eq(2);
      expect(_mngr.sentEvents[1].contentId).to.eq('test');

      const upd = new CommunicationsEvent(CommunicationsEventKind.BeforeUpdate);
      _handler.send(upd);
      expect(_mngr.sentEvents.length).to.eq(3);
      expect(_mngr.sentEvents[2].contentId).to.eq('test');
      expect(_mngr.sentEvents[2].kind).to.eq(upd.kind);
      expect(_mngr.sentEvents[2].uuid).to.eq(upd.uuid);
    })

    it('should process dispose commands only after the embedId is received', async () => {
      const disposeCommand = new CommunicationsEvent(CommunicationsEventKind.BeforeDispose);
      await _mngr.simulateReceiveEvent(_mngr.wrapEvent(disposeCommand, _eventType));

      expect(_disposeCall).to.eq(0);

      const handshakeEvent = new CommunicationsEvent(CommunicationsEventKind.Mounted);
      handshakeEvent.contentId = 'test';
      await _mngr.simulateReceiveEvent(_mngr.wrapEvent(handshakeEvent, _eventType));

      disposeCommand.contentId = 'test';
      await _mngr.simulateReceiveEvent(_mngr.wrapEvent(disposeCommand, _eventType));
      expect(_disposeCall).to.eq(1);

    })

    it('sends the messages it had queued before receiving the embedId', async () => {
      _handler.send(new CommunicationsEvent(CommunicationsEventKind.Mounted));
      expect(_mngr.sentEvents.length).to.eq(1);
      expect(_mngr.sentEvents[0].contentId).to.eq('');

      _handler.send(new CommunicationsEvent(CommunicationsEventKind.BeforeUpdate));
      expect(_mngr.sentEvents.length).to.eq(1);

      _handler.send(new CommunicationsEvent(CommunicationsEventKind.Updated));
      expect(_mngr.sentEvents.length).to.eq(1);

      const handshakeEvent = new CommunicationsEvent(CommunicationsEventKind.Mounted);
      handshakeEvent.contentId = 'test';
      await _mngr.simulateReceiveEvent(_mngr.wrapEvent(handshakeEvent, _eventType));

      // A mounted is re-sent
      expect(_mngr.sentEvents[1].contentId).to.eq('test');
      expect(_mngr.sentEvents[1].kind).to.eq(CommunicationsEventKind.Mounted);

      // The BeforeUpdate
      expect(_mngr.sentEvents[2].contentId).to.eq('test');
      expect(_mngr.sentEvents[2].kind).to.eq(CommunicationsEventKind.BeforeUpdate);

      // The Updated
      expect(_mngr.sentEvents[3].contentId).to.eq('test');
      expect(_mngr.sentEvents[3].kind).to.eq(CommunicationsEventKind.Updated);

      expect(_mngr.sentEvents.length).to.eq(4);
    })

  })
}
