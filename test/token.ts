/// <reference path="../definitions/definitions.d.ts"/>
/// <reference path="../definitions/api.d.ts"/>

import 'es6-promise';

interface IToken<T>{}
class Token<T> implements IToken<T>{} 

function NamedToken(): PropertyDecorator {
	return (target, propertyKey) => {
		console.log(propertyKey);
	}
}

class OneToken extends Token<number> {}

bind(OneToken, 5)
bind(OneToken, '5');

function bind<T>(TokenClass: {new(): Token<T>}, value: T) {
	
}