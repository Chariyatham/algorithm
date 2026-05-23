#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

int main() {
    int n;
    cin >> n;

    if (n <= 0) {
        cout << 0;
        return 0;
    }

    vector<int> arr(n);
    for (int i = 0; i < n; i++) {
        cin >> arr[i];
    }

    sort(arr.begin(), arr.end());

    int maxLen = 1;
    int currentLen = 1;

    for (int i = 1; i < n; i++) {
        if (arr[i] == arr[i - 1] + 1) {
            currentLen++;
        } else if (arr[i] != arr[i - 1]) {
            if (currentLen > maxLen) {
                maxLen = currentLen;
            }
            currentLen = 1;
        }
    }

    if (currentLen > maxLen) {
        maxLen = currentLen;
    }

    cout << maxLen << endl;

    return 0;
}