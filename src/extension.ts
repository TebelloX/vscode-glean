'use strict';

import * as vscode from 'vscode';
import { showDirectoryPicker } from './directories-picker';
import { showFilePicker } from './file-picker';
import { selectedText, openFile, showErrorMessage } from './editor';
import { appendTextToFile } from './file-system';


const appendSelectedTextToFile = absolutePath => {
  appendTextToFile(selectedText(), absolutePath);
  return absolutePath;
};

const handleError = e => {
  if (e) {
    showErrorMessage(e.message);
  }
};

export class CompleteActionProvider implements vscode.CodeActionProvider {
  public provideCodeActions(): Promise<vscode.Command[]> {
    return new Promise(resolve => resolve([
      {
        command: 'extension.extractToFile',
        title: 'Export to File'
      }
    ])
    );
  }
}

const TYPESCRIPT: vscode.DocumentFilter = { language: 'typescript' }

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(vscode.languages.registerCodeActionsProvider(TYPESCRIPT, new CompleteActionProvider()));

  const disposable = vscode.commands.registerCommand('extension.extractToFile', () => {

    var editor = vscode.window.activeTextEditor;
    if (!editor) {
      return; // No open text editor
    }



    showDirectoryPicker()
      .then(showFilePicker)
      .then(appendSelectedTextToFile)
      .then(openFile)
      .catch(handleError);
  });

}

// this method is called when your extension is deactivated
export function deactivate() {
}