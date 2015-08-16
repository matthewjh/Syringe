/// <reference path="./syringe.d.ts"/>

declare module 'syringe.ts/lazy' {
	export interface ILazy<T> {
		get(): Promise<T>;
	}
}