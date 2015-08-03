/// <reference path="../definitions/definitions.d.ts"/>
/// <reference path="../definitions/api.d.ts"/>

import 'es6-promise';
import {Injector, Token, bind} from '../src/index';

describe('injector with value bindings', () => {
  let oneToken: Syringe.IToken<number> = new Token();
  let twoToken: Syringe.IToken<number> = new Token();
  let threeToken: Syringe.IToken<number> = new Token();
  
  it('should correctly resolve values from tokens', (done) => {
    let injector: Syringe.IInjector;
    let bindings = [
      bind(oneToken).toValue(1),
      bind(twoToken).toValue(2),
      bind(threeToken).toValue(3)
    ];
    
    injector = new Injector(bindings);
    
    Promise.all([
      injector.get(oneToken),
      injector.get(twoToken),
      injector.get(threeToken)
    ]).then(([oneValue, twoValue, threeValue]) => {
      expect(oneValue).toEqual(1);
      expect(twoValue).toEqual(2);
      expect(threeValue).toEqual(3);
      done();
    });
  });
});