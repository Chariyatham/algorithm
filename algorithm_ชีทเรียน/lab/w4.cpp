#include <iostream>
#include <vector>

using namespace std;

int n;
int capacity;
int max_v = -1;
vector<int> w;
vector<int> v;
vector<int> x;
vector<int> best_x;

void subset1(int l, int r) {
    if (l == r) {
        int current_w = 0;
        int current_v = 0;
        for (int i = 1; i <= r; i++) {
            if (x[i] == 1) {
                current_w += w[i - 1];
                current_v += v[i - 1];
            }
        }

        if (current_w <= capacity && current_v > max_v) {
            max_v = current_v;
            best_x = x;
        }
    } else {
        x[l + 1] = 1;
        subset1(l + 1, r);
        x[l + 1] = 0;
        subset1(l + 1, r);
    }
}

int main() {
    cout << "enter Capacity: ";
    cin >> capacity;

    cout << "enter number of items: ";
    cin >> n;

    w.resize(n);
    v.resize(n);
    x.resize(n + 1);
    best_x.resize(n + 1);

    for (int i = 0; i < n; i++) {
        cout << "item " << i + 1 << " weight: ";
        cin >> w[i];
        cout << "item " << i + 1 << " value: ";
        cin >> v[i];
    }

    subset1(0, n);

    cout << "max Value: " << max_v << endl;
    cout << "selected Items index: ";
    for (int i = 1; i <= n; i++) {
        if (best_x[i] == 1) {
            cout << i << " ";
        }
    }
    cout << endl;

    return 0;
}