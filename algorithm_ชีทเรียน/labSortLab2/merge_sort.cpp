#include <iostream>
#include <vector>

using namespace std;

void printArray(vector<int>& arr, int l, int r) {
    for (int i = l; i <= r; i++) {
        cout << arr[i] << " ";
    }
    cout << endl;
}

void merge(vector<int>& arr, int l, int m, int r) {
    int n1 = m - l + 1;
    int n2 = r - m;

    vector<int> L(n1), R(n2);

    for (int i = 0; i < n1; i++) L[i] = arr[l + i];
    for (int j = 0; j < n2; j++) R[j] = arr[m + 1 + j];

    int i = 0, j = 0, k = l;
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) {
            arr[k] = L[i];
            i++;
        } else {
            arr[k] = R[j];
            j++;
        }
        k++;
    }

    while (i < n1) arr[k++] = L[i++];
    while (j < n2) arr[k++] = R[j++];

    cout << "Merged [" << l << "-" << r << "]: ";
    printArray(arr, l, r);
}

void mergeSort(vector<int>& arr, int l, int r) {
    if (l >= r) return;

    cout << "Split [" << l << "-" << r << "]: ";
    printArray(arr, l, r);

    int m = l + (r - l) / 2;
    mergeSort(arr, l, m);
    mergeSort(arr, m + 1, r);
    merge(arr, l, m, r);
}

int main() {
    vector<int> arr = {16, 25, 2, 54, 36, 9, 12, 66};
    int n = arr.size();

    cout << "Original: ";
    printArray(arr, 0, n - 1);
    cout << "-----------------" << endl;

    mergeSort(arr, 0, n - 1);

    cout << "-----------------" << endl;
    cout << "Sorted: ";
    printArray(arr, 0, n - 1);

    return 0;
}