import React, { useState } from "react";

const FormAirBnb = ({ handleForm }) => {
  const [location, setLocation] = useState("");
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [pets, setPets] = useState(0);
  const [page, setPage] = useState(1);
  const [currency, setCurrency] = useState("EUR");

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = {
      location: location.toString(),
      checkin: checkin.toString(),
      checkout: checkout.toString(),
      adults: adults.toString(),
      children: children.toString(),
      infants: infants.toString(),
      pets: pets.toString(),
      page: page.toString(),
      currency: currency.toString(),
    };
    handleForm(params);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Location:
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </label>
      <br />
      <label>
        Checkin:
        <input
          type="date"
          value={checkin}
          onChange={(e) => setCheckin(e.target.value)}
        />
      </label>
      <br />
      <label>
        Checkout:
        <input
          type="date"
          value={checkout}
          onChange={(e) => setCheckout(e.target.value)}
        />
      </label>
      <br />
      <label>
        Adults:
        <input
          type="number"
          value={adults}
          onChange={(e) => setAdults(e.target.value)}
        />
      </label>
      <br />
      <label>
        Children:
        <input
          type="number"
          value={children}
          onChange={(e) => setChildren(e.target.value)}
        />
      </label>
      <br />
      <label>
        Infants:
        <input
          type="number"
          value={infants}
          onChange={(e) => setInfants(e.target.value)}
        />
      </label>
      <br />
      <label>
        Pets:
        <input
          type="number"
          value={pets}
          onChange={(e) => setPets(e.target.value)}
        />
      </label>
      <br />
      <label>
        Page:
        <input
          type="number"
          value={page}
          onChange={(e) => setPage(e.target.value)}
        />
      </label>
      <br />
      <label>
        Currency:
        <input
          type="text"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
        />
      </label>
      <br />
      <button type="submit">Submit</button>
    </form>
  );
};

export default FormAirBnb;

