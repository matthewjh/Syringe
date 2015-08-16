/// <reference path="../syringe.d.ts"/>

declare module 'syringe.ts/provider/indexed' {
	import {IProvider} from 'syringe.ts/provider/abstract';
	import {IToken} from 'syringe.ts/token';
	
	export class IndexedProvider<T> implements IProvider<T> {
		public dependencyTokens: IToken<any>[];
		public dependencyIndices: number[]; 
		
		constructor(provider: IProvider<T>, getIndexForToken: (token: IToken<any>) => number);
		
		get(dependencies: any[]): Promise<T>;
	}
}