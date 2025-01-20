const vscode = require('vscode');
const LcHandler = require('./LCHandler');

function activate(ctx) {
    console.log('CPH LeetCode extension is now active!');

    const LeetCodeHandler = new LcHandler();

    let fetchCmd = vscode.commands.registerCommand(
        'cph.fetchLeetCodeTestCases',
        async () => {
            const lang = await vscode.window.showQuickPick(['cpp', 'py'], {
                placeHolder: 'Select the programming language'
            });
            if (!lang) {
                vscode.window.showErrorMessage('Language selection is required.');
                return;
            }

            const slug = await vscode.window.showInputBox({ prompt: 'Enter the LeetCode problem slug' });
            if (slug) {
                LeetCodeHandler.fetchTestCases(slug, lang);
            } else {
                vscode.window.showErrorMessage('Slug is required to fetch test cases.');
            }
        }
    );

    let runCmd = vscode.commands.registerCommand(
        'cph.runTestCases',
        async () => {
            const lang = await vscode.window.showQuickPick(['cpp', 'py'], {
                placeHolder: 'Select the programming language'
            });
            if (!lang) {
                vscode.window.showErrorMessage('Language selection is required.');
                return;
            }

            const slug = await vscode.window.showInputBox({ prompt: 'Enter the LeetCode problem slug' });
            if (slug) {
                LeetCodeHandler.runTestCases(slug, lang);
            } else {
                vscode.window.showErrorMessage('Slug is required to run test cases.');
            }
        }
    );

    let helloCmd = vscode.commands.registerCommand('cod.helloWorld', () => {
        vscode.window.showInformationMessage('Hello World from cph!');
    });

    ctx.subscriptions.push(fetchCmd, runCmd, helloCmd);
}

function deactivate() { }

module.exports = {
    activate,
    deactivate
};