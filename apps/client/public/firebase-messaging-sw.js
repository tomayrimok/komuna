importScripts("https://www.gstatic.com/firebasejs/10.12.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.1/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyAuuSLDSWS5oIxhJhXwP9w_1fhOb68-GR8",
  authDomain: "komuna-2025.firebaseapp.com",
  projectId: "komuna-2025",
  messagingSenderId: "843705847350",
  appId: "1:843705847350:web:06c2e780f11fce25929297",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  const { title, body } = payload.notification;
  console.log("Received background message ", payload);
  self.registration.showNotification(title, { body });
});