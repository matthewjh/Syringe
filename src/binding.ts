/// <reference path="../definitions/definitions.d.ts"/>
/// <reference path="../definitions/api.d.ts"/>

class Binding<T> implements Syringe.Binding.IBinding<T> {
  public token: Syringe.IToken<T>;
  public value: T;
  
  constructor(token: Syringe.IToken<T>, value: T) {
    this.token = token;
    this.value = value;
  }
}

class PotentialBinding<T> implements Syringe.Binding.IPotentialBinding<T> {
  private _token: Syringe.IToken<T>;

  constructor(token: Syringe.IToken<T>) {
    this._token = token;
  }

  toValue(value: T): Binding<T> {
    return new Binding(this._token, value);
  }
}

export function bind<T>(token: Syringe.IToken<T>): Syringe.Binding.IPotentialBinding<T> {
  return new PotentialBinding<T>(token);
}