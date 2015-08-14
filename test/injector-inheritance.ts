/// <reference path="../definitions/definitions.d.ts"/>
/// <reference path="../definitions/api.d.ts"/>

import 'es6-promise';
import {Injector, Token, bind} from '../src/index';

class OneToken extends Token<number> {}
class TwoToken extends Token<number> {}
class ThreeToken extends Token<number> {}

describe('injector with missing bindings', () => {
  it('should resolve token from parent injector when it\'s not on the child', (done) => {
   let parentInjector = new Injector([
     bind(OneToken).toValue(1)
   ]);
   
   let childInjector = new Injector([
     bind(TwoToken).toFactory(one => one + 1,
                              OneToken)
   ], parentInjector);
   
   Promise.all([
     childInjector.get(OneToken),
     childInjector.get(TwoToken)
   ]).then(([one, two]) => {
     expect(one).toBe(1);
     expect(two).toBe(2);
     
     done();
   });
  });
  
  it('should resolve token from the child injector if it\'s on both the child and the parent', (done) => {
    let parentInjector = new Injector([
      bind(OneToken).toValue(2)
    ]);
    
    let childInjector = new Injector([
     bind(OneToken).toValue(1)
    ], parentInjector);
    
    childInjector.get(OneToken).then(one => {
      expect(one).toBe(1);
      
      done();
    });
  });
});