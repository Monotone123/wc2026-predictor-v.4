// Firebase Configuration for WC2026 Predictor
const firebaseConfig = {
  apiKey: "AIzaSyB7RIkGcsWhDfXd-MfUMtcP37HrdniNEEI",
  authDomain: "wc2026-predictor-8dd1d.firebaseapp.com",
  databaseURL: "https://wc2026-predictor-8dd1d-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "wc2026-predictor-8dd1d",
  storageBucket: "wc2026-predictor-8dd1d.firebasestorage.app",
  messagingSenderId: "69382354330",
  appId: "1:69382354330:web:c15c006f6ea80d94bbf623"
};

// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);
const db_firebase = firebase.database();
