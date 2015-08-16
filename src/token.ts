/// <reference path="../definitions/definitions.d.ts"/>
/// <reference path="../definitions/api.d.ts"/>

// For envs that lack Function#name
const FALLBACK_TOKEN_DEBUG_NAME = 'Token';

export class Token<T> {
	surrogate: T;
	
	constructor() {
		throw new Error(`Do not instantiate Token directly. Instead create tokens by subclassing or by using Token.create`);
	}
	
	static getDebugName(): string {		
		return this.name || FALLBACK_TOKEN_DEBUG_NAME;
	}
	
	static create<T>(debugName = FALLBACK_TOKEN_DEBUG_NAME): Syringe.IToken<T> {
		return createInlineToken<T>(debugName);
	}
}

function createInlineToken<T>(debugName): Syringe.IToken<T> {
	// Until TypeScript allows class expressions
	
	function InlineToken() {
		Token.apply(this, arguments);
	}
	
	InlineToken.prototype = Object.create(Token.prototype);
	InlineToken['getDebugName'] = () => debugName; 
	
	return <any>InlineToken;
}

export function Lazy<T>(token: Syringe.IToken<T>): Syringe.IToken<Syringe.ILazy<T>> {
	if (!token['___lazyToken']) {
		token['___lazyToken'] = Token.create<Syringe.ILazy<T>>(`Lazy(${token.getDebugName()})`);
	}
	
	return token['___lazyToken'];
}