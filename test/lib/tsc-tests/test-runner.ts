import {ITest, ITestResult, Test} from './test';

import colors = require('colors');

export interface ITestRunner {
	runTests(tests: ITest[]): ITestRunnerResult;
} 

export interface ITestRunnerResult {
	testsPassed: boolean;
}

export class TestRunner implements ITestRunner {
	runTests(tests: ITest[]): ITestRunnerResult {
		let testCount = tests.length;
		let testsPassed = true;
		
		tests.forEach((t, i) => {
			let result = t.run();
			let counter = `${i + 1}/${testCount}`;
			
			if (result.isPass) {
				console.log(colors.green(`PASS ${counter} [${t.filePath}]`)); 
			} else {
				testsPassed = false;
				console.log(colors.red(`FAIL ${counter} [${t.filePath}]: ${this.getTestFailureMessage(result)}`));
			}
		});
		
		return {
			testsPassed: testsPassed
		};
	}
	
	getTestFailureMessage(result: ITestResult): string {
		let formattedActual = JSON.stringify(result.actual, null, 2);
		let formattedExpected = JSON.stringify(result.expected, null, 2);
		let message = `
---------
Actual Test Result (${result.actualDiagnosticsCount}):
${colors.white(formattedActual)}

---------
Expected Test Result (${result.expectedDiagnosticsCount}):
${colors.white(formattedExpected)}
---------`;
		
		return message;
	}
}