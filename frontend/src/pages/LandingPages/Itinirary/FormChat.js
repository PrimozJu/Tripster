import React, { useState } from "react";
import MKBox from "components/MKBox";
import MKInput from "components/MKInput";

function TripForm({ submit }) {
  const [departureDate, setDepartureDate] = useState("18-7-2023");
  const [returnDate, setReturnDate] = useState("29-7-2023");
  const [numTravelers, setNumTravelers] = useState("1");
  const [desiredContinent, setDesiredContinent] = useState("Europe");
  const [travelType, setTravelType] = useState("adventure");
  const [interests, setInterests] = useState("hiking");
  const [preferredAccommodation, setPreferredAccommodation] = useState("hotels");
  const [maxBudget, setMaxBudget] = useState("10000");

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = {
      departureDate,
      returnDate,
      numTravelers,
      desiredContinent,
      travelType,
      interests,
      preferredAccommodation,
      maxBudget,
    };
    submit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <MKBox display="flex" flexDirection="column" gap={2}>
        <MKBox display="flex" alignItems="center" gap={1}>
          <label>Departure date:</label>
          <MKInput
            type="text"
            value={departureDate}
            onChange={(event) => setDepartureDate(event.target.value)}
          />
        </MKBox>
        <MKBox display="flex" alignItems="center" gap={1}>
          <label>Return date:</label>
          <MKInput
            type="text"
            value={returnDate}
            onChange={(event) => setReturnDate(event.target.value)}
          />
        </MKBox>
        <MKBox display="flex" alignItems="center" gap={1}>
          <label>Number of travelers:</label>
          <MKInput
            type="text"
            value={numTravelers}
            onChange={(event) => setNumTravelers(event.target.value)}
          />
        </MKBox>
        <MKBox display="flex" alignItems="center" gap={1}>
          <label>Desired location:</label>
          <MKInput
            type="text"
            value={desiredContinent}
            onChange={(event) => setDesiredContinent(event.target.value)}
          />
        </MKBox>
        <MKBox display="flex" alignItems="center" gap={1}>
          <label>Travel type:</label>
          <MKInput
            type="text"
            value={travelType}
            onChange={(event) => setTravelType(event.target.value)}
          />
        </MKBox>
        <MKBox display="flex" alignItems="center" gap={1}>
          <label>Interests:</label>
          <MKInput
            type="text"
            value={interests}
            onChange={(event) => setInterests(event.target.value)}
          />
        </MKBox>
        <MKBox display="flex" alignItems="center" gap={1}>
          <label>Preferred accommodation:</label>
          <MKInput
            type="text"
            value={preferredAccommodation}
            onChange={(event) => setPreferredAccommodation(event.target.value)}
          />
        </MKBox>
        <MKBox display="flex" alignItems="center" gap={1}>
          <label>Max budget:</label>
          <MKInput
            type="text"
            value={maxBudget}
            onChange={(event) => setMaxBudget(event.target.value)}
          />
        </MKBox>
      </MKBox>
      <button type="submit">Submit</button>
    </form>
  );
}

export default TripForm;

