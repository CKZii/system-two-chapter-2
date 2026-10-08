# System.Two

## Chapter 2

Released:
One year after Chapter 1

Depends on:
A smile that lasted all day.

เกมเว็บสำหรับวันครบรอบ 1 ปี โดยตั้งใจให้เป็นภาคต่อของ Chapter 1 แยกคนละ repository

## วิธีเปิดเล่นในเครื่อง

ดับเบิลคลิก `index.html` ได้เลย หรือเปิดด้วย Chrome / Edge

## วิธีขึ้น GitHub Pages

1. สร้าง repository ใหม่ เช่น `system-two-chapter-2`
2. Upload ไฟล์ทั้งหมดในโฟลเดอร์นี้ โดยให้ `index.html`, `style.css`, `game.js` อยู่ระดับบนสุด
3. ไปที่ `Settings → Pages`
4. เลือก `Deploy from a branch`
5. Branch: `main` และ Folder: `/ (root)`
6. กด Save แล้วรอ GitHub สร้างลิงก์

## วิธีแก้ข้อความให้เป็นของคุณเอง

เปิด `game.js` แล้วแก้ส่วน `CONFIG` ด้านบน:

```js
const CONFIG = {
  playerName: "Two",
  authorName: "CK",
  memories: [
	"[SYSTEM LOG]\nBirthday gift executed successfully.\nUnexpected side effect detected:\nSubject fell in love even more.",
	"[SYSTEM LOG]\nSmile suppression failed.\nSubject smiled continuously\nfor an entire day. 😂",
    "Three songs arrived before words.",
    "The moment logic fell behind the heart."
  ],
  puzzleAnswer: "256",
  secretCommand: "Console.ReadLine();"
};
```

## วิธีเล่น

- คอมพิวเตอร์: `← →` หรือ `A D`
- มือถือ: ปุ่ม `◀ ▶`
- เดินชน Memory ทั้ง 4 จุด
- กด Build Solution
- อ่านบทสนทนาของ System.Two
- แก้ .NET puzzle
- หลังตอบถูก จะมีช่องสำหรับ secret command

### คำตอบสำหรับผู้สร้างเกม

- Puzzle: `256`
- Secret command: `Console.ReadLine();`

## หมายเหตุ

เกมนี้ไม่ใช้รูป เพลง หรือ library ภายนอก จึงเปิดแบบ offline และขึ้น GitHub Pages ได้ทันที
เสียงทั้งหมดสร้างด้วย Web Audio API ใน browser

---

## Changelog

### Version 1.0
- Birthday Surprise
- Final Boss: System.Two
- Secret Ending

### Version 2.0
- Imported memories from Chapter 1
- No more boss battles
- One year completed
