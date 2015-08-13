/// <reference path="../definitions/definitions.d.ts"/>
/// <reference path="../definitions/api.d.ts"/>

import 'es6-promise';
import {IndexedProvider} from './provider/facade';
import {bind} from './binding';
import {CyclicDependencyError, NoBoundTokenError, MissingBindingError} from './errors';

const DEFAULT_OPTIONS: Syringe.IInjectorOptions = {
  shouldDetectMissingBindings: true
};

interface IIndexLog extends Array<boolean> {
  [index: number]: (boolean | typeof undefined);
}

interface ICache extends Array<Promise<any>> {
  [index: number]: Promise<any>;
}

export class Injector implements Syringe.IInjector {
  private _tokens: Syringe.IToken<any>[];
  private _providers: IndexedProvider<any>[];
  private _parent: Syringe.IInjector;
  private _isRoot: boolean;
  private _cache: ICache;
  private _options: Syringe.IInjectorOptions;
  
  constructor(bindings: Syringe.Binding.IBinding<any>[], 
              parent?: Syringe.IInjector, 
              options: Syringe.IInjectorOptions = DEFAULT_OPTIONS) {
    this._tokens = [];
    this._providers = [];
    this._cache = [];
    this._parent = parent;
    this._isRoot = !parent;
    this._options = options;
   
    this._ingestBindings(
      bindings, 
      this._getLazyBindings(bindings)
    );
  }
  
  public get<T>(token: Syringe.IToken<T>): Promise<T> {
    let index = this._getIndexForToken(token);
    
    if (index !== -1) {
      return this._getByIndex(index, []);
    } else {
      return this._getFromParent(token);
    }
  }

  private _getFromParent<T>(token: Syringe.IToken<T>): Promise<T> {
     if (this._parent) {
        return this._parent.get(token);
      } else {
        let error = new NoBoundTokenError();
        
        return Promise.reject(error); 
      }
  }
  
  private _getByIndex<T>(index: number, indexLog: IIndexLog): Promise<T> {
    let promise = this._cache[index];
    
    if (!promise) {
      promise = this._getByIndexLookup(index, indexLog);
      this._cache[index] = promise;
    }
    
    return promise;
  }
  
  private _getByIndexLookup<T>(index: number, indexLog: IIndexLog): Promise<T> {
    let provider = this._providers[index];

    this._detectCycle(index, indexLog);
    indexLog[index] = true;
   
    let dependencyPromises = provider.dependencyIndices.map((depIndex, i) => {
      if (depIndex === -1) {
        let token = provider.dependencyTokens[i];
        
        return this._getFromParent(token);
      } else {
        let clonedIndexLog = indexLog.slice();
        
        return this._getByIndex(depIndex, clonedIndexLog);
      }
    });
    
    return Promise.all(dependencyPromises).then(dependencies => {
      return provider.get(dependencies);
    });
  }
  
  private _getIndexForToken(token: Syringe.IToken<any>): number {
    return this._tokens.indexOf(token);
  }
  
  private _ingestBindings(...bindings: Syringe.Binding.IBinding<any>[][]): void {
    let allBindings = [].concat(...bindings);
    let getIndexForToken = (binding: Syringe.Binding.IBinding<any>, token: Syringe.IToken<any>) => {
      let index = this._getIndexForToken(token);
      
      // If a token isn't on the root injector, we have a problem.
      if (index === -1 && this._isRoot && this._options.shouldDetectMissingBindings) {
        this._reportMissingBinding(binding);
      }
      
      return index;
    }
     
    this._tokens = allBindings.map(b => b.token);
    this._providers = allBindings.map(b => {
      return new IndexedProvider(b.provider, getIndexForToken.bind(this, b));
    });
  }
  
  private _getLazyBindings(bindings: Syringe.Binding.IBinding<any>[]): Syringe.Binding.IBinding<any>[] {
    return bindings.map(b => bind(b.token.asLazy).toValue({
      get: () => {
        return this.get(b.token);
      }
    }));
  }
  
  private _detectCycle(index: number, indexLog: IIndexLog): void {
    if (indexLog[index]) {
      throw new CyclicDependencyError();
    }
  }
  
  private _reportMissingBinding(binding: Syringe.Binding.IBinding<any>): void {
    let index = this._tokens.indexOf(binding.token);
    
    throw new MissingBindingError(index);
  }
}