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
  
  module Provider {
    interface IProvider<T> {
      dependencyTokens: IToken<any>[];
      get(dependencies: any[]): Promise<T>;
    }
  }
  
  interface IStaticThatMaybeHasTokens<T, T1, T2, T3, T4, T5, T6, T7, T8> extends IStaticWithArgs<T, T1, T2, T3, T4, T5, T6, T7, T8> {
    ___tokens?: IToken<any>[];
  }
}

interface Function {
  
  // Available in ES6
  name?: string;
}

declare module 'syringe.ts' {
  export = Syringe;
}

declare module 'syringe' {
  export = Syringe;
}