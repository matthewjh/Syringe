/// <reference path="./syringe.d.ts"/>

declare module 'syringe.ts/token' {
	import {ILazy} from 'syringe.ts/lazy';
	
    export interface IToken<T> {
		new(): Token<T>;
		getDebugName(): string;
	}
	
	class Token<T> {
		constructor();
		
		static getDebugName(): string;
		static create<T>(debugName?: string): IToken<T>;
	}
	
	export function Lazy<T>(token: IToken<T>): IToken<ILazy<T>>;
}