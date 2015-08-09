/// <reference path="./es6-promise/es6-promise.d.ts"/>

declare module Syringe {
  interface IStatic<T> {
    new(...args: any[]): T;
  }
  
  interface IStaticWithArgs<T, T1, T2, T3> extends IStatic<T> {
    new(dep1: T1, dep2: T2, dep3: T3): T;
  }
  
  module Decorators {
    interface IInjectDecorator<T1, T2, T3, T4> {
      (Class: IStaticThatMaybeHasTokens<any, T1, T2, T3>): IStaticThatMaybeHasTokens<any, T1, T2, T3>; 
    }
  }
  
  module Binding {
    interface IBinding<T> { 
      token: IToken<T>;
      provider: Provider.IProvider<T>
    } 
    
    interface IUnprovidedBinding<T> {
      toValue(value: T): IBinding<T>;
      
      toClass(Class: IStatic<T>): IBinding<T>;
      toClass<T1>(Class: IStaticWithArgs<T, T1, {}, {}>, token1: IToken<T1>): IBinding<T>;
      toClass<T1, T2>(Class: IStaticWithArgs<T, T1, T2, {}>, token1: IToken<T1>, token2: IToken<T2>): IBinding<T>;
      toClass<T1, T2, T3>(Class: IStaticWithArgs<T, T1, T2, T3>, token1: IToken<T1>, token2: IToken<T2>, token3: IToken<T3>): IBinding<T>;
      
      toFactory(factory: () => T): IBinding<T>;
      toFactory<T1>(factory: (dep1: T1) => T, token1: IToken<T1>): IBinding<T>;
      toFactory<T1, T2>(factory: (dep1: T1, dep2: T2) => T, token1: IToken<T1>, token2: IToken<T2>): IBinding<T>;
      toFactory<T1, T2, T3>(factory: (dep1: T1, dep2: T2, dep3: T3) => T, token1: IToken<T1>, token2: IToken<T2>, token3: IToken<T3>): IBinding<T>;
      toFactory<T1, T2, T3, T4>(factory: (dep1: T1, dep2: T2, dep3: T3, dep4: T4) => T, token1: IToken<T1>, token2: IToken<T2>, token3: IToken<T3>, token4: IToken<T4>): IBinding<T>;
            
      toAsyncFactory(factory: () => Promise<T>): IBinding<T>;
      toAsyncFactory<T1>(factory: (dep1: T1) => Promise<T>, token1: IToken<T1>): IBinding<T>;
      toAsyncFactory<T1, T2>(factory: (dep1: T1, dep2: T2) => Promise<T>, token1: IToken<T1>, token2: IToken<T2>): IBinding<T>;
      toAsyncFactory<T1, T2, T3>(factory: (dep1: T1, dep2: T2, dep3: T3) => Promise<T>, token1: IToken<T1>, token2: IToken<T2>, token3: IToken<T3>): IBinding<T>;
      toAsyncFactory<T1, T2, T3, T4>(factory: (dep1: T1, dep2: T2, dep3: T3, dep4: T4) => Promise<T>, token1: IToken<T1>, token2: IToken<T2>, token3: IToken<T3>, token4: IToken<T4>): IBinding<T>;
    }
  }
  
  module Provider {
    interface IProvider<T> {
      dependencyTokens: IToken<any>[];
      get(dependencies: any[]): Promise<T>;
    }
  }
  
  interface IStaticThatMaybeHasTokens<T, T1, T2, T3> extends IStaticWithArgs<T, T1, T2, T3> {
    ___tokens?: IToken<any>[];
  }

  interface IToken<T> { 
    asLazy: IToken<ILazy<T>>;  
  }
  
  interface ITokenStatic {
    new<T>(): IToken<T>;
  }
  
  interface ILazy<T> {
    get(): Promise<T>;
  }

  interface IInjector {
    get<T>(token: IToken<T>): Promise<T>;
  }
  
  interface IInjectorStatic {
    new(bindings: Binding.IBinding<any>[], parent?: IInjector): IInjector;
  }

  function bind<T>(token: IToken<T>): Binding.IUnprovidedBinding<T>;
  
  function Inject(): Decorators.IInjectDecorator<{}, {}, {}, {}>;
  function Inject<T1>(token1: IToken<T1>): Decorators.IInjectDecorator<T1, {}, {}, {}>;
  function Inject<T1, T2>(token1: IToken<T1>, token2: IToken<T2>): Decorators.IInjectDecorator<T1, T2, {}, {}>;
  function Inject<T1, T2, T3>(token1: IToken<T1>, token2: IToken<T2>, token3: IToken<T3>): Decorators.IInjectDecorator<T1, T2, T3, {}>;
  
  var Injector: IInjectorStatic;
  var Token: ITokenStatic;
}

declare module 'syringe' {
  export = Syringe;
}