import React from "react";
import TripForm from "./FormChat";
import axios from "axios";

async function chatTalk(params) {
  console.log(params);
  const departureDate = params.departureDate;
  const returnDate = params.returnDate;
  const numTravelers = params.numTravelers;
  const desiredContinent = params.desiredContinent;
  const travelType = params.travelType; //adventure cultural, relaxation
  const interests = params.interest;
  const preferredAccommodation = params.preferredAccommodation;
  const maxBudget = params.maxBudget;

  const query = `Hi ChatGPT, can you recommend a trip based on my travel preferences? My desired dates of travel are ${departureDate} to ${returnDate}, and there will be ${numTravelers} traveling. I'm interested in traveling to ${desiredContinent}, and I'm looking for a ${travelType} experience. My interests include ${interests}. I would prefer to stay in a ${preferredAccommodation}, and my maximum budget is ${maxBudget}. Based on these preferences, what trip do you recommend?`;

  console.log(query);

  const options = {
    method: "POST",
    url: "https://chatgpt53.p.rapidapi.com/",
    headers: {
      "content-type": "application/json",
      "X-RapidAPI-Key": "0e529198bdmshaba36f78a36a9a5p1a9db0jsn082565d2fdf8",
      "X-RapidAPI-Host": "chatgpt53.p.rapidapi.com",
    },
    data: {
      messages: [
        {
          role: "user",
          content: query,
        },
      ],
    },
  };

  try {
    const response = await axios.request(options);
    console.log(response.data)
    document.getElementById("chatDiv").innerHTML = response.data.choices[0].message.content;
  } catch (error) {
    console.error(error);
  }
}
const Itinerary = () => {
  return (
    <div>
      {/*Tu pride se meni */}
      <TripForm submit={chatTalk}></TripForm>
      <div id="chatDiv"></div>
    </div>
  );
};
export default Itinerary;
