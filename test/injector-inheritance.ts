/// <reference path="../definitions/definitions.d.ts"/>
/// <reference path="../definitions/api.d.ts"/>

import 'es6-promise';
import {Injector, Token, bind} from '../src/index';

describe('injector with missing bindings', () => {
  let oneToken = new Token<number>();
  let twoToken = new Token<number>();
  let threeToken = new Token<number>();
  
  it('should resolve token from parent injector when it\'s not on the child', (done) => {
   let parentInjector = new Injector([
     bind(oneToken).toValue(1)
   ]);
   
   let childInjector = new Injector([
     bind(twoToken).toFactory(one => one + 1,
                              oneToken)
   ], parentInjector);
   
   Promise.all([
     childInjector.get(oneToken),
     childInjector.get(twoToken)
   ]).then(([one, two]) => {
     expect(one).toBe(1);
     expect(two).toBe(2);
     
     done();
   });
  });
  
  it('should resolve token from the child injector if it\'s on both the child and the parent', (done) => {
    let parentInjector = new Injector([
      bind(oneToken).toValue(2)
    ]);
    
    let childInjector = new Injector([
     bind(oneToken).toValue(1)
    ], parentInjector);
    
    childInjector.get(oneToken).then(one => {
      expect(one).toBe(1);
      
      done();
    });
  });
});