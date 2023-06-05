const { object } = require("firebase-functions/v1/storage");
const { airbnbAPIkey, chatGPTAPIkey, flightsAPIkey } = require("./secret-keys");
const axios = require("axios");


module.exports.callFligtsAPI = async (params, limit) => {
  params.limit = limit;

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
    return null;
  });

  try {
    const data = respons.data.data;
    return data;
  } catch (err) {
    console.error(err.message);
    return null;
  }
}


module.exports.callAirbnbAPI = async (params) => {
  const options = {
    method: "GET",
    url: "https://airbnb13.p.rapidapi.com/search-location",
    params: params,
    headers: {
      "X-RapidAPI-Key": airbnbAPIkey,
      "X-RapidAPI-Host": "airbnb13.p.rapidapi.com",
    },
  };

  const response = await axios.request(options).catch((err) => {
    console.error(err.message);
    return null;
  });

  try {
    const data = response.data;
    return data
  } catch (err) {
    console.error(err.message);
    return null;
  }
}


module.exports.formatFlightData = (responseData) => {
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

      const arrayItem = Object.assign(routeItem, this.formatFlightdetails(duration));

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
      durationBack: this.formatFromMinutes(durationBack),
      arrivalBack: arrivalBack[arrivalBack.length - 1],
      departureBack: departureBack[0],
    };

    const duration = {
      utc_departure: element.utc_departure,
      utc_arrival: element.utc_arrival,
    };
    const arrayItem = Object.assign(item, this.formatFlightdetails(duration));
    arrayItem.transfers = transfer;

    zaNazaj.push(arrayItem);
  });

  const fastAndCheap = this.getBestFlights(zaNazaj);
  const filteredFlights = zaNazaj.filter((flight) => {
    return !fastAndCheap.includes(flight);
  });
  return this.fastAndCheap.concat(filteredFlights);
}


module.exports.prestej = async (currentUser, db, number) => {

  const combineKeys = (input) => {
    const result = {};

    for (const key in input) {
      const value = input[key];
      for (const subKey in value) {
        if (result[subKey]) {
          result[subKey] += value[subKey];
        } else {
          result[subKey] = value[subKey];
        }
      }
    }


    return result;
  }

  const countOccurrences = (items) => {
    const count = {};
    items.forEach((item) => {
      count[item] = (count[item] || 0) + 1;
    });
    return count;
  };

  const getDates = (data, key) => {
    const resultArray = [];
    data.forEach((item) => {
      if (!resultArray.includes(item[key]))
        resultArray.push(item[key]);
    });

    return resultArray;
  }

  function findMostCommonEntry(obj) {
    let mostCommonEntry;
    let maxFrequency = 0;

    for (const entry in obj) {
      if (obj[entry] > maxFrequency) {
        mostCommonEntry = entry;
        maxFrequency = obj[entry];
      }
    }

    return mostCommonEntry;
  }

  return new Promise((resolve, reject) => {
    const docRef = db.collection('users').doc(currentUser);

    docRef.get().then(docSnapshot => {
      const flightData = docSnapshot.exists ? docSnapshot.data()["flightSearches"] || [] : [];
      const stayData = docSnapshot.exists ? docSnapshot.data()["staySearches"] || [] : [];

      const lastFiveFlights = flightData.slice(-number) || [];
      const lastFiveStays = stayData.slice(-number) || [];

      const currency = combineKeys([
        countOccurrences(lastFiveFlights.map((flight) => flight.curr)),
        countOccurrences(lastFiveStays.map((stay) => stay.currency))
      ]);

      const adults = combineKeys([
        countOccurrences(lastFiveFlights.map((flight) => flight.adults)),
        countOccurrences(lastFiveStays.map((stay) => stay.adults))
      ]);

      const dates = {
        flightDates: [
          getDates(lastFiveFlights, "date_from"),
          getDates(lastFiveFlights, "return_from")
        ],
        stayDates: [
          getDates(lastFiveStays, "checkin"),
          getDates(lastFiveStays, "checkout")
        ]
      };

      resolve({
        currency: findMostCommonEntry(currency),
        adults: findMostCommonEntry(adults),
        dates: dates,
        flightOrigins: Object.keys(countOccurrences(lastFiveFlights.map((flight) => flight.cityFrom))),
        flightDestinations: Object.keys(countOccurrences(lastFiveFlights.map((flight) => flight.cityTo))),
        flightO: Object.keys(countOccurrences(lastFiveFlights.map((flight) => flight.fly_from))),
        flightD: Object.keys(countOccurrences(lastFiveFlights.map((flight) => flight.fly_to))),
        flightClass: countOccurrences(lastFiveFlights.map((flight) => flight.selected_cubins)),
        stayDestinations: countOccurrences(lastFiveStays.map((stay) => stay.location)),
      });
    }).catch(err => {
      console.error(err);
      reject(err);
    });
  });
}


