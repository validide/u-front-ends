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
import { expect } from 'chai';
import { AbortablePromise, FetchOptions, JSDOM, ResourceLoader, VirtualConsole } from 'jsdom';
import { loadResource, noop } from '../../../src';

class CustomResourceLoader extends ResourceLoader {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  fetch(url: string, options: FetchOptions): AbortablePromise<Buffer> | null {
    // if (url.endsWith('.js') && options.element?.constructor.name !== 'HTMLScriptElement') {
    //   return Promise.reject(new Error('Requested JS with WRONG element.'));
    // }

    if (url.indexOf('404') !== -1) {
      return Promise.reject(new Error('404')) as AbortablePromise<Buffer>;
    }

    if (url.endsWith('.js')) {
      return Promise.resolve(Buffer.from(`
      var el = window.document.createElement('div');
      el.id = 'testId';
      window.document.body.appendChild(el);
      `)) as AbortablePromise<Buffer>;
    }

    if (url.endsWith('.css')) {
      return Promise.resolve(Buffer.from('body {color: red;}')) as AbortablePromise<Buffer>;
    }

    return Promise.reject(new Error('404')) as AbortablePromise<Buffer>;
  }
}

export function test_loadResource() {
  describe('loadResource', () => {
    let _jsDom: JSDOM;
    let _win: Window;

    beforeEach(() => {
      const loader = new CustomResourceLoader();
      const virtualConsole = new VirtualConsole();
      virtualConsole.on('jsdomError', noop);
      _jsDom = new JSDOM(undefined,
        {
          url: 'http://localhost:8080/',
          runScripts: 'dangerously',
          resources: loader,
          virtualConsole: virtualConsole
        });
      if (!_jsDom.window?.document?.defaultView)
        throw new Error('Setup failure!');
      _win = _jsDom.window.document.defaultView;
    });

    afterEach(() => {
      _win?.close();
      _jsDom.window.close();
    });

    it('should reject if load fails', async () => {
      const url = 'http://test.com/404.js';
      try {
        const prom = loadResource(_win.document, url, true, undefined, undefined);
        expect(_win.document.querySelectorAll(`script[src="${url}"]`).length).to.eq(1);
        await prom;
      }
      catch (e) {
        expect(e.message).to.eq(`Script load error for url: ${url}.`);
      }
    });

    it('should load and run script', async () => {
      const url = 'http://test.com/test.js';
      const prom = loadResource(_win.document, url);
      expect(_win.document.querySelectorAll(`script[src="${url}"]`).length).to.eq(1);
      await prom;
      expect(_win.document.getElementById('testId')).not.to.be.null;
    });

    it('should load css', async () => {
      const url = 'http://test.com/test.css';
      const prom = loadResource(_win.document, url, false, undefined, {
        'rel': 'stylesheet'
      });
      expect(_win.document.querySelectorAll(`link[href="${url}"]`).length).to.eq(1);
      await prom;
      expect(_win.document.defaultView?.getComputedStyle(_win.document.body).color || 'null').to.eq('red');
    });

    it('should skip loading', async () => {
      const url = 'http://test.com/test.js';
      const prom = loadResource(_win.document, url, true, () => true, undefined);
      expect(_win.document.querySelectorAll(`script[src="${url}"]`).length).to.eq(0);
      await prom;
      expect(_win.document.getElementById('testId')).to.be.null;
    });

  });
}
