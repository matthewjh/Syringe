/// <reference path="../definitions/definitions.d.ts"/>
/// <reference path="../definitions/api.d.ts"/>

import 'es6-promise';
import {Injector, Token, bind} from '../src/index';

class OneToken extends Token<number> {}
class TwoToken extends Token<number> {}
class ThreeToken extends Token<number> {}

describe('injector with value bindings', () => {  
  it('should correctly resolve values from tokens', (done) => {
    let bindings = [
      bind(OneToken).toValue(1),
      bind(TwoToken).toValue(2),
      bind(ThreeToken).toValue(3)
    ];
    
    let injector = new Injector(bindings);
    
    Promise.all([
      injector.get(OneToken),
      injector.get(TwoToken),
      injector.get(ThreeToken)
    ]).then(([oneValue, twoValue, threeValue]) => {
      expect(oneValue).toEqual(1);
      expect(twoValue).toEqual(2);
      expect(threeValue).toEqual(3);
      done();
    });
  });
});