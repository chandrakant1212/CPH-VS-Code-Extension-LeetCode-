const fs = require('fs');
const path = require('path');
const vscode = require('vscode');
const { exec } = require('child_process');
const LcService = require('./LcService');

class LcHandler {
    constructor() {
        this.wsFolders = vscode.workspace.workspaceFolders;
        if (!this.wsFolders) {
            vscode.window.showErrorMessage('No workspace folder found');
            return;
        }
        this.wsRoot = this.wsFolders[0].uri.fsPath;
    }

    async fetchTestCases(slug, lang) {
        if (!this.wsRoot) return;

        const lcService = new LcService();
        try {
            const probDetails = await lcService.getDetails(slug);
            const tests = lcService.extractTests(probDetails);
            const testsDir = path.join(this.wsRoot, `${slug}_tests`);

            if (!fs.existsSync(testsDir)) fs.mkdirSync(testsDir);

            tests.forEach((test, idx) => {
                const inputPath = path.join(testsDir, `input_${idx + 1}.txt`);
                const outputPath = path.join(testsDir, `output_${idx + 1}.txt`);
                fs.writeFileSync(inputPath, test.input);
                fs.writeFileSync(outputPath, test.output);
            });

            const testsJsonPath = path.join(testsDir, `${slug}_tests.json`);
            fs.writeFileSync(testsJsonPath, JSON.stringify(tests, null, 2));
            vscode.window.showInformationMessage(`Tests saved to ${testsDir}`);
        } catch (err) {
            vscode.window.showErrorMessage(`Failed to fetch tests: ${err.message}`);
        }
    }

    async runTestCases(slug, lang) {
        if (!this.wsRoot) {
            console.log('No workspace root found');
            return;
        }

        console.log(`Running tests for ${slug} in ${lang}`);
        console.log(`Workspace root: ${this.wsRoot}`);

        const solPath = path.join(this.wsRoot, `solution.${lang === 'cpp' ? 'cpp' : 'py'}`);
        console.log(`Looking for solution file at: ${solPath}`);

        if (!fs.existsSync(solPath)) {
            console.log(`Solution file not found at: ${solPath}`);
            vscode.window.showErrorMessage(`Solution file not found: ${solPath}`);
            return;
        }

        const testsDir = path.join(this.wsRoot, `${slug}_tests`);
        console.log(`Looking for tests in: ${testsDir}`);

        if (!fs.existsSync(testsDir)) {
            console.log(`Tests directory not found: ${testsDir}`);
            vscode.window.showErrorMessage(`Tests directory not found: ${testsDir}`);
            return;
        }

        const solCode = fs.readFileSync(solPath, 'utf8');
        console.log('Solution code loaded successfully');
        const results = [];
        const inputFiles = fs.readdirSync(testsDir).filter(file => file.startsWith('input_'));

        for (const inputFile of inputFiles) {
            const testCaseNum = inputFile.match(/input_(\d+)\.txt/)[1];
            const inputPath = path.join(testsDir, inputFile);
            const outputPath = path.join(testsDir, `output_${testCaseNum}.txt`);

            try {
                const input = fs.readFileSync(inputPath, 'utf8');
                const expectedOutput = fs.readFileSync(outputPath, 'utf8').trim();
                const userOutput = await this.runCode(solCode, input, lang);
                const passed = userOutput === expectedOutput;

                results.push({
                    testCaseNum,
                    passed,
                    userOutput,
                    expectedOutput
                });
            } catch (err) {
                const expectedOutput = fs.readFileSync(outputPath, 'utf8').trim();
                results.push({
                    testCaseNum,
                    passed: false,
                    userOutput: err.toString(),
                    expectedOutput
                });
            }
        }

        this.showTestResults(results);
    }

