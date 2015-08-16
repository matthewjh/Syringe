/// <reference path="./syringe.d.ts"/>

declare module 'syringe.ts/index' {
	export {Injector} from 'syringe.ts/injector';
	export {Token, Lazy} from 'syringe.ts/token';
	export {Inject} from 'syringe.ts/decorators';
	export {bind} from 'syringe.ts/binding';
}