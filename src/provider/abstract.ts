import {IToken} from '../token';

/**
 * A provider is recipe for building a value that may have dependencies.
 */
export interface IProvider<T> {
	dependencyTokens: IToken<any>[];
	get(dependencies: any[]): Promise<T>;
}