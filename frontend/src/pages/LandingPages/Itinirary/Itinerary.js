import React, { useState } from "react";
import TripForm from "./FormChat";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import routes from "routes";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import bgImage from "assets/images/tnf.jpg";
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import ReactLoading from "react-loading";
import ItineraryDetails from "./ItineraryDetails";
import firebase from "firebase/app";
import { getAuth } from "firebase/auth";
import "./Itinerary.css";
import footerRoutes from "../../../footer.routes";
import { chatAPI } from "secret-keys";

import Airplane from "../../../assets/images/itinerary/airplane.png";
import DefaultFooter from "examples/Footers/DefaultFooter";

//import "firebase/auth";

const Itinerary = () => {
  const [response, setResponse] = useState(undefined);
  const [loading, setLoading] = useState(false);

  async function chatTalk(params) {
    // console.log(params);
    const travelTime = params.travelTime;
    const travelDestination = params.travelDestination;
    const additionalInfo = params.additionalInfo;

    const jsonData = {
      travelTime,
      travelDestination,
      additionalInfo,
    };

    const options = {
      method: "POST",
      url: chatAPI,
      data: JSON.stringify(jsonData),
    };

    setLoading(true);

    try {
      const response = await fetch(options.url, {
        method: options.method,
        body: options.data,
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setResponse(data);
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  }

  const auth = getAuth();
  const user = auth.currentUser;

  if (user) {
    // User is signed in.
    // console.log("user je prijavljen");
    // ...
  } else {
    // No user is signed in.
    // console.log("user NI prijavljen");
  }

  const footerStyle = {
    backgroundColor: "#f5f5f5",
    paddingTop: "3vw",
  };



  return (
    <>
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
          backgroundColor: ({ palette: { white }, functions: { rgba } }) =>
            rgba(white.main, 0.8),
          backdropFilter: "saturate(200%) blur(30px)",
          boxShadow: ({ boxShadows: { xxl } }) => xxl,
        }}
      >
        <TripForm submit={chatTalk}></TripForm>
        <div id="chatDiv"></div>
      </Card>

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
          <ItineraryDetails data={response} />
        </Card>
      )}
   <div style={footerStyle}>
        <DefaultFooter content={footerRoutes} />
      </div>
    </>
  );
};

export default Itinerary;