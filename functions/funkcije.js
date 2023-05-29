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
  return new Promise((resolve, reject) => {
    const docRef = db.collection('users').doc(currentUser);

    docRef.get().then(docSnapshot => {
      const flightData = docSnapshot.exists ? docSnapshot.data()["flightSearches"] || [] : [];
      const stayData = docSnapshot.exists ? docSnapshot.data()["staySearches"] || [] : [];

      const lastFiveFlights = flightData.slice(-number) || [];
      const lastFiveStays = stayData.slice(-number) || [];

      const countOccurrences = (items) => {
        const count = {};
        items.forEach((item) => {
          count[item] = (count[item] || 0) + 1;
        });
        return count;
      };

      const data = {
        flightCurrency: countOccurrences(lastFiveFlights.map((flight) => flight.curr)),
        stayCurrency: countOccurrences(lastFiveStays.map((stay) => stay.currency)),
        flightOrigins: countOccurrences(lastFiveFlights.map((flight) => flight.cityFrom)),
        flightDestinations: countOccurrences(lastFiveFlights.map((flight) => flight.cityTo)),
        flightThere: countOccurrences(lastFiveFlights.map((flight) => flight.date_from)),
        flightBack: countOccurrences(lastFiveFlights.map((flight) => flight.return_from)),
        flightClass: countOccurrences(lastFiveFlights.map((flight) => flight.selected_cubins)),
        flightNumberAdults: countOccurrences(lastFiveFlights.map((flight) => flight.adults)),
        stayDestinations: countOccurrences(lastFiveStays.map((stay) => stay.location)),
        stayCheckin: countOccurrences(lastFiveStays.map((stay) => stay.checkin)),
        stayCheckout: countOccurrences(lastFiveStays.map((stay) => stay.checkout)),
        stayAdults: countOccurrences(lastFiveStays.map((stay) => stay.adults)),
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
    const mostCommonCurrencies = findMostCommon('flightCurrency');
    const mostCommonFlightOrigins = findMostCommon('flightOrigins');
    const mostCommonFlightDestinations = findMostCommon('flightDestinations');
    const mostCommonFlightClasses = findMostCommon('flightClass');
    const mostCommonStayDestinations = findMostCommon('stayDestinations');

    const flightDates = Object.keys(data.flightThere);
    const mostRecentFlightDate = flightDates.reduce((a, b) => new Date(a) > new Date(b) ? a : b);

    const numberOfAdults = Object.keys(data.stayAdults).reduce((a, b) => data.stayAdults[a] > data.stayAdults[b] ? a : b);
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


module.exports.getCheapestFlight = (flights, value) => {
  const cheapestFlight = flights.reduce((cheapest, current) => {
    if (current[value] < cheapest[value]) {
      return current;
    }
    return cheapest;
  });

  return cheapestFlight;
}


module.exports.getBestFlights = (flights) => {
  let zaNazaj = [];
  zaNazaj.push(this.getCheapestFlight(flights, "price"));
  zaNazaj.push(this.getCheapestFlight(flights, "durationInMinutes"));

  return zaNazaj;
}