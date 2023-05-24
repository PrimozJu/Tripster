import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import Flights from './Flights';
import Card from "@mui/material/Card";
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Colorize } from '@mui/icons-material';
function FlightsList({ data }) {
  console.log("nanaanan");
  console.log(data);

  const divStyle = {
    color: 'red',
    fontSize: '16px',
    backgroundColor: '#f2f2f2',
    padding: '10px',
    borderRadius: '5px',
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
            {index===0 && <Typography variant="h6" gutterBottom>
                <div style={divStyle}> Best Flight </div>
                </Typography>
          }
              <Typography variant="h6" gutterBottom>
                Flight Details
              </Typography>
              <Typography variant="subtitle1">
                <strong>Airlines:</strong> {flight.airlines.join(", ")}
              </Typography>
              <Typography variant="subtitle1">
                <strong>Departure:</strong> {flight.departure}
              </Typography>
              <Typography variant="subtitle1">
                <strong>Arrival:</strong> {flight.arrival}
              </Typography>
              <Typography variant="subtitle1">
                <strong>Duration:</strong> {flight.duration}
              </Typography>
              <Typography variant="subtitle1">
                <strong>Price:</strong> {flight.price}
              </Typography>
              <Typography variant="subtitle1">
                <strong>Availability:</strong> {flight.availability}
              </Typography>
              <Typography variant="subtitle1">
                <strong>Transfers:</strong> {flight.transfers.join(", ")}
              </Typography>
            </CardContent>

          </Card>

        ))}
      </div>
    </div>
  );
}

export default FlightsList;

