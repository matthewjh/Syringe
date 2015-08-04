/// <reference path="../../definitions/definitions.d.ts"/>
/// <reference path="../../definitions/api.d.ts"/>

export class ValueProvider<T> implements Syringe.Provider.IProvider<T> {
  public dependencyTokens: Syringe.IToken<any>[];
  
  private value: T; 
  
  constructor(value: T) {
    this.value = value;
  }
  
  get(...dependencies: any[]): Promise<T> {
    return Promise.resolve(this.value);
  }
}