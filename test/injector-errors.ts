/// <reference path="../definitions/definitions.d.ts"/>
/// <reference path="../definitions/api.d.ts"/>

import 'es6-promise';
import {Injector, Token, bind} from '../src/index';
import {CyclicDependencyError, NoBoundTokenError, MissingBindingError} from '../src/errors';

describe('injector', () => {
  let oneToken = new Token<number>();
  let twoToken = new Token<number>();
  let threeToken = new Token<number>();
  
  it('should reject the returned promise when trying to get an unbound token', (done) => {
    let injector: Syringe.IInjector;
    let bindings = [
      bind(oneToken).toFactory(() => 1)                         
    ];
    
    injector = new Injector(bindings, null, {
      shouldDetectMissingBindings: false
    });
    
    injector.get(twoToken).catch((error) => {
      expect(error).toEqual(jasmine.any(NoBoundTokenError));
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
    
    injector = new Injector(bindings, null, {
      shouldDetectMissingBindings: false
    });
    
    injector.get(threeToken).catch((error) => {
      expect(error).toEqual(jasmine.any(NoBoundTokenError));
      done();
    });
  });
  
  it('should throw when encountering a cyclic dependency', () => {
    let injector = new Injector([
      bind(oneToken).toFactory(two => two - 1,
                              twoToken),
      bind(twoToken).toFactory(one => one + 1,
                              oneToken)
    ]);
    
    expect(() => {
      injector.get(oneToken);
    }).toThrowError(CyclicDependencyError)
    
    expect(() => {
      injector.get(twoToken);
    }).toThrowError(CyclicDependencyError);
  });
  
  it('should not throw when there\'s a pseudo-cyclic dependency with a parent injector', done => {
    let parentInjector = new Injector([
      bind(oneToken).toFactory(two => two - 1,
                               twoToken),
      bind(twoToken).toValue(2),
    ])
    
    let injector = new Injector([
      bind(twoToken).toFactory(three => three - 1,
                              threeToken),
      bind(threeToken).toFactory(one => one * 3,
                                  oneToken)                      
    ], parentInjector);
    
    expect(() => {
      injector.get(oneToken);
    }).not.toThrowError(CyclicDependencyError)
    
    expect(() => {
      injector.get(twoToken);
    }).not.toThrowError(CyclicDependencyError);
    
    Promise.all([
      injector.get(oneToken),
      injector.get(twoToken)
    ]).then(([one, two]) => {
      expect(one).toBe(1);
      expect(two).toBe(2);
      done()
    });
  });
  
  it('should throw when creating a root injector with a missing binding', () => {
    expect(() => {
      let injector = new Injector([
        bind(oneToken).toValue(1),
        bind(twoToken).toFactory(three => three - 1,
                                threeToken)              
      ]);
    }).toThrowError(MissingBindingError);
    
    try {
      let injector = new Injector([
          bind(oneToken).toValue(1),
          bind(twoToken).toFactory(three => three - 1,
                                  threeToken)              
      ]);
    } catch (error) {
      expect(<MissingBindingError>error.bindingIndex).toBe(1);
    }
  });
  
  it('should not throw when creating a sole injector with a missing binding when shouldDetectMissingBindings is false', () => {
    expect(() => {
      let injector = new Injector([
        bind(twoToken).toFactory(three => three - 1,
                                threeToken)              
      ], null, {
        shouldDetectMissingBindings: false
      });
    }).not.toThrowError(MissingBindingError);
  });
});