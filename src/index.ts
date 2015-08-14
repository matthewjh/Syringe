/// <reference path="../definitions/api.d.ts"/>

import {bind as _bind} from './binding';
import {Injector as _Injector} from './injector';
import {Token as _Token, Lazy as _Lazy} from './token';
import {Inject as _Inject} from './decorators';

// Check assignability to public API types
let Token: typeof Syringe.Token = _Token;

export let Inject: typeof Syringe.Inject = _Inject;
export let Injector: Syringe.IInjectorStatic = _Injector;
export let bind: typeof Syringe.bind = _bind;
export let Lazy: typeof Syringe.Lazy = _Lazy;

export {Token} from './token';