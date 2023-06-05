import React, { useState } from "react";
import MKBox from "components/MKBox";
import MKInput from "components/MKInput";
import Button from "@mui/material/Button";

function TripForm({ submit }) {
  const [travelTime, setTravelTime] = useState("");
  const [travelDestination, setTravelDestination] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = {
      travelTime,
      travelDestination,
      additionalInfo,
    };
    submit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <MKBox display="grid" gap={2} sx={{ width: "400px" }}>
        <div className="form-row">
          <label>Travel destination:</label><br/>
          <MKInput
            type="text"
            value={travelDestination}
            onChange={(event) => setTravelDestination(event.target.value)}
          />
        </div>
        <div className="form-row">
          <label>Travel time:</label><br/>
          <MKInput
            type="text"
            value={travelTime}
            onChange={(event) => setTravelTime(event.target.value)}
          />
        </div>
        <div className="form-row">
          <label>Additional information:</label><br/>
          <MKInput
            type="text"
            value={additionalInfo}
            placeholder="Optional"
            onChange={(event) => setAdditionalInfo(event.target.value)}
          />
        </div>
      </MKBox>

      <br />
      <Button
        variant="contained"
        color="success"
        sx={{ backgroundColor: "#4caf50", color: "#ffffff" , '&:hover': { backgroundColor: '#388e3c' }}}
        type="submit"
      >
        Plan my trip
      </Button>
    </form>
  );
}

export default TripForm;
