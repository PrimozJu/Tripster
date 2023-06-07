import React, { useContext } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Button, Card, CardContent, CardMedia, Grid, Typography } from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import "./ApartmentList.css"; // Import the CSS file for custom styling
import { UserContext } from "../../../App";

function ApartmentList({ data }) {
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const { cartItems, setCartItems } = useContext(UserContext);

  // Define a function to handle adding an item to the cart
  const handleAddProduct = (product) => {
    // Check if the product already exists in the cart
    const productExist = cartItems.find((item) => item.id === product.id);

    if (productExist) {
      // If so, update its quantity
      setCartItems(
        cartItems.map((item) =>
          item.id === product.id
            ? { ...productExist, quantity: productExist.quantity + 1 }
            : item
        )
      );
    } else {
      // Otherwise, add it to the cart with a default quantity of 1
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };

  const addToCart = (recommendation) => {
    console.log(recommendation)
    const { id,  name, price } = recommendation;
    
    const item = {
      name: name,
      price: price.total,
      id: id,
      type:"3"
    };

    console.log("Added to cart:", item);
    handleAddProduct(item);
  };

  return (
    <div className="container">
      <Grid container spacing={2}>
        {data.map((result) => (
          <Grid key={result.id} item xs={12} sm={6} md={6} lg={4}>
            <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
              <Slider {...settings}>
                {result?.images.map((slika, index) => {
                  return (
                    <div key={index}>
                      <CardMedia
                        component="img"
                        alt=""
                        image={slika}
                        className="card-image" // Add the CSS class for custom styling
                      />
                    </div>
                  );
                })}
              </Slider>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h5" component="h2">
                  {result.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Address:</strong> {result.address}, {result.city}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Price:</strong> {result.price.total} {result.price.currency}
                </Typography>
              </CardContent>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddShoppingCartIcon />}
                onClick={() => addToCart(result)}
                style={{ color: "#ffffff" }}
              >
                Click here to book
              </Button>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default ApartmentList;
