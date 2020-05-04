import 'mocha';
import { JSDOM } from 'jsdom';
import { expect } from 'chai';
import { MockCommunicationsManager } from '../../../mocks/mockCommunicationsManager';
import { InWindowContentCommunicationHandler, noop, ContentCommunicationHandler, ContentCommunicationHandlerMethods } from '../../../../src';

export function test_InWindowContentCommunicationHandler() {
  describe('InWindowContentCommunicationHandler', () => {
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
    })

    it('requires a handler and methods as parameters', () => {
      expect(() => new InWindowContentCommunicationHandler(
        _mngr,
        new ContentCommunicationHandlerMethods()
      )).not.to.throw();
    })


    it('should inherit from ContainerCommunicationHandler', () => {
      const handler = new InWindowContentCommunicationHandler(
        _mngr,
        new ContentCommunicationHandlerMethods()
      );
      expect(handler).to.be.an.instanceOf(ContentCommunicationHandler);
    })
  });
}