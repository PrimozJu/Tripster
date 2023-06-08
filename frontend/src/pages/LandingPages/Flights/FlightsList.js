import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import Flights from './Flights';
import Card from "@mui/material/Card";
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Add, Colorize } from '@mui/icons-material';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import FlightLandIcon from '@mui/icons-material/FlightLand';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import ConnectingAirportsIcon from '@mui/icons-material/ConnectingAirports';
import FlightIcon from '@mui/icons-material/Flight';
import { UserContext } from "../../../App";
import { useContext } from "react";
function FlightsList({ data }) {

  //// console.log(data); //might be useful to see what data is passed to this component

  const divStyle = {
    color: 'red',
    fontSize: '16px',
    backgroundColor: '#f2f2f2',
    padding: '10px',
    borderRadius: '5px',
  };


  const getTransfersComponents = (transfers, way) => { /* tota komponenta je kr yee yee ass ampak it does the job done for now */
    const separatorIndex = transfers.indexOf("|");
    if (separatorIndex !== -1) {
      const beforeSeparator = transfers.slice(0, separatorIndex);
      const afterSeparator = transfers.slice(separatorIndex + 1);



      if (way === "to") {
        if (beforeSeparator.length == 0)
          return (
            <Typography variant="subtitle1"> <FlightIcon /> DIRECT </Typography>
          )
        return (
          <div>
            <ConnectingAirportsIcon />
            {beforeSeparator.length}
            {beforeSeparator.length == 1 && "stop( "}
            {beforeSeparator.length > 1 && " stop" + (beforeSeparator.length > 1 ? "s (" : " (")}
            {beforeSeparator.join(", ") + ")"}
          </div>
        );
      }
      else if (way === "back") {
        if (afterSeparator.length == 0)
          return (
            <Typography variant="subtitle1"> <FlightIcon /> DIRECT </Typography>
          )
        return (
          <div>
            <ConnectingAirportsIcon />
            {afterSeparator.length}
            {afterSeparator.length == 1 && " stop("}
            {afterSeparator.length > 1 && " stop" + (afterSeparator.length > 1 ? "s (" : " (")}
            {afterSeparator.join(", ") + ")"}
          </div>
        );

      } else {
        return (
          <Typography variant="subtitle1">
            {transfers.join(", ")}
          </Typography>
        );
      }
    }
  };

  // Define a state variable to store the items in the cart

  const {cartItems, setCartItems} = useContext(UserContext);


  // Define a function to handle adding an item to the cart
  const handleAddProduct = product => {
    // Check if the product already exists in the cart
    const productExist = cartItems.find(item => item.id === product.id);
    
    if (productExist) {
      // If so, update its quantity
      setCartItems(
        cartItems.map(item =>
          item.id === product.id
            ? { ...productExist, quantity: productExist.quantity + 1 }
            : item
        )
      );
    } else {
      // Otherwise, add it to the cart with a default quantity of 1
      const updatedProduct = { ...product, quantity: 1, type: "1" };
      setCartItems([...cartItems, updatedProduct]);
    }
  };
  

  return (
    <div className="container">
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4">
        {data.map((flight, index) => (

          <Card
            sx={{
              p: 2,
              mx: { xs: 2, lg: 3 },
              mt: +3,
              mb: 4,
              backgroundColor: ({ palette: { white }, functions: { rgba } }) => rgba(white.main, 0.8),
              backdropFilter: "saturate(200%) blur(30px)",
              boxShadow: ({ boxShadows: { xxl } }) => xxl,
            }}
          >

            <CardContent>
              {index === 0 && <Typography variant="h6" gutterBottom>
                <div style={divStyle}> Cheapest Flight </div>
              </Typography>
              }
              {index === 1 && <Typography variant="h6" gutterBottom>
                <div style={divStyle}> Fastest flight </div>
              </Typography>
              }


              <Typography variant="h6" gutterBottom>
                {flight.airlines.length < 2 ? "Airline: " : "Airlines: "}{flight.airlines.join(", ")}

              </Typography>

              <Typography variant="h6" gutterBottom>
                {flight.cityFrom} - {flight.cityTo}
                {getTransfersComponents(flight.transfers, "to")}
              </Typography>
              <Typography variant="subtitle1">
                <FlightTakeoffIcon sx={{ color: 'green' }} />
                <strong>Departure:</strong> {flight.routeTo[0].departure}
              </Typography>

              <Typography variant="subtitle1">
                <FlightLandIcon sx={{ color: 'red' }} />
                <strong>Arrival:</strong> {flight.routeTo[0].arrival}
              </Typography>
              <Typography variant="subtitle1">
                <AccessTimeIcon sx={{ color: 'blue' }} />
                <strong>Duration:</strong> {flight.duration}
              </Typography>
              <hr />
              <Typography variant="h6" gutterBottom>
                {flight.cityTo} - {flight.cityFrom}
                {getTransfersComponents(flight.transfers, "back")}
              </Typography>
              <Typography variant="subtitle1">
                <FlightTakeoffIcon sx={{ color: 'green' }} />
                <strong>Departure:</strong> {flight.routeFrom[0].departure}
              </Typography>
              <Typography variant="subtitle1">
                <FlightLandIcon sx={{ color: 'red' }} />
                <strong>Arrival:</strong> {flight.routeFrom[0].arrival}
              </Typography>
              <Typography variant="subtitle1">
                <AccessTimeIcon sx={{ color: 'blue' }} />
                <strong>Duration:</strong> {flight.durationBack}
              </Typography>
              <hr />
              <Typography variant="subtitle1">
                <strong>Price:</strong> {flight.price} EUR
              </Typography>

              <Typography variant="subtitle1">
                <Button
                  sx={{ color: 'success.main', fontSize: 20 }}
                  onClick={() => handleAddProduct(flight)} >
                  <AddShoppingCartIcon />
                  Add to cart
                </Button>
              </Typography>

            </CardContent>
          </Card>

        ))}
      </div>
    </div>
  );
}

export default FlightsList;
