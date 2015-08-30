import {IToken} from './token';

import {IStaticWithArgs} from './shared-interfaces';

export interface IStaticThatMaybeHasTokens<T, T1, T2, T3, T4, T5, T6, T7, T8> extends IStaticWithArgs<T, T1, T2, T3, T4, T5, T6, T7, T8> {
  ___tokens?: IToken<any>[];
}

export interface IInjectDecorator<T1, T2, T3, T4, T5, T6, T7, T8> {
    (Class: IStaticThatMaybeHasTokens<any, T1, T2, T3, T4, T5, T6, T7, T8>): IStaticThatMaybeHasTokens<any, T1, T2, T3, T4, T5, T6, T7, T8>; 
}

export function Inject(): IInjectDecorator<{}, {}, {}, {}, {}, {}, {}, {}>;
export function Inject<T1>(token1: IToken<T1>): IInjectDecorator<T1, {}, {}, {}, {}, {}, {}, {}>;
export function Inject<T1, T2>(token1: IToken<T1>, token2: IToken<T2>): IInjectDecorator<T1, T2, {}, {}, {}, {}, {}, {}>;
export function Inject<T1, T2, T3>(token1: IToken<T1>, token2: IToken<T2>, token3: IToken<T3>): IInjectDecorator<T1, T2, T3, {}, {}, {}, {}, {}>;
export function Inject<T1, T2, T3, T4>(token1: IToken<T1>, token2: IToken<T2>, token3: IToken<T3>, token4: IToken<T4>): IInjectDecorator<T1, T2, T3, T4, {}, {}, {}, {}>;
export function Inject<T1, T2, T3, T4, T5>(token1: IToken<T1>, token2: IToken<T2>, token3: IToken<T3>, token4: IToken<T4>, token5: IToken<T5>): IInjectDecorator<T1, T2, T3, T4, T5, {}, {}, {}>;
export function Inject<T1, T2, T3, T4, T5, T6>(token1: IToken<T1>, token2: IToken<T2>, token3: IToken<T3>, token4: IToken<T4>, token5: IToken<T5>, token6: IToken<T6>): IInjectDecorator<T1, T2, T3, T4, T5, T6, {}, {}>;
export function Inject<T1, T2, T3, T4, T5, T6, T7, T8>(token1: IToken<T1>, token2: IToken<T2>, token3: IToken<T3>, token4: IToken<T4>, token5: IToken<T5>, token6: IToken<T6>, token7: IToken<T7>, token8: IToken<T8>): IInjectDecorator<T1, T2, T3, T4, T5, T6, T7, T8>;
export function Inject<T1, T2, T3, T4, T5, T6, T7>(token1: IToken<T1>, token2: IToken<T2>, token3: IToken<T3>, token4: IToken<T4>, token5: IToken<T5>, token6: IToken<T6>, token7: IToken<T7>): IInjectDecorator<T1, T2, T3, T4, T5, T6, T7, {}>;
export function Inject(...tokens: IToken<any>[]): IInjectDecorator<any, any, any, any, any, any, any, any> {
  return (Class: IStaticThatMaybeHasTokens<any, any, any, any, any, any, any, any, any>) => {
    
     Object.defineProperty(Class, '___tokens', {
       enumerable: false,
       value: tokens
     });
     
     return Class;
  };
}