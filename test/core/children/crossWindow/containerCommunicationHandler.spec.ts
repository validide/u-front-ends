/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { expect } from 'chai';
import { JSDOM } from 'jsdom';
import 'mocha';
import { CommunicationsEvent, CommunicationsEventKind, ContainerCommunicationHandlerMethods, getHashCode } from '../../../../src';
import { MockCrossWindowCommunicationsManager } from '../../../mocks/mockCrossWindowCommunicationsManager';
import { MockCrossWindowContainerCommunicationHandler } from '../../../mocks/mockCrossWindowContainerCommunicationHandler';
import { values_falsies } from '../../../utils';

export function test_CrossWindowContainerCommunicationHandler() {
  describe('CrossWindowContentCommunicatinsHandler', () => {
    let _jsDom: JSDOM;
    let _win: Window;
    let _mngr: MockCrossWindowCommunicationsManager;
    let _handler: MockCrossWindowContainerCommunicationHandler;
    let _handlerMethods: ContainerCommunicationHandlerMethods;
    const _eventType = 'some_event_type';
    const _embedId = 'the_embed_id';

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
      _handlerMethods = new ContainerCommunicationHandlerMethods();
      _handler = new MockCrossWindowContainerCommunicationHandler(_mngr, _embedId, _handlerMethods);
    });

    afterEach(() => {
      _handler.dispose();
      _mngr.dispose();
      _win.close();
      _jsDom.window.close();
    });

    it('handles events if embedid is the same', async () => {
      let mounted = false;
      _handlerMethods.mounted = () => { mounted = true; };
      const handler = new MockCrossWindowContainerCommunicationHandler(_mngr, _embedId, _handlerMethods);

      const mountedEvent = new CommunicationsEvent(CommunicationsEventKind.Mounted);
      mountedEvent.contentId = _embedId;
      await _mngr.simulateReceiveEvent(_mngr.wrapEvent(mountedEvent, _eventType));

      expect(mounted).to.be.true;
    });

    it('does not handle events if embedid is not the same', async () => {
      let mounted = false;
      _handlerMethods.mounted = () => { mounted = true; };
      const handler = new MockCrossWindowContainerCommunicationHandler(_mngr, _embedId, _handlerMethods);

      const mountedEvent = new CommunicationsEvent(CommunicationsEventKind.Mounted);
      mountedEvent.contentId = _embedId + '_some_stuff';
      await _mngr.simulateReceiveEvent(_mngr.wrapEvent(mountedEvent, _eventType));

      expect(mounted).to.be.false;
    });

    values_falsies.forEach(f => {
      it(`ignores all events if embedid("${f}") is mising`, async () => {
        let mounted = false;
        _handlerMethods.mounted = () => { mounted = true; };
        const handler = new MockCrossWindowContainerCommunicationHandler(_mngr, f as unknown as string, _handlerMethods);

        const mountedEvent = new CommunicationsEvent(CommunicationsEventKind.Mounted);
        mountedEvent.contentId = (f as unknown as string);
        await _mngr.simulateReceiveEvent(_mngr.wrapEvent(mountedEvent, _eventType));

        expect(mounted).to.be.false;
      });
    });

    it('attempts a handshake in case the contentId is missing and the event kind is Mounted', async () => {
      const mountedEvent = new CommunicationsEvent(CommunicationsEventKind.Mounted);
      mountedEvent.contentId = '';
      await _mngr.simulateReceiveEvent(_mngr.wrapEvent(mountedEvent, _eventType));

      expect(_mngr.sentEvents.length).to.eq(1);
      expect(_mngr.sentEvents[0].kind).to.eq(CommunicationsEventKind.Mounted);
      expect(_mngr.sentEvents[0].data).to.eq(getHashCode(_embedId).toString(10));
    });



    it('completed a handshake in case it gets an Event of kind Mounted containing as data the hash of the embedId', async () => {
      const mountedEvent = new CommunicationsEvent(CommunicationsEventKind.Mounted);
      mountedEvent.contentId = '';
      mountedEvent.data = getHashCode(_embedId).toString(10);
      await _mngr.simulateReceiveEvent(_mngr.wrapEvent(mountedEvent, _eventType));

      expect(_mngr.sentEvents.length).to.eq(1);
      expect(_mngr.sentEvents[0].kind).to.eq(CommunicationsEventKind.Mounted);
      expect(_mngr.sentEvents[0].contentId).to.eq(_embedId);
    });
  });
}