    async runCode(solCode, input, lang) {
        const tempInputPath = path.join(this.wsRoot, 'input.txt');
        const tempOutputPath = path.join(this.wsRoot, 'output.txt');

        const arrayMatch = input.match(/\[(.*?)\]/);
        const targetMatch = input.match(/\d+$/);
        const formattedInput = `[${arrayMatch[1]}]\n${targetMatch[0]}`;
        fs.writeFileSync(tempInputPath, formattedInput);
        console.log(`Formatted input for ${lang}: ${formattedInput}`);

        return new Promise((resolve, reject) => {
            if (lang === 'cpp') {
                const tempCppPath = path.join(this.wsRoot, 'solution.cpp');
                const tempExePath = path.join(this.wsRoot, 'solution.exe');
                fs.writeFileSync(tempCppPath, solCode);

                exec(`g++ "${tempCppPath}" -o "${tempExePath}" -std=c++17`, (compileError, stdout, stderr) => {
                    if (compileError) {
                        console.error('C++ compilation error:', stderr);
                        reject(`Compilation error: ${stderr}`);
                        return;
                    }

                    exec(`"${tempExePath}" < "${tempInputPath}" > "${tempOutputPath}"`, (runError, stdout, stderr) => {
                        if (runError) {
                            console.error('C++ runtime error:', stderr);
                            reject(`Runtime error: ${stderr}`);
                            return;
                        }

                        try {
                            const userOutput = fs.readFileSync(tempOutputPath, 'utf8').trim();
                            console.log(`C++ output: ${userOutput}`);
                            resolve(userOutput);
                        } catch (err) {
                            reject(`Output reading error: ${err.message}`);
                        }
                    });
                });
            } else if (lang === 'py') {
                const tempPyPath = path.join(this.wsRoot, 'solution.py');
                fs.writeFileSync(tempPyPath, solCode);

                exec(`python "${tempPyPath}" < "${tempInputPath}" > "${tempOutputPath}"`, (runError, stdout, stderr) => {
                    if (runError) {
                        reject(`Runtime error: ${stderr}`);
                        return;
                    }
                    const userOutput = fs.readFileSync(tempOutputPath, 'utf8').trim();
                    resolve(userOutput);
                });
            }
        });
    }

    showTestResults(results) {
        const panel = vscode.window.createWebviewPanel(
            'testResults',
            'LeetCode Test Results',
            vscode.ViewColumn.Two,
            { enableScripts: true }
        );

        const totalTests = results.length;
        const passedTests = results.filter(r => r.passed).length;

        panel.webview.html = `
            <!DOCTYPE html>
            <!DOCTYPE html>
<html>
<head>
    <style>
        :root {
            --success-color: rgb(72, 187, 120);
            --error-color: rgb(239, 83, 80);
            --border-color: rgb(70, 70, 70);
            --header-bg: rgb(48, 50, 54);
            --text-color: rgb(201, 209, 217);
            --body-bg: rgb(30, 32, 34);
            --output-bg: rgb(40, 42, 46);
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            padding: 20px;
            max-width: 800px;
            margin: 0 auto;
            background: var(--body-bg);
            color: var(--text-color);
        }
        .summary {
            display: flex;
            justify-content: space-between;
            padding: 15px;
            background: var(--header-bg);
            border-radius: 8px;
            margin-bottom: 20px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
        }
        .summary-item {
            text-align: center;
        }
        .summary-label {
            font-size: 0.9em;
            color: var(--text-color);
        }
        .summary-value {
            font-size: 1.5em;
            font-weight: 600;
            color: var(--text-color);
        }
        .test-case {
            margin-bottom: 20px;
            border: 1px solid var(--border-color);
            border-radius: 8px;
            overflow: hidden;
        }
        .test-header {
            padding: 12px 15px;
            background: var(--header-bg);
            border-bottom: 1px solid var(--border-color);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .test-status {
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.85em;
            font-weight: 500;
        }
        .status-passed {
            background: rgba(72, 187, 120, 0.2);
            color: var(--success-color);
        }
        .status-failed {
            background: rgba(239, 83, 80, 0.2);
            color: var(--error-color);
        }
        .test-body {
            padding: 15px;
        }
        .output-section {
            font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
            font-size: 0.9em;
            line-height: 1.5;
        }
        .output-value {
            padding: 8px;
            background: var(--output-bg);
            border-radius: 4px;
            word-break: break-all;
            color: var(--text-color);
        }
        .testcase {
            color: var(--text-color);
        }
    </style>
</head>
<body>
    <div class="summary">
        <div class="summary-item">
            <div class="summary-label">Total Tests</div>
            <div class="summary-value">${totalTests}</div>
        </div>
        <div class="summary-item">
            <div class="summary-label">Passed</div>
            <div class="summary-value" style="color: var(--success-color)">${passedTests}</div>
        </div>
        <div class="summary-item">
            <div class="summary-label">Failed</div>
            <div class="summary-value" style="color: var(--error-color)">${totalTests - passedTests}</div>
        </div>
    </div>
    ${results.map(result => `
        <div class="test-case">
            <div class="test-header">
                <span class="testcase">Test Case ${result.testCaseNum}</span>
                <span class="test-status ${result.passed ? 'status-passed' : 'status-failed'}">
                    ${result.passed ? 'PASSED' : 'FAILED'}
                </span>
            </div>
            <div class="test-body">
                <div class="output-section">
                    <div class="output-label">Expected Output</div>
                    <div class="output-value">${result.expectedOutput}</div>
                    <div class="output-label" style="margin-top: 10px">Actual Output</div>
                    <div class="output-value">${result.userOutput}</div>
                </div>
            </div>
        </div>
    `).join('')}
</body>
</html>

        `;
    }
}

module.exports = LcHandler;
