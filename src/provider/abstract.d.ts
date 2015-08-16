/// <reference path="../syringe.d.ts"/>

declare module 'syringe.ts/provider/abstract' {
	import {IToken} from 'syringe.ts/token';
	
	export interface IProvider<T> {
      dependencyTokens: IToken<any>[];
      get(dependencies: any[]): Promise<T>;
    }
}