module.exports.formatFlightdetails = (flightDetails) => {
    const departureTime = new Date(flightDetails.utc_departure);
  const arrivalTime = new Date(flightDetails.utc_arrival);

  const options = { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' };

  const formattedDeparture = departureTime.toLocaleString('en-US', options);
  const formattedArrival = arrivalTime.toLocaleString('en-US', options);

  const durationInMilliseconds = arrivalTime - departureTime;
  const durationInMinutes = Math.floor(durationInMilliseconds / 60000);
  const hours = Math.floor(durationInMinutes / 60);
  const minutes = durationInMinutes % 60;
  const formattedDuration = `${hours} hour${hours !== 1 ? 's' : ''} and ${minutes} minute${minutes !== 1 ? 's' : ''}`;

  return {
    departure: formattedDeparture,
    arrival: formattedArrival,
    duration: formattedDuration
  };
}