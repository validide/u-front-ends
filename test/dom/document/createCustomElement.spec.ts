import 'mocha';
import { expect } from 'chai';
import { JSDOM } from 'jsdom';
import { values_falsies } from '../../utils';
import { createCustomEvent } from '../../../src/dom/document/createCustomEvent';

function getNewDocument(): Document { return new JSDOM('<!DOCTYPE html>').window.document; }

export function test_createCustomEvent() {
  describe('generateUniqueId', () => {
    let doc = getNewDocument();
    beforeEach(() => { doc = getNewDocument(); });

    values_falsies.forEach(f => {
      it('should return an id that is unique within the DOM', () => {
        expect(() => createCustomEvent(f as unknown as Document, ''))
          .to.throw('Document does not have a defualt view.');
      });
    });

    it('should return a custom event', () => {
      expect(createCustomEvent(doc, 'test').type).to.eq('test');
    });

    it('should return a custom event using polifill', () => {
      Object.defineProperty(doc, 'defaultView', {
        value: {},
        writable: false
      });

      const cEvt = createCustomEvent(doc, 'test');
      expect(cEvt.type).to.eq('test');
    });
  });
}
