import React from "react";
import { Typography, Card, CardContent, List, ListItem, ListItemText, Grid } from "@mui/material";

const ItineraryDetails = ({ data }) => {
  console.log(data);
  if (!data || data.tripArray.length === 0) {
    return null; // If data or tripArray is undefined or empty, don't display anything
  }

  const { travelDestination, tripArray } = data;

  return (
    <div>
      <Card variant="outlined" sx={{ marginBottom: 2 }}>
        <CardContent>
          <Typography variant="h4" component="h1">
            {travelDestination}
          </Typography>
        </CardContent>
      </Card>
      <Grid container spacing={2} sx={{ display: 'flex', flexWrap: 'wrap' }}>
        {tripArray.map((day) => (
          <Grid key={day.day} item xs={12} md={4}>
            <Card variant="outlined" sx={{ marginBottom: 4, height: '100%' }}>
              <CardContent>
                <Typography variant="h5" component="h3">
                  Day {day.day}
                </Typography>
                <Typography variant="body1" component="p">
                  <i>{day.description}</i>
                </Typography>
                <List>
                  {day.activities.map((activity, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={activity} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default ItineraryDetails;
