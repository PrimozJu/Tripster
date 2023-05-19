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
  // fetch("https://airbnb13.p.rapidapi.com/search-location", {
  //     method: "GET",
  //     headers: {
  //         "X-RapidAPI-Key": "afe4876245msh28deaebdd3bfb30p1bae3fjsn903df328d7da",
  //         "X-RapidAPI-Host": "airbnb13.p.rapidapi.com",
  //     },
  //     params: req.query
  // }).then((response) => {
  //     console.log(response);
  //     return res.send(response.data);
  // }).catch((err) => {
  //     console.error(err.message);
  //     return res.send(err.message);
  // });
  console.log(req.query);
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

  collectionRef
    .get()
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

  await docRef
    .set({
      first: "Ada",
      last: "Lovelace",
      born: 1815,
    })
    .then((snapshot) => {
      res.status(200).send(`POST request received ${JSON.stringify(snapshot)}`);
    })
    .catch((error) => {
      res.status(500).send(`POST request failed ${error}`);
    });
});

app.post("/itineary-chat-gpt", async (req, res) => {
  //const query = `Hi ChatGPT, can you recommend a trip based on my travel preferences? My desired dates of travel are ${departureDate} to ${returnDate}, and there will be ${numTravelers} traveling. I'm interested in traveling to ${desiredContinent}, and I'm looking for a ${travelType} experience. My interests include ${interests}. I would prefer to stay in a ${preferredAccommodation}, and my maximum budget is ${maxBudget}. Based on these preferences, what trip do you recommend?`;

  try {
    const params = req.body;

    const departureDate = params.departureDate;
    const returnDate = params.returnDate;
    const numTravelers = params.numTravelers;
    const desiredContinent = params.desiredContinent;
    const travelType = params.travelType; //adventure cultural, relaxation
    const interests = params.interest;
    const preferredAccommodation = params.preferredAccommodation;
    const maxBudget = params.maxBudget;
    // prostor za belezenje searchov
    const query = `Hi ChatGPT, can you recommend a trip based on my travel preferences? My desired dates of travel are ${departureDate} to ${returnDate}, and there will be ${numTravelers} traveling. I'm interested in traveling to ${desiredContinent}, and I'm looking for a ${travelType} experience. My interests include ${interests}. I would prefer to stay in a ${preferredAccommodation}, and my maximum budget is ${maxBudget}. Based on these preferences, what trip do you recommend?, Can you return me only JSON format? I want to use your response on my website, so please provide only JSON format, I dont want your extra words before and after json you give me, because I cant json.parse it. JUST GIVE ME JSON FORMAT WITHOUT ANY TEXT AROUND IT. Thank you`;
    // V query se dodaj fixen izgled json formata, za lazjo predstavitev na fe

    const options = {
      method: "POST",
      url: "https://chatgpt53.p.rapidapi.com/",
      headers: {
        "content-type": "application/json",
        "X-RapidAPI-Key": "0e529198bdmshaba36f78a36a9a5p1a9db0jsn082565d2fdf8",
        "X-RapidAPI-Host": "chatgpt53.p.rapidapi.com",
      },
      data: {
        messages: [
          {
            role: "user",
            content: query,
          },
        ],
      },
    };

    console.log("Zacenjam posiljanje chatu");
    const respons = await axios.request(options);
    console.log(respons.data.choices[0].message.content);
    res.send(JSON.stringify(respons.data.choices[0].message.content));
  } catch (error) {
    res.status(500).send(`POST request failed ${error}`);
  }
});
//Deploja funkcijo
exports.app = functions.region("europe-west2").https.onRequest(app);