module.exports.analyzeData = (data) => {

  const findMostCommon = (key) => {
    const items = Object.keys(data[key]);
    const itemCounts = items.map(item => data[key][item]);
    const maxItemCount = Math.max(...itemCounts);
    const mostCommonItems = items.filter(item => data[key][item] === maxItemCount);
    return mostCommonItems;
  }

  const getDate = (noOfDays) => {
    const date = new Date();
    date.setDate(date.getDate() + noOfDays);

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;
    return formattedDate;
  }

  return new Promise((resolve, reject) => {
    const combinations = {
      "flights": [],
      "stays": []
    };

    const thereDate = getDate(14);
    const backDate = getDate(24);

    data.flightD.forEach((destination) => {
      const index = data.flightD.findIndex(item => item === destination);

      const Flightaram = {
        "curr": data.currency,
        "adults": data.adults,
        "fly_from": data.flightO[0],
        "fly_to": destination,
        "selected_cubins": findMostCommon("flightClass")[0],
        "limit": 10,
        "date_from": thereDate,
        "date_to": thereDate,
        "return_from": backDate,
        "return_to": backDate,
      }
      const stayParam = {
        "currency": data.currency,
        "adults": data.adults,
        "location": data.flightDestinations[index],
        "page": 1,
        "checkin": thereDate,
        "checkout": backDate,
      }

      combinations.flights.push(Flightaram);
      combinations.stays.push(stayParam);
    });

    resolve({
      combinations: combinations,
    });
  });
}


module.exports.saveSearch = (user, params, collection, db) => {
  const docRef = db.collection('users').doc(user);

  docRef.get().then(docSnapshot => {
    const searches = docSnapshot.exists ? docSnapshot.data()[collection] || [] : [];

    searches.push(params);
    const updateData = {};
    updateData[collection] = searches;

    return docRef.set(updateData, { merge: true });
  }).then(() => {
    console.log(`Collecttion ${collection} updated for user ${user}`);
  }).catch(err => {
    console.error(err);
  });
}


module.exports.formatFromMinutes = (durationInMinutes) => {
  const hours = Math.floor(durationInMinutes / 60);
  const minutes = durationInMinutes % 60;
  const formattedDuration = `${hours !== 0 ? `${hours} hour${hours !== 1 ? 's' : ''}` : ''}${hours !== 0 && minutes !== 0 ? ' and ' : ''}${minutes !== 0 ? `${minutes} minute${minutes !== 1 ? 's' : ''}` : ''}`;

  return formattedDuration;
}


module.exports.fortmatTime = (time) => {
  const options = { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: false, timeZone: 'UTC' };
  const formattedTime = time.toLocaleString('en-US', options);

  return formattedTime;
}


module.exports.formatFlightdetails = (flightDetails) => {
  const departureTime = new Date(flightDetails.utc_departure);
  const arrivalTime = new Date(flightDetails.utc_arrival);

  const formattedDeparture = module.exports.fortmatTime(departureTime);
  const formattedArrival = module.exports.fortmatTime(arrivalTime);

  const durationInMilliseconds = arrivalTime - departureTime;
  const durationInMinutes = Math.floor(durationInMilliseconds / 60000);

  const formattedDuration = module.exports.formatFromMinutes(durationInMinutes);

  return {
    departure: formattedDeparture,
    arrival: formattedArrival,
    duration: formattedDuration,
    durationInMinutes: durationInMinutes
  };
}


