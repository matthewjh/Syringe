/// <reference path="../../definitions/definitions.d.ts"/>
/// <reference path="../../definitions/api.d.ts"/>

import 'es6-promise';

export class FactoryProvider<T> implements Syringe.Provider.IProvider<T> {
  public dependencyTokens: Syringe.IToken<any>[];
  
  private _factory: (...deps: any[]) => T; 
  
  constructor(factory: (...deps: any[]) => T, dependencyTokens: Syringe.IToken<any>[]) {
    this.dependencyTokens = dependencyTokens;
    this._factory = factory;
  }
  
  get(dependencies: any[]): Promise<T> {
    return Promise.resolve(
      this._factory(...dependencies)
    );
  }
}

export class AsyncFactoryProvider<T> implements Syringe.Provider.IProvider<T> {
  public dependencyTokens: Syringe.IToken<any>[];
  
  private _factory: (...deps: any[]) => Promise<T>; 
  
  constructor(factory: (...deps: any[]) => Promise<T>, dependencyTokens: Syringe.IToken<any>[]) {
    this.dependencyTokens = dependencyTokens;
    this._factory = factory;
  }
  
  get(dependencies: any[]): Promise<T> {
    return this._factory(...dependencies);
  }
}