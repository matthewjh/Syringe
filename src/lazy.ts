import {IToken, Token} from './token';

export interface ILazy<T> {
	get(): Promise<T>;
}

export function Lazy<T>(token: IToken<T>): IToken<ILazy<T>> {
	if (!token['___lazyToken']) {
		token['___lazyToken'] = Token.create<ILazy<T>>(`Lazy(${token.getDebugName()})`);
	}
	
	return token['___lazyToken'];
}