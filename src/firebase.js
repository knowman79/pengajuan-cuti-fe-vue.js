import firebase from 'firebase'
import 'firebase/messaging'

const initializedFirebaseApp = firebase.initializeApp({

    apiKey: "AIzaSyCN5VYLHknB8Suoqfx_1VldKl5CY_cYDts",
    authDomain: "pengajuan-cuti-74ffa.firebaseapp.com",
    projectId: "pengajuan-cuti-74ffa",
    storageBucket: "pengajuan-cuti-74ffa.appspot.com",
    messagingSenderId: "113293072809",
    appId: "1:113293072809:web:ab80a21e482ccefb084cb8",
    measurementId: "G-5G59FEMX10" 
  })

  const messaging = initializedFirebaseApp.messaging();

  messaging.usePublicVapidKey(
    "BPwXZ3sFCq7EEm-uSUy-Oo-W1ZF5I0RZ8SmytxzTW4AM1kuetXaJ5EMXTkMRSdslXsceMa8dP91_mk5jhumWZWg"
  );

  export {messaging}