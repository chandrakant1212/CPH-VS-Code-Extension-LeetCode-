
# CodeCracker Extension (CPH - Competitive Programming Helper)

**CodeCracker** is a Visual Studio Code extension designed to assist competitive programmers in solving problems on LeetCode by automatically fetching test cases and validating solutions. This extension simplifies the process of fetching problem statements, generating test cases, and running solutions locally against those test cases. It provides support for languages like Python and C++ while enabling seamless integration with LeetCode for efficient problem-solving workflows.

---

## Key Features

### 1. **Problem URL Fetching**
   - Fetch problem details directly by typing a LeetCode problem Name.
   - Automatically scrape test cases, inputs, and expected outputs from the problem description.
   - Supports problems with multiple test cases and formats them for local testing.
   
### 2. **Test Case Storage**
   - Test cases are saved locally in a structured format, including:
     - **Input Files**: `input_1.txt`, `input_2.txt`, etc.
     - **Output Files**: `output_1.txt`, `output_2.txt`, etc.
   - This allows for local testing and debugging without needing to manually copy inputs or expected outputs.
   - ![preview](codecraker.png)

   
### 3. **Code Execution**
   - Write your solution in any of the supported languages (C++ or Python).
   - Run your code against the fetched test cases with a single command (`CPH: Run Test Cases`).
   - Automatically compares the actual output with expected output, and highlights discrepancies for debugging.

### 4. **Multi-Language Support**
   - **C++**:
     - Code is compiled using `g++` with customizable commands.
   - **Python**:
     - Python code is executed using the `python` command.
   - Users can configure language-specific compile and run commands for flexibility.

### 5. **No Code Submission**
   - The extension does not submit solutions to LeetCode. It focuses solely on local problem-solving, allowing users to test and debug solutions locally.
   
---

## Installation

### Prerequisites
1. **Node.js**: Ensure Node.js is installed on your system. You can download it from [Node.js Official Website](https://nodejs.org/).
2. **Visual Studio Code**: Download and install VS Code if not already installed. [Get it here](https://code.visualstudio.com/).

### Steps to Install
1. Clone the repository:
   ```bash
   git clone https://github.com/chandrakant1212/cph.git
   ```
2. Navigate to the project directory:
   ```bash
   cd cph
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Open the project in Visual Studio Code:
   ```bash
   code .
   ```
5. Launch the extension:
   - Press `F5` to open a new window with the extension activated.

---

## Usage

### Fetching Test Cases from LeetCode
1. Open the Command Palette in VS Code:
   - **Windows/Linux:** `Ctrl+Shift+P`
   - **MacOS:** `Cmd+Shift+P`
2. Run the command `CPH: Fetch Test Cases`.
3. Paste the LeetCode problem Name (e.g., `two-sum`, `3sum`).
4. The extension will scrape the test cases, saving them in `.txt` format locally for use.

### Running Test Cases Locally
1. Write your solution in either **C++** or **Python**.
2. Run the command `CPH: Run Test Cases`.
3. The extension will:
   - Execute your code against the saved test cases.
   - Compare the outputs and display the results, highlighting discrepancies for easy debugging.

---

## API Details

### Problem URL Fetching
The extension uses LeetCode's public API to scrape test cases. Here's a breakdown of how the API integration works:

- **Endpoint**: 
  ```
  https://leetcode.com/api/problems/{problem_slug}/
  ```
  Replace `{problem_slug}` with the specific problem name (e.g., `two-sum`).

- **Data Fetched**:
  - Problem statement
  - Constraints
  - Sample test cases (input and expected output)

- **Test Case Storage**:
  - The input for each test case is saved in files like `input_1.txt`, `input_2.txt`, etc.
  - The expected output for each test case is saved in `output_1.txt`, `output_2.txt`, etc.

### Example of Test Case Fetching:
For problem `two-sum`, the API request would be:
```
https://leetcode.com/api/problems/two-sum/
```
The extension then processes the data, extracts the test cases, and stores them in `input_1.txt` and `output_1.txt`.

---

## Supported Languages

1. **C++**:
   - Code is compiled using `g++ -std=c++17 -o $fileNameWithoutExt $fileName`.
   - Test cases are executed against the compiled code using `./$fileNameWithoutExt`.
   
2. **Python**:
   - Python code is executed with the command `python $fileName`.

### Custom Compile and Run Configuration
You can customize compile and run commands in the VS Code settings.

For **C++**, you can specify the following configuration:
```json
{
  "cph.language.cpp.compile": "g++ -std=c++17 -o $fileNameWithoutExt $fileName",
  "cph.language.cpp.run": "./$fileNameWithoutExt"
}
```

For **Python**, you can specify the following configuration:
```json
{
  "cph.language.python.run": "python $fileName"
}
```

---

## No Code Submission
The extension is designed with a focus on testing solutions locally. **Code submission to LeetCode** is not supported, ensuring users can work offline without having to worry about submitting their solutions.

---

## Contributing

Contributions are welcome! To contribute:

1. Fork this repository.
2. Create a new branch for your feature or bug fix:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Description of changes"
   ```
4. Push to your branch:
   ```bash
   git push origin feature-name
   ```
5. Open a pull request.

---

## Troubleshooting

### Common Issues
1. **Problem URL not fetching test cases**:
   - Ensure the URL is correct and that the problem has publicly available test cases.
   - Check your internet connection.

2. **Test case files not generated**:
   - Verify that the problem description contains test cases in a readable format.
   - Check for any errors in the output pane of VS Code.

3. **Test case execution errors**:
   - Ensure the correct language configuration is set up for your solution.
   - Double-check the syntax of your code.

---

## License

This project is licensed under the MIT License. For more details, see the [LICENSE](LICENSE) file in the repository.

---

## Contact

For issues, feature requests, or contributions, feel free to reach out:

- **GitHub Issues**: [Create an Issue](https://github.com/chandrakant1212/cph/issues)
- **Maintainer**: Chandrakant

---

Enhance your competitive programming journey with **CodeCracker**! 🚀

## For more information

* [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
* [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

**Enjoy!**
