#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

int countPermutations = 0;

void findPermutations(vector<int>& nums, int left, int right) {
    if (left == right) {
        for (int i = 0; i <= right; i++) {
            cout << nums[i] << (i == right ? "" : " ");
        }
        cout << endl;
        countPermutations++;
        return;
    }

    for (int i = left; i <= right; i++) {
        swap(nums[left], nums[i]);
        findPermutations(nums, left + 1, right);
        swap(nums[left], nums[i]); // backtrack
    }
}

int main() {
    int n;
    cout << "input: ";
    cin >> n;
    vector<int> nums;
    for (int i = 1; i <= n; i++) nums.push_back(i);
    findPermutations(nums, 0, n - 1);
    cout << countPermutations << endl;
    return 0;
}