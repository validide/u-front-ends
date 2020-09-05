import 'mocha';
import { expect } from 'chai';
import { CrossWindowChildComponentOptions, ChildComponentType } from '../../../../src';
// tslint:disable: no-unused-expression

export function test_CrossWindowChildComponentOptions() {
  describe('ChildComponentOptions', () => {
    it('should have the following properties and default values', () => {
      const conf = new CrossWindowChildComponentOptions();
      expect(conf.type).to.eq(ChildComponentType.CrossWindow);
      expect(conf.contentDisposeTimeout).to.eq(3000);
      expect(conf.handlers).to.not.be.null;
      expect(conf.resources).to.not.be.null;
      expect(conf.resources.length).to.eq(0);
      expect(conf.tag).to.eq('div');
      expect(conf.parent).to.eq('body');
      expect(conf.url).to.eq('about:blank');
      expect(conf.createEmbedElement).to.be.undefined;
      expect(conf.embeddedAttributes).to.be.undefined;
    });
  });
}
