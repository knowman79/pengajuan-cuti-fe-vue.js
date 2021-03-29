importScripts('https://www.gstatic.com/firebasejs/8.3.1/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/8.3.1/firebase-messaging.js')

const firebaseConfig = {
    apiKey: "AIzaSyCN5VYLHknB8Suoqfx_1VldKl5CY_cYDts",
    authDomain: "pengajuan-cuti-74ffa.firebaseapp.com",
    projectId: "pengajuan-cuti-74ffa",
    storageBucket: "pengajuan-cuti-74ffa.appspot.com",
    messagingSenderId: "113293072809",
    appId: "1:113293072809:web:ab80a21e482ccefb084cb8",
    measurementId: "G-5G59FEMX10"
  };

  firebase.initializeApp(firebaseConfig);

  const initMessaging = firebase.messaging()