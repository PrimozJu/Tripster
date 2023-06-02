/**
=========================================================
* Material Kit 2 React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-kit-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useEffect } from "react";

// react-router components
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

// @mui material components
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

// Material Kit 2 React themes
import theme from "assets/theme";
import Presentation from "layouts/pages/presentation";
import SignIn from "pages/LandingPages/SignIn/SignIn";
import SignUp from "pages/LandingPages/SignUp/SignUp";
// Material Kit 2 React routes
import routes from "routes";
import { useState } from "react";
import User from "pages/LandingPages/User/User";
import { createContext } from "react";
import Cart from "pages/LandingPages/Cart/Cart";
export const UserContext = createContext()
const App = () => {

  const[logged,setLogged]=useState(false);
  const { pathname } = useLocation();



  const[userIdState,setUserIdState]=useState(null);

  // Setting page scroll to 0 when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }

      if (route.route) {
        return <Route exact path={route.route} element={route.component} key={route.key} />;
      }
      return null;
    });


    
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <UserContext.Provider value={{userIdState,setUserIdState}}>
      <Routes>
        {getRoutes(routes)}
        <Route path="/presentation" element={<Presentation />} />
        <Route path="/user/login" element={<SignIn/>} />
        <Route path="/user/signup" element={<SignUp/>} />
        <Route path="/user/profile" element={<User/>} />
{/*         <Route path="/user/cart" element={<Cart/>} />
 */}        <Route path="*" element={<Navigate to="/presentation" />} />
      </Routes>
      </UserContext.Provider>
    </ThemeProvider>
  );
}
export default App;