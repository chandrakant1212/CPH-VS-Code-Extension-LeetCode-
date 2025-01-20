#include <iostream>
#include <vector>
#include <algorithm>
#include <string>
using namespace std;

class Solution
{
public:
    vector<vector<int>> fourSum(vector<int> &nums, int target)
    {
        vector<vector<int>> result;
        int n = nums.size();

        if (n < 4)
            return result;

        // Sort the array to simplify duplicate handling and two-pointer approach
        sort(nums.begin(), nums.end());

        for (int i = 0; i < n - 3; i++)
        {
            // Skip duplicates for the first number
            if (i > 0 && nums[i] == nums[i - 1])
                continue;

            for (int j = i + 1; j < n - 2; j++)
            {
                // Skip duplicates for the second number
                if (j > i + 1 && nums[j] == nums[j - 1])
                    continue;

                int left = j + 1;
                int right = n - 1;

                while (left < right)
                {
                    long long sum = (long long)nums[i] + nums[j] + nums[left] + nums[right];

                    if (sum == target)
                    {
                        result.push_back({nums[i], nums[j], nums[left], nums[right]});

                        // Skip duplicates for the third and fourth numbers
                        while (left < right && nums[left] == nums[left + 1])
                            left++;
                        while (left < right && nums[right] == nums[right - 1])
                            right--;

                        left++;
                        right--;
                    }
                    else if (sum < target)
                    {
                        left++;
                    }
                    else
                    {
                        right--;
                    }
                }
            }
        }

        return result;
    }
};

// Function to parse input array from a string
vector<int> parseInput(string input)
{
    vector<int> nums;
    string temp = "";
    bool readingNumber = false;

    for (size_t i = 0; i < input.length(); i++)
    {
        if (input[i] == '[')
        {
            continue;
        }
        else if (isdigit(input[i]) || input[i] == '-')
        {
            temp += input[i];
            readingNumber = true;
        }
        else if ((input[i] == ',' || input[i] == ']') && readingNumber)
        {
            nums.push_back(stoi(temp));
            temp = "";
            readingNumber = false;
        }
    }
    return nums;
}

int main()
{
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    string input;
    int target;

    getline(cin, input);
    cin >> target;

    vector<int> nums = parseInput(input);
    Solution solution;
    vector<vector<int>> result = solution.fourSum(nums, target);

    cout << "[";
    for (size_t i = 0; i < result.size(); i++)
    {
        cout << "[";
        for (size_t j = 0; j < result[i].size(); j++)
        {
            cout << result[i][j];
            if (j < result[i].size() - 1)
                cout << ",";
        }
        cout << "]";
        if (i < result.size() - 1)
            cout << ",";
    }
    cout << "]";

    return 0;
}
