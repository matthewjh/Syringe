/// <reference path="../definitions/definitions.d.ts"/>
/// <reference path="../definitions/api.d.ts"/>

import 'es6-promise';
import {Injector, Token, bind} from '../src/index';

describe('injector with missing bindings', () => {
  let oneToken: Syringe.IToken<number> = new Token();
  let twoToken: Syringe.IToken<number> = new Token();
  let threeToken: Syringe.IToken<number> = new Token();
  
  it('should reject the returned promise when trying to get an unbound token', (done) => {
    let injector: Syringe.IInjector;
    let bindings = [
      bind(oneToken).toFactory(() => 1)                         
    ];
    
    injector = new Injector(bindings);
    
    injector.get(twoToken).catch(() => {
      done();
    });
  });
  
  it('should reject the returned promise when trying to get a value that is dependent on an unbound token', (done) => {
    let injector: Syringe.IInjector;
    let bindings = [
      bind(oneToken).toFactory(() => 1),
      bind(threeToken).toFactory(two => two + 1,
                                  twoToken)                         
    ];
    
    injector = new Injector(bindings);
    
    injector.get(threeToken).catch(() => {
      done();
    });
  });
});