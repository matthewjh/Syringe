var glob = require('glob');

module.exports = function () {
	var testLibModule = require('../../built/test/lib/tsc-tests/facade');
	var testRunner = new testLibModule.TestRunner();
	var testFilePaths = glob.sync('test/tsc-tests/**/*.ts');
	var tests = testFilePaths.map(function (p) {
		return new testLibModule.Test(p);
	});
	var result = testRunner.runTests(tests);
	
	if (result.testsPassed) {
		process.exit(0);
	} else {
		process.exit(1);
	}
};
