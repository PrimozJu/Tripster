import React, { useState } from "react";
import { TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";

const Autocomplete = (props) => {
  const items = props.countries;
  const setDesiredContinent = props.setDesiredContinent;

  const [state, setState] = useState({
    activeItem: 0,
    filteredItems: [],
    displayItems: false,
    inputValue: "",
  });

  const handleChange = (e) => {
    const inputValue = e.currentTarget.value;
    setDesiredContinent(e.currentTarget.value);
    const filteredItems = items
      .filter((optionName) =>
        optionName.toLowerCase().startsWith(inputValue.toLowerCase())
      )
      .slice(0, 3); // Only keep the first three most accurate options
  
    setState({
      activeItem: 0,
      filteredItems,
      displayItems: true,
      inputValue: e.currentTarget.value,
    });
  };
  

  const handleClick = (e) => {
    setState({
      activeItem: 0,
      filteredItems: [],
      displayItems: false,
      inputValue: e.currentTarget.innerText,
    });
    setDesiredContinent(e.currentTarget.innerText);
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
      <TextField
        name="countries"
        label="Enter a country and press enter"
        variant="standard"
        fullWidth
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
              {state.filteredItems.slice(0, 10).map((optionName, index) => (
                <TableRow
                  className={`${state.activeItem === index ? "active-item" : "default-item"}`}
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

export default Autocomplete;
