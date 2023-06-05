import React, { useState, useContext } from 'react';
import recommendationData from '../../../assets/recommendationData/recommendationData.json';
import './RecommendationTable.css'; // Import the CSS file for styling
import { Button } from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { UserContext } from "../../../App";

const RecommendationCard = ({ recommendation, handleAddProduct }) => {
  const [showDetails, setShowDetails] = useState(false);

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  const addToCart = () => {
    const { itinerary_id, departure, destination, price,  } = recommendation;
    const item = {
      cityFrom: departure,
      cityTo: destination,
      price: price.total,
      id: itinerary_id,

    };

    console.log("Added to cart:", item);
    handleAddProduct(item);
  };

  return (
    <div className={`card ${showDetails ? 'active' : ''}`} onClick={toggleDetails}>
      <h3>{recommendation.departure} - {recommendation.destination}</h3>
      <p><strong>Total Price:</strong> {recommendation.price.total}</p>
      <p><strong>Trip Length:</strong> {recommendation.itinerary.length} days</p>
      {showDetails && (
        <>
          <p><strong>Flight:</strong> {recommendation.outboundFlight}</p>
          <p><strong>Flight Duration:</strong> {recommendation.flightDuration}</p>
          <p><strong>Sleeping Type:</strong> {recommendation.sleepingType}</p>
          <h4>Sleeping Description:</h4>
          <p>{recommendation.sleepingDescription}</p>
          <h4>Itinerary:</h4>
          <ul>
            {recommendation.itinerary.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
          <h4>Price Breakdown:</h4>
          <p><strong>Flight Price:</strong> {recommendation.price.flight}</p>
          <p><strong>Sleep Price:</strong> {recommendation.price.sleep}</p>
          <p><strong>Attractions Price:</strong> {recommendation.price.attractions}</p>
          <Button
            sx={{ color: 'success.main', fontSize: 20 }}
            onClick={addToCart}>
            <AddShoppingCartIcon />
            Add to cart
          </Button>
        </>
      )}
    </div>
  );
};

const RecommendationTable = () => {
  const recommendations = recommendationData.recommendations;
  const { cartItems, setCartItems } = useContext(UserContext); // Get the cartItems and setCartItems from UserContext

  // Define a function to handle adding an item to the cart
  const handleAddProduct = (item) => {
    // Check if the product already exists in the cart
    const productExist = cartItems.find((cartItem) => cartItem.id === item.id);

    if (productExist) {
      // If so, update its quantity
      setCartItems(
        cartItems.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      );
    } else {
      // Otherwise, add it to the cart with a default quantity of 1
      setCartItems([...cartItems, { ...item, quantity: 1 }]);
    }
  };

  return (
    <div className="recommendation-table">
      <h2>Trip Recommendations</h2>
      <div className="card-container">
        {recommendations.map((recommendation, index) => (
          <RecommendationCard
            key={index}
            recommendation={recommendation}
            handleAddProduct={handleAddProduct}
          />
        ))}
      </div>
    </div>
  );
};

export default RecommendationTable;
