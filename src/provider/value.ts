/// <reference path="../../definitions/definitions.d.ts"/>
/// <reference path="../../definitions/api.d.ts"/>

import 'es6-promise';

export class ValueProvider<T> implements Syringe.Provider.IProvider<T> {
  public dependencyTokens: Syringe.IToken<any>[];
  
  private _value: T; 
  
  constructor(value: T) {
    this.dependencyTokens = [];
    this._value = value;
  }
  
  get(...dependencies: any[]): Promise<T> {
    return Promise.resolve(this._value);
  }
}