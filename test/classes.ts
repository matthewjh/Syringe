/// <reference path="../definitions/definitions.d.ts"/>
/// <reference path="../definitions/api.d.ts"/>

import 'es6-promise';
import {Injector, Token, Inject, bind} from '../src/index';

let aToken = new Token<A>();
let bToken = new Token<B>();
let cToken = new Token<C>();
let decoratedAToken = new Token<DecoratedA>();
let decoratedBToken = new Token<DecoratedB>();
let oneToken = new Token<number>();
let emptyObjectToken = new Token<{}>();

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

@Inject(oneToken)
class DecoratedA {
  constructor(public one: number) {}
}

@Inject(decoratedAToken)
class DecoratedB {
  constructor(public a: DecoratedA) {}
}

@Inject(emptyObjectToken)
class ClassReturningObjectFromConstructor {
  constructor(object: {}) {
    return object;
  }
}

@Inject(oneToken)
class ClassReturningNumberFromConstructor {
  constructor(x: number) {
    return x;
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
  
  it('should correctly resolve classes when they decorated with tokens', (done) => {
    let injector: Syringe.IInjector;
    let bindings = [
      bind(decoratedAToken).toClass(DecoratedA),
      bind(decoratedBToken).toClass(DecoratedB),
      bind(oneToken).toValue(1)                     
    ];
    
    injector = new Injector(bindings);
    
    Promise.all(<Promise<any>[]>[
      injector.get(decoratedAToken),
      injector.get(decoratedBToken)
    ]).then(([a, b]) => {
      expect(a.one).toEqual(1);
      expect(b.a).toBe(a);
      done();
    });
  });
  
  it('should correctly resolve classes using token lists even when they are decorated with tokens', (done) => {
    var alternativeOneToken = new Token<number>();
    
    let injector = new Injector([
      bind(decoratedAToken).toClass(DecoratedA,
                                    alternativeOneToken),
      bind(oneToken).toValue(1),
      bind(alternativeOneToken).toValue(5)
    ]);
    
    injector.get(decoratedAToken).then(decoratedA => {
      expect(decoratedA.one).toBe(5);
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
  
  it('should correctly construct classes that return objects from their constructors', (done) => {
    let token = new Token<ClassReturningObjectFromConstructor>();
    let obj = {};
    
    let injector = new Injector([
      bind(token).toClass(ClassReturningObjectFromConstructor),
      bind(emptyObjectToken).toValue(obj)
    ]);
    
    injector.get(token).then(value => {
      expect(value).toBe(obj);
      done();
    });
  });
  
  it('should correctly construct classes that return non-objects from their constructors', (done) => {
    let token = new Token<ClassReturningNumberFromConstructor>();
    
    let injector = new Injector([
      bind(token).toClass(ClassReturningNumberFromConstructor),
      bind(oneToken).toValue(1)
    ]);
    
    injector.get(token).then(value => {
      expect(value).toEqual(jasmine.any(ClassReturningNumberFromConstructor));
      done();
    });
  });
});