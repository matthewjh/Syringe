/// <reference path="../definitions/definitions.d.ts"/>
/// <reference path="./syringe.d.ts"/>

import 'es6-promise';
import {IndexedProvider} from './provider/facade';
import {CyclicDependencyError, NoBoundTokenError} from './errors';

import {bind, IBinding} from 'syringe.ts/binding';
import {IToken, Lazy} from 'syringe.ts/token';

interface IIndexLog extends Array<boolean> {
  [index: number]: (boolean | typeof undefined);
}

interface ICache extends Array<Promise<any>> {
  [index: number]: Promise<any>;
}

export interface IInjector {
		get<T>(token: IToken<T>): Promise<T>;
}

export class Injector implements IInjector {
  private _tokens: IToken<any>[];
  private _providers: IndexedProvider<any>[];
  private _parent: IInjector;
  private _cache: ICache;
  
  constructor(bindings: IBinding<any>[], parent?: IInjector) {
    this._tokens = [];
    this._providers = [];
    this._cache = [];
    this._parent = parent;
   
    this._ingestBindings(
      bindings, 
      this._getLazyBindings(bindings)
    );
  }
  
  public get<T>(token: IToken<T>): Promise<T> {
    let index = this._getIndexForToken(token);
    
    if (index !== -1) {
      return this._getByIndex(index, [], []);
    } else {
      return this._getFromParent(token);
    }
  }

  private _getFromParent<T>(token: IToken<T>): Promise<T> {
     if (this._parent) {
        return this._parent.get(token);
      } else {
        let error = new NoBoundTokenError(token);
        
        return Promise.reject(error); 
      }
  }
  
  private _getByIndex<T>(index: number, indexLog: IIndexLog, tokenChain: IToken<any>[]): Promise<T> {
    let promise = this._cache[index];
    
    if (!promise) {
      promise = this._getByIndexLookup(index, indexLog, tokenChain);
      this._cache[index] = promise;
    }
    
    return promise;
  }
  
  private _getByIndexLookup<T>(index: number, indexLog: IIndexLog, tokenChain: IToken<any>[]): Promise<T> {
    let token = this._tokens[index];
    let provider = this._providers[index];

    tokenChain.push(token);
    this._detectCycle(index, indexLog, tokenChain);
    indexLog[index] = true;
   
    let dependencyPromises = provider.dependencyIndices.map((depIndex, i) => {
      if (depIndex === -1) {
        let token = provider.dependencyTokens[i];
        
        return this._getFromParent(token);
      } else {
        let clonedIndexLog = indexLog.slice();
        let clonedTokenChain = tokenChain.slice();
        
        return this._getByIndex(depIndex, clonedIndexLog, tokenChain);
      }
    });
    
    return Promise.all(dependencyPromises).then(dependencies => {
      return provider.get(dependencies);
    });
  }
  
  private _getIndexForToken(token: IToken<any>): number {
    return this._tokens.indexOf(token);
  }
  
  private _ingestBindings(...bindings: IBinding<any>[][]): void {
    let allBindings = [].concat(...bindings);
     
    this._tokens = allBindings.map(b => b.token);
    this._providers = allBindings.map(b => {
      return new IndexedProvider(b.provider, token => this._getIndexForToken(token))
    });
  }
  
  private _getLazyBindings(bindings: IBinding<any>[]): IBinding<any>[] {
    return bindings.map(b => bind(Lazy(b.token)).toValue({
      get: () => {
        return this.get(b.token);
      }
    }));
  }
  
  private _detectCycle(index: number, indexLog: IIndexLog, tokenChain: IToken<any>[]): void {
    if (indexLog[index]) {
      throw new CyclicDependencyError(tokenChain);
    }
  }
}