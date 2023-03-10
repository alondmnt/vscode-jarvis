/* eslint-disable @typescript-eslint/naming-convention */
import * as vscode from 'vscode';

export function replace_selection(text: string) {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      const selection = editor.selection;
      // replace selection in the editor with the citation
      editor.edit((editBuilder) => {
        editBuilder.replace(selection, text);
      });
    }
}
