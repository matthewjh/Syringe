/// <reference path="../definitions/definitions.d.ts"/>
/// <reference path="../definitions/api.d.ts"/>

import 'es6-promise';

export class Injector implements Syringe.IInjector {
  private _tokens: Syringe.IToken<any>[];
  private _providers: Syringe.Provider.IProvider<any>[];
  private _parent: Syringe.IInjector;
  
  constructor(bindings: Syringe.Binding.IBinding<any>[], parent?: Syringe.IInjector) {
    this._tokens = [];
    this._providers = [];
    this._parent = parent;
    
    this._ingestBindings(bindings);
  }
  
  get<T>(token: Syringe.IToken<T>): Promise<T> {
    let value: T;
    let provider = this._getProvider(token);
      
    if (!provider) {
      if (this._parent) {
        return this._parent.get(token);
      } else {
        return Promise.reject(new Error('No provider found for token ${token} on this Injector')); 
      }
    } else {
      let dependencyPromises = provider.dependencyTokens.map(token => this.get(token));
      
      return Promise.all(dependencyPromises).then(dependencies => {
        return provider.get(dependencies);
      });
    }
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
    bindings.forEach(({token, provider}) => {
      this._tokens.push(token);
      this._providers.push(provider);
    });
  }
}