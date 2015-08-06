/// <reference path="../definitions/definitions.d.ts"/>
/// <reference path="../definitions/api.d.ts"/>

import 'es6-promise';
import {Injector, Token, bind} from '../src/index';

let aToken: Syringe.IToken<A> = new Token();
let bToken: Syringe.IToken<B> = new Token();
let cToken: Syringe.IToken<C> = new Token();
let oneToken: Syringe.IToken<number> = new Token();

class A {
  constructor(public one: number) {}
}

class B {
  constructor(public a: A) {}
}

class C {
  static constructCount = 0;
  
  constructor() {
    C.constructCount++;
  }
}


describe('injector with class bindings', () => {
  it('should correctly resolve values from tokens via class factories when tokens are passed', (done) => {
    let injector: Syringe.IInjector;
    let bindings = [
      bind(aToken).toClass(A, oneToken),
      bind(bToken).toClass(B, aToken),
      bind(oneToken).toValue(1)                     
    ];
    
    injector = new Injector(bindings);
    
    Promise.all(<Promise<any>[]>[
      injector.get(aToken),
      injector.get(bToken)
    ]).then(([a, b]) => {
      expect(a.one).toEqual(1);
      expect(b.a).toBe(a);
      done();
    });
  });
  
  it('should only construct a given class once', (done) => {
    let injector = new Injector([
      bind(cToken).toClass(C)
    ]);
    
    Promise.all([
      injector.get(cToken),
      injector.get(cToken),
      injector.get(cToken)
    ]).then(() => {
      expect(C.constructCount).toBe(1);
      done();
    });
  });
});