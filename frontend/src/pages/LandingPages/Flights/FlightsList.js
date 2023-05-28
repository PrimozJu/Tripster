import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import Flights from './Flights';
import Card from "@mui/material/Card";
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Colorize } from '@mui/icons-material';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import FlightLandIcon from '@mui/icons-material/FlightLand';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
function FlightsList({ data }) {
  
  //console.log(data); //might be useful to see what data is passed to this component

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
        return (
          <div>
            {beforeSeparator.length}
            {beforeSeparator.length == 1 && "stop( "}
            {beforeSeparator.length > 1 && " stop" + (beforeSeparator.length > 1 ? "s (" : " (")}
            {beforeSeparator.join(", ") + ")"}
          </div>
        );
      }
      else if (way === "back") {
        return (
          <div>
            {afterSeparator.length}
            {afterSeparator.length == 1 && "stop("}
            {afterSeparator.length > 1 && "stop" + (afterSeparator.length > 1 ? "s (" : " (")}
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
                <div style={divStyle}> Best Flight </div>
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
                {/* za nazaj, naredi še lepo narjene prestope */}
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



            </CardContent>

          </Card>

        ))}
      </div>
    </div>
  );
}

export default FlightsList;
