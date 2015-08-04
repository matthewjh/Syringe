/// <reference path="./es6-promise.d.ts"/>

declare module Syringe {
  module Binding {
    interface IBinding<T> { 
      token: IToken<T>;
      provider: Provider.IProvider<T>
    } 
    
    interface IUnprovidedBinding<T> {
      toValue(value: T): IBinding<T>;
    }
  }
  
  module Provider {
    interface IProvider<T> {
      dependencyTokens: Syringe.IToken<any>[];
      get(...dependencies: any[]): Promise<T>;
    }
  }

  interface IToken<T> { }

  interface IInjector {
    get<T>(token: IToken<T>): Promise<T>;
  }

  function bind<T>(token: IToken<T>): Binding.IUnprovidedBinding<T>;
}

declare module 'syringe' {
  export = Syringe;
}