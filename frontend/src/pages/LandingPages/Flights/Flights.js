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
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import ReactLoading from "react-loading";
import { db, auth } from '../../../index';
import { localApiFlights } from "secret-keys";
import DefaultFooter from "examples/Footers/DefaultFooter";
import footerRoutes from "footer.routes";
import Airplane from "../../../assets/images/itinerary/airplane.png";

const Flights = () => {
  const [response, setResponse] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // New state variable for error message
  async function handleForm(params) {

    // console.log(`parameters: ${JSON.stringify(params)}`);

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
  
      // PRIMA - Tu mas array
      const responseData = respons.data;
      // console.log(responseData);
      
      setResponse(responseData);
      setError(null); // Reset error state if request succeeds
    } catch (err) {
      console.error(err.message);
      setError("Something went wrong, try again later"); // Set error message in state
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
       

       
      

      {loading && (
        <Grid container item xs={12} justifyContent="center">
          <img
            src={Airplane}
            className="loadingImg"
            alt="Airplane"
            style={{ height: "100px", width: "100px" }}
          />
        </Grid>
      )}

      {response && (
        <Card>
          <FlightsList data={response} />
        </Card>
      )}
      </Card>


        <DefaultFooter content={footerRoutes} />
    

    </div>
  )
}
export default Flights
