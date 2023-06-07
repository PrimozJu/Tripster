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
import { useContext } from "react";
import { UserContext } from "../../../App";
import { useNavigate } from "react-router-dom";
const provider = new GoogleAuthProvider();

const ConitnueGoogle = () => {
  const { userIdState, setUserIdState } = useContext(UserContext);
  const navigate = useNavigate();

  const handleClickGoogle = (e) => {



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
        console.log("logged in buddy");
        setUserIdState(user.uid);
        navigate("/Presentation");


        // ...
      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.log(errorCode, errorMessage, email,);
        // ...
      });
  }
  return (
    <MKBox mt={4} mb={1}>
      <MKButton variant="gradient" color="info" fullWidth onClick={handleClickGoogle}>
        Continue with google
      </MKButton>
    </MKBox>
  )


}
export default ConitnueGoogle