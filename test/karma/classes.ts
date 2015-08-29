import 'es6-promise'; 
import {Injector, Token, IToken, Inject, bind} from '../../src/index';

class AToken extends Token<A> {}
class BToken extends Token<B> {}
class CToken extends Token<C> {}
class DecoratedAToken extends Token<DecoratedA> {}
class DecoratedBToken extends Token<DecoratedB> {}
class OneToken extends Token<number> {}
class EmptyObjectToken extends Token<{}> {}
class ClassReturningObjectFromConstructorToken extends Token<ClassReturningObjectFromConstructor> {}
class ClassReturningNumberFromConstructorToken extends Token<ClassReturningNumberFromConstructor> {}

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

@Inject(OneToken)
class DecoratedA {
  constructor(public one: number) {}
}

@Inject(DecoratedAToken)
class DecoratedB {
  constructor(public a: DecoratedA) {}
}

@Inject(EmptyObjectToken)
class ClassReturningObjectFromConstructor {
  constructor(object: {}) {
    return object;
  }
}

@Inject(OneToken)
class ClassReturningNumberFromConstructor {
  constructor(x: number) {
    return x;
  }
}


describe('injector with class bindings', () => {
  it('should correctly resolve values from tokens via class factories when tokens are passed', (done) => {
    let bindings = [
      bind(AToken).toClass(A, OneToken),
      bind(BToken).toClass(B, AToken),
      bind(OneToken).toValue(1)                     
    ];
    
    let injector = new Injector(bindings);
    
    Promise.all(<Promise<any>[]>[
      injector.get(AToken),
      injector.get(BToken)
    ]).then(([a, b]) => {
      expect(a.one).toEqual(1);
      expect(b.a).toBe(a);
      done();
    });
  });
  
  it('should correctly resolve classes when they decorated with tokens', (done) => {
    let bindings = [
      bind(DecoratedAToken).toClass(DecoratedA),
      bind(DecoratedBToken).toClass(DecoratedB),
      bind(OneToken).toValue(1)                     
    ];
    
    let injector = new Injector(bindings);
    
    Promise.all(<Promise<any>[]>[
      injector.get(DecoratedAToken),
      injector.get(DecoratedBToken)
    ]).then(([a, b]) => {
      expect(a.one).toEqual(1);
      expect(b.a).toBe(a);
      done();
    });
  });
  
  it('should correctly resolve classes using token lists even when they are decorated with tokens', (done) => {
    let alternativeOneToken = Token.create<number>();
    
    let injector = new Injector([
      bind(DecoratedAToken).toClass(DecoratedA,
                                    alternativeOneToken),
      bind(OneToken).toValue(1),
      bind(alternativeOneToken).toValue(5)
    ]);
    
    injector.get(DecoratedAToken).then(decoratedA => {
      expect(decoratedA.one).toBe(5);
      done();
    });
  });
  
  it('should only construct a given class once', (done) => {
    let injector = new Injector([
      bind(CToken).toClass(C)
    ]);
    
    Promise.all([
      injector.get(CToken),
      injector.get(CToken),
      injector.get(CToken)
    ]).then(() => {
      expect(C.constructCount).toBe(1);
      done();
    });
  });
  
  it('should correctly construct classes that return objects from their constructors', (done) => {
    let obj = {};
    
    let injector = new Injector([
      bind(ClassReturningObjectFromConstructorToken).toClass(ClassReturningObjectFromConstructor),
      bind(EmptyObjectToken).toValue(obj)
    ]);
    
    injector.get(ClassReturningObjectFromConstructorToken).then(value => {
      expect(value).toBe(obj);
      done();
    });
  });
  
  it('should correctly construct classes that return non-objects from their constructors', (done) => {
    let injector = new Injector([
      bind(ClassReturningNumberFromConstructorToken).toClass(ClassReturningNumberFromConstructor),
      bind(OneToken).toValue(1)
    ]);
    
    injector.get(ClassReturningNumberFromConstructorToken).then(value => {
      expect(value).toEqual(jasmine.any(ClassReturningNumberFromConstructor));
      done();
    });
  });
});