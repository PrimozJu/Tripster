import React, { useState } from "react";
import TripForm from "./FormChat";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import routes from "routes";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import bgImage from "assets/images/tnf.jpg";
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import ReactLoading from "react-loading";
import ItineraryDetails from "./ItineraryDetails";
const Itinerary = () => {
  const [response, setResponse] = useState(undefined);
  const [loading, setLoading] = useState(false);

  async function chatTalk(params) {
    console.log(params);
    const departureDate = params.departureDate;
    const returnDate = params.returnDate;
    const numTravelers = params.numTravelers;
    const desiredContinent = params.desiredContinent;
    const travelType = params.travelType; //adventure cultural, relaxation
    const interests = params.interest;
    const preferredAccommodation = params.preferredAccommodation;
    const maxBudget = params.maxBudget;

    const jsonData = {
      departureDate: departureDate,
      returnDate: returnDate,
      numTravelers: numTravelers,
      desiredContinent: desiredContinent,
      travelType: travelType,
      interests: interests,
      preferredAccommodation: preferredAccommodation,
      maxBudget: maxBudget,
    };

    const options = {
      method: "POST",
      url: "http://127.0.0.1:5001/tripsterpraktikum-e913c/europe-west2/app/itineary-chat-gpt",
      data: JSON.stringify(jsonData),
    };

    fetch(options.url, {
      method: options.method,
      body: options.data,
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the response data here
        setLoading(true);

        console.log(data);
        setResponse(data);

        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }

  return (
    <div>
      <DefaultNavbar
        routes={routes}
        action={{
          type: "internal",
          route: "/user/login",
          label: "Login",
          color: "info",
        }}
        sticky
      />

      <MKBox
        minHeight="75vh"
        width="100%"
        sx={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "top",
          display: "grid",
          placeItems: "center",
        }}
      >
        <Container>
          <Grid container item xs={12} lg={7} justifyContent="center" mx="auto">
            <MKTypography
              variant="h1"
              color="dark blue"
              mt={-6}
              mb={1}
              sx={({ breakpoints, typography: { size } }) => ({
                [breakpoints.down("md")]: {
                  fontSize: size["3xl"],
                },
              })}
            />
            <MKTypography
              variant="h1"
              color="dark blue"
              mt={-6}
              mb={1}
              sx={({ breakpoints, typography: { size } }) => ({
                [breakpoints.down("md")]: {
                  fontSize: size["3xl"],
                },
              })}
            >
              Tripster{" "}
            </MKTypography>
            <MKTypography
              variant="body1"
              color="dark blue"
              textAlign="center"
              px={{ xs: 6, lg: 12 }}
              mt={1}
            >
              Join millions of travelers around the world and take the journeys
              that matter. Using our search engine, you can find the best deals
              on flights, hotels, and car rentals.
            </MKTypography>
          </Grid>
        </Container>
      </MKBox>

      <Card
        sx={{
          p: 2,
          mx: { xs: 2, lg: 3 },
          mt: -5,
          mb: 4,
          backgroundColor: ({ palette: { white }, functions: { rgba } }) =>
            rgba(white.main, 0.8),
          backdropFilter: "saturate(200%) blur(30px)",
          boxShadow: ({ boxShadows: { xxl } }) => xxl,
        }}
      >
        <TripForm submit={chatTalk}></TripForm>
        <div id="chatDiv"></div>

        {loading ? (
          <ReactLoading type="bars" color="#000" height={50} width={50} />
        ) : response ? (
          <ItineraryDetails data={response} />
        ) : null}
      </Card>
    </div>
  );
};

export default Itinerary;
