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
// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBcXZcJdG_QeSBo0MStgHsSzl-IZewC2ls',
  authDomain: 'trainify-react-app.firebaseapp.com',
  databaseURL: 'https://trainify-react-app-default-rtdb.firebaseio.com',
  projectId: 'trainify-react-app',
  storageBucket: 'trainify-react-app.appspot.com',
  messagingSenderId: '1026534116413',
  appId: '1:1026534116413:web:cf7deca9677a36157aee54',
};

// Initialize Firebase
// const app = initializeApp(firebaseConfig);

let app = FirebaseApp ? FirebaseApp() : initializeApp(firebaseConfig);
export default app;
// export const app = !firabase.apps.length ? Firebase.initializeApp(firebaseConfig) : firebase.app()
