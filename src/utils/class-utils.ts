/*
 * Instantiate a class with the given arguments. Works for both pseudo classes and native es6 classes.
 */
export function instantiateClass<T>(Clazz: { new(...args: any[]): T }, args: any[]): T {
  return require('./class-utils-impl/instantiate-class')(Clazz, args);
}
