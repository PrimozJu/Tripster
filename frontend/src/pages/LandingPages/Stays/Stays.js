import React from "react"
import FormAirBnb from "./FormAirBnb";
import axios from "axios";
async function handleForm(params) {
    console.log(params);
    const options = {
      method: "GET",
      url: "https://airbnb13.p.rapidapi.com/search-location",
      params: {
        location: params.location,
        checkin: params.checkin,
        checkout: params.checkout,
        adults: params.adults,
        children: params.children,
        infants: params.infants,
        pets: params.pets,
        page: params.page,
        currency: params.currency,
      },
      headers: {
        "X-RapidAPI-Key": "0e529198bdmshaba36f78a36a9a5p1a9db0jsn082565d2fdf8",
        "X-RapidAPI-Host": "airbnb13.p.rapidapi.com",
      },
    };
  
    try {
      const response = await axios.request(options);
      console.log(response.data.results);
  
      const dataDiv = document.getElementById("data");
      dataDiv.innerHTML = "";
  
      // Loop through each result and create a new container div element for each one
      response.data.results.forEach((result) => {
        // Create container div
        const containerDiv = document.createElement("div");
        containerDiv.setAttribute("class", "container");
  
        // Get the required attributes
        const { id, address, city, images, name, price, url } = result;
  
        // Add id, address, city, and name to the container div
        const idDiv = document.createElement("div");
        idDiv.textContent = `id: ${id}`;
        containerDiv.appendChild(idDiv);
  
        const addressDiv = document.createElement("div");
        addressDiv.textContent = `address: ${address}, ${city}`;
        containerDiv.appendChild(addressDiv);
  
        const nameDiv = document.createElement("div");
        nameDiv.textContent = `name: ${name}`;
        containerDiv.appendChild(nameDiv);
  
        // Add images to the container div with right-click and left-click functionality
        const image = document.createElement("img");
        image.setAttribute("src", images[0]);
  
        containerDiv.appendChild(image);
  
        // Add prices to the container div
        const pricesDiv = document.createElement("div");
        pricesDiv.textContent = `price: ${price.total} ${price.currency}`;
        containerDiv.appendChild(pricesDiv);
  
        // Add url to the container div with click functionality
        const urlDiv = document.createElement("div");
        urlDiv.innerHTML = `<a href="${url}">Click here to book</a>`;
        containerDiv.appendChild(urlDiv);
  
        dataDiv.appendChild(containerDiv); // Add containerDiv to the dataDiv
      });
    } catch (error) {
      console.log("napaka");
      console.error(error);
    }
  }


const Stays = () =>{

    return(
        <div >
             {/*Tu pride se meni */}
            <FormAirBnb  handleForm={handleForm} />
            <div id="data"></div>
            
        </div>
    )
}
export default Stays
