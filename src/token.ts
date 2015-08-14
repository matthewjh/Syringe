/// <reference path="../definitions/definitions.d.ts"/>
/// <reference path="../definitions/api.d.ts"/>

export class Token<T> {
	surrogate: T;
}

function createInlineToken<T>(): Syringe.IToken<T> {
	// Until TypeScript allows class expressions
	
	function InlineToken() {
		Token.apply(this, arguments);
	}
	
	InlineToken.prototype = Object.create(Token.prototype);
	
	return <any>InlineToken;
}

export function Lazy<T>(token: Syringe.IToken<T>): Syringe.IToken<Syringe.ILazy<T>> {
	if (!token['___lazyToken']) {
		token['___lazyToken'] = createInlineToken<Syringe.ILazy<T>>();
	}
	
	return token['___lazyToken'];
}