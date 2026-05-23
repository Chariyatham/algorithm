#include <iostream>
using namespace std;

int findSum(int arr[], int n) {
    if (n <= 0) {
        return 0;
    }
    return arr[n - 1] + findSum(arr, n - 1);
}

int main() {
    int N;
    cin >> N;
    int arr[N];
    for(int i = 0; i < N; i++) {
        cin >> arr[i];
    }

    cout << findSum(arr, N);
    return 0;
}