/// <reference path="./syringe.d.ts"/>

declare module 'syringe.ts/index' {
	export {Injector} from 'syringe.ts/injector';
	export {IToken, Token, Lazy} from 'syringe.ts/token';
	export {ILazy} from 'syringe.ts/lazy';
	export {Inject} from 'syringe.ts/decorators';
	export {bind} from 'syringe.ts/binding';
}