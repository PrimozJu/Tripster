import { useState } from "react";

function TripForm({ submit }) {
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [numTravelers, setNumTravelers] = useState("");
  const [desiredContinent, setDesiredLocation] = useState("");
  const [travelType, setTravelType] = useState("");
  const [interests, setInterests] = useState("");
  const [preferredAccommodation, setPreferredAccommodation] = useState("");
  const [maxBudget, setMaxBudget] = useState("");

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
      <label>
        Departure date:
        <input
          type="text"
          value={departureDate}
          onChange={(event) => setDepartureDate(event.target.value)}
        />
      </label>
      <br />
      <label>
        Return date:
        <input
          type="text"
          value={returnDate}
          onChange={(event) => setReturnDate(event.target.value)}
        />
      </label>
      <br />
      <label>
        Number of travelers:
        <input
          type="text"
          value={numTravelers}
          onChange={(event) => setNumTravelers(event.target.value)}
        />
      </label>
      <br />
      <label>
        Desired location:
        <input
          type="text"
          value={desiredContinent}
          onChange={(event) => setDesiredLocation(event.target.value)}
        />
      </label>
      <br />
      <label>
        Travel type:
        <input
          type="text"
          value={travelType}
          onChange={(event) => setTravelType(event.target.value)}
        />
      </label>
      <br />
      <label>
        Interests:
        <input
          type="text"
          value={interests}
          onChange={(event) => setInterests(event.target.value)}
        />
      </label>
      <br />
      <label>
        Preferred accommodation:
        <input
          type="text"
          value={preferredAccommodation}
          onChange={(event) => setPreferredAccommodation(event.target.value)}
        />
      </label>
      <br />
      <label>
        Max budget:
        <input
          type="text"
          value={maxBudget}
          onChange={(event) => setMaxBudget(event.target.value)}
        />
      </label>
      <br />
      <button type="submit">Submit</button>
    </form>
  );
}

export default TripForm;
