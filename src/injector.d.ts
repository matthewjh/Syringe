/// <reference path="./syringe.d.ts"/>

declare module 'syringe.ts/injector' {
	import {IToken} from 'syringe.ts/token';
	import {IBinding} from 'syringe.ts/binding';
	
	export interface IInjector {
		get<T>(token: IToken<T>): Promise<T>;
	}
	
	export class Injector implements IInjector {
		constructor(bindings: IBinding<any>[], parent?: IInjector);
		get<T>(token: IToken<T>): Promise<T>;
	}
}