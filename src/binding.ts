/// <reference path="../definitions/definitions.d.ts"/>
/// <reference path="../definitions/api.d.ts"/>

import {ValueProvider} from './provider/facade';

class Binding<T> implements Syringe.Binding.IBinding<T> {
  public token: Syringe.IToken<T>;
  public provider: Syringe.Provider.IProvider<T>;
  
  constructor(token: Syringe.IToken<T>, provider: Syringe.Provider.IProvider<T>) {
    this.token = token;
    this.provider = provider;
  }
}

class UnprovidedBinding<T> implements Syringe.Binding.IUnprovidedBinding<T> {
  private _token: Syringe.IToken<T>;

  constructor(token: Syringe.IToken<T>) {
    this._token = token;
  }

  toValue(value: T): Binding<T> {
    return new Binding(this._token, new ValueProvider(value));
  }
}

export function bind<T>(token: Syringe.IToken<T>): Syringe.Binding.IUnprovidedBinding<T> {
  return new UnprovidedBinding<T>(token);
}