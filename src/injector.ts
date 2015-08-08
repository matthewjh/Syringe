/// <reference path="../definitions/definitions.d.ts"/>
/// <reference path="../definitions/api.d.ts"/>

import 'es6-promise';
import {IndexedProvider} from './provider/facade';
import {bind} from './binding';
import {CyclicDependencyError} from './errors';

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
  private _cache: ICache;
  
  constructor(bindings: Syringe.Binding.IBinding<any>[], parent?: Syringe.IInjector) {
    this._tokens = [];
    this._providers = [];
    this._cache = [];
    this._parent = parent;
   
    this._ingestBindings(
      bindings, 
      this._getImplicitBindings(bindings)
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
        return Promise.reject(new Error(`No provider found for token ${token} on this Injector`)); 
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
     
    this._tokens = allBindings.map(b => b.token);
    this._providers = allBindings.map(b => {
      return new IndexedProvider(b.provider, token => this._getIndexForToken(token))
    });
  }
  
  private _getImplicitBindings(bindings: Syringe.Binding.IBinding<any>[]): Syringe.Binding.IBinding<any>[] {
    return [].concat(
      this._getLazyBindings(bindings)
    );
  }
  
  private _getLazyBindings(bindings: Syringe.Binding.IBinding<any>[]): Syringe.Binding.IBinding<any>[] {
    return bindings.map(b => bind(b.token.asLazy).toFactory(() => {
      return {
        get: () => {
          return this.get(b.token);
        }
      }
    }));
  }
  
  private _detectCycle(index: number, indexLog: IIndexLog): void {
    if (indexLog[index]) {
      throw new CyclicDependencyError();
    }
  }
}