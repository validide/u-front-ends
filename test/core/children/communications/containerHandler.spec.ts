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
import { MockContainerCommunicationHandler } from '../../../mocks/mockContainerCommunicationHandler';
import { MockCommunicationsManager } from '../../../mocks/mockCommunicationsManager';
import { ContainerCommunicationHandlerMethods, CommunicationsEvent, CommunicationsEventKind } from '../../../../src';
import { createCustomEvent } from '../../../../src/dom/document/createCustomEvent';
import { values_falsies } from '../../../utils';

export function test_ContainerCommunicationHandler() {
  describe('ContainerCommunicationHandler', () => {
    let _jsDom: JSDOM;
    let _win: Window;
    let _mngr: MockCommunicationsManager;
    let _handler: MockContainerCommunicationHandler;
    let _handlerMethods: ContainerCommunicationHandlerMethods;
    let _beforeDisposeCalls = 0;
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
      _handlerMethods = new ContainerCommunicationHandlerMethods();
      _handler = new MockContainerCommunicationHandler(_mngr, _handlerMethods);
      _handlerMethods.beforeDispose = () => { _beforeDisposeCalls++; };

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
      expect(_beforeDisposeCalls).to.eq(1);
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

    values_falsies.forEach(f => {
      it(`should not fail if calling handleEventCore without any methods("${f}")`, () => {
        const hander = new MockContainerCommunicationHandler(_mngr, f as unknown as ContainerCommunicationHandlerMethods);
        expect(() => hander.handleEventCore(new CommunicationsEvent(CommunicationsEventKind.BeforeDispose)))
          .not.to.throw();
      });
    });

    values_falsies.forEach(f => {
      it(`should not fail if calling handleEventCore without the method beeig configured("${f}")`, () => {
        const methods = new ContainerCommunicationHandlerMethods();
        methods.beforeDispose = (f as unknown as ()=>void);
        const hander = new MockContainerCommunicationHandler(_mngr, methods);
        expect(() => hander.handleEventCore(new CommunicationsEvent(CommunicationsEventKind.BeforeDispose)))
          .not.to.throw();
      });
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

    it('should not fail on send data', () => {
      const data = {
        'foo': 'bar',
        nested: {
          'prop_name': 'prop_value'
        }
      };

      _handler.dispose();
      expect(()=> _handler.sendData(data)).not.to.throw();
    });
  });
}
