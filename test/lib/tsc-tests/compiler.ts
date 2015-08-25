///<reference path="../../../node_modules/typescript/lib/typescript.d.ts"/>

import * as ts from 'typescript';

export interface IDiagnostic {
	message: string;
	line: number;
	character: number;
}

export interface ICompilerResult {
	emitSkipped: boolean;
	diagnostics: IDiagnostic[];
}

export interface ICompiler {
	compile(fileNames: string[], compilerOptions: ts.CompilerOptions): ICompilerResult;
}

export class Compiler implements ICompiler {
	compile(fileNames: string[], compilerOptions: ts.CompilerOptions): ICompilerResult {
		let program = ts.createProgram(fileNames, compilerOptions);
		let emitResult = program.emit();
		let allDiagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);
		
		let wrappedDiagnostics = allDiagnostics.map(d => {
			let position = d.file.getLineAndCharacterOfPosition(d.start);
			
			return {
				message: ts.flattenDiagnosticMessageText(d.messageText, '\n'),
				character: position.character,
				line: position.line
			};
		});
		
		return {
			emitSkipped: emitResult.emitSkipped,
			diagnostics: wrappedDiagnostics
		}
	}
}