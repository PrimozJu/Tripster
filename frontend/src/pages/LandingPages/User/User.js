import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import MKBox from "components/MKBox";
import MKButton from "components/MKButton";
import MKTypography from "components/MKTypography";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../../../App";
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import { db } from "../../../index";
import DefaultNavbarDropdown from "examples/Navbars/DefaultNavbar/DefaultNavbarDropdown";
import DefaultNavbarMobile from "examples/Navbars/DefaultNavbar/DefaultNavbarMobile";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import routes from "routes";
const User = () => {
    const colRef = collection(db, "user1");
    const [iskanje, setIskanje] = useState([]);
    const navigate = useNavigate();
    const { userIdState, setUserIdState } = useContext(UserContext);

    useEffect(() => {
        izpisiIskanja();
    }, []);

    const izpisiIskanja = () => {
        getDocs(colRef)
            .then((querySnapshot) => {
                const data = [];
                querySnapshot.forEach((doc) => {
                    console.log(`${doc.id} => ${doc.data()}`);
                    if (doc.data().userid == userIdState) {
                        data.push(doc.data());
                    }
                });
                setIskanje(data);
            })
            .catch((error) => {
                console.log("napaka pri branju iz baze", error);
            });
    };

    const SignOut = () => {
        const auth = getAuth();
        signOut(auth)
            .then(() => {
                console.log("odjavljen");
                navigate("/Presentation");
                setUserIdState(null);
            })
            .catch((error) => {
                console.log("napaka pri odjavi", error);
            });
    };

    return (
        <>
            {/* Your Navbar and other components */}
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
                        `${linearGradient(rgba(gradients.dark.main, 0.6), rgba(gradients.dark.state, 0.6))}, url(${bgImage})`,
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
                            {iskanje.map((item, index) => (
                                <MKTypography
                                    key={index}
                                    variant="body2"
                                    fontWeight={400}
                                    color="text.secondary"
                                    gutterBottom
                                >
                                    {item.location} :
                                    from: {item.checkin + " "}
                                    to:  {item.checkout}
                                </MKTypography>
                            ))}
                        </Card>
                        <Card>
                            kot kaže si prijavljen
                            <MKButton variant="gradient" color="warning" width="100%" mt={3} onClick={SignOut}>
                                SignOut
                            </MKButton>
                        </Card>
                    </Grid>
                </Grid>
            </MKBox>
            <MKBox width="100%" position="absolute" zIndex={2} bottom="1.625rem"></MKBox>
        </>
    );
};

export default User;
