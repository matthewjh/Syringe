import {IndexedProvider} from './provider/facade';
import {CyclicDependencyError, NoBoundTokenError} from './errors';
import {bind, IBinding} from './binding';
import {IToken} from './token';
import {Lazy} from './lazy';

interface IIndexLog extends Array<boolean> {
  [index: number]: (boolean | typeof undefined);
}

interface ICache extends Array<Promise<any>> {
  [index: number]: Promise<any>;
}

export interface IInjector {
	get<T>(token: IToken<T>): Promise<T>;
}

/**
 * An Injector resolves tokens to values via bindings.
 */
export class Injector implements IInjector {
  private _tokens: IToken<any>[];
  private _providers: IndexedProvider<any>[];
  private _parent: IInjector;
  private _cache: ICache;
  
  /**
   * @constructor
   * @param {IBinding<any>[]} bindings The array of bindings to load onto the injector
   * @param {IInjector} [parent] A parent for this injector, which will be delegated to for any tokens unbound on this injector
   */
  constructor(bindings: IBinding<any>[], parent?: IInjector) {
    this._tokens = [];
    this._providers = [];
    this._cache = [];
    this._parent = parent;

    this._ingestBindings([
      bindings,
      this._getLazyBindings(bindings)
    ]);
  }
  
  /**
   * Resolves a token to a Promise for a value.
   * @param {IToken<T>} token Token to get
   */
  public get<T>(token: IToken<T>): Promise<T> {
    let index = this._getIndexForToken(token);

    if (index !== -1) {
      return this._getByIndex(index);
    } else {
      return this._getFromParent(token);
    }
  }
  
  /**
   * Consult the injector's parent for a token if there is one, otherwise throw an exception.
   */
  private _getFromParent<T>(token: IToken<T>): Promise<T> {
    if (this._parent) {
      return this._parent.get(token);
    } else {
      let error = new NoBoundTokenError(token);

      return Promise.reject(error);
    }
  }
  
  /**
   * Get a Promise for a value by its index, consulting the cache first.
   */
  private _getByIndex<T>(index: number, indexLog: IIndexLog = [], tokenChain: IToken<any>[] = []): Promise<T> {
    let promise = this._cache[index];

    if (!promise) {
      promise = this._getByIndexLookup(index, indexLog, tokenChain);
      this._cache[index] = promise;
    }

    return promise;
  }
  
  /**
   * Get a Promise for a value by its index.
   */
  private _getByIndexLookup<T>(index: number, indexLog: IIndexLog, tokenChain: IToken<any>[]): Promise<T> {
    let token = this._tokens[index];
    let provider = this._providers[index];

    tokenChain.push(token);
    this._detectCycle(index, indexLog, tokenChain);
    indexLog[index] = true;

    let dependencyPromises = provider.dependencyIndices.map((depIndex, i) => {
      let maybeDecorating = this._parent && depIndex === index;

      if (depIndex === -1 || maybeDecorating) {
        let token = provider.dependencyTokens[i];

        return this._getFromParent(token);
      } else {
        let clonedIndexLog = indexLog.slice();
        let clonedTokenChain = tokenChain.slice();

        return this._getByIndex(depIndex, clonedIndexLog, tokenChain);
      }
    });

    return Promise.all(dependencyPromises).then(dependencies => {
      return provider.get(dependencies);
    });
  }

  private _getIndexForToken(token: IToken<any>): number {
    return this._tokens.indexOf(token);
  }
  
  /**
   * Install and index a collection of bindings.
   */
  private _ingestBindings(bindings: IBinding<any>[][]): void {
    let allBindings = [].concat(...bindings);

    this._tokens = allBindings.map(b => b.token);
    this._providers = allBindings.map(b => {
      return new IndexedProvider(b.provider, token => this._getIndexForToken(token))
    });
  }
  
  
  /**
   * Get a collection of lazy bindings for a given collection of bindings.
   */
  private _getLazyBindings(bindings: IBinding<any>[]): IBinding<any>[] {
    return bindings.map(b => bind(Lazy(b.token)).toValue({
      get: () => {
        return this.get(b.token);
      }
    }));
  }
  
  /**
   * Detect a cyclic dependency lookup, and if there is one, throw.
   */
  private _detectCycle(index: number, indexLog: IIndexLog, tokenChain: IToken<any>[]): void {
    if (indexLog[index]) {
      throw new CyclicDependencyError(tokenChain);
    }
  }
}
