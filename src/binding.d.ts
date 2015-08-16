/// <reference path="./syringe.d.ts"/>

declare module 'syringe.ts/binding' {
    import {IToken} from 'syringe.ts/token';
      
    export function bind<T>(token: IToken<T>): IUnprovidedBinding<T>;	
	
    export interface IBinding<T> { 
      token: IToken<T>;
      provider: Syringe.Provider.IProvider<T>
    } 
    
    export interface IUnprovidedBinding<T> {
      toValue(value: T): IBinding<T>;
      
      toClass(Class: Syringe.IStatic<T>): IBinding<T>;
      toClass<T1>(Class: Syringe.IStaticWithArgs<T, T1, {}, {}, {}, {}, {}, {}, {}>, token1: IToken<T1>): IBinding<T>;
      toClass<T1, T2>(Class: Syringe.IStaticWithArgs<T, T1, T2, {}, {}, {}, {}, {}, {}>, token1: IToken<T1>, token2: IToken<T2>): IBinding<T>;
      toClass<T1, T2, T3>(Class: Syringe.IStaticWithArgs<T, T1, T2, T3, {}, {}, {}, {}, {}>, token1: IToken<T1>, token2: IToken<T2>, token3: IToken<T3>): IBinding<T>;
      toClass<T1, T2, T3, T4>(Class: Syringe.IStaticWithArgs<T, T1, T2, T3, T4, {}, {}, {}, {}>, token1: IToken<T1>, token2: IToken<T2>, token3: IToken<T3>, token4: IToken<T4>): IBinding<T>;
      toClass<T1, T2, T3, T4, T5>(Class: Syringe.IStaticWithArgs<T, T1, T2, T3, T4, T5, {}, {}, {}>, token1: IToken<T1>, token2: IToken<T2>, token3: IToken<T3>, token4: IToken<T4>, token5: IToken<T5>): IBinding<T>;
      toClass<T1, T2, T3, T4, T5, T6>(Class: Syringe.IStaticWithArgs<T, T1, T2, T3, T4, T5, T6, {}, {}>, token1: IToken<T1>, token2: IToken<T2>, token3: IToken<T3>, token4: IToken<T4>, token5: IToken<T5>, token6: IToken<T6>): IBinding<T>;
      toClass<T1, T2, T3, T4, T5, T6, T7>(Class: Syringe.IStaticWithArgs<T, T1, T2, T3, T4, T5, T6, T7, {}>, token1: IToken<T1>, token2: IToken<T2>, token3: IToken<T3>, token4: IToken<T4>, token5: IToken<T5>, token6: IToken<T6>, token7: IToken<T7>): IBinding<T>;
      toClass<T1, T2, T3, T4, T5, T6, T7, T8>(Class: Syringe.IStaticWithArgs<T, T1, T2, T3, T4, T5, T6, T7, T8>, token1: IToken<T1>, token2: IToken<T2>, token3: IToken<T3>, token4: IToken<T4>, token5: IToken<T5>, token6: IToken<T6>, token7: IToken<T7>, token8: IToken<T8>): IBinding<T>;
      
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