/// <reference path="../../definitions/definitions.d.ts"/>
/// <reference path="../syringe.d.ts"/>

import 'es6-promise';

import {IToken} from 'syringe.ts/token';
import {IProvider} from 'syringe.ts/provider/abstract';
import {IStaticThatMaybeHasTokens} from 'syringe.ts/decorators';

export class ClassProvider<T> implements IProvider<T> {
  public dependencyTokens: IToken<any>[];
  
  private _Class: Syringe.IStatic<T>;
  
  constructor(Class: IStaticThatMaybeHasTokens<any, any, any, any, any, any, any, any, any>, dependencyTokens: IToken<any>[]) {
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