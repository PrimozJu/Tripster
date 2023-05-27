const { initializeApp } = require("firebase-admin/app");
const { getFirestore, doc, setDoc, updateDoc, FieldValue } = require("firebase-admin/firestore");
const functions = require("firebase-functions");
const express = require("express");
const axios = require("axios");
const admin = require("firebase-admin");
const { airbnbAPIkey, chatGPTAPIkey, flightsAPIkey } = require("./secret-keys");
const { getBestFlights, formatFlightdetails, callFligtsAPI, saveSearch, callAirbnbAPI, formatFromMinutes, fortmatTime } = require("./funkcije");


initializeApp();
const app = express();
const db = getFirestore();

app.use((req, res, next) => {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT");
    res.set("Access-Control-Allow-Headers", "*");
    next();
});


app.get("/searches/:searchType", async (req, res) => {
    /**
     * searchType: "flights" | "stays" | "both"
     */
    const searchType = req.params.searchType.toLowerCase();
    const currentUser = req.headers["user"];


    if (!searchType || !currentUser) {
        return res.status(400).send("Bad request");
    }

    let pogoj = false;
    if (searchType === "both") {
        pogoj = true;
    }

    const docRef = db.collection('users').doc(currentUser);
    const zaNazaj = {};

    docRef.get().then(docSnapshot => {
        if (searchType === "flights" || pogoj) {
            const flightData = docSnapshot.exists ? docSnapshot.data()["flightSearches"] || [] : [];
            zaNazaj.flights = flightData;
        }

        if (searchType === "stays" || pogoj) {
            const stayData = docSnapshot.exists ? docSnapshot.data()["staySearches"] || [] : [];
            zaNazaj.stays = stayData;
        }

        return res.status(200).json(zaNazaj);
    }).catch(err => {
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
    console.log(currentUser)

    if (currentUser) {
        saveSearch(currentUser, params, "staySearches", db);
    };

    const responseData = await callAirbnbAPI(params);

    if (responseData) {
        return res.status(500).send("lmao");

        res.status(200).send(responseData);
    } else {
        res.status(500).send("Something went wrong");
    }
});


app.get("/flights", async (req, res) => {
    const params = req.query
    const responseData = await callFligtsAPI(params, 50);
    const currentUser = req.headers["user"];

    if (currentUser) {
        saveSearch(currentUser, params, "flightSearches", db);
    };

    if (!responseData) {
        return res.status(500).send("Something went wrong");
    }

    zaNazaj = []
    responseData.forEach((element) => {
        //Da ne pošlje že zasedenih
        if (element.availability.seats == null) {
            console.log("No seats available");
            return;
        }

        //Za VSE prestopne lete
        const transfer = []
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
                "id": item.id,
                "cityFrom": item.cityFrom,
                "cityTo": item.cityTo,
                "airline": item.airline,
            }

            const duration = {
                "utc_departure": item.utc_departure,
                "utc_arrival": item.utc_arrival
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
            "id": element.id,
            "cityFrom": element.cityFrom,
            "cityTo": element.cityTo,
            "airlines": element.airlines,
            "availability": element.availability.seats,
            "price": element.conversion[req.query.curr],
            "routeTo": routeTo,
            "routeFrom": routeFrom,
            "durationBack": formatFromMinutes(durationBack),
            "arrivalBack": arrivalBack[arrivalBack.length - 1],
            "departureBack": departureBack[0],
        }

        const duration = {
            "utc_departure": element.utc_departure,
            "utc_arrival": element.utc_arrival
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