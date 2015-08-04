/// <reference path="../definitions/definitions.d.ts"/>
/// <reference path="../definitions/api.d.ts"/>

import 'es6-promise';

export class Injector implements Syringe.IInjector {
  private _tokens: Syringe.IToken<any>[];
  private _providers: Syringe.Provider.IProvider<any>[];
  
  constructor(bindings: Syringe.Binding.IBinding<any>[]) {
    this._tokens = [];
    this._providers = [];
    
    this._ingestBindings(bindings);
  }
  
  get<T>(token: Syringe.IToken<T>): Promise<T> {
    var value: T;
    var provider = this._getProvider(token);
    var dependencyPromises = provider.dependencyTokens.map(token => this.get(token));
    
    if (!provider) {
      return Promise.reject(new Error('No provider found for token ${token} on this Injector'));
    } else {
      return Promise.all(dependencyPromises).then(dependencies => {
        return provider.get(dependencies);
      });
    }
  }
  
  private _getProvider<T>(token: Syringe.IToken<T>): Syringe.Provider.IProvider<T> {
    var tokenIndex = this._tokens.indexOf(token);
    
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