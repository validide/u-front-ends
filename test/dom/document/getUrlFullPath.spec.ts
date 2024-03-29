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
import { getUrlFullPath } from '../../../src/index';
import { expect } from 'chai';
import { JSDOM } from 'jsdom';

function getNewDocument(): Document {return new JSDOM('<!DOCTYPE html>').window.document;}

export function test_getUrlFullPath() {
  describe('getUrlFullPath', () => {
    let doc = getNewDocument();
    beforeEach(() => { doc = getNewDocument(); });

    it('should return empty string if url is "undefined", "null" or empty string', () => {
      expect(getUrlFullPath(doc, (undefined as unknown) as string)).to.eq('');
      expect(getUrlFullPath(doc, (null as unknown) as string)).to.eq('');
      expect(getUrlFullPath(doc, '')).to.eq('');
    });

    it('should thow an error if document is "undefined"', () => {
      expect(
        () => getUrlFullPath((undefined as unknown) as Document, 'some value')
      ).throws(Error, 'Cannot read properties of undefined (reading \'createElement\')');
    });

    it('should thow an error if document is "null"', () => {
      expect(
        () => getUrlFullPath((null as unknown) as Document, 'some value')
      ).throws(Error, 'Cannot read properties of null (reading \'createElement\')');
    });

    it('should return origin', () => {
      expect(getUrlFullPath(doc, 'http://localhost')).to.eq('http://localhost/');
      expect(getUrlFullPath(doc, 'http://localhost:81')).to.eq('http://localhost:81/');
      expect(getUrlFullPath(doc, 'http://localhost/')).to.eq('http://localhost/');
      expect(getUrlFullPath(doc, 'http://localhost:81/')).to.eq('http://localhost:81/');
      expect(getUrlFullPath(doc, 'https://localhost:443')).to.eq('https://localhost/');
      expect(getUrlFullPath(doc, 'https://localhost:443/')).to.eq('https://localhost/');
      expect(getUrlFullPath(doc, 'https://localhost:444/')).to.eq('https://localhost:444/');
      expect(getUrlFullPath(doc, 'https://localhost:444/sasasasa')).to.eq('https://localhost:444/sasasasa');
      expect(getUrlFullPath(doc, 'https://localhost:444/sasasasa/')).to.eq('https://localhost:444/sasasasa/');
      expect(getUrlFullPath(doc, 'http://localhost/seg-1/seg-2')).to.eq('http://localhost/seg-1/seg-2');
      expect(getUrlFullPath(doc, 'http://localhost/seg-1/seg-2?foo=1&bar=2#bzz')).to.eq('http://localhost/seg-1/seg-2');
    });
  });
}
