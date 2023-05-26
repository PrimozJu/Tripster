
import { Fragment, useState, useEffect } from "react";

// react-router components
import { Link } from "react-router-dom";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @mui material components
import Container from "@mui/material/Container";
import Icon from "@mui/material/Icon";
import Popper from "@mui/material/Popper";
import Grow from "@mui/material/Grow";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import MuiLink from "@mui/material/Link";

// Material Kit 2 React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import MKButton from "components/MKButton";

// Material Kit 2 React example components
import DefaultNavbarDropdown from "examples/Navbars/DefaultNavbar/DefaultNavbarDropdown";
import DefaultNavbarMobile from "examples/Navbars/DefaultNavbar/DefaultNavbarMobile";

// Material Kit 2 React base styles
import breakpoints from "assets/theme/base/breakpoints";
import { onAuthStateChanged } from "firebase/auth";
import Button from "assets/theme/components/button";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import routes from "routes";

//cigo

// react-router-dom components

// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";

// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";

// Material Kit 2 React components
import MKInput from "components/MKInput";

import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import { getAuth, signOut } from "firebase/auth";
import { useLocation, useHistory, useNavigate } from 'react-router-dom';
import { useContext } from "react";
import { UserContext } from "../../../App";
//import { getAuth } from 'firebase/auth';
import { db } from "../../../index";
import {
    getFirestore,
    collection,
    getDocs
} from "firebase/firestore";
import { auth } from "../../../index";
/* 
const querySnapshot = await getDocs(collection(db, "cities", "SF", "landmarks"));
querySnapshot.forEach((doc) => {
  // doc.data() is never undefined for query doc snapshots
  console.log(doc.id, " => ", doc.data());
}); */
const User = () => {

    const colRef = collection(db, "user1");


    console.log("prozim");
    getDocs(colRef).then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            console.log(`${doc.id} => ${doc.data()}`);
            //tu moram zaj getnit ID pol pa spremenit da iz baze prebere samo za da faking ID, je jasno? good

        });
        console.log("ah shit")
    });


    const navigate = useNavigate();
    const { userIdState, setUserIdState } = useContext(UserContext);

    const SignOut = () => {
        const auth = getAuth();
        signOut(auth).then(() => {
            console.log("odjavljen");
            navigate("/Presentation");
            setUserIdState(null);
        }).catch((error) => {
            // An error happened.
            console.log("napaka pri odjavi");
        });




    }

    return (
        <>
            <DefaultNavbar
                routes={routes}
                action={{
                    type: "external",
                    route: "/user/login",
                    label: "Login",
                    color: "info",
                }}
                transparent
                light
            />

            <MKBox
                position="absolute"
                top={0}
                left={0}
                zIndex={1}
                width="100%"
                minHeight="100vh"
                sx={{
                    backgroundImage: ({ functions: { linearGradient, rgba }, palette: { gradients } }) =>
                        `${linearGradient(
                            rgba(gradients.dark.main, 0.6),
                            rgba(gradients.dark.state, 0.6)
                        )}, url(${bgImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                }}
            />
            <MKBox px={1} width="100%" height="100vh" mx="auto" position="relative" zIndex={2}>
                <Grid container spacing={1} justifyContent="center" alignItems="center" height="100%">
                    <Grid item xs={11} sm={9} md={5} lg={4} xl={3}>
                        <Card sx={{ p: 3, borderRadius: 2, bgcolor: "background.paper" }}>
                            <MKTypography variant="h2" fontWeight={700} gutterBottom>
                                Pretekla iskanja
                            </MKTypography>
                            <MKTypography variant="body2" fontWeight={400} color="text.secondary" gutterBottom>
                                
                            </MKTypography>

                        </Card>
                        <Card>
                            kot kaže si prijavljen
                            <MKButton variant="gradient" color="warning" width="100%" mt={3} onClick={SignOut}> SignOut </MKButton>
                        </Card>

                    </Grid>
                </Grid>
            </MKBox>
            <MKBox width="100%" position="absolute" zIndex={2} bottom="1.625rem">

            </MKBox>

        </>

    );


}
export default User;