/// <reference path="../definitions/definitions.d.ts"/>
/// <reference path="../definitions/api.d.ts"/>

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
    var tokenIndex = this._tokens.indexOf(token);
    
    if (tokenIndex === -1) {
      return Promise.reject(new Error('No binding found for token ${token} on this Injector'));
    } else {
      return this._providers[tokenIndex].get([]);
    }
  } 
  
  private _ingestBindings(bindings: Syringe.Binding.IBinding<any>[]): void {
    bindings.forEach(({token, provider}) => {
      this._tokens.push(token);
      this._providers.push(provider);
    });
  }
}