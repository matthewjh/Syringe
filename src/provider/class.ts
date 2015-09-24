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
    let instance = this._instantiate(dependencies);

    return Promise.resolve(instance);
  }

  private _instantiate(a: any[]): T {

    // we have to use `new` here to support es6 native classes
    switch (a.length) {
      case 0: return new this._Class();
      case 1: return new this._Class(a[0]);
      case 2: return new this._Class(a[0], a[1]);
      case 3: return new this._Class(a[0], a[1], a[2]);
      case 4: return new this._Class(a[0], a[1], a[2], a[3]);
      case 5: return new this._Class(a[0], a[1], a[2], a[3], a[4]);
      case 6: return new this._Class(a[0], a[1], a[2], a[3], a[4], a[5]);
      case 7: return new this._Class(a[0], a[1], a[2], a[3], a[4], a[5], a[6]);
      case 8: return new this._Class(a[0], a[1], a[2], a[3], a[4], a[5], a[6], a[7]);
      case 9: return new this._Class(a[0], a[1], a[2], a[3], a[4], a[5], a[6], a[7], a[8]);
      case 10: return new this._Class(a[0], a[1], a[2], a[3], a[4], a[5], a[6], a[7], a[8], a[9]);
      case 11: return new this._Class(a[0], a[1], a[2], a[3], a[4], a[5], a[6], a[7], a[8], a[9], a[10]);
      case 12: return new this._Class(a[0], a[1], a[2], a[3], a[4], a[5], a[6], a[7], a[8], a[9], a[10], a[11]);
      case 13: return new this._Class(a[0], a[1], a[2], a[3], a[4], a[5], a[6], a[7], a[8], a[9], a[10], a[11], a[12]);
      case 14: return new this._Class(a[0], a[1], a[2], a[3], a[4], a[5], a[6], a[7], a[8], a[9], a[10], a[11], a[12], a[13]);
      case 15: return new this._Class(a[0], a[1], a[2], a[3], a[4], a[5], a[6], a[7], a[8], a[9], a[10], a[11], a[12], a[13], a[14]);
      case 16: return new this._Class(a[0], a[1], a[2], a[3], a[4], a[5], a[6], a[7], a[8], a[9], a[10], a[11], a[12], a[13], a[14], a[15]);
      case 17: return new this._Class(a[0], a[1], a[2], a[3], a[4], a[5], a[6], a[7], a[8], a[9], a[10], a[11], a[12], a[13], a[14], a[15], a[16]);
      case 18: return new this._Class(a[0], a[1], a[2], a[3], a[4], a[5], a[6], a[7], a[8], a[9], a[10], a[11], a[12], a[13], a[14], a[15], a[16], a[17]);
      case 19: return new this._Class(a[0], a[1], a[2], a[3], a[4], a[5], a[6], a[7], a[8], a[9], a[10], a[11], a[12], a[13], a[14], a[15], a[16], a[17], a[18]);
      case 20: return new this._Class(a[0], a[1], a[2], a[3], a[4], a[5], a[6], a[7], a[8], a[9], a[10], a[11], a[12], a[13], a[14], a[15], a[16], a[17], a[18], a[19]);
      default: throw new Error('Ooops! At present only classes with <=20 parameters are supported by bind(..).toClass(..). Please open an issue on GitHub.');
    }

    return null;
  }
}
