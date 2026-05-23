#include <iostream>
using namespace std;

int findMax(int arr[], int n) {
    if (n == 1) {
        return arr[0];
    }

    int maxRest = findMax(arr, n - 1);

    if (arr[n - 1] > maxRest) {
        return arr[n - 1];
    } else {
        return maxRest;
    }
}

int main() {
    int N;
    cin >> N;
    int arr[N];
    for(int i = 0; i < N; i++) {
        cin >> arr[i];
    }

    cout << findMax(arr, N);
    return 0;
}
