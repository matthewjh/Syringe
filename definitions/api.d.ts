/// <reference path="./es6-promise/es6-promise.d.ts"/>

declare module Syringe {
  interface IStatic<T> {
    new(...args: any[]): T;
  }
  
  interface IStaticWithArgs<T, T1, T2, T3, T4, T5, T6, T7, T8> extends IStatic<T> {
    new(dep1: T1, dep2: T2, dep3: T3, dep4: T4, dep5: T5, dep6: T6, dep7: T7, dep8: T8): T;
  }
  
  module Decorators {
    interface IInjectDecorator<T1, T2, T3, T4, T5, T6, T7, T8> {
      (Class: IStaticThatMaybeHasTokens<any, T1, T2, T3, T4, T5, T6, T7, T8>): IStaticThatMaybeHasTokens<any, T1, T2, T3, T4, T5, T6, T7, T8>; 
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
      toClass<T1>(Class: IStaticWithArgs<T, T1, {}, {}, {}, {}, {}, {}, {}>, token1: IToken<T1>): IBinding<T>;
      toClass<T1, T2>(Class: IStaticWithArgs<T, T1, T2, {}, {}, {}, {}, {}, {}>, token1: IToken<T1>, token2: IToken<T2>): IBinding<T>;
      toClass<T1, T2, T3>(Class: IStaticWithArgs<T, T1, T2, T3, {}, {}, {}, {}, {}>, token1: IToken<T1>, token2: IToken<T2>, token3: IToken<T3>): IBinding<T>;
      toClass<T1, T2, T3, T4>(Class: IStaticWithArgs<T, T1, T2, T3, T4, {}, {}, {}, {}>, token1: IToken<T1>, token2: IToken<T2>, token3: IToken<T3>, token4: IToken<T4>): IBinding<T>;
      toClass<T1, T2, T3, T4, T5>(Class: IStaticWithArgs<T, T1, T2, T3, T4, T5, {}, {}, {}>, token1: IToken<T1>, token2: IToken<T2>, token3: IToken<T3>, token4: IToken<T4>, token5: IToken<T5>): IBinding<T>;
      toClass<T1, T2, T3, T4, T5, T6>(Class: IStaticWithArgs<T, T1, T2, T3, T4, T5, T6, {}, {}>, token1: IToken<T1>, token2: IToken<T2>, token3: IToken<T3>, token4: IToken<T4>, token5: IToken<T5>, token6: IToken<T6>): IBinding<T>;
      toClass<T1, T2, T3, T4, T5, T6, T7>(Class: IStaticWithArgs<T, T1, T2, T3, T4, T5, T6, T7, {}>, token1: IToken<T1>, token2: IToken<T2>, token3: IToken<T3>, token4: IToken<T4>, token5: IToken<T5>, token6: IToken<T6>, token7: IToken<T7>): IBinding<T>;
      toClass<T1, T2, T3, T4, T5, T6, T7, T8>(Class: IStaticWithArgs<T, T1, T2, T3, T4, T5, T6, T7, T8>, token1: IToken<T1>, token2: IToken<T2>, token3: IToken<T3>, token4: IToken<T4>, token5: IToken<T5>, token6: IToken<T6>, token7: IToken<T7>, token8: IToken<T8>): IBinding<T>;
      
      toFactory(factory: () => T): IBinding<T>;
      toFactory<T1>(factory: (dep1: T1) => T, token1: IToken<T1>): IBinding<T>;
      toFactory<T1, T2>(factory: (dep1: T1, dep2: T2) => T, token1: IToken<T1>, token2: IToken<T2>): IBinding<T>;
      toFactory<T1, T2, T3>(factory: (dep1: T1, dep2: T2, dep3: T3) => T, token1: IToken<T1>, token2: IToken<T2>, token3: IToken<T3>): IBinding<T>;
      toFactory<T1, T2, T3, T4>(factory: (dep1: T1, dep2: T2, dep3: T3, dep4: T4) => T, token1: IToken<T1>, token2: IToken<T2>, token3: IToken<T3>, token4: IToken<T4>): IBinding<T>;
      toFactory<T1, T2, T3, T4, T5>(factory: (dep1: T1, dep2: T2, dep3: T3, dep4: T4, dep5: T5) => T, token1: IToken<T1>, token2: IToken<T2>, token3: IToken<T3>, token4: IToken<T4>, token5: IToken<T5>): IBinding<T>;
      toFactory<T1, T2, T3, T4, T5, T6>(factory: (dep1: T1, dep2: T2, dep3: T3, dep4: T4, dep5: T5, dep6: T6) => T, token1: IToken<T1>, token2: IToken<T2>, token3: IToken<T3>, token4: IToken<T4>, token5: IToken<T5>, token6: IToken<T6>): IBinding<T>;
      toFactory<T1, T2, T3, T4, T5, T6, T7>(factory: (dep1: T1, dep2: T2, dep3: T3, dep4: T4, dep5: T5, dep6: T6, dep7: T7) => T, token1: IToken<T1>, token2: IToken<T2>, token3: IToken<T3>, token4: IToken<T4>, token5: IToken<T5>, token6: IToken<T6>, token7: IToken<T7>): IBinding<T>;
      toFactory<T1, T2, T3, T4, T5, T6, T7, T8>(factory: (dep1: T1, dep2: T2, dep3: T3, dep4: T4, dep5: T5, dep6: T7, dep7: T7, dep8: T8) => T, token1: IToken<T1>, token2: IToken<T2>, token3: IToken<T3>, token4: IToken<T4>, token5: IToken<T5>, token6: IToken<T6>, token7: IToken<T7>, token8: IToken<T8>): IBinding<T>;
            
