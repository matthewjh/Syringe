/// <reference path="../definitions/definitions.d.ts"/>
/// <reference path="../definitions/api.d.ts"/>

export class Injector implements Syringe.IInjector {
  private _bindings: Syringe.Binding.IBinding<any>[];
  
  constructor(bindings: Syringe.Binding.IBinding<any>[]) {
    this._bindings = bindings;
  }
  
  get<T>(token: Syringe.IToken<T>): Promise<T> {
    var value: T;
    
    this._bindings.forEach(binding => {
      if (binding.token === token) {
        value = binding.value;
      }
    });
    
    if (!value) {
      return Promise.reject(new Error('No binding found for token ${token} on this Injector'));
    }
    
    return Promise.resolve(value);
  } 
}