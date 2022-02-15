// db.js

///Old

// import * as firebase from 'firebase';
// import 'firebase/auth';

// let config = {
//     apiKey: "AIzaSyA7vIj_ndbnESPuCU29Bca_or93rO1VNws",
//     authDomain: "colorsapp-751bc.firebaseapp.com",
//     databaseURL: "https://colorsapp-751bc.firebaseio.com",
//     projectId: "colorsapp-751bc",
//     storageBucket: "colorsapp-751bc.appspot.com",
//     messagingSenderId: "37781309196",
//     appId: "1:37781309196:web:c2b22e0c293d881a77eb29"
// };
// export let app = !Firebase.apps.length ? Firebase.initializeApp(config) : Firebase.app()


//New

// Import the functions you need from the SDKs you need
import {  Firebase, FirebaseApp, initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyDUh2w3W75cUQG2a27NxEWdNxqAZ9JzA_E",
  authDomain: "trainify-app-firebase.firebaseapp.com",
  databaseURL: "https://trainify-app-firebase-default-rtdb.firebaseio.com",
  projectId: "trainify-app-firebase",
  storageBucket: "trainify-app-firebase.appspot.com",
  messagingSenderId: "29770888713",
  appId: "1:29770888713:web:fe462fc9b13fe837ab6ad8"
};

// Initialize Firebase
// export const app = initializeApp(firebaseConfig);
export let app = Firebase.apps.length ? Firebase.app() : Firebase.initializeApp(firebaseConfig);

// export const app = !firabase.apps.length ? Firebase.initializeApp(firebaseConfig) : firebase.app()