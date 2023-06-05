const { initializeApp } = require("firebase-admin/app");
const {
  getFirestore,
  doc,
  setDoc,
  updateDoc,
  FieldValue,
} = require("firebase-admin/firestore");
const functions = require("firebase-functions");
const express = require("express");
const axios = require("axios");
const admin = require("firebase-admin");
const { airbnbAPIkey, chatGPTAPIkey, flightsAPIkey } = require("./secret-keys");
const {
  getBestFlights,
  formatFlightdetails,
  callFligtsAPI,
  saveSearch,
  callAirbnbAPI,
  formatFromMinutes,
  fortmatTime,
  prestej,
  analyzeData,
  fillDB,
  callAPIAndTransformData,
} = require("./funkcije");

initializeApp();
const app = express();
const db = getFirestore();

app.use((req, res, next) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT");
  res.set("Access-Control-Allow-Headers", "*");
  next();
});

app.get("/recommendation", async (req, res) => {
  const currentUser = req.headers["user"];

  if (!currentUser) {
    return res.status(400).send("Bad request");
  }

  try {
    const data = await prestej(currentUser, db, 5);
    console.log(data);
    const analyzedData = await analyzeData(data);
    return res.status(200).json(analyzedData);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Something went wrong");
  }
});

app.get("/searches/:searchType", async (req, res) => {
  /**
   * searchType: "flights" | "stays" | "both"
   */
  const searchType = req.params.searchType.toLowerCase();
  const currentUser = req.headers["user"];
  const allowedStrings = ["flights", "stays", "both"];

  if (!allowedStrings.includes(searchType) || !currentUser) {
    return res.status(400).send("Bad request");
  }

  let pogoj = false;
  if (searchType === "both") {
    pogoj = true;
  }

  const docRef = db.collection("users").doc(currentUser);
  const zaNazaj = {};

  docRef
    .get()
    .then((docSnapshot) => {
      if (searchType === "flights" || pogoj) {
        const flightData = docSnapshot.exists
          ? docSnapshot.data()["flightSearches"] || []
          : [];
        zaNazaj.flights = flightData;
      }

      if (searchType === "stays" || pogoj) {
        const stayData = docSnapshot.exists
          ? docSnapshot.data()["staySearches"] || []
          : [];
        zaNazaj.stays = stayData;
      }

      return res.status(200).json(zaNazaj);
    })
    .catch((err) => {
      console.error(err);
    });
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
  const params = req.query;
  const currentUser = req.headers["user"];

  if (currentUser) {
    saveSearch(currentUser, params, "staySearches", db);
  }

  let responseData = undefined;
   responseData = await callAirbnbAPI(params);

  if (responseData) {
    //return res.status(500).send("lmao");

    res.status(200).send(responseData);
  } else {
    console.log(responseData);
    res.status(500).send("Something went wrong");
  }
});

app.get("/testData", (req, res) => {
  const currentUser = req.headers["user"];

  if (!currentUser) {
    return res.status(400).send("Bad request");
  }

  try {
    fillDB(currentUser, db);
    return res.status(200).send("OK");
  } catch (err) {
    console.error(err);
    return res.status(500).send("Something went wrong");
  }
});

app.get("/flights", async (req, res) => {
  const params = req.query;

  let responseData;
  responseData = await callFligtsAPI(params, 50);

  if (!responseData || responseData.length == 0) {
    console.log("No flights found");
    return res.status(500).send("Something went wrong");
  }

  const currentUser = req.headers["user"];
  params.cityTo = responseData[0].cityTo;
  params.cityFrom = responseData[0].cityFrom;

  if (currentUser) {
    saveSearch(currentUser, params, "flightSearches", db);
  }

  zaNazaj = [];
  responseData.forEach((element) => {
    //Da ne pošlje že zasedenih
    if (element.availability.seats == null) {
      console.log("No seats available");
      return;
    }

    //Za VSE prestopne lete
    const transfer = [];
    const routeTo = [];
    const routeFrom = [];
    const arrivalBack = [];
    const departureBack = [];
    let pogoj = true;
    let durationBack = 0;
    element.route.forEach((item) => {
      if (item.flyFrom != params.fly_from) {
        if (item.flyFrom != params.fly_to) {
          transfer.push(item.flyFrom);
        } else {
          transfer.push("|");
        }
      }

      const routeItem = {
        id: item.id,
        cityFrom: item.cityFrom,
        cityTo: item.cityTo,
        airline: item.airline,
      };

      const duration = {
        utc_departure: item.utc_departure,
        utc_arrival: item.utc_arrival,
      };

      const arrayItem = Object.assign(routeItem, formatFlightdetails(duration));

      //loci za tja in nazaj
      if (pogoj && item.cityFrom != element.cityTo) {
        routeTo.push(arrayItem);
      } else {
        pogoj = false;
        durationBack += arrayItem.durationInMinutes;
        arrivalBack.push(fortmatTime(new Date(item.utc_arrival)));
        departureBack.push(fortmatTime(new Date(item.utc_departure)));

        routeFrom.push(arrayItem);
      }
    });

    //Tisti ta glavni let
    const item = {
      id: element.id,
      cityFrom: element.cityFrom,
      cityTo: element.cityTo,
      airlines: element.airlines,
      availability: element.availability.seats,
      price: element.conversion[req.query.curr],
      routeTo: routeTo,
      routeFrom: routeFrom,
      durationBack: formatFromMinutes(durationBack),
      arrivalBack: arrivalBack[arrivalBack.length - 1],
      departureBack: departureBack[0],
    };

    const duration = {
      utc_departure: element.utc_departure,
      utc_arrival: element.utc_arrival,
    };
    const arrayItem = Object.assign(item, formatFlightdetails(duration));
    arrayItem.transfers = transfer;

    zaNazaj.push(arrayItem);
  });

  const fastAndCheap = getBestFlights(zaNazaj);
  const filteredFlights = zaNazaj.filter((flight) => {
    return !fastAndCheap.includes(flight);
  });
  const finalArray = fastAndCheap.concat(filteredFlights);

  res.status(200).send(finalArray);
});

app.post("/itineary-chat-gpt", async (req, res) => {
  try {
    const params = req.body;
    
    // Adding data to the database
    const jsonData = req.body;
    jsonData.search_type = "itineary-chat-gpt";
    const documentId = "user1";
    db.collection(documentId).add(jsonData);

    // Calling the API and transforming the data
    const itinerary = await callAPIAndTransformData(params);

    res.send(JSON.stringify(itinerary));
  } catch (error) {
    console.log(error);
    res.status(500).send(`${error}`);
  }
});

//Deploja funkcijo
exports.app = functions.region("europe-west2").https.onRequest(app);
