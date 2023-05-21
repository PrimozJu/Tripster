const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const axios = require("axios");

initializeApp();
const db = getFirestore();
const app = express();

app.use((req, res, next) => {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT");
    res.set("Access-Control-Allow-Headers", "*");
    next();
});

//kak se authenticata userja
app.post("/authenticate", async (req, res) => {
    const idToken = req.headers["authorization"];
    const user = req.body;

    if (!idToken) {
        return res.status(401).send("Unauthorized");
    }

    try {
        await admin.auth().verifyIdToken(idToken);
        console.log(user.email + " authenticated");
        return res.status(200).send("authenticated");
    } catch (err) {
        console.log(err);
        return res.status(401).send(`POST request failed ${err}`);
    }
});

app.get("/airbnb", async (req, res) => {
    const options = {
        method: "GET",
        url: "https://airbnb13.p.rapidapi.com/search-location",
        params: req.query,
        headers: {
          "X-RapidAPI-Key": "afe4876245msh28deaebdd3bfb30p1bae3fjsn903df328d7da",
          "X-RapidAPI-Host": "airbnb13.p.rapidapi.com",
        },
      };
      try {
        const response = await axios.request(options);
        const responseData = response.data; 
        res.status(200).send(responseData);
      } catch (err) {
        console.error(err.message);
        res.status(500).send(err.message);
      }
});

//En nacin sejvanja v DB
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

//drugi nacin sejvanja v DB
app.post("/test1", async (req, res) => {
    const docRef = db.collection("test2").doc("alovena");

    await docRef.set({
        first: 'Ada',
        last: 'Lovelace',
        born: 1815
    }).then((snapshot) => {
        res.status(200).send(`POST request received ${JSON.stringify(snapshot)}`);
    }).catch((error) => {
        res.status(500).send(`POST request failed ${error}`);
    });
});

//Deploja funkcijo
exports.app = functions.region("europe-west2").https.onRequest(app);