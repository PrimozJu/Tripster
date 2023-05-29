import React, { useState } from "react"
import FormFlights from "./FormFlights";
import axios from "axios";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import routes from "routes";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import bgImage from "assets/images/tnf.jpg";
import FlightsList from "./FlightsList";
// Material Kit 2 React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import ReactLoading from "react-loading";
import { db, auth } from '../../../index';
import { localApiFlights } from "secret-keys";


const Flights = () => {
  const [response, setResponse] = useState(undefined)
  const [loading, setLoading] = useState(false);

  async function handleForm(params) {
    console.log(`parameters: ${JSON.stringify(params)}`);

    let userEmail = null;
    try {
      userEmail = auth.currentUser.email
    } catch (err) {}

    const options = {
      method: "GET",
      url: localApiFlights,
      headers: {
        "Content-Type": "application/json",
        "user": userEmail
      },
      params: params
    }

    try {
      setLoading(true);
      const respons = await axios.request(options);
  
      //PRIMA - Tu mas array
      const responseData = respons.data;
      console.log(responseData);
      
      setResponse(responseData)
    } catch (err) {
      console.error(err.message);
    }

    setLoading(false);
  }

  return (
    <div >
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
              Join mekdonalc millions of travellers around the world and take the journeys that matter. Using our search engine, you can find the best deals on flights, hotels, and car rentals.
            
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

        
        <FormFlights handleForm={handleForm} />
        <div id="data"></div>
       

        {loading ? (
          <ReactLoading type="bars" color="#000" height={50} width={50} />
        ) : response ? (
          <FlightsList data={response} />
        ) : null}
      </Card>



    </div>
  )
}
export default Flights
