/// <reference path="../definitions/definitions.d.ts"/>
/// <reference path="../definitions/api.d.ts"/>

import 'es6-promise';
import {Injector, Token, bind} from '../src/index';
import {CyclicDependencyError, NoBoundTokenError} from '../src/errors';

class OneToken extends Token<number> {}
class TwoToken extends Token<number> {}
class ThreeToken extends Token<number> {}

describe('injector with missing bindings', () => {  
  it('should reject the returned promise when trying to get an unbound token', (done) => {
    let injector: Syringe.IInjector;
    let bindings = [
      bind(OneToken).toFactory(() => 1)                         
    ];
    
    injector = new Injector(bindings);
    
    injector.get(TwoToken).catch((error) => {
      expect(error).toEqual(jasmine.any(NoBoundTokenError));
      done();
    });
  });
  
  it('should reject the returned promise when trying to get a value that is dependent on an unbound token', (done) => {
    let injector: Syringe.IInjector;
    let bindings = [
      bind(OneToken).toFactory(() => 1),
      bind(ThreeToken).toFactory(two => two + 1,
                                  TwoToken)                         
    ];
    
    injector = new Injector(bindings);
    
    injector.get(ThreeToken).catch((error) => {
      expect(error).toEqual(jasmine.any(NoBoundTokenError));
      expect(error.message).toContain('TwoToken');
      done();
    });
  });
  
  it('should throw when encountering a cyclic dependency', () => {
    let injector = new Injector([
      bind(OneToken).toFactory(two => two - 1,
                              TwoToken),
      bind(TwoToken).toFactory(one => one + 1,
                              OneToken)
    ]);
    
    expect(() => {
      injector.get(OneToken);
    }).toThrowError(CyclicDependencyError)
    
    expect(() => {
      injector.get(TwoToken);
    }).toThrowError(CyclicDependencyError);
    
    try {
      injector.get(TwoToken);
    } catch(e) {
      expect(e.message).toContain('TwoToken -> OneToken -> TwoToken');
    }
  });
  
  it('should not throw when there\'s a pseudo-cyclic dependency with a parent injector', done => {
    let parentInjector = new Injector([
      bind(OneToken).toFactory(two => two - 1,
                               TwoToken),
      bind(TwoToken).toValue(2),
    ])
    
    let injector = new Injector([
      bind(TwoToken).toFactory(three => three - 1,
                              ThreeToken),
      bind(ThreeToken).toFactory(one => one * 3,
                                  OneToken)                      
    ], parentInjector);
    
    expect(() => {
      injector.get(OneToken);
    }).not.toThrowError(CyclicDependencyError)
    
    expect(() => {
      injector.get(TwoToken);
    }).not.toThrowError(CyclicDependencyError);
    
    Promise.all([
      injector.get(OneToken),
      injector.get(TwoToken)
    ]).then(([one, two]) => {
      expect(one).toBe(1);
      expect(two).toBe(2);
      done()
    });
  });
});