/// <reference path="../../definitions/definitions.d.ts"/>
/// <reference path="../../definitions/api.d.ts"/>

import 'es6-promise';

export class ClassProvider<T> implements Syringe.Provider.IProvider<T> {
  public dependencyTokens: Syringe.IToken<any>[];
  
  private _Class: Syringe.IStatic<T>;
  
  constructor(Class: Syringe.IStaticThatMaybeHasTokens<any, any, any, any>, dependencyTokens: Syringe.IToken<any>[]) {
    this.dependencyTokens = dependencyTokens;
    
    if (Class.___tokens) {
      if (!(dependencyTokens && dependencyTokens.length)) {
        this.dependencyTokens = Class.___tokens;
      }
    }

    this._Class = Class;
  }
  
  get(dependencies: any[]): Promise<T> {
    var object = Object.create(this._Class.prototype);
    var returnedObject = this._Class.apply(object, dependencies);
    
    return Promise.resolve(typeof returnedObject === 'object' ? returnedObject : object);
  }
}