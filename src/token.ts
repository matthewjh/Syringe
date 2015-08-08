/// <reference path="../definitions/definitions.d.ts"/>
/// <reference path="../definitions/api.d.ts"/>

export class Token<T> implements Syringe.IToken<T> {
  private _lazyToken: Syringe.IToken<Syringe.ILazy<T>>;
  
  get asLazy(): Syringe.IToken<Syringe.ILazy<T>> {
    if (!this._lazyToken) {
      this._lazyToken = new Token<Syringe.ILazy<T>>();
    }
    
    return this._lazyToken;
  }
}