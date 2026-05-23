#include <iostream>
#include <vector>

using namespace std;

int n;
int target;
vector<int> A;
vector<int> x;

void subset1(int l, int r) {
    if (l == r) {
        int sum = 0;
        for (int i = 1; i <= r; i++) {
            if (x[i] == 1) {
                sum += A[i - 1];
            }
        }
        if (sum == target) {
            cout << "{ ";
            for (int i = 1; i <= r; i++) {
                if (x[i] == 1) {
                    cout << A[i - 1] << " ";
                }
            }
            cout << "} = " << target << endl;
        }
    } else {
        x[l + 1] = 1;
        subset1(l + 1, r);
        x[l + 1] = 0;
        subset1(l + 1, r);
    }
}

int main() {
    cout << "enter N: ";
    cin >> n;
    
    A.resize(n);
    x.resize(n + 1);

    cout << "enter elements: ";
    for (int i = 0; i < n; i++) {
        cin >> A[i];
    }

    cout << "enter target sum: ";
    cin >> target;

    subset1(0, n);

    return 0;
}