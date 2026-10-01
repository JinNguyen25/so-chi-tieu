# Bật đồng bộ bằng Firebase (miễn phí, khoảng 10 phút)

Gói Spark miễn phí, không cần thẻ. Dùng cá nhân thì không bao giờ chạm hạn mức.

## 1. Tạo project
1. Vào https://console.firebase.google.com và đăng nhập Google.
2. **Create a project** (Tạo dự án), đặt tên bất kỳ, ví dụ `so-chi-tieu`.
3. Tắt Google Analytics (không cần), bấm Create.

## 2. Bật đăng nhập
1. Menu trái: **Build → Authentication → Get started**.
2. Tab **Sign-in method**, bật **Email/Password** (chạy tốt trên cả iPhone lẫn Android).
3. Có thể bật thêm **Google** nếu muốn nút "Google".

## 3. Tạo cơ sở dữ liệu
1. Menu trái: **Build → Firestore Database → Create database**.
2. Chọn vị trí gần bạn (vd `asia-northeast1` Tokyo), chọn **Production mode**.
3. Sang tab **Rules**, xoá hết, dán đoạn dưới rồi bấm **Publish**.
   Quy tắc này cho phép mỗi người chỉ đọc/ghi dữ liệu của chính mình:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
  }
}
```

## 4. Lấy cấu hình web
1. Biểu tượng bánh răng cạnh "Project Overview" → **Project settings**.
2. Cuộn xuống **Your apps** → bấm biểu tượng web `</>`, đặt tên app, **không** cần tick Hosting.
3. Sao chép khối `firebaseConfig = { ... }` hiện ra.
4. Mở file `firebase-config.js`, thay dòng `window.FIREBASE_CONFIG = null;` bằng:

```js
window.FIREBASE_CONFIG = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};
```
(Khoá này dành cho web nên không phải bí mật. An toàn nhờ Rules ở bước 3.)

## 5. Cho phép tên miền hosting
Authentication → **Settings → Authorized domains → Add domain**, thêm tên miền
của bạn, ví dụ `ten-ban.netlify.app` (không có `https://`).

## 6. Đưa lên hosting lại
Kéo thả thư mục vào Netlify Drop (hoặc đẩy lên GitHub Pages) như lần trước.
Mở app → **Cài đặt → Đồng bộ** → Tạo tài khoản. Trên các thiết bị khác chỉ cần
đăng nhập cùng tài khoản là dữ liệu tự về.

## Lưu ý
- Lần đăng nhập đầu, dữ liệu sẵn có trên máy được **gộp** lên tài khoản, không bị mất.
- Offline vẫn dùng bình thường; có mạng lại sẽ tự đồng bộ.
- Xoá giao dịch trên máy này sẽ xoá trên các máy khác.
- Ví, ngân sách, nhóm, mục tiêu được đồng bộ theo kiểu "bản sửa mới nhất thắng";
  nếu 2 máy cùng sửa phần này khi offline thì máy sửa sau cùng sẽ được giữ.
- Giao diện sáng/tối và giờ nhắc ghi chép được lưu riêng trên từng máy.
