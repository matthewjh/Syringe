/// <reference path="./syringe.d.ts"/>

declare module 'syringe.ts/decorators' {
	interface IInjectDecorator<T1, T2, T3, T4, T5, T6, T7, T8> {
     (Class: Syringe.IStaticThatMaybeHasTokens<any, T1, T2, T3, T4, T5, T6, T7, T8>): Syringe.IStaticThatMaybeHasTokens<any, T1, T2, T3, T4, T5, T6, T7, T8>; 
  }
	
  export function Inject(): IInjectDecorator<{}, {}, {}, {}, {}, {}, {}, {}>;
  export function Inject<T1>(token1: Syringe.IToken<T1>): IInjectDecorator<T1, {}, {}, {}, {}, {}, {}, {}>;
  export function Inject<T1, T2>(token1: Syringe.IToken<T1>, token2: Syringe.IToken<T2>): IInjectDecorator<T1, T2, {}, {}, {}, {}, {}, {}>;
  export function Inject<T1, T2, T3>(token1: Syringe.IToken<T1>, token2: Syringe.IToken<T2>, token3: Syringe.IToken<T3>): IInjectDecorator<T1, T2, T3, {}, {}, {}, {}, {}>;
  export function Inject<T1, T2, T3, T4>(token1: Syringe.IToken<T1>, token2: Syringe.IToken<T2>, token3: Syringe.IToken<T3>, token4: Syringe.IToken<T4>): IInjectDecorator<T1, T2, T3, T4, {}, {}, {}, {}>;
  export function Inject<T1, T2, T3, T4, T5>(token1: Syringe.IToken<T1>, token2: Syringe.IToken<T2>, token3: Syringe.IToken<T3>, token4: Syringe.IToken<T4>, token5: Syringe.IToken<T5>): IInjectDecorator<T1, T2, T3, T4, T5, {}, {}, {}>;
  export function Inject<T1, T2, T3, T4, T5, T6>(token1: Syringe.IToken<T1>, token2: Syringe.IToken<T2>, token3: Syringe.IToken<T3>, token4: Syringe.IToken<T4>, token5: Syringe.IToken<T5>, token6: Syringe.IToken<T6>): IInjectDecorator<T1, T2, T3, T4, T5, T6, {}, {}>;
  export function Inject<T1, T2, T3, T4, T5, T6, T7>(token1: Syringe.IToken<T1>, token2: Syringe.IToken<T2>, token3: Syringe.IToken<T3>, token4: Syringe.IToken<T4>, token5: Syringe.IToken<T5>, token6: Syringe.IToken<T6>, token7: Syringe.IToken<T7>): IInjectDecorator<T1, T2, T3, T4, T5, T6, T7, {}>;
  export function Inject<T1, T2, T3, T4, T5, T6, T7, T8>(token1: Syringe.IToken<T1>, token2: Syringe.IToken<T2>, token3: Syringe.IToken<T3>, token4: Syringe.IToken<T4>, token5: Syringe.IToken<T5>, token6: Syringe.IToken<T6>, token7: Syringe.IToken<T7>, token8: Syringe.IToken<T8>): IInjectDecorator<T1, T2, T3, T4, T5, T6, T7, T8>;
}