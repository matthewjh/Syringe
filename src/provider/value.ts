/// <reference path="../../definitions/definitions.d.ts"/>
/// <reference path="../syringe.d.ts"/>

import 'es6-promise';

import {IToken} from 'syringe.ts/token';
import {IProvider} from 'syringe.ts/provider/abstract';

export class ValueProvider<T> implements IProvider<T> {
  public dependencyTokens: IToken<any>[];
  
  private _value: T; 
  
  constructor(value: T) {
    this.dependencyTokens = [];
    this._value = value;
  }
  
  get(...dependencies: any[]): Promise<T> {
    return Promise.resolve(this._value);
  }
}