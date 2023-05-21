import React, { useState } from "react";
import MKInput from "components/MKInput";
const Autocomplete = (props) => {
  const items = props.countries;
  const setDesiredContinent = props.setDesiredContinent;
  console.log(items);

  const [state, setState] = useState({
    activeItem: 0,
    filteredItems: [],
    displayItems: false,
    inputValue: "",
  });

  const handleChange = (e) => {
    const inputValue = e.currentTarget.value;
    setDesiredContinent(e.currentTarget.value);
    const filteredItems = items.filter(
      (optionName) =>
        optionName.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
    );

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
  };

  const handleKeyDown = (e) => {
    const { activeItem, filteredItems } = state;

    if (e.keyCode === 13) {
      // keyCode 13 is the "enter" key
      setState({
        activeItem: 0,
        filteredItems: [],
        displayItems: false,
        inputValue: filteredItems[activeItem],
      });
    } else if (e.keyCode === 38) {
      // keyCode 38 is the up arrow key
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
      // keyCode 40 is the down arrow
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
      {state.displayItems &&
      state.inputValue.length &&
      state.filteredItems.length ? (
        <div className="list-panel uk-panel uk-padding-remove uk-box-shadow-medium">
          <ul className="uk-list">
            {state.filteredItems
              .map((optionName, index) => {
                return (
                  <li
                    className={`${
                      state.activeItem === index
                        ? "active-item"
                        : "default-item"
                    }`}
                    key={optionName}
                    onClick={handleClick} // <-- new
                  >
                    {optionName}
                  </li>
                );
              })
              .slice(0, 10)}
          </ul>
        </div>
      ) : null}
    </div>
  );
};

export default Autocomplete;