      toAsyncFactory(factory: () => Thenable<T>): IBinding<T>;
      toAsyncFactory<T1>(factory: (dep1: T1) => Thenable<T>, token1: IToken<T1>): IBinding<T>;
      toAsyncFactory<T1, T2>(factory: (dep1: T1, dep2: T2) => Thenable<T>, token1: IToken<T1>, token2: IToken<T2>): IBinding<T>;
      toAsyncFactory<T1, T2, T3>(factory: (dep1: T1, dep2: T2, dep3: T3) => Thenable<T>, token1: IToken<T1>, token2: IToken<T2>, token3: IToken<T3>): IBinding<T>;
      toAsyncFactory<T1, T2, T3, T4>(factory: (dep1: T1, dep2: T2, dep3: T3, dep4: T4) => Thenable<T>, token1: IToken<T1>, token2: IToken<T2>, token3: IToken<T3>, token4: IToken<T4>): IBinding<T>;
      toAsyncFactory<T1, T2, T3, T4, T5>(factory: (dep1: T1, dep2: T2, dep3: T3, dep4: T4, dep5: T5) => Thenable<T>, token1: IToken<T1>, token2: IToken<T2>, token3: IToken<T3>, token4: IToken<T4>, token5: IToken<T5>): IBinding<T>;
      toAsyncFactory<T1, T2, T3, T4, T5, T6>(factory: (dep1: T1, dep2: T2, dep3: T3, dep4: T4, dep5: T5, dep6: T6) => Thenable<T>, token1: IToken<T1>, token2: IToken<T2>, token3: IToken<T3>, token4: IToken<T4>, token5: IToken<T5>, token6: IToken<T6>): IBinding<T>;
      toAsyncFactory<T1, T2, T3, T4, T5, T6, T7>(factory: (dep1: T1, dep2: T2, dep3: T3, dep4: T4, dep5: T5, dep6: T6, dep7: T7) => Thenable<T>, token1: IToken<T1>, token2: IToken<T2>, token3: IToken<T3>, token4: IToken<T4>, token5: IToken<T5>, token6: IToken<T6>, token7: IToken<T7>): IBinding<T>;
      toAsyncFactory<T1, T2, T3, T4, T5, T6, T7, T8>(factory: (dep1: T1, dep2: T2, dep3: T3, dep4: T4, dep5: T5, dep6: T6, dep7: T7, dep8: T8) => Thenable<T>, token1: IToken<T1>, token2: IToken<T2>, token3: IToken<T3>, token4: IToken<T4>, token5: IToken<T5>, token6: IToken<T6>, token7: IToken<T7>, token8: IToken<T8>): IBinding<T>;
    }
  }
  
  module Provider {
    interface IProvider<T> {
      dependencyTokens: IToken<any>[];
      get(dependencies: any[]): Promise<T>;
    }
  }
  
  interface IStaticThatMaybeHasTokens<T, T1, T2, T3, T4, T5, T6, T7, T8> extends IStaticWithArgs<T, T1, T2, T3, T4, T5, T6, T7, T8> {
    ___tokens?: IToken<any>[];
  }

  interface IToken<T> {
    new(): Token<T>;
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
  
  function Inject(): Decorators.IInjectDecorator<{}, {}, {}, {}, {}, {}, {}, {}>;
  function Inject<T1>(token1: IToken<T1>): Decorators.IInjectDecorator<T1, {}, {}, {}, {}, {}, {}, {}>;
  function Inject<T1, T2>(token1: IToken<T1>, token2: IToken<T2>): Decorators.IInjectDecorator<T1, T2, {}, {}, {}, {}, {}, {}>;
  function Inject<T1, T2, T3>(token1: IToken<T1>, token2: IToken<T2>, token3: IToken<T3>): Decorators.IInjectDecorator<T1, T2, T3, {}, {}, {}, {}, {}>;
  function Inject<T1, T2, T3, T4>(token1: IToken<T1>, token2: IToken<T2>, token3: IToken<T3>, token4: IToken<T4>): Decorators.IInjectDecorator<T1, T2, T3, T4, {}, {}, {}, {}>;
  function Inject<T1, T2, T3, T4, T5>(token1: IToken<T1>, token2: IToken<T2>, token3: IToken<T3>, token4: IToken<T4>, token5: IToken<T5>): Decorators.IInjectDecorator<T1, T2, T3, T4, T5, {}, {}, {}>;
  function Inject<T1, T2, T3, T4, T5, T6>(token1: IToken<T1>, token2: IToken<T2>, token3: IToken<T3>, token4: IToken<T4>, token5: IToken<T5>, token6: IToken<T6>): Decorators.IInjectDecorator<T1, T2, T3, T4, T5, T6, {}, {}>;
  function Inject<T1, T2, T3, T4, T5, T6, T7>(token1: IToken<T1>, token2: IToken<T2>, token3: IToken<T3>, token4: IToken<T4>, token5: IToken<T5>, token6: IToken<T6>, token7: IToken<T7>): Decorators.IInjectDecorator<T1, T2, T3, T4, T5, T6, T7, {}>;
  function Inject<T1, T2, T3, T4, T5, T6, T7, T8>(token1: IToken<T1>, token2: IToken<T2>, token3: IToken<T3>, token4: IToken<T4>, token5: IToken<T5>, token6: IToken<T6>, token7: IToken<T7>, token8: IToken<T8>): Decorators.IInjectDecorator<T1, T2, T3, T4, T5, T6, T7, T8>;
  
  function Lazy<T>(token: IToken<T>): IToken<ILazy<T>>;
  
  var Injector: IInjectorStatic;
  
  class Token<T> {
    // Unfortunately we need this for TS to infer `T` in some contexts
    surrogate: T;
  }
}

declare module 'syringe.ts' {
  export = Syringe;
}

declare module 'syringe' {
  export = Syringe;
}