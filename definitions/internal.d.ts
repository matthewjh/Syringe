declare module Syringe.Internal {
  interface Static<T> {
    new(...args: any[]): T;
  }
  
  interface StaticWithArgs<T, T1, T2, T3> extends Static<T> {
    new(dep1: T1, dep2: T2, dep3: T3): T;
  }
}