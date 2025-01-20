from typing import List

class Solution:
    def fourSum(self, nums: List[int], target: int) -> List[List[int]]:
        result = []
        n = len(nums)

        if n < 4:
            return result

        nums.sort()

        for i in range(n - 3):
          
            if i > 0 and nums[i] == nums[i - 1]:
                continue

            for j in range(i + 1, n - 2):
                
                if j > i + 1 and nums[j] == nums[j - 1]:
                    continue

                left = j + 1
                right = n - 1

                while left < right:
                    current_sum = nums[i] + nums[j] + nums[left] + nums[right]

                    if current_sum == target:
                        result.append([nums[i], nums[j], nums[left], nums[right]])

                       
                        while left < right and nums[left] == nums[left + 1]:
                            left += 1
                        while left < right and nums[right] == nums[right - 1]:
                            right -= 1

                        left += 1
                        right -= 1
                    elif current_sum < target:
                        left += 1
                    else:
                        right -= 1

        return result


def parse_input(input_str: str) -> List[int]:
    input_str = input_str.strip()
    nums = []
    temp = ""
    reading_number = False

    for char in input_str:
        if char == '[':
            continue
        elif char.isdigit() or char == '-':
            temp += char
            reading_number = True
        elif (char == ',' or char == ']') and reading_number:
            nums.append(int(temp))
            temp = ""
            reading_number = False

    return nums

def main():
    input_str = input()
    target = int(input())

    nums = parse_input(input_str)
    solution = Solution()
    result = solution.fourSum(nums, target)

    print("[", end="")
    for i, quad in enumerate(result):
        print("[", end="")
        for j, num in enumerate(quad):
            print(num, end="")
            if j < len(quad) - 1:
                print(",", end="")
        print("]", end="")
        if i < len(result) - 1:
            print(",", end="")
    print("]")

if __name__ == "__main__":
    main()
