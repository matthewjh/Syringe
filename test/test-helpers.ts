/// <reference path="../definitions/definitions.d.ts"/>
/// <reference path="../definitions/api.d.ts"/>

export function envSupportsFunctionName(): boolean {
	function namedFunction() {}
	
	return !!namedFunction.name;
}