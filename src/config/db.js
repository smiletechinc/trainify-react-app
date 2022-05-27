import {Firebase, FirebaseApp, initializeApp, getApps} from 'firebase/app';

// /* hfshan247@gmail.com */
// const firebaseConfig = {
//   apiKey: "AIzaSyDUh2w3W75cUQG2a27NxEWdNxqAZ9JzA_E",
//   authDomain: "trainify-app-firebase.firebaseapp.com",
//   databaseURL: "https://trainify-app-firebase-default-rtdb.firebaseio.com",
//   projectId: "trainify-app-firebase",
//   storageBucket: "trainify-app-firebase.appspot.com",
//   messagingSenderId: "29770888713",
//   appId: "1:29770888713:web:fe462fc9b13fe837ab6ad8"
// };

/*smiletechpakistan@gmail.com */
const firebaseConfig = {
  apiKey: 'AIzaSyBcXZcJdG_QeSBo0MStgHsSzl-IZewC2ls',
  authDomain: 'trainify-react-app.firebaseapp.com',
  projectId: 'trainify-react-app',
  storageBucket: 'trainify-react-app.appspot.com',
  messagingSenderId: '1026534116413',
  appId: '1:1026534116413:web:e1600a2f66e460cd7aee54',
};

let app = FirebaseApp ? FirebaseApp() : initializeApp(firebaseConfig);
export default app;
// export const app = !firabase.apps.length ? Firebase.initializeApp(firebaseConfig) : firebase.app()
