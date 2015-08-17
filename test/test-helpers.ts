/// <reference path="../definitions/definitions.d.ts"/>

export function envSupportsFunctionName(): boolean {
	function namedFunction() {}
	
	return !!namedFunction.name;
}