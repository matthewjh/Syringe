/// <reference path="../definitions/definitions.d.ts"/>
/// <reference path="../definitions/api.d.ts"/>

import 'es6-promise';
import {Injector, Token, bind} from '../src/index';

describe('injector with factory bindings', () => {
  let oneToken: Syringe.IToken<number> = new Token();
  let twoToken: Syringe.IToken<number> = new Token();
  let threeToken: Syringe.IToken<number> = new Token();
  let concatenedNumbersToken: Syringe.IToken<string> = new Token();
  
  it('should correctly resolve values from tokens via sync factories', (done) => {
    let injector: Syringe.IInjector;
    let bindings = [
      bind(oneToken).toFactory(() => 1),
      bind(twoToken).toFactory((one) => one + 1,
                               oneToken),
      bind(threeToken).toFactory((one, two) => one + two,
                                oneToken, twoToken),
      bind(concatenedNumbersToken).toFactory((one, two, three) => `${one}${two}${three}`,
                                              oneToken, twoToken, threeToken),                         
    ];
    
    injector = new Injector(bindings);
    
    Promise.all(<Promise<any>[]>[
      injector.get(oneToken),
      injector.get(twoToken),
      injector.get(threeToken),
      injector.get(concatenedNumbersToken)
    ]).then(([oneValue, twoValue, threeValue, concatenatedNumbers]) => {
      expect(oneValue).toEqual(1);
      expect(twoValue).toEqual(2);
      expect(threeValue).toEqual(3);
      expect(concatenatedNumbers).toEqual('123');
      
      done();
    });
  });
  
  it('should correctly resolve values from tokens via async factories', (done) => {
    let injector: Syringe.IInjector;
    let bindings = [
      bind(oneToken).toAsyncFactory(() => Promise.resolve(1)),
      bind(twoToken).toFactory((one) => one + 1,
                               oneToken),
      bind(threeToken).toAsyncFactory((one, two) => Promise.resolve(one + two),
                                      oneToken, twoToken),
      bind(concatenedNumbersToken).toFactory((one, two, three) => `${one}${two}${three}`,
                                              oneToken, twoToken, threeToken),                         
    ];
    
    injector = new Injector(bindings);
    
    Promise.all(<Promise<any>[]>[
      injector.get(oneToken),
      injector.get(twoToken),
      injector.get(threeToken),
      injector.get(concatenedNumbersToken)
    ]).then(([oneValue, twoValue, threeValue, concatenatedNumbers]) => {
      expect(oneValue).toEqual(1);
      expect(twoValue).toEqual(2);
      expect(threeValue).toEqual(3);
      expect(concatenatedNumbers).toEqual('123');
      
      done();
    });
  });
  
  it('should propagate async dependency promise rejection', (done) => {
    let injector: Syringe.IInjector;
    let error = new Error();
    let bindings = [
      bind(oneToken).toAsyncFactory(() => Promise.reject(error)),
      bind(twoToken).toFactory((one) => one + 1,
                               oneToken)                   
    ];
    
    injector = new Injector(bindings);
    
    injector.get(twoToken).catch(actualError => {
      expect(actualError).toBe(error);
      done();
    });
  });
  
  it('should only call a given factory once', (done) => {
    let callCount = 0;
    let injector = new Injector([
      bind(oneToken).toFactory(() => {
        callCount++;
        return 1;
      })
    ]);
    
    Promise.all([
      injector.get(oneToken),
      injector.get(oneToken),
      injector.get(oneToken)
    ]).then(() => {
      expect(callCount).toBe(1);
      done();
    });
  });
});