/// <reference path="../syringe.d.ts"/>

declare module 'syringe.ts/provider/factory' {
	import {IProvider} from 'syringe.ts/provider/abstract';
	import {IToken} from 'syringe.ts/token';
	
	export class FactoryProvider<T> implements IProvider<T> {
		dependencyTokens: IToken<any>[];
		
		constructor(factory: (...deps: any[]) => T, dependencyTokens: IToken<any>[]);
		
		get(dependencies: any[]): Promise<T>;
	}
	
	export class AsyncFactoryProvider<T> implements IProvider<T> {
		dependencyTokens: IToken<any>[];
		
		constructor(factory: (...deps: any[]) => Thenable<T>, dependencyTokens: IToken<any>[]);
		
		get(dependencies: any[]): Promise<T>;
	}
}