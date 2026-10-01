// Cấu hình Firebase của project "controll-e514a".
// (Khoá web này không phải bí mật; an toàn nhờ Firestore Rules.)
window.FIREBASE_CONFIG = {
  apiKey: "AIzaSyD0P5PvNWRLCk9MXxF_VghggAQ2f5MW16M",
  authDomain: "controll-e514a.firebaseapp.com",
  projectId: "controll-e514a",
  storageBucket: "controll-e514a.firebasestorage.app",
  messagingSenderId: "594595564366",
  appId: "1:594595564366:web:a9f02f25133341f70b2c1f",
  measurementId: "G-35726VFN31",

  // Quét hoá đơn bằng Firebase AI Logic (Gemini). Bật trong Firebase Console → AI Logic.
  aiLogic: true,
  // Khoá công khai (site key) của Fraud Defense / reCAPTCHA Enterprise dùng cho App Check.
  recaptchaSiteKey: "6Ldqs9ktAAAAAN89EMR6zgKJvudoZvguBRWrhcHq",
  recaptchaType: "enterprise"   // "enterprise" (Fraud Defense) hoặc "v3" (reCAPTCHA Classic, đã ngừng)
};
