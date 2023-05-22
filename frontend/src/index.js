import React from "react";
import * as ReactDOMClient from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "App";
import { initializeApp } from 'firebase/app';
import { getAnalytics } from "firebase/analytics";

import {
  getFirestore,
  collection,
  getDocs
} from "firebase/firestore";


const container = document.getElementById("root");

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDvrLf6ndKyHMgXCxReOOLXvGRuiW9eOhM",
  authDomain: "tripsterpraktikum-e913c.firebaseapp.com",
  projectId: "tripsterpraktikum-e913c",
  storageBucket: "tripsterpraktikum-e913c.appspot.com",
  messagingSenderId: "320340062048",
  appId: "1:320340062048:web:be951119ae91fae5b1b805",
  measurementId: "G-S1FG8420FV"
};

initializeApp(firebaseConfig);


// Initialize Firebase
const db = getFirestore();

const colRef = collection(db, "users");

getDocs(colRef).then((querySnapshot) => {
  querySnapshot.forEach((doc) => {
    //console.log(`${doc.id} => ${doc.data()}`);
  });
  //console.log("ah shit")
});


// Create a root.
const root = ReactDOMClient.createRoot(container);

root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
