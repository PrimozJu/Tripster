import React, { useState } from "react";
import MKBox from "components/MKBox";
import MKInput from "components/MKInput";

function TripForm({ submit }) {
  const [travelTime, setTravelTime] = useState("");
  const [travelDestination, setTravelDestination] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = {
      travelTime,
      travelDestination,
      additionalInfo,
    };
    submit(formData);
  };

  const handleAddInfo = () => {
    if (additionalInfo !== "") {
      setAdditionalInfo(additionalInfo);
    }
  };

  const toggleAdditionalInfo = () => {
    setShowAdditionalInfo(!showAdditionalInfo);
  };

  return (
    <form onSubmit={handleSubmit}>
      <MKBox display="flex" flexDirection="column" gap={2}>
        <MKBox display="flex" alignItems="center" gap={1}>
          <label>Travel destination:</label>
          <MKInput
            type="text"
            value={travelDestination}
            onChange={(event) => setTravelDestination(event.target.value)}
          />
        </MKBox>
        <MKBox display="flex" alignItems="center" gap={1}>
          <label>Travel time:</label>
          <MKInput
            type="text"
            value={travelTime}
            onChange={(event) => setTravelTime(event.target.value)}
          />
        </MKBox>
        {showAdditionalInfo && (
          <MKBox display="flex" alignItems="center" gap={1}>
            <label>Additional information:</label>
            <MKInput
              type="text"
              value={additionalInfo}
              onChange={(event) => setAdditionalInfo(event.target.value)}
            />
          </MKBox>
        )}
        {!showAdditionalInfo && (
          <MKBox display="flex" alignItems="center" gap={1}>
            <label>Additional information:</label>
            <div>{additionalInfo}</div>
          </MKBox>
        )}
        <button  type="button"className="gumbDod" onClick={toggleAdditionalInfo}>
          {showAdditionalInfo ? "-" : "+"}
        </button>
      </MKBox>
      <button type="submit">Submit</button>
    </form>
  );
}

export default TripForm;
