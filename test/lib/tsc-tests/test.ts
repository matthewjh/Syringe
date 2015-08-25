///<reference path="../../../node_modules/typescript/lib/typescript.d.ts"/>

import {ICompiler, Compiler, ICompilerResult} from './compiler';
import {ModuleKind} from 'typescript';
import * as fs from 'fs';

import deepEqual = require('deep-equal');

export interface ITestResult {
	isPass: boolean;
	expected: ICompilerResult,
	actual: ICompilerResult
}

export interface ITest {
	filePath: string;
	
	run(): ITestResult;
}

export class Test implements ITest {
	private _compiler: ICompiler;
	
	constructor(public filePath: string) {
		this._compiler = new Compiler();
	}
	
	run(): ITestResult {
		let compileResult = this._compiler.compile([this.filePath], {
			module: ModuleKind.CommonJS,
			experimentalDecorators: true,
			noEmit: true
		});
		let expectedResult = this._getExpectedCompileResult();
		let isPass = this._isPass(expectedResult, compileResult);
		
		return {
			isPass: isPass,
			expected: expectedResult,
			actual: compileResult
		};
	}
	
	private _getExpectedCompileResult(): ICompilerResult {
		let expectedFilePath = this.filePath.replace(/\.ts$/, '.expected.json');
		
		if (!fs.existsSync(expectedFilePath)) {
			throw new Error(`No "expected.json" file exists for "${this.filePath}". Please create one.`);	
		}
		
		let expectedResultString = fs.readFileSync(expectedFilePath, {
			encoding: 'utf-8'
		});
		let expectedResult = JSON.parse(expectedResultString);
		
		return expectedResult;
	}
	
	private _isPass(expected: ICompilerResult, actual: ICompilerResult): boolean {
		for (let expectedPropName in expected) {
			if (!deepEqual(expected[expectedPropName], actual[expectedPropName])) {
				return false;
			}
		}
		
		return true;
	}
}