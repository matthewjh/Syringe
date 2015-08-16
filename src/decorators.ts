/// <reference path="../definitions/definitions.d.ts"/>
/// <reference path="./syringe.d.ts"/>

import {IToken} from 'syringe.ts/token';

interface IStaticThatMaybeHasTokens<T, T1, T2, T3, T4, T5, T6, T7, T8> extends Syringe.IStaticWithArgs<T, T1, T2, T3, T4, T5, T6, T7, T8> {
  ___tokens?: IToken<any>[];
}

interface IInjectDecorator<T1, T2, T3, T4, T5, T6, T7, T8> {
    (Class: IStaticThatMaybeHasTokens<any, T1, T2, T3, T4, T5, T6, T7, T8>): IStaticThatMaybeHasTokens<any, T1, T2, T3, T4, T5, T6, T7, T8>; 
}


export function Inject<T1, T2, T3, T4, T5, T6, T7, T8>(...dependencyTokens: IToken<any>[]): IInjectDecorator<T1, T2, T3, T4, T5, T6, T7, T8> {
  return (Class: IStaticThatMaybeHasTokens<any, T1, T2, T3, T4, T5, T6, T7, T8>) => {
    
     Object.defineProperty(Class, '___tokens', {
       enumerable: false,
       value: dependencyTokens
     });
     
     return Class;
  };
}