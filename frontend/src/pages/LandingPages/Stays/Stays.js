import React, { useState } from "react"
import FormAirBnb from "./FormAirBnb";
import axios from "axios";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import routes from "routes";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import bgImage from "assets/images/tnf.jpg";
import ApartmentList from "./ApartmentList";
// Material Kit 2 React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import ReactLoading from "react-loading";


const Stays = () => {
  //let response;
  const [response, setResponse] = useState(undefined)
  //ne seri
  const [loading, setLoading] = useState(false);



  async function handleForm(params) {
    console.log(params);
    const options = {
      method: "GET",
      url: "https://airbnb13.p.rapidapi.com/search-location",
      params: {
        location: params.location,
        checkin: params.checkin,
        checkout: params.checkout,
        adults: params.adults,
        children: params.children,
        infants: params.infants,
        pets: params.pets,
        page: params.page,
        currency: params.currency,
      },
      headers: {
        "X-RapidAPI-Key": "0e529198bdmshaba36f78a36a9a5p1a9db0jsn082565d2fdf8",
        "X-RapidAPI-Host": "airbnb13.p.rapidapi.com",
      },
    };

    setLoading(true);
    const respons = await axios.request(options);
    setResponse(respons)
    console.log(respons.data.results);

    //    setLoading(false
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
              Join millions of travellers around the world and take the journeys that matter. Using our search engine, you can find the best deals on flights, hotels, and car rentals.
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

        The search engine will go here
        <FormAirBnb handleForm={handleForm} />
        <div id="data"></div>
        {/*       <ApartmentList data={response.data.results} />
 */}

        {/*   {response && <ApartmentList data={response.data.results} />} */}

        {loading ? (
  <ReactLoading type="bars" color="#000" height={50} width={50} />
) : response ? (
  <ApartmentList data={response.data.results} />
) : null}
      </Card>



    </div>
  )
}
export default Stays
