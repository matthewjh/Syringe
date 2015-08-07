/// <reference path="../definitions/definitions.d.ts"/>
/// <reference path="../definitions/api.d.ts"/>

export function Inject<T1, T2, T3, T4>(...dependencyTokens: Syringe.IToken<any>[]): Syringe.Decorators.IInjectDecorator<T1, T2, T3, T4> {
  return (Class: Syringe.Internal.StaticWithArgs<any, T1, T2, T3>) => {
     let annotatedClass = <Syringe.IAnnotatedWithTokens<T1, T2, T3>>Class;
     annotatedClass.___tokens = dependencyTokens;
     
     return annotatedClass;
  };
}