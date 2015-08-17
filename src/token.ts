/// <reference path="../definitions/definitions.d.ts"/>

import {IToken} from './token';
import {ILazy} from './lazy';

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