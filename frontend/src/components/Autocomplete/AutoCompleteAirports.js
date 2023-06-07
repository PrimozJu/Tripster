import React, { useEffect, useState } from "react";
import MKInput from "components/MKInput";
import Airports from "../../assets/aiports/airports";
import { Air } from "@mui/icons-material";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";

const AutocompleteAirports = (props) => {
  const findCode = (name) => {
    // console.log("prozim funkcijo findCode");
    const airport = Airports.find((airport) => airport.name === name);

    if (airport) {
      // console.log("Nasel sem letalisce");
      // console.log(airport.iata);
      return airport.iata;
    }

    // Return a default value or handle the case when the airport is not found
    return null;
  };

  const airports = Airports;
  const items = airports
    .filter((airport) => airport.name)
    .map((airport) => airport.name);
  const setLocation = props.setLocation;

  const [state, setState] = useState({
    activeItem: 0,
    filteredItems: [],
    displayItems: false,
    inputValue: "",
  });

  const handleChange = (e) => {
    const inputValue = e.currentTarget.value;
    setLocation(e.currentTarget.value);
    const filteredItems = items
      .filter((optionName) =>
        optionName.toLowerCase().startsWith(inputValue.toLowerCase())
      )
      .slice(0, 3); // Display only three most accurate options

    setState({
      activeItem: 0,
      filteredItems,
      displayItems: true,
      inputValue: e.currentTarget.value,
    });
  };

  const handleClick = (e) => {
    const clickedItemValue = e.currentTarget.innerText;
    setState({
      activeItem: 0,
      filteredItems: [],
      displayItems: false,
      inputValue: clickedItemValue,
    });
    const AirportCode = findCode(clickedItemValue);
    // console.log(AirportCode);
    setLocation(AirportCode);
  };

  const handleKeyDown = (e) => {
    const { activeItem, filteredItems } = state;

    if (e.keyCode === 13) {
      setState({
        activeItem: 0,
        filteredItems: [],
        displayItems: false,
        inputValue: filteredItems[activeItem],
      });
    } else if (e.keyCode === 38) {
      e.preventDefault();
      if (activeItem === 0) {
        return;
      }
      setState({
        activeItem: activeItem - 1,
        filteredItems,
        displayItems: true,
        inputValue: e.currentTarget.value,
      });
    } else if (e.keyCode === 40) {
      e.preventDefault();
      if (
        (filteredItems && activeItem === filteredItems.length - 1) ||
        activeItem >= 9
      ) {
        return;
      }
      setState({
        activeItem: activeItem + 1,
        filteredItems,
        displayItems: true,
        inputValue: e.currentTarget.value,
      });
    }
  };

  return (
    <div className="uk-inline uk-width-1-1 uk-margin-top">
      <span className="uk-form-icon" data-uk-icon="icon: world" />
      <MKInput
        name="countries"
        placeholder="Enter a country and press enter"
        className="uk-input uk-form-large uk-width-expand"
        value={state.inputValue}
        autoComplete="off"
        autoCapitalize="off"
        autoCorrect="off"
        onChange={handleChange}
      />
      {state.displayItems && state.inputValue.length && state.filteredItems.length ? (
        <TableContainer className="list-panel uk-panel uk-padding-remove uk-box-shadow-medium">
          <Table>
            <TableBody>
              {state.filteredItems.map((optionName, index) => (
                <TableRow
                  className={`${
                    state.activeItem === index ? "active-item" : "default-item"
                  }`}
                  key={optionName}
                  onClick={handleClick}
                >
                  <TableCell>{optionName}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : null}
    </div>
  );
};

export default AutocompleteAirports;
