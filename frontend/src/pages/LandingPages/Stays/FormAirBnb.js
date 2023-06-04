import React, { useState } from "react";
import { Box, TextField, Button, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import AutoComplete from "../../../components/Autocomplete/AutoComplete";
import countriesList from "../../../components/Autocomplete/cities";

const FormAirBnb = ({ handleForm }) => {
  const [location, setLocation] = useState("Maribor");
  const [checkin, setCheckin] = useState("2023-07-02");
  const [checkout, setCheckout] = useState("2023-07-14");
  const [adults, setAdults] = useState(2);
  const [currency, setCurrency] = useState("EUR");

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = {
      location: location.toString(),
      checkin: checkin.toString(),
      checkout: checkout.toString(),
      adults: adults.toString(),
      currency: currency.toString(),
    };
    handleForm(params);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box display="flex" flexDirection="column" gap={2}>
        <Box display="flex" alignItems="center" gap={1}>
          <InputLabel shrink htmlFor="location-input">
            Location:
          </InputLabel>
          <AutoComplete
            countries={countriesList}
            setDesiredContinent={setLocation}
            maxSuggestions={4} // Set the maximum number of suggestions to show
          />
        </Box>
        <Box display="flex" alignItems="center" gap={1}>
          <InputLabel shrink htmlFor="checkin-input">
            Checkin:
          </InputLabel>
          <TextField
            id="checkin-input"
            type="date"
            value={checkin}
            onChange={(e) => setCheckin(e.target.value)}
          />
        </Box>
        <Box display="flex" alignItems="center" gap={1}>
          <InputLabel shrink htmlFor="checkout-input">
            Checkout:
          </InputLabel>
          <TextField
            id="checkout-input"
            type="date"
            value={checkout}
            onChange={(e) => setCheckout(e.target.value)}
          />
        </Box>
        <Box display="flex" alignItems="center" gap={1}>
          <InputLabel shrink htmlFor="adults-input">
            People:
          </InputLabel>
          <TextField
            id="adults-input"
            type="number"
            value={adults}
            onChange={(e) => setAdults(e.target.value)}
            placeholder="Adults"
          />
        </Box>
        <Box display="flex" alignItems="center" gap={1}>
          <FormControl>
            <InputLabel shrink htmlFor="currency-select">
              
            </InputLabel>
            <Select
              labelId="currency-label"
              id="currency-select"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              <MenuItem value={"EUR"}>EUR</MenuItem>
              <MenuItem value={"USD"}>USD</MenuItem>
              <MenuItem value={"GBP"}>GBP</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>
      <Button
        variant="contained"
        color="success"
        sx={{ backgroundColor: "#4caf50", color: "#ffffff", '&:hover': { backgroundColor: '#388e3c' } }}
        type="submit"
      >
        Submit
      </Button>
    </form>
  );
};

export default FormAirBnb;
