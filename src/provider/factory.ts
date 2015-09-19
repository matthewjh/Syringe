import {IToken} from '../token';
import {IProvider} from './abstract'

/**
 * Provider that gets values by invoking a factory function.
 */
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

/**
 * Provider that gets a Promise for values by invoking a factory function.
 */
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