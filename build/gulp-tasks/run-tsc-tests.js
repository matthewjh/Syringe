var gulp = require('gulp');

module.exports = function () {
	var testLibModule = require('../../built/test/lib/tsc-tests/facade');
	
	var testRunner = new testLibModule.TestRunner();
	var test = new testLibModule.Test('/Users/mattewhill/Documents/Personal/Syringe/test/tsc-tests/test.ts');
	
	var result = testRunner.runTests([test]);
	
	if (result.testsPassed) {
		process.exit(0);
	} else {
		process.exit(1);
	}
};