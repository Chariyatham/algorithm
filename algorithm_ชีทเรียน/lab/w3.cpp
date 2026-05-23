#include <iostream>
#include <vector>
#include <cmath>
#include <algorithm>

using namespace std;

int n;
vector<int> X;

bool isValid(int end) {
    for (int i = 1; i < end; i++) {
        for (int j = i + 1; j <= end; j++) {
            if (abs(i - j) == abs(X[i] - X[j])) {
                return false;
            }
        }
    }
    return true;
}

void permute(int start, int end) {
    if (start == end) {
        if (isValid(end)) {
            for (int i = 1; i <= end; i++) {
                cout << X[i] << " ";
            }
            cout << endl;
        }
        return;
    }

    for (int i = start; i <= end; i++) {
        swap(X[start], X[i]);
        permute(start + 1, end);
        swap(X[start], X[i]);
    }
}

int main() {
    cout << "enter N: ";
    cin >> n;

    X.resize(n + 1);
    for (int i = 1; i <= n; i++) {
        X[i] = i;
    }

    permute(1, n);

    return 0;
}