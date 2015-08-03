/// <reference path="./es6-promise.d.ts"/>

declare module Syringe {
  module Binding {
    interface IBinding<T> { 
      token: IToken<T>;
      value: T;
    } 
    
    interface IPotentialBinding<T> {
      toValue(value: T): IBinding<T>;
    }
  }

  interface IToken<T> { }

  interface IInjector {
    get<T>(token: IToken<T>): Promise<T>;
  }

  function bind<T>(token: IToken<T>): Binding.IPotentialBinding<T>;
}

declare module 'syringe' {
  export = Syringe;
}