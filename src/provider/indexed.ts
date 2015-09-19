import {IToken} from '../token';
import {IProvider} from './abstract';

/**
 * Provider that wraps another provider but indexes the dependency tokens
 * within the context of an Injector.
 */
export class IndexedProvider<T> implements IProvider<T> {
  public dependencyTokens: IToken<any>[];
  public dependencyIndices: number[];
  
  private _provider: IProvider<T>; 
  
  constructor(provider: IProvider<T>, getIndexForToken: (token: IToken<any>) => number) {
    this._provider = provider;
    this.dependencyTokens = provider.dependencyTokens;
    this.dependencyIndices = provider.dependencyTokens.map(token => getIndexForToken(token));
  }
  
  get(dependencies: any[]): Promise<T> {
    return this._provider.get(dependencies);
  }
}