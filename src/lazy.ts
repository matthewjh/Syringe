import {IToken, Token} from './token';

export interface ILazy<T> {
	get(): Promise<T>;
}

/**
 * Get the corresponding Lazy token for a given token.
 * @param {IToken<T>} token The non-lazy token
 */
export function Lazy<T>(token: IToken<T>): IToken<ILazy<T>> {
	if (!token['___lazyToken']) {
		token['___lazyToken'] = Token.create<ILazy<T>>(`Lazy(${token.getDebugName()})`);
	}
	
	return token['___lazyToken'];
}