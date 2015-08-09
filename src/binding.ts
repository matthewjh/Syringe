/// <reference path="../definitions/definitions.d.ts"/>
/// <reference path="../definitions/api.d.ts"/>

import {ValueProvider, FactoryProvider, AsyncFactoryProvider, ClassProvider} from './provider/facade';

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
  
  toFactory<T1, T2, T3, T4, T5, T6, T7, T8>(factory: (...deps: any[]) => T, ...dependencyTokens: Syringe.IToken<any>[]): Syringe.Binding.IBinding<T> {
    return new Binding(this._token, new FactoryProvider(factory, dependencyTokens));
  }
  
  toAsyncFactory<T1, T2, T3, T4, T5, T6, T7, T8>(factory: (...deps: any[]) => Promise<T>, ...dependencyTokens: Syringe.IToken<any>[]): Syringe.Binding.IBinding<T> {
    return new Binding(this._token, new AsyncFactoryProvider(factory, dependencyTokens));
  }
  
  toClass<T1, T2, T3, T4, T5, T6, T7, T8>(Class: Syringe.IStaticWithArgs<T, T1, T2, T3, T4, T5, T6, T7, T8>, ...dependencyTokens: Syringe.IToken<any>[]): Syringe.Binding.IBinding<T> {
    return new Binding(this._token, new ClassProvider(Class, dependencyTokens));
  }
}

export function bind<T>(token: Syringe.IToken<T>): Syringe.Binding.IUnprovidedBinding<T> {
  return new UnprovidedBinding<T>(token);
}