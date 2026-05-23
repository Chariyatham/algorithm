#include <iostream>
#include <vector>
#include <string>
#include <algorithm>

using namespace std;

int totalWays = 0;

//check g1ติด g2ไหม
bool isValid(const vector<string>& arrangement) {
    for (int i = 0; i < arrangement.size() - 1; i++) {
        if ((arrangement[i] == "g1" && arrangement[i+1] == "g2") ||
            (arrangement[i] == "g2" && arrangement[i+1] == "g1")) {
            return false;
        }
    }
    return true;
}

void solveSeating(vector<string>& seats, int left, int right) {
    if (left == right) {
        if (isValid(seats)) {
            for (int i = 0; i <= right; i++) {
                cout << seats[i] << (i == right ? "" : " ");
            }
            cout << endl;
            totalWays++;
        }
        return;
    }

    for (int i = left; i <= right; i++) {
        swap(seats[left], seats[i]);
        solveSeating(seats, left + 1, right);
        swap(seats[left], seats[i]); // backtrack
    }
}

int main() {
    int m, n;
    cout << "input: ";
    cin >> m >> n;

    vector<string> people;
    for (int i = 1; i <= m; i++) people.push_back("b" + to_string(i));
    for (int i = 1; i <= n; i++) people.push_back("g" + to_string(i));

    // เรียงงง
    sort(people.begin(), people.end());

    solveSeating(people, 0, people.size() - 1);
    cout << totalWays << endl;

    return 0;
}