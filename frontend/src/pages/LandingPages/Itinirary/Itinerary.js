import React, { useState } from "react";
import TripForm from "./FormChat";
import axios from "axios";
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

    const query = `Hi ChatGPT, can you recommend a trip based on my travel preferences? My desired dates of travel are ${departureDate} to ${returnDate}, and there will be ${numTravelers} traveling. I'm interested in traveling to ${desiredContinent}, and I'm looking for a ${travelType} experience. My interests include ${interests}. I would prefer to stay in a ${preferredAccommodation}, and my maximum budget is ${maxBudget}. Based on these preferences, what trip do you recommend?`;

    console.log(query);

    const options = {
      method: "POST",
      url: "https://chatgpt53.p.rapidapi.com/",
      headers: {
        "content-type": "application/json",
        "X-RapidAPI-Key": "0e529198bdmshaba36f78a36a9a5p1a9db0jsn082565d2fdf8",
        "X-RapidAPI-Host": "chatgpt53.p.rapidapi.com",
      },
      data: {
        messages: [
          {
            role: "user",
            content: query,
          },
        ],
      },
    };

    try {
      setLoading(true);
      const respons = await axios.request(options);
      console.log(respons.data.choices[0].message.content);
      setResponse(respons.data.choices[0].message.content);
      //document.getElementById("chatDiv").innerHTML = response.data.choices[0].message.content;
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
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
              Join millions of travelers around the world and take the journeys that matter. Using our search engine, you can find the best deals on flights, hotels, and car rentals.
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
          backgroundColor: ({ palette: { white }, functions: { rgba } }) => rgba(white.main, 0.8),
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
