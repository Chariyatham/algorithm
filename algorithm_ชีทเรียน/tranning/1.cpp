#include <iostream>
using namespace std;

int main(){
    string a;
    getline(cin,a);

    int count=0;
    cout<<a<<endl;
    for(char c:a){
        if(c=='a'){
            count++;
        }
    }
    cout<<count<<endl;
}
