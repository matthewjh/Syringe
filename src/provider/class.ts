/// <reference path="../../definitions/definitions.d.ts"/>
/// <reference path="../../definitions/api.d.ts"/>

import 'es6-promise';

export class ClassProvider<T> implements Syringe.Provider.IProvider<T> {
  public dependencyTokens: Syringe.IToken<any>[];
  
  private _Class: Syringe.Internal.Static<T>;
  
  constructor(Class: Syringe.Internal.Static<T>, dependencyTokens: Syringe.IToken<any>[]) {
    this.dependencyTokens = dependencyTokens;
    this._Class = Class;
  }
  
  get(dependencies: any[]): Promise<T> {
    var object = Object.create(this._Class.prototype);
    this._Class.apply(object, dependencies);
    
    return Promise.resolve(object);
  }
}