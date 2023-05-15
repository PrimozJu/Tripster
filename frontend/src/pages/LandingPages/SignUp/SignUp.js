import { useState } from "react";
// react-router-dom components
import { Link } from "react-router-dom";
// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Switch from "@mui/material/Switch";
// Material Kit 2 React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import MKInput from "components/MKInput";
import MKButton from "components/MKButton";
// Material Kit 2 React example components
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
// Material Kit 2 React page layout routes
import routes from "routes";
// Images
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import GoogleLogin from 'react-google-login';


import { collection, addDoc } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";




const SignUp = () => {
  const [rememberMe, setRememberMe] = useState(false);
  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  const [formSubmitted, setFormSubmitted] = useState(false);

  const [newDocData, setNewDocData] = useState({});




  const handleInputChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setNewDocData(values => ({ ...values, [name]: value })) //to ne deluje sploh jebote
    //console.log(newDocData);   //LIGHTWEIGHT BABY

  };

  const handleClick = (e) => {
    e.preventDefault();
    console.log("clicked");


    if (newDocData.password === newDocData.password2) {
      const email = newDocData.email; //to je to
      const password = newDocData.password; //to je to
      console.log(email, password);
      const db = getFirestore();
      const addNewDoc = async () => {
        console.log(newDocData);
        try {

          /* const docRef = await addDoc(collection(db, "users"), newDocData);
          console.log("Document written with ID: ", docRef.id);
          setNewDocData({}); */


          const auth = getAuth();
          createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
              // Signed in 
              const user = userCredential.user;
              // ...
              console.log("uspesno registriran user: ", user);
            })
            .catch((error) => {
              const errorCode = error.code;
              const errorMessage = error.message;
              console.log("napaka pri registraciji: ", errorCode, errorMessage);
              // ..
            });
        } catch (e) {
          console.error("Error adding document: ", e);
        }
      };
      addNewDoc()
    }

  }

  /* const handleClickGoogle = (e) => {

    e.preventDefault();
    console.log("clicked google");


    const auth = getAuth();
    signInWithPopup(auth, provider)
  .then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    // The signed-in user info.
    const user = result.user;
    // IdP data available using getAdditionalUserInfo(result)
    // ...
  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    // ...
  });
  } */
  return (
    <>
      <DefaultNavbar
        routes={routes}
        action={{
          type: "external",
          route: "https://www.creative-tim.com/product/material-kit-react",
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
            <Card>
              <MKBox
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
                mx={2}
                mt={-3}
                p={2}
                mb={1}
                textAlign="center"
              >
                <MKTypography variant="h2" fontWeight="medium" color="white" mt={1}>
                  Sign up
                </MKTypography>
              </MKBox>
              <MKBox pt={4} pb={3} px={3}>
                <MKBox component="form" role="form">
                  <MKBox mb={2}>
                    <MKInput type="text" label="Email Address" name="email" onChange={handleInputChange} fullWidth />
                  </MKBox>
                  <MKBox mb={2}>
                    <MKInput type="password" label="Password" name="password" onChange={handleInputChange} fullWidth />
                  </MKBox>
                  <MKBox mb={2}>
                    <MKInput type="password" label="Confirm Password" name="password2" onChange={handleInputChange} fullWidth />
                  </MKBox>
                  <MKBox mb={2}>
                    <MKInput type="text" label="First Name" name="name" onChange={handleInputChange} fullWidth />
                  </MKBox>
                  <MKBox mb={2}>
                    <MKInput type="text" label="Last Name" name="last_name" onChange={handleInputChange} fullWidth />
                  </MKBox>
                  <MKBox mb={2}>
                    <MKInput type="text" label="Country" name="country" onChange={handleInputChange} fullWidth />
                  </MKBox>
                  <MKBox display="flex" alignItems="center" ml={-1}>
                    <Switch checked={rememberMe} onChange={handleSetRememberMe} />
                    <MKTypography
                      variant="button"
                      fontWeight="regular"
                      color="text"
                      onClick={handleSetRememberMe}
                      sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
                    >
                      Remember me
                    </MKTypography>
                  </MKBox>
                  <MKBox mt={4} mb={1}>
                    <MKButton variant="gradient" color="info" fullWidth onClick={handleClick}>
                      sign up
                    </MKButton>
                  </MKBox>
                  {/* <MKBox mt={4} mb={1}>
                    <MKButton variant="gradient" color="info" fullWidth onClick={handleClickGoogle}>
                      Continue with google
                    </MKButton>
                  </MKBox> */}
                  <MKBox mt={3} mb={1} textAlign="center">
                    <MKTypography variant="button" color="text">
                      Already have an account?{" "}
                      <Link to="/user/login" style={{ textDecoration: "none" }}>
                        Sign in
                      </Link>
                    </MKTypography>
                  </MKBox>
                </MKBox>
              </MKBox>
            </Card>
          </Grid>
        </Grid>
      </MKBox>
    </>
  );
}
export default SignUp;