module.exports.getBest = (flights, value) => {
  const flight = flights.reduce((best, current) => {
    if (current[value] < best[value]) {
      return current;
    }
    return best;
  });

  return flight;
}


module.exports.getBestFlights = (flights) => {
  let zaNazaj = [];
  zaNazaj.push(this.getBest(flights, "price"));
  zaNazaj.push(this.getBest(flights, "durationInMinutes"));

  return zaNazaj;
}


module.exports.fillDB = (user, db) => {
  const docRef = db.collection('users').doc(user);

  docRef.get().then(docSnapshot => {
    const flightSearches = docSnapshot.exists ? docSnapshot.data()["flightSearches"] || [] : [];
    const staySearches = docSnapshot.exists ? docSnapshot.data()["staySearches"] || [] : [];

    const data = {
      "flightSearches": [
        {
          "adults": "2",
          "fly_from": "ZAG",
          "selected_cubins": "M",
          "limit": 50,
          "return_to": "15/07/2023",
          "return_from": "15/07/2023",
          "cityFrom": "Zagreb",
          "date_to": "01/07/2023",
          "cityTo": "New York",
          "curr": "EUR",
          "fly_to": "JFK",
          "date_from": "01/07/2023"
        },
        {
          "adults": "2",
          "fly_from": "ZAG",
          "selected_cubins": "M",
          "limit": 50,
          "return_to": "15/07/2023",
          "return_from": "15/07/2023",
          "cityFrom": "Zagreb",
          "date_to": "01/07/2023",
          "cityTo": "Paris",
          "curr": "EUR",
          "fly_to": "ORY",
          "date_from": "01/07/2023"
        },
        {
          "adults": "2",
          "fly_from": "ZAG",
          "selected_cubins": "M",
          "limit": 50,
          "return_to": "15/07/2023",
          "return_from": "15/07/2023",
          "cityFrom": "Zagreb",
          "date_to": "01/07/2023",
          "cityTo": "Edinburgh",
          "curr": "EUR",
          "fly_to": "EDI",
          "date_from": "01/07/2023"
        },
        {
          "adults": "2",
          "fly_from": "ZAG",
          "selected_cubins": "M",
          "limit": 50,
          "return_to": "29/07/2023",
          "return_from": "29/07/2023",
          "cityFrom": "Zagreb",
          "date_to": "01/07/2023",
          "cityTo": "New York",
          "curr": "EUR",
          "fly_to": "JFK",
          "date_from": "01/07/2023"
        },
        {
          "adults": "3",
          "fly_from": "ZAG",
          "selected_cubins": "M",
          "limit": 50,
          "return_to": "29/07/2023",
          "return_from": "29/07/2023",
          "cityFrom": "Zagreb",
          "date_to": "01/07/2023",
          "cityTo": "New York",
          "curr": "EUR",
          "fly_to": "JFK",
          "date_from": "01/07/2023"
        }
      ],
      "staySearches": [
        {
          "pets": "0",
          "checkin": "2023-07-02",
          "infants": "0",
          "children": "0",
          "adults": "2",
          "location": "New York, NY",
          "currency": "EUR",
          "page": "1",
          "checkout": "2023-07-14"
        },
        {
          "pets": "0",
          "checkin": "2023-07-02",
          "infants": "0",
          "children": "0",
          "adults": "2",
          "location": "New York, NY",
          "currency": "EUR",
          "page": "1",
          "checkout": "2023-07-15"
        },
        {
          "pets": "0",
          "checkin": "2023-07-02",
          "infants": "0",
          "children": "0",
          "adults": "2",
          "location": "New York, NY",
          "currency": "EUR",
          "page": "1",
          "checkout": "2023-07-13"
        }
      ]
    };

    docRef.set(data, { merge: true });
  }).then(() => {
    console.log(`Filled DB for user ${user}`);
  }).catch(err => {
    console.error(err);
  });
}