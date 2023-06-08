const { object } = require("firebase-functions/v1/storage");
const { airbnbAPIkey, chatGPTAPIkey, flightsAPIkey } = require("./secret-keys");
const axios = require("axios");


/**
    Calls the Flights API to search for flights based on the provided parameters.
    @param {Object} params - The parameters for the flight search.
    @param {number} limit - The maximum number of results to return.
    @returns {Promise<Array|null>} - A promise that resolves to an array of flight data or null if an error occurs.
    */
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


/**
    Calls the Airbnb API to search for locations based on the provided parameters.
    @param {Object} params - The parameters for the location search.
    @returns {Promise<Object|null>} - A promise that resolves to an object containing the search results or null if an error occurs.
    */
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


/**
    Formats the flight data received from the API response.
    @param {Array} responseData - The flight data received from the API.
    @param {Object} params - The parameters used for the flight search.
    @param {string} currency - The currency in which the prices should be formatted.
    @returns {Promise<Array>} - A promise that resolves to an array of formatted flight data.
    */
module.exports.formatFlightData = async (responseData, params, currency) => {
  return new Promise((resolve, reject) => {
    zaNazaj = [];
    responseData.forEach((element) => {
      //Da ne pošlje že zasedenih
      if (element.availability.seats == null) {
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
          arrivalBack.push(this.fortmatTime(new Date(item.utc_arrival)));
          departureBack.push(this.fortmatTime(new Date(item.utc_departure)));

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
        price: element.conversion[currency],
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

    resolve(fastAndCheap.concat(filteredFlights));
  });
}


/**
    Retrieves and analyzes the recent search data for flights and stays for a specific user.
    @param {string} currentUser - The ID of the current user.
    @param {Object} db - The database object used for querying.
    @param {number} number - The number of recent searches to consider.
    @returns {Promise<Object>} - A promise that resolves to an object containing analyzed search data.
    */
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


/**
    Analyzes the search data and generates combinations for flight and stay searches.
    @param {Object} data - The analyzed search data.
    @returns {Promise<Object>} - A promise that resolves to an object containing combinations for flight and stay searches.
    */
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

  const convertDateFromat = (dateString) => {
    const parts = dateString.split('/');
    const day = parts[0];
    const month = parts[1];
    const year = parts[2];
    const convertedDate = `${year}-${month}-${day}`;
    return convertedDate;
  }

  return new Promise((resolve, reject) => {
    const combinations = [];

    const daysFromNow = 14;
    const otherDaysFromNow = 14 + 5;
    const thereDate = getDate(daysFromNow);
    const backDate = getDate(otherDaysFromNow);

    data.flightD.forEach((destination) => {
      const index = data.flightD.findIndex(item => item === destination);
      const fullDestination = data.flightDestinations[index];

      const chatParams = {
        "travelTime": otherDaysFromNow - daysFromNow ,
        "travelDestination": fullDestination,
        "additionalInfo": ""
      }

      const flightaram = {
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
        "location": fullDestination,
        "page": 1,
        "checkin": convertDateFromat(thereDate),
        "checkout": convertDateFromat(backDate),
      }

      combinations.push([
        flightaram, stayParam, chatParams
      ]);
    });

    resolve({
      combinations: combinations,
    });
  });
}


/**
    Saves a search parameter object to the specified collection for a user.
    @param {string} user - The user ID.
    @param {Object} params - The search parameter object to be saved.
    @param {string} collection - The name of the collection to save the search to.
    @param {Object} db - The database instance.
    */
module.exports.saveSearch = (user, params, collection, db) => {
  const docRef = db.collection('users').doc(user);

  docRef.get().then(docSnapshot => {
    const searches = docSnapshot.exists ? docSnapshot.data()[collection] || [] : [];

    searches.push(params);
    const updateData = {};
    updateData[collection] = searches;

    return docRef.set(updateData, { merge: true });
  }).then(() => {
    // console.log(`Collecttion ${collection} updated for user ${user}`);
  }).catch(err => {
    console.error(err);
  });
}


module.exports.callAPIAndTransformData = async (params) => {
  try {

    const travelTime = params.travelTime;
    const travelDestination = params.travelDestination;
    const additionalInfo = params.additionalInfo;

    const query = `Hi chatGPT, can you write me an itinerary for ${travelTime} days in ${travelDestination}? Include these parameters in the response: ${additionalInfo!=undefined?additionalInfo:""}. Respond back with a JSON format so I can map through them like this: {"travelDestination": ${travelDestination}, tripArray: [{ "day": 1, "description": "description of the day", "activities": ["activity1", "activity2", "activity3"] }, { "day": 2, "description": "description of the day", "activities": ["activity1", "activity2", "activity3"] }]} and continue for the duration of the provided time length., Dont give me normal sentences I need json format as I provided you in format, because you giving me normal sentence is making it difficult for my website to work. Please be kind to me and consider giving me JSON format. Thank you!
    `;
    // console.log(query)

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

    const response = await axios.request(options);

    const itineraryVmesni = response.data.choices[0].message.content;
    const startIndex = itineraryVmesni.indexOf("{");
    const endIndex = itineraryVmesni.lastIndexOf("}");
    const strippedText = itineraryVmesni.substring(startIndex, endIndex + 1);

    // Now you can parse the strippedText as JSON
    const itinerary = JSON.parse(strippedText);
    // console.log("itinerary");
    return itinerary;
  } catch (error) {
    console.error(error);
    throw new Error(`API request failed: ${error}`);
  }
};


/**
    Formats the duration in minutes into a human-readable format.
    @param {number} durationInMinutes - The duration in minutes.
    @returns {string} The formatted duration string.
    */
module.exports.formatFromMinutes = (durationInMinutes) => {
  const hours = Math.floor(durationInMinutes / 60);
  const minutes = durationInMinutes % 60;
  const formattedDuration = `${hours !== 0 ? `${hours} hour${hours !== 1 ? 's' : ''}` : ''}${hours !== 0 && minutes !== 0 ? ' and ' : ''}${minutes !== 0 ? `${minutes} minute${minutes !== 1 ? 's' : ''}` : ''}`;

  return formattedDuration;
}


/**
    Formats the given time into a specific format.
    @param {Date} time - The time to be formatted.
    @returns {string} The formatted time string.
    */
module.exports.fortmatTime = (time) => {
  const options = { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: false, timeZone: 'UTC' };
  const formattedTime = time.toLocaleString('en-US', options);

  return formattedTime;
}


/**
    Formats the flight details including departure time, arrival time, and duration.
    @param {Object} flightDetails - The flight details object.
    @param {string} flightDetails.utc_departure - The UTC departure time.
    @param {string} flightDetails.utc_arrival - The UTC arrival time.
    @returns {Object} The formatted flight details object.
    */
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


/**
    Finds the best flight based on a specified value.
    @param {Array} flights - The array of flight objects.
    @param {string} value - The property to compare for finding the best flight.
    @returns {Object} The best flight object.
    */
module.exports.getBest = (flights, value) => {
  const flight = flights.reduce((best, current) => {
    if (current[value] < best[value]) {
      return current;
    }
    return best;
  });

  return flight;
}


/**
    Retrieves the best flights based on price and duration from the given array of flights.
    @param {Array} flights - The array of flight objects.
    @returns {Array} The best flights based on price and duration.
    */
module.exports.getBestFlights = (flights) => {
  let zaNazaj = [];
  zaNazaj.push(this.getBest(flights, "price"));
  zaNazaj.push(this.getBest(flights, "durationInMinutes"));

  return zaNazaj;
}


/**

    Fills the database with sample flight and stay searches for the specified user.
    @param {string} user - The user ID.
    @param {Object} db - The Firestore database instance.
    */
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
    // console.log(`Filled DB for user ${user}`);
  }).catch(err => {
    console.error(err);
  });
}