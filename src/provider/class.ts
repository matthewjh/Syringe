import {IToken} from '../token';
import {IProvider} from './abstract';
import {IStaticThatMaybeHasTokens} from '../decorators';
import {IStatic} from '../shared-interfaces';

/**
 * Provider that gets values by constructing an instance of a class.
 */
export class ClassProvider<T> implements IProvider<T> {
  public dependencyTokens: IToken<any>[];
  
  private _Class: IStatic<T>;
  
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