/// <reference path="../../definitions/definitions.d.ts"/>
/// <reference path="../../definitions/api.d.ts"/>

export class IndexedProvider<T> implements Syringe.Provider.IProvider<T> {
  public dependencyTokens: Syringe.IToken<any>[];
  public dependencyIndices: number[];
  
  private _provider: Syringe.Provider.IProvider<T>; 
  
  constructor(provider: Syringe.Provider.IProvider<T>, getIndexForToken: (token: Syringe.IToken<any>) => number) {
    this._provider = provider;
    this.dependencyTokens = provider.dependencyTokens;
    this.dependencyIndices = provider.dependencyTokens.map(token => getIndexForToken(token));
  }
  
  get(dependencies: any[]): Promise<T> {
    return this._provider.get(dependencies);
  }
}