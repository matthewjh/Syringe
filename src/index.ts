/// <reference path="../definitions/api.d.ts"/>

import {bind as _bind} from './binding';
import {Injector as _Injector} from './injector';
import {Token as _Token} from './token';
import {Inject as _Inject} from './decorators';

export var bind: typeof Syringe.bind = _bind;
export var Injector: Syringe.IInjectorStatic = _Injector;
export var Inject: typeof Syringe.Inject = _Inject;
export var Token: Syringe.ITokenStatic = _Token;