const { initializeApp } = require("firebase-admin/app");
const { getFirestore, doc, setDoc, updateDoc } = require("firebase-admin/firestore");
const functions = require("firebase-functions");
const express = require("express");
const axios = require("axios");
const admin = require("firebase-admin");
const { airbnbAPIkey, chatGPTAPIkey, flightsAPIkey } = require("./secret-keys");
const { convertToJSON, formatFlightdetails } = require("./funkcije");


initializeApp();
const app = express();
const db = getFirestore();

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
    console.log(req.query);
    const data = req.query;
    const currentUser = req.headers["user"]

    if (currentUser) {
        const docRef = db.collection('users').doc(currentUser);
        docRef.get().then(docSnapshot => {
            if (docSnapshot.exists) {
                updateDoc(docRef, {
                    staySearches: arrayUnion(data.location),
                });
            } else {
                db.collection('users').doc(currentUser).set({
                    staySearches: [data.location]
                });
            }
        });
    };

    const options = {
        method: "GET",
        url: "https://airbnb13.p.rapidapi.com/search-location",
        params: data,
        headers: {
            "X-RapidAPI-Key": airbnbAPIkey,
            "X-RapidAPI-Host": "airbnb13.p.rapidapi.com",
        },
    };
    try {
        //API klic za airbnb
        // const response = await axios.request(options);

        //Send data back to frontend
        // const responseData = response.data;
        // res.status(200).send(responseData);
        //TODO nepozabo removat!
        res.status(500).send("lmao");

    } catch (err) {
        console.error(err.message);
        res.status(500).send(err.message);
    }
});

app.get("/flights", async (req, res) => {
    const params = req.query;

    if (!params.hasOwnProperty("limit")) {
        params.limit = 10;
    }
    console.log(params);

    const options = {
        method: "GET",
        url: "https://api.tequila.kiwi.com/v2/search",
        headers: {
            "Content-Type": "application/json",
            "apikey": flightsAPIkey
        },
        params: params
    }

    const respons = await axios.request(options).catch((err) => {
        console.error(err.message);
        res.status(500).send(err.message);
    });
    const responseData = respons.data.data;

    zaNazaj = []
    responseData.forEach((element) => {

        const transfer = element.route.map((item) => item.flyFrom);

        const duration = {
            "utc_departure": element.utc_departure,
            "utc_arrival": element.utc_arrival
        }

        const item = {
            "id": element.id,
            "cityFrom": element.cityFrom,
            "cityTo": element.cityTo,
            "airlines": element.airlines,
            "availability": element.availability.seats,
            "price": element.conversion[req.query.curr]
        }

        const arrayItem = Object.assign(item, formatFlightdetails(duration));
        arrayItem.transfers = transfer;
        zaNazaj.push(arrayItem);
    });

    const docRef = db.collection("leti").doc(`user1`);
    await docRef.set({
        result: zaNazaj
    })
        .then(() => {
            console.log("Document successfully written!");
        }).catch((error) => {
            console.error("Error writing document: ", error);
        });

    res.status(200).send(zaNazaj);
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
        //Get params from request
        const params = req.body;
        const departureDate = params.departureDate;
        const returnDate = params.returnDate;
        const numTravelers = params.numTravelers;
        const desiredContinent = params.desiredContinent;
        const travelType = params.travelType; //adventure cultural, relaxation
        const interests = params.interest;
        const preferredAccommodation = params.preferredAccommodation;
        const maxBudget = params.maxBudget;

        // V query se dodaj fixen izgled json formata, za lazjo predstavitev na fe
        const query = `Hi ChatGPT, can you recommend a trip based on my travel preferences? My desired dates of travel are ${departureDate} to ${returnDate}, and there will be ${numTravelers} traveling. I'm interested in traveling to ${desiredContinent}, and I'm looking for a ${travelType} experience. My interests include ${interests}. I would prefer to stay in a ${preferredAccommodation}, and my maximum budget is ${maxBudget}. Based on these preferences, what trip do you recommend?, Can you return me only JSON format? I want to use your response on my website, so please provide only JSON format, I dont want your extra words before and after json you give me, because I cant json.parse it. JUST GIVE ME JSON FORMAT WITHOUT ANY TEXT AROUND IT. Thank you`;

        const options = {
            method: "POST",
            url: "https://chatgpt53.p.rapidapi.com/",
            headers: {
                "content-type": "application/json",
                "X-RapidAPI-Key": chatGPTAPIkey,
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
        console.log("JSON DATA v bazo");

        //Dodajanje v bazo
        const jsonData = req.body;
        jsonData.search_type = "itineary-chat-gpt";
        const documentId = "user1" //jsonData.id;
        db.collection(documentId).add(jsonData);

        //API klic za chat gpt
        console.log("Zacenjam posiljanje chatu");
        const respons = await axios.request(options);

        //Send data back to frontend
        console.log(respons.data.choices[0].message.content);
        res.send(JSON.stringify(respons.data.choices[0].message.content));
    } catch (error) {
        res.status(500).send(`POST request failed ${error}`);
    }
});

//Deploja funkcijo
exports.app = functions.region("europe-west2").https.onRequest(app);