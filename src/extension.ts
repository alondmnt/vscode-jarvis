import * as vscode from 'vscode';
import { do_research } from './research';

export function activate(context: vscode.ExtensionContext) {
	console.log('Jarvis is now active');

	let disposable = vscode.commands.registerCommand('jarvis.research', () => {
		// get selected text
		const editor = vscode.window.activeTextEditor;
		if (editor) {
			const selection = editor.selection;
			const text = editor.document.getText(selection);
      // replace selection with an empty string
      editor.edit(editBuilder => {
        editBuilder.replace(selection, '');
      });
			do_research(text);
		}
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}
