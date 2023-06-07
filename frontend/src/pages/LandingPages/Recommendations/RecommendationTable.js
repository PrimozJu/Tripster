import React, { useState, useContext, useEffect } from "react";
import "./RecommendationsCSS/RecommendationTable.css";
import { Button } from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { UserContext } from "../../../App";
import RecommendationCard from "./RecommendationCard";

const RecommendationTable = () => {
  const [recommendations, setRecommendations] = useState([]);
  const { cartItems, setCartItems } = useContext(UserContext);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    // console.log("Fetching data");
    try {
       const response = await fetch('http://127.0.0.1:5001/tripsterpraktikum-e913c/europe-west2/app/recommendation', { 
        headers: {
          'user': 'lmao@gmail.com',
          // Add any other headers you need
        }});
       const data = await response.json();
    //   const data = 
    //   [
    //       {
    //           "departure": "Zagreb",
    //           "destination": "Paris",
    //           "price": {
    //               "total": 1278,
    //               "flight": 409,
    //               "sleep": 869
    //           },
    //           "itinerary": {
    //               "travelDestination": "Paris",
    //               "tripArray": [
    //                   {
    //                       "day": 1,
    //                       "description": "Arrival in Paris, indulge in French cuisine",
    //                       "activities": [
    //                           "Visit Eiffel Tower",
    //                           "Stroll along the Seine River",
    //                           "Explore Champs-Élysées Avenue"
    //                       ]
    //                   },
    //                   {
    //                       "day": 2,
    //                       "description": "Discover the art and culture of Paris",
    //                       "activities": [
    //                           "Visit the Louvre Museum",
    //                           "Explore Musée d'Orsay",
    //                           "Walk through Montmartre"
    //                       ]
    //                   },
    //                   {
    //                       "day": 3,
    //                       "description": "Enjoy the beauty of Parisian architecture",
    //                       "activities": [
    //                           "Visit Palace of Versailles",
    //                           "Marvel at Notre-Dame Cathedral",
    //                           "Stroll through the Marais district"
    //                       ]
    //                   },
    //                   {
    //                       "day": 4,
    //                       "description": "Experience quintessential Parisian activities",
    //                       "activities": [
    //                           "Take a cruise along the Seine River",
    //                           "Visit the Catacombs of Paris",
    //                           "Enjoy a cabaret at Moulin Rouge"
    //                       ]
    //                   },
    //                   {
    //                       "day": 5,
    //                       "description": "Departure day, shop for souvenirs",
    //                       "activities": [
    //                           "Shop along Rue Saint-Honoré",
    //                           "Visit the Paris flea markets",
    //                           "Enjoy a final French meal"
    //                       ]
    //                   }
    //               ]
    //           },
    //           "flightDuration": "26 hours and 40 minutes",
    //           "sleepingType": "Entire rental unit",
    //           "sleepingDescription": "Cocon zen & lumineux / Arc de Triomphe"
    //       },
    //       {
    //           "departure": "Zagreb",
    //           "destination": "Edinburgh",
    //           "price": {
    //               "total": 1040,
    //               "flight": 267,
    //               "sleep": 773
    //           },
    //           "itinerary": {
    //               "travelDestination": "Edinburgh",
    //               "tripArray": [
    //                   {
    //                       "day": 1,
    //                       "description": "Arrival and Edinburgh Castle",
    //                       "activities": [
    //                           "Visit Edinburgh Castle",
    //                           "Explore the Royal Mile",
    //                           "Stroll through Princes Street Gardens"
    //                       ]
    //                   },
    //                   {
    //                       "day": 2,
    //                       "description": "Old Town and Arthur's Seat",
    //                       "activities": [
    //                           "Take a walking tour of Old Town",
    //                           "Hike up Arthur's Seat for panoramic views",
    //                           "Visit St Giles' Cathedral"
    //                       ]
    //                   },
    //                   {
    //                       "day": 3,
    //                       "description": "New Town and Modern Art Galleries",
    //                       "activities": [
    //                           "See the Georgian architecture of New Town",
    //                           "Visit the Scottish National Gallery",
    //                           "Check out the modern art at the Scottish National Gallery of Modern Art"
    //                       ]
    //                   },
    //                   {
    //                       "day": 4,
    //                       "description": "Leith and Royal Yacht Britannia",
    //                       "activities": [
    //                           "Explore the vibrant port district of Leith",
    //                           "Tour the Royal Yacht Britannia",
    //                           "Visit the historic Trinity House"
    //                       ]
    //                   },
    //                   {
    //                       "day": 5,
    //                       "description": "Day Trip to Stirling Castle and Loch Lomond",
    //                       "activities": [
    //                           "Take a day trip to Stirling Castle",
    //                           "Admire the scenery of Loch Lomond",
    //                           "Enjoy a boat cruise or hike around the loch"
    //                       ]
    //                   }
    //               ]
    //           },
    //           "flightDuration": "12 hours and 40 minutes",
    //           "sleepingType": "Entire rental unit",
    //           "sleepingDescription": "Jeffrey Street (Flat 1), Royal Mile, Old Town"
    //       },
    //       {
    //           "departure": "Zagreb",
    //           "destination": "New York",
    //           "price": {
    //               "total": 3263,
    //               "flight": 2021,
    //               "sleep": 1242
    //           },
    //           "itinerary": {
    //               "travelDestination": "New York",
    //               "tripArray": [
    //                   {
    //                       "day": 1,
    //                       "description": "Exploring Manhattan",
    //                       "activities": [
    //                           "Visit the iconic Empire State Building",
    //                           "Explore the vibrant Times Square",
    //                           "Walk through Central Park",
    //                           "Visit the Metropolitan Museum of Art"
    //                       ]
    //                   },
    //                   {
    //                       "day": 2,
    //                       "description": "Lower Manhattan and the Statue of Liberty",
    //                       "activities": [
    //                           "Visit the Statue of Liberty and Ellis Island",
    //                           "Take a walk on the Brooklyn Bridge",
    //                           "Explore the bustling Financial District, including Wall Street and the New York Stock Exchange",
    //                           "Visit the 9/11 Memorial and Museum"
    //                       ]
    //                   },
    //                   {
    //                       "day": 3,
    //                       "description": "Brooklyn and Queens",
    //                       "activities": [
    //                           "Visit the diverse neighborhood of Williamsburg in Brooklyn",
    //                           "Explore the outdoor art scene at the Bushwick Collective",
    //                           "Visit the trendy waterfront neighborhood of Long Island City in Queens",
    //                           "Experience the colorful culture of Jackson Heights, Queens",
    //                           "Enjoy a sunset cruise of the New York City skyline"
    //                       ]
    //                   },
    //                   {
    //                       "day": 4,
    //                       "description": "Exploring Food and Culture",
    //                       "activities": [
    //                           "Experience the food scene in the diverse neighborhoods of Chinatown and Little Italy",
    //                           "Visit the famous food market, Chelsea Market",
    //                           "Explore the fascinating exhibits at the American Museum of Natural History",
    //                           "Experience Broadway with a show at one of the famous theaters"
    //                       ]
    //                   },
    //                   {
    //                       "day": 5,
    //                       "description": "Final Day in New York",
    //                       "activities": [
    //                           "Take a sightseeing tour on the Hop-On, Hop-Off bus",
    //                           "Shop till you drop on Fifth Avenue",
    //                           "Visit the famous Rockefeller Center",
    //                           "Explore the popular High Line park"
    //                       ]
    //                   }
    //               ]
    //           },
    //           "flightDuration": "12 hours and 30 minutes",
    //           "sleepingType": "Entire rental unit",
    //           "sleepingDescription": "Untitled at 3 Freeman  - Studio Queen"
    //       }
    //   ];
      setRecommendations(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleAddProduct = (item) => {
    setCartItems((prevItems) => [...prevItems, item]);
  };

  return (
    <div className="recommendation-table">
      {recommendations.map((recommendation, index) => (
        <RecommendationCard
          key={index}
          recommendation={recommendation}
          handleAddProduct={handleAddProduct}
        />
      ))}
    </div>
  );
};

export default RecommendationTable;
