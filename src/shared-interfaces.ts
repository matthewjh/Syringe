export interface IStatic<T> {
  new (...args: any[]): T;
}

export interface IStaticWithNoArgs<T> {
  new (): T;
}

export interface IStaticWith1Arg<T, T1> { 
  new (dep1: T1): T; 
}

export interface IStaticWith2Args<T, T1, T2> { 
  new (dep1: T1, dep2: T2): T; 
}

export interface IStaticWith3Args<T, T1, T2, T3> { 
  new (dep1: T1, dep2: T2, dep3: T3): T; 
}

export interface IStaticWith4Args<T, T1, T2, T3, T4> { 
  new (dep1: T1, dep2: T2, dep3: T3, dep4: T4): T; 
}

export interface IStaticWith5Args<T, T1, T2, T3, T4, T5> { 
  new (dep1: T1, dep2: T2, dep3: T3, dep4: T4, dep5: T5): T; 
}

export interface IStaticWith6Args<T, T1, T2, T3, T4, T5, T6> { 
  new (dep1: T1, dep2: T2, dep3: T3, dep4: T4, dep5: T5, dep6: T6): T; 
}

export interface IStaticWith7Args<T, T1, T2, T3, T4, T5, T6, T7> { 
  new (dep1: T1, dep2: T2, dep3: T3, dep4: T4, dep5: T5, dep6: T6, dep7: T7): T; 
}

export interface IStaticWith8Args<T, T1, T2, T3, T4, T5, T6, T7, T8> { 
  new (dep1: T1, dep2: T2, dep3: T3, dep4: T4, dep5: T5, dep6: T6, dep7: T7, dep8: T8): T; 
}

export interface IStaticWithArgs<T, T1, T2, T3, T4, T5, T6, T7, T8> extends IStatic<T> {
  new (dep1: T1, dep2: T2, dep3: T3, dep4: T4, dep5: T5, dep6: T6, dep7: T7, dep8: T8): T;
}
