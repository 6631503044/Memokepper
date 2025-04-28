📱 แบบฟอร์มส่งงานสอบ Take-home | Take-home Assignment Template
ชื่อ - นามสกุล (Full Name):Suwaphit Vatidmatee
รหัสนักศึกษา (Student ID):6631503044
ชื่อแอป (App Name):MemoKeeper
Framework ที่ใช้ (Framework Used): Expo / React Native 
ลิงก์ GitHub Repository: (https://github.com/6631503044/Memokepper)
ลิงก์ไฟล์ติดตั้ง (APK/IPA): (https://expo.dev/accounts/bigbigsathu/projects/Memokepper/builds/df40dcd6-49f2-4abc-99e8-fe1b164fbde5)

1. การออกแบบแอป | App Concept and Design (2 คะแนน / 2 pts)
1.1 ผู้ใช้งานเป้าหมาย | User Personas

Persona 1:  
- ชื่อ: นิก
- อายุ: 21 ปี  
- อาชีพ: นักศึกษาปี 3  
- ความต้องการ: ต้องการเก็บภาพความทรงจำและลายละเอียดไว้มาน้อนดูทีหลังโดยไม่ต้องไปหาในแกลรรี่

Persona 2:  
- ชื่อ: บัต  
- อายุ: 22 ปี  
- อาชีพ: นักศึกษาฝึกงาน  
- ความต้องการ: ต้องการเปิดดูความทรงจำเก่าๆโดยไม่ต้องเสียเวลาหาในอัลลบั้ม
1.2 เป้าหมายของแอป | App Goals

- ช่วยเก็บภาพและวิดิโอ
- ช่วยบันทึกลายละเอียดในกิจกรรมนั้นๆ
- มีหมวดหมู่ให้จัด
- มีระบบค้นหาความจำ
1.3 โครงร่างหน้าจอ / Mockup
ใส่รูปภาพ หรือคำอธิบายแต่ละหน้าหลัก 3 หน้า | Attach image or describe 3 main pages
1. Home / Memories Page
Main timeline to view all memories (sorted by newest).
Toggle between timeline view and photo grid view.
Add new memory with floating "+" button.
Tap a memory card to see its details.
Vintage style background and frames.
2. Categories Page
Organize memories by custom categories (Family, Travel, etc.).
View, create, and delete categories easily.
Add/edit categories with a popup modal (choose color and icon).
3. Memory Detail Page
Full view of a memory: photo, title, description, date, location, category.
Action buttons: Edit, Delete, Share memory.
Back button to return to Home or Categories.


1.4 การไหลของผู้ใช้งาน | User Flow
Home → Tap a memory → Memory Detail.
Home → "+" → Add new memory.
Home → Categories → Tap category → See memories in that category.

2. การพัฒนาแอป | App Implementation (4 คะแนน / 4 pts)
2.1 รายละเอียดการพัฒนา | Development Details
เครื่องมือที่ใช้ / Tools used:
-React Native: v0.72.6
-Expo: v49.0.15
-TypeScript: v5.1.3
-React: v18.2.0
2.2 ฟังก์ชันที่พัฒนา | Features Implemented
Checklist:
- [x] เพิ่ม / ลบ memory
- [x] Add catagory
- [x] See catagory and memory
- [ ] ซิงก์กับ Google Calendar
2.3 ภาพหน้าจอแอป | App Screenshots
แนบภาพหรือ URL (Attach images or image links):
(https://drive.google.com/drive/folders/1_XC1Xz1Pv6XB9m2VnSrDH-6f0D_TpGMl?usp=sharing)
3. การ Build และติดตั้งแอป | Deployment (2 คะแนน / 2 pts)
3.1 ประเภท Build | Build Type
[x] Debug
[ ] Release
3.2 แพลตฟอร์มที่ทดสอบ | Platform Tested
[x] Android
[ ] iOS
3.3 ไฟล์ README และวิธีติดตั้ง | README & Install Guide
แนบไฟล์หรือคำอธิบายการติดตั้งแอป | Insert steps
1. ดาวน์โหลดไฟล์ .apk
2. เปิดในอุปกรณ์ Android
3. ติดตั้งผ่าน File Manager
4. การสะท้อนผลลัพธ์ | Reflection (2 คะแนน / 2 pts)
- หากมีเวลา จะเพิ่มBackeend and database
5. การใช้ AI ช่วยพัฒนา | AI Assisted Development (Bonus / ใช้ประกอบการพิจารณา)
5.1 ใช้ AI ช่วยคิดไอเดีย | Idea Generation
Prompt ที่ใช้:  
"Suggest mobile app ideas for students to manage classes and reminders."

ผลลัพธ์:  
ได้ไอเดียแอปจัดตารางเรียนและระบบเตือนอัตโนมัติ
5.2 ใช้ AI ช่วยออกแบบ UI | UI Layout Prompt
Prompt ที่ใช้:  
"Design a simple layout for a schedule and reminder app in Flutter."

ผลลัพธ์:  
ได้ code structure ของ Scaffold 3 หน้า
5.3 ใช้ AI ช่วยเขียนโค้ด | Code Writing Prompt
Prompt ที่ใช้:  
Create a nostalgic "MemoryKeeper" mobile app using React Native with Expo framework for Android. The app should have a vintage/old-fashioned aesthetic that feels like a traditional photo album or scrapbook.

Core Requirements:
1. User Authentication:
   - Login and signup screens with vintage styling
   - User profile management
   - Mock authentication system using AsyncStorage

2. Memory Management:
   - Create, view, edit, and delete memories
   - Each memory should include: photo, title, description, date, category, and optional location
   - Image picker integration for camera and gallery
   - Date picker for selecting memory dates

3. Categories:
   - Create and manage custom categories with colors
   - View memories filtered by category
   - Delete empty categories

4. UI/UX:
   - Vintage/old-fashioned design theme throughout the app
   - Serif fonts, muted colors, decorative borders
   - Photo frames and paper textures
   - Bottom tab navigation with Home, Categories, Search, and Profile
   - Timeline and grid view options for memories

5. Search:
   - Search memories by title, description, or date
   - Filtered results with vintage styling

6. Data Management:
   - Context API for state management
   - Mock data for demonstration
   - AsyncStorage for persistence

Technical Specifications:
- React Native with Expo SDK 49
- TypeScript for type safety
- React Navigation v6 for navigation
- Expo Image Picker for media handling
- Date-fns for date formatting
- Custom styling with StyleSheet API

Please provide the complete implementation with detailed comments, project structure, and instructions for running the app. Also include suggestions for future enhancements like backend integration, video support, and offline mode.
5.4 ใช้ AI ช่วย debug | Debug Prompt
-
5.5 ใช้ AI ช่วย Deploy | Deployment Prompt
Prompt ที่ใช้:  
"How to build Expo app as APK and test on Android?"

ผลลัพธ์:  
คำสั่ง npx eas build -p android --profile development
✅ Checklist ก่อนส่ง | Final Checklist
[x] กรอกข้อมูลครบทุก Section
[x] แนบ GitHub และไฟล์ติดตั้ง
[x] สะท้อนผล และใช้ AI อย่างมีเหตุผล
