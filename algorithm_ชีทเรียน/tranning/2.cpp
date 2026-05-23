#include <iostream>
using namespace std;
#include <vector>

double sum(vector<int> &all) //&ไม่ใช้การcopy แต่ส่งrefมาไว แต่ข้อมุลละวังโดนแก้
{
    double sum = 0; //ระวังห้ามเป็น int เดะมันตัดเศษ
    for (int x : all)
    {
        sum += x;
    }
    return sum / all.size();
}

int main()
{
    /*สมมติคุณต้องเขียนโปรแกรมรับคะแนนสอบ 5 คนมาเก็บไว้ใน vector แล้วหา "ผลรวม" คุณคิดว่าควรใช้ Loop แบบไหน (For ปกติ หรือ Range-based) และต้องเรียกใช้ฟังก์ชันอะไรเพื่อเอาเลขใส่เข้าไปใน Vector ครับ?*/
    int x;
    vector<int> score;
    for (int i = 0; i < 5; i++)
    {
        cin >> x;
        score.push_back(x);
    }
    cout<<sum(score)<<endl;
}