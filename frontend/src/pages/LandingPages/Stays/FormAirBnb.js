import React, { useState } from "react";
import MKBox from "components/MKBox";
import MKInput from "components/MKInput";
import countriesList from "../../../components/Autocomplete/cities";
import AutoComplete from "../../../components/Autocomplete/AutoComplete";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
const FormAirBnb = ({ handleForm }) => {
  const [location, setLocation] = useState("Maribor");
  const [checkin, setCheckin] = useState("2023-07-02");
  const [checkout, setCheckout] = useState("2023-07-14");
  const [adults, setAdults] = useState(2);
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
      <MKBox display="flex" flexDirection="column" gap={2}>
        <MKBox display="flex" alignItems="center" gap={1}>
          <label>Location:</label>
          <AutoComplete
            countries={countriesList}
            setDesiredContinent={setLocation}
          />
        </MKBox>
        <MKBox display="flex" alignItems="center" gap={1}>
          <label>Checkin:</label>
          <MKInput
            type="date"
            value={checkin}
            onChange={(e) => setCheckin(e.target.value)}
          />
        </MKBox>
        <MKBox display="flex" alignItems="center" gap={1}>
          <label>Checkout:</label>
          <MKInput
            type="date"
            value={checkout}
            onChange={(e) => setCheckout(e.target.value)}
          />
        </MKBox>
        <MKBox display="flex" alignItems="center" gap={1}>
          <label>People:</label>
          <MKInput
            type="number"
            value={adults}
            onChange={(e) => setAdults(e.target.value)}
            placeholder="Adults"
          />
        </MKBox>
        
       {/*  <MKBox display="flex" alignItems="center" gap={1}>
          <label>Currency:</label>
          <MKInput
            type="text"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          />
        </MKBox> */}
        <MKBox display="flex" alignItems="center" gap={1}>
          <InputLabel id="demo-simple-select-label">Currency</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={currency}
            label="currency"
            onChange={(e) => setCurrency(e.target.value)}
          >
            <MenuItem value={"EUR"}>EUR</MenuItem>
            <MenuItem value={"USD"}>USD</MenuItem>
            <MenuItem value={"GBP"}>GBP</MenuItem>
          </Select>
        </MKBox>
      </MKBox>
      <button type="submit">Submit</button>
    </form>
  );
};

export default FormAirBnb;
