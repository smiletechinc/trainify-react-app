/**
 * Setting up the firebase for application connectivity and storage of data
 */
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDUh2w3W75cUQG2a27NxEWdNxqAZ9JzA_E",
  authDomain: "trainify-app-firebase.firebaseapp.com",
  databaseURL: "https://trainify-app-firebase-default-rtdb.firebaseio.com",
  projectId: "trainify-app-firebase",
  storageBucket: "trainify-app-firebase.appspot.com",
  messagingSenderId: "29770888713",
  appId: "1:29770888713:web:fe462fc9b13fe837ab6ad8"
};

let app = FirebaseApp? FirebaseApp() : initializeApp(firebaseConfig);
export default app;