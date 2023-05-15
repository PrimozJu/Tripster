/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {initializeApp} = require("firebase-admin/app");
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");

initializeApp();
const app = express();
app.use((req, res, next) => {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT");
    res.set("Access-Control-Allow-Headers", "*");
    next();
});

app.get("/test", (req, res) => {
    const collectionRef = admin.firestore().collection("test");

    collectionRef.get()
        .then((querySnapshot) => {
            const documents = [];
            querySnapshot.forEach((doc) => {
                documents.push(doc.data());
            });
            res.status(200).json(documents);
        })
        .catch((error) => {
            console.error("Error retrieving documents: ", error);
            res.status(500).send("GET request failed");
        });
});

app.post("/test", (req, res) => {
    const documentData = {
        field1: "field1",
        field2: "field2",
    };

    const collectionRef = admin.firestore().collection("test");

    collectionRef.add(documentData).then((snapshot) => {
        console.log("Document written with ID: ", snapshot.id);
        res.status(200).send("POST request received");
    }).catch((error) => {
        console.error("Error adding document: ", error);
        res.status(500).send("POST request failed");
    });
});

app.put("/", (req, res) => {
    res.status(200).send("PUT request received");
});

app.delete("/", (req, res) => {
    res.status(200).send("DELETE request received");
});

//Deploja funkcijo
exports.app = functions.region("europe-west2").https.onRequest(app);