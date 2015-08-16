/// <reference path="../syringe.d.ts"/>

declare module 'syringe.ts/provider/class' {
	import {IProvider} from 'syringe.ts/provider/abstract';
	import {IToken} from 'syringe.ts/token';
	import {IStaticThatMaybeHasTokens} from 'syringe.ts/decorators';
	
	export class ClassProvider<T> implements IProvider<T> {
		dependencyTokens: IToken<any>[];
		
		constructor(Class: IStaticThatMaybeHasTokens<any, any, any, any, any, any, any, any, any>, dependencyTokens: IToken<any>[]);
		
		get(dependencies: any[]): Promise<T>;
	}
}