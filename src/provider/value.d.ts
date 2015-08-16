/// <reference path="../syringe.d.ts"/>

declare module 'syringe.ts/provider/value' {
	import {IProvider} from 'syringe.ts/provider/abstract';
	import {IToken} from 'syringe.ts/token';
	
	export class ValueProvider<T> implements IProvider<T> {
		public dependencyTokens: IToken<any>[];
		
		constructor(value: T);
		
		get(...dependencies: any[]): Promise<T>;
	}
}