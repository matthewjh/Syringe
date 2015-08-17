/// <reference path="../definitions/definitions.d.ts"/>

import {IToken} from './token';

interface IStatic<T> {
  new(...args: any[]): T;
}

interface IStaticWithArgs<T, T1, T2, T3, T4, T5, T6, T7, T8> extends IStatic<T> {
  new(dep1: T1, dep2: T2, dep3: T3, dep4: T4, dep5: T5, dep6: T6, dep7: T7, dep8: T8): T;
}

export interface IStaticThatMaybeHasTokens<T, T1, T2, T3, T4, T5, T6, T7, T8> extends IStaticWithArgs<T, T1, T2, T3, T4, T5, T6, T7, T8> {
  ___tokens?: IToken<any>[];
}

export interface IInjectDecorator<T1, T2, T3, T4, T5, T6, T7, T8> {
    (Class: IStaticThatMaybeHasTokens<any, T1, T2, T3, T4, T5, T6, T7, T8>): IStaticThatMaybeHasTokens<any, T1, T2, T3, T4, T5, T6, T7, T8>; 
}

export function Inject<T1, T2, T3, T4, T5, T6, T7, T8>(
  token1?: IToken<T1>,
  token2?: IToken<T2>,
  token3?: IToken<T3>,
  token4?: IToken<T4>,
  token5?: IToken<T5>,
  token6?: IToken<T6>,
  token7?: IToken<T7>,
  token8?: IToken<T8>
): IInjectDecorator<T1, T2, T3, T4, T5, T6, T7, T8> {
  return (Class: IStaticThatMaybeHasTokens<any, T1, T2, T3, T4, T5, T6, T7, T8>) => {
    
     Object.defineProperty(Class, '___tokens', {
       enumerable: false,
       value: [token1, token2, token3, token4, token5, token6, token7, token8].filter(t => t != null)
     });
     
     return Class;
  };
}