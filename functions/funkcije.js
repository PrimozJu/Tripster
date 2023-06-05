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


      const data = {
        currency: currency,
        adults: adults,
        flightOrigins: countOccurrences(lastFiveFlights.map((flight) => flight.cityFrom)),
        flightDestinations: countOccurrences(lastFiveFlights.map((flight) => flight.cityTo)),
        flightThere: countOccurrences(lastFiveFlights.map((flight) => flight.date_from)),
        flightBack: countOccurrences(lastFiveFlights.map((flight) => flight.return_from)),
        flightClass: countOccurrences(lastFiveFlights.map((flight) => flight.selected_cubins)),
        stayDestinations: countOccurrences(lastFiveStays.map((stay) => stay.location)),
        stayCheckin: countOccurrences(lastFiveStays.map((stay) => stay.checkin)),
        stayCheckout: countOccurrences(lastFiveStays.map((stay) => stay.checkout)),
        stayChildren: countOccurrences(lastFiveStays.map((stay) => stay.children)),
        stayInfants: countOccurrences(lastFiveStays.map((stay) => stay.infants))
      };

      resolve(data);

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

  return new Promise((resolve, reject) => {
    const mostCommonCurrencies = findMostCommon('currency');
    const mostCommonFlightOrigins = findMostCommon('flightOrigins');
    const mostCommonFlightDestinations = findMostCommon('flightDestinations');
    const mostCommonFlightClasses = findMostCommon('flightClass');
    const mostCommonStayDestinations = findMostCommon('stayDestinations');

    const flightDates = Object.keys(data.flightThere);
    const mostRecentFlightDate = flightDates.reduce((a, b) => new Date(a) > new Date(b) ? a : b);

    const numberOfAdults = Object.keys(data.adults).reduce((a, b) => data.adults[a] > data.adults[b] ? a : b);
    const numberOfChildren = Object.keys(data.stayChildren).reduce((a, b) => data.stayChildren[a] > data.stayChildren[b] ? a : b);
    const numberOfInfants = Object.keys(data.stayInfants).reduce((a, b) => data.stayInfants[a] > data.stayInfants[b] ? a : b);

    resolve({
      currency: mostCommonCurrencies,
      flightOrigin: mostCommonFlightOrigins,
      flightDestination: mostCommonFlightDestinations,
      recentFlightDate: mostRecentFlightDate,
      flightClass: mostCommonFlightClasses,
      numberOfAdults: [numberOfAdults],
      numberOfChildren: [numberOfChildren],
      numberOfInfants: [numberOfInfants],
      stayDestination: mostCommonStayDestinations
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


module.exports.callAPIAndTransformData = async (params) => {
  console.log("lmao")
  try {

    const travelTime = params.travelTime;
    const travelDestination = params.travelDestination;
    const additionalInfo = params.additionalInfo;
    
    const query = `Hi chatGPT, can you write me an itinerary for ${travelTime} days in ${travelDestination}? Include these parameters in the response: ${additionalInfo}. Respond back with a JSON format so I can map through them like this: {"travelDestination": ${travelDestination}, tripArray: [{ "day": 1, "description": "description of the day", "activities": ["activity1", "activity2", "activity3"] }, { "day": 2, "description": "description of the day", "activities": ["activity1", "activity2", "activity3"] }]} and continue for the duration of the provided time length. Thank you!`;
    console.log(query)

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
    console.log("itinerary");
    return itinerary;
  } catch (error) {
    throw new Error(`API request failed: ${error}`);
  }
};





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