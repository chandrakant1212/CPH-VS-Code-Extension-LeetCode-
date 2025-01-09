// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const axios = require('axios');
const xmlParser = require('fast-xml-parser');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
async function activate(context) {
    try {
        const res = await axios.get("https://alfa-leetcode-api.onrender.com/");
        
        // Log parsed data (assuming XML format)
        if (xmlParser.validate(res.data)) {
            const parsedData = xmlParser.parse(res.data);
            console.log("Parsed API Response:", parsedData);
        } else {
            console.error("Invalid XML response from the API.");
        }
    } catch (error) {
        console.error("Error fetching data from the API:", error.message);
    }

    // Use the console to output diagnostic information
    console.log('Congratulations, your extension "codecracker" is now active!');

    // Register the command
    const disposable = vscode.commands.registerCommand('codecracker.helloWorld', function () {
        vscode.window.showInformationMessage('Hello World from CodeCracker!');
    });

    context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
function deactivate() {
    console.log('CodeCracker extension deactivated!');
}

module.exports = {
    activate,
    deactivate
};
