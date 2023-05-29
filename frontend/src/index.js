import React from "react";
import * as ReactDOMClient from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "App";
import { initializeApp } from 'firebase/app';
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import { firebaseKey } from "secret-keys";

import {
  getFirestore,
  collection,
  getDocs
} from "firebase/firestore";


const container = document.getElementById("root");

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = firebaseKey;

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

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
