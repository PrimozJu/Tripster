const ItineraryDetails = ({ data }) => {
    console.log(data);
    if (!data || data.tripArray.length === 0) {
      return null; // If data or tripArray is undefined or empty, don't display anything
    }
  
    const { travelDestination, tripArray } = data;
  
    return (
      <div>
        <h1>{travelDestination}</h1>
        {tripArray.map((day) => (
          <div key={day.day}>
            <h2>Day {day.day}</h2>
            <p>Description: {day.description}</p>
            <ul>
              {day.activities.map((activity, index) => (
                <li key={index}>{activity}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  };
  
  export default ItineraryDetails;
  