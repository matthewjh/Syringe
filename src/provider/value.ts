import {IToken} from '../token';
import {IProvider} from './abstract';

/**
 * Provider that gets values by returning a constant value. 
 */
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