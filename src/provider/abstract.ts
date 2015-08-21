import {IToken} from '../token';

export interface IProvider<T> {
	dependencyTokens: IToken<any>[];
	get(dependencies: any[]): Promise<T>;
}