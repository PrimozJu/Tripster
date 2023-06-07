import React, { useState } from "react";
import "./RecommendationsCSS/RecommendationCard.css";
import { Button } from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";

const RecommendationCard = ({ recommendation, handleAddProduct }) => {
  const [showDetails, setShowDetails] = useState(false);

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  const addToCart = () => {
    const { itinerary_id, departure, destination, price } = recommendation;

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
    <div className={`card ${showDetails ? "active" : ""}`} onClick={toggleDetails}>
      <h3>
        {recommendation.departure} - {recommendation.destination}
      </h3>
      <p>
        <strong>Total Price:</strong> {recommendation.price.total}
      </p>
      <p>
        <strong>Trip Length:</strong> {recommendation.itinerary.length} days
      </p>
      {showDetails && (
        <div className="details">
          <p>
            <strong>Flight:</strong> {recommendation.outboundFlight}
          </p>
          <p>
            <strong>Flight Duration:</strong> {recommendation.flightDuration}
          </p>
          <p>
            <strong>Sleeping Type:</strong> {recommendation.sleepingType}
          </p>
          <h4>Sleeping Description:</h4>
          <p>{recommendation.sleepingDescription}</p>
          <h4>Itinerary:</h4>
          <ul>
            {recommendation.itinerary.tripArray.map((item, index) => (
              <li key={index}>
                <p>
                  <strong>Day:</strong> {item.day}
                </p>
                <p>
                <strong>Description:</strong> {item.description}
                </p>
              </li>
            ))}
          </ul>
          <Button
  variant="contained"
  color="primary"
  startIcon={<AddShoppingCartIcon style={{ color: 'snow' }} />} /* Add style here */
  onClick={addToCart}
>
  <span style={{ color: 'snow' }}>Add to Cart</span>
</Button>

        </div>
      )}
    </div>
  );
};

export default RecommendationCard;
