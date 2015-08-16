/// <reference path="../definitions/definitions.d.ts"/>
/// <reference path="./syringe.d.ts"/>

import {IToken} from 'syringe.ts/token';
import {ILazy} from 'syringe.ts/lazy';

// For envs that lack Function#name
const FALLBACK_TOKEN_DEBUG_NAME = 'Token';

export interface IToken<T> {
	new(): Token<T>;
	getDebugName(): string;
}

export class Token<T> {
	surrogate: T;
	
	constructor() {
		throw new Error(`Do not instantiate Token directly. Instead create tokens by subclassing or by using Token.create`);
	}
	
	static getDebugName(): string {		
		return this.name || FALLBACK_TOKEN_DEBUG_NAME;
	}
	
	static create<T>(debugName = FALLBACK_TOKEN_DEBUG_NAME): IToken<T> {
		return createInlineToken<T>(debugName);
	}
}

function createInlineToken<T>(debugName): IToken<T> {
	// Until TypeScript allows class expressions
	
	function InlineToken() {
		Token.apply(this, arguments);
	}
	
	InlineToken.prototype = Object.create(Token.prototype);
	InlineToken['getDebugName'] = () => debugName; 
	
	return <any>InlineToken;
}

export function Lazy<T>(token: IToken<T>): IToken<ILazy<T>> {
	if (!token['___lazyToken']) {
		token['___lazyToken'] = Token.create<ILazy<T>>(`Lazy(${token.getDebugName()})`);
	}
	
	return token['___lazyToken'];
}