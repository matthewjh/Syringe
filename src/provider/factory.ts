/// <reference path="../../definitions/definitions.d.ts"/>
/// <reference path="../syringe.d.ts"/>

import 'es6-promise';

import {IToken} from 'syringe.ts/token';
import {IProvider} from 'syringe.ts/provider/abstract'

export class FactoryProvider<T> implements IProvider<T> {
  public dependencyTokens: IToken<any>[];
  
  private _factory: (...deps: any[]) => T; 
  
  constructor(factory: (...deps: any[]) => T, dependencyTokens: IToken<any>[]) {
    this.dependencyTokens = dependencyTokens;
    this._factory = factory;
  }
  
  get(dependencies: any[]): Promise<T> {
    return Promise.resolve(
      this._factory(...dependencies)
    );
  }
}

export class AsyncFactoryProvider<T> implements IProvider<T> {
  public dependencyTokens: IToken<any>[];
  
  private _factory: (...deps: any[]) => Thenable<T>; 
  
  constructor(factory: (...deps: any[]) => Thenable<T>, dependencyTokens: IToken<any>[]) {
    this.dependencyTokens = dependencyTokens;
    this._factory = factory;
  }
  
  get(dependencies: any[]): Promise<T> {
    return Promise.resolve(this._factory(...dependencies));
  }
}