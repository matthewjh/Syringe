/// <reference path="../definitions/definitions.d.ts"/>
/// <reference path="../definitions/api.d.ts"/>

import 'es6-promise';
import {IndexedProvider} from './provider/facade';
import {CyclicDependencyError} from './errors';

export class Injector implements Syringe.IInjector {
  private _tokens: Syringe.IToken<any>[];
  private _providers: IndexedProvider<any>[];
  private _parent: Syringe.IInjector;
  
  constructor(bindings: Syringe.Binding.IBinding<any>[], parent?: Syringe.IInjector) {
    this._tokens = [];
    this._providers = [];
    this._parent = parent;
    
    this._ingestBindings(bindings);
  }
  
  public get<T>(token: Syringe.IToken<T>, tokenLog: Syringe.IToken<T>[] = []): Promise<T> {
    var index = this._getIndexForToken(token);
    
    if (index !== -1) {
      return this._getByIndex(index, tokenLog);
    } else {
      return this._getFromParent(token);
    }
  }

  private _getFromParent<T>(token: Syringe.IToken<T>, tokenLog: Syringe.IToken<T>[] = []): Promise<T> {
     if (this._parent) {
        return this._parent.get(token);
      } else {
        return Promise.reject(new Error(`No provider found for token ${token} on this Injector`)); 
      }
  }
  
  private _getByIndex<T>(index: number, tokenLog: Syringe.IToken<T>[]): Promise<T> {
    let provider = this._providers[index];

    this._detectCycle(this._tokens[index], tokenLog);
    tokenLog.push(this._tokens[index]);
   
    let dependencyPromises = provider.dependencyIndices.map((depIndex, i) => {
      let clonedTokenLog = tokenLog.slice();
      
      if (depIndex === -1) {
        let token = provider.dependencyTokens[i];
        return this._getFromParent(token, clonedTokenLog);
      } else {
        return this._getByIndex(depIndex, clonedTokenLog);
      }
    });
    
    return Promise.all(dependencyPromises).then(dependencies => {
      return provider.get(dependencies);
    });
  }
  
  private _getProvider<T>(token: Syringe.IToken<T>): Syringe.Provider.IProvider<T> {
    let tokenIndex = this._tokens.indexOf(token);
    
    if (tokenIndex >= 0) {
      return this._providers[tokenIndex];
    } else {
      return null;
    }
  } 
  
  private _ingestBindings(bindings: Syringe.Binding.IBinding<any>[]): void {
    let providers = bindings.map(b => b.provider);
    
    this._tokens = bindings.map(b => b.token);
    this._providers = providers.map(p => new IndexedProvider(p, token => this._getIndexForToken(token)));
  }
  
  private _getIndexForToken(token: Syringe.IToken<any>): number {
    return this._tokens.indexOf(token);
  }
  
  private _detectCycle(token: Syringe.IToken<any>, tokenLog: Syringe.IToken<any>[]): void {
    let hasCycle = tokenLog.indexOf(token) !== -1;
    
    if (hasCycle) {
      throw new CyclicDependencyError();
    }
  }
}