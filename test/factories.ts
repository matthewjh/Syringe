/// <reference path="../definitions/definitions.d.ts"/>
/// <reference path="../src/syringe.d.ts"/>

import 'es6-promise';
import {Injector, Token, Inject, bind} from 'syringe.ts/index';

class OneToken extends Token<number> {}
class TwoToken extends Token<number> {}
class ThreeToken extends Token<number> {}
class ConcatenatedNumbersToken extends Token<string> {}

describe('injector with factory bindings', () => {  
  it('should correctly resolve values from tokens via sync factories', (done) => {
    let bindings = [
      bind(OneToken).toFactory(() => 1),
      bind(TwoToken).toFactory((one) => one + 1,
                               OneToken),
      bind(ThreeToken).toFactory((one, two) => one + two,
                                OneToken, TwoToken),
      bind(ConcatenatedNumbersToken).toFactory((one, two, three) => `${one}${two}${three}`,
                                              OneToken, TwoToken, ThreeToken),                         
    ];
    
    let injector = new Injector(bindings);
    
    Promise.all(<Promise<any>[]>[
      injector.get(OneToken),
      injector.get(TwoToken),
      injector.get(ThreeToken),
      injector.get(ConcatenatedNumbersToken)
    ]).then(([oneValue, twoValue, threeValue, concatenatedNumbers]) => {
      expect(oneValue).toEqual(1);
      expect(twoValue).toEqual(2);
      expect(threeValue).toEqual(3);
      expect(concatenatedNumbers).toEqual('123');
      
      done();
    });
  });
  
  it('should correctly resolve values from tokens via async factories', (done) => {
    let bindings = [
      bind(OneToken).toAsyncFactory(() => Promise.resolve(1)),
      bind(TwoToken).toFactory((one) => one + 1,
                               OneToken),
      bind(ThreeToken).toAsyncFactory((one, two) => Promise.resolve(one + two),
                                      OneToken, TwoToken),
      bind(ConcatenatedNumbersToken).toFactory((one, two, three) => `${one}${two}${three}`,
                                              OneToken, TwoToken, ThreeToken),                         
    ];
    
    let injector = new Injector(bindings);
    
    Promise.all(<Promise<any>[]>[
      injector.get(OneToken),
      injector.get(TwoToken),
      injector.get(ThreeToken),
      injector.get(ConcatenatedNumbersToken)
    ]).then(([oneValue, twoValue, threeValue, concatenatedNumbers]) => {
      expect(oneValue).toEqual(1);
      expect(twoValue).toEqual(2);
      expect(threeValue).toEqual(3);
      expect(concatenatedNumbers).toEqual('123');
      
      done();
    });
  });
  
  it('should propagate async dependency promise rejection', (done) => {
    let error = new Error();
    let bindings = [
      bind(OneToken).toAsyncFactory(() => Promise.reject(error)),
      bind(TwoToken).toFactory((one) => one + 1,
                               OneToken)                   
    ];
    
    let injector = new Injector(bindings);
    
    injector.get(TwoToken).catch(actualError => {
      expect(actualError).toBe(error);
      done();
    });
  });
  
  it('should only call a given factory once', (done) => {
    let callCount = 0;
    let injector = new Injector([
      bind(OneToken).toFactory(() => {
        callCount++;
        return 1;
      })
    ]);
    
    Promise.all([
      injector.get(OneToken),
      injector.get(OneToken),
      injector.get(OneToken)
    ]).then(() => {
      expect(callCount).toBe(1);
      done();
    });
  });
});