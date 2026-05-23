#include <iostream>
#include <vector>

using namespace std;

void printArray(vector<int>& arr, int l, int r) {
    for (int i = l; i <= r; i++) {
        cout << arr[i] << " ";
    }
    cout << endl;
}

int partition(vector<int>& arr, int low, int high) {
    int pivot = arr[high];
    int i = (low - 1);

    for (int j = low; j <= high - 1; j++) {
        if (arr[j] < pivot) {
            i++;
            swap(arr[i], arr[j]);
        }
    }
    swap(arr[i + 1], arr[high]);
    
    cout << "Partition (Pivot=" << pivot << "): ";
    printArray(arr, low, high);
    return (i + 1);
}

void quickSort(vector<int>& arr, int low, int high) {
    if (low < high) {
        cout << "Call [" << low << "-" << high << "]: ";
        printArray(arr, low, high);

        int pi = partition(arr, low, high);

        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}

int main() {
    vector<int> arr = {16, 25, 2, 54, 36, 9, 12, 66};
    int n = arr.size();

    cout << "Original: ";
    printArray(arr, 0, n - 1);
    cout << "-----------------" << endl;

    quickSort(arr, 0, n - 1);

    cout << "-----------------" << endl;
    cout << "Sorted: ";
    printArray(arr, 0, n - 1);

    return 0;
}