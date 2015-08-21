export function envSupportsFunctionName(): boolean {
	function namedFunction() {}
	
	return !!namedFunction.name;
}