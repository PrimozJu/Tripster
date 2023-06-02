import React, { useState } from "react";
import MKBox from "components/MKBox";
import MKInput from "components/MKInput";
import AutocompleteAirports from "../../../components/Autocomplete/AutoCompleteAirports";
function convertDateFormat(dateString) {
    const dateParts = dateString.split('-');
    const day = dateParts[2];
    const month = dateParts[1];
    const year = dateParts[0];
  
    return `${day}/${month}/${year}`;
  }

const FormFlights = ({ handleForm }) => {
    const [fromLocation, setFromLocation] = useState("LJU");
    const [toLocation, setToLocation] = useState("VLC");
    const [from, setFrom] = useState("2023-07-01");
    const [to, setTo] = useState("2023-07-15");
    const [adults, setAdults] = useState(1);
    const [currency, setCurrency] = useState("EUR");
    const [cabinClass, setCabinClass] = useState("M"); //M - economy, C - business, F - first

    const handleSubmit = (e) => {
      
        
        
        e.preventDefault();
        const params = {
            fly_from: fromLocation.toString(),
            fly_to: toLocation.toString(),
            date_from: convertDateFormat(from.toString()),
            date_to: convertDateFormat(from.toString()),
            return_from: convertDateFormat(to.toString()),
            return_to: convertDateFormat(to.toString()),
            adults: adults.toString(),
            curr: currency.toString(),
            selected_cubins: cabinClass.toString(),
        };
        handleForm(params);
    };

    return (
        <form onSubmit={handleSubmit}>
            <MKBox display="flex" flexDirection="column" gap={2}>
                <MKBox display="flex" alignItems="center" gap={1}>
                    <label>From where :</label>
                    {/* <MKInput
                        type="text"
                        value={fromLocation}
                        onChange={(e) => setFromLocation(e.target.value)}
                    /> */}
                <AutocompleteAirports setLocation={setFromLocation}/>
                </MKBox>
                <MKBox display="flex" alignItems="center" gap={1}>
                    <label>To where :</label> {/* primeri airport kod da nebos rabo iskat VIE MAD BCN JFK ATH LHR LJU ZAG */}
                    {/* <MKInput
                        type="text"
                        value={toLocation}
                        onChange={(e) => setToLocation(e.target.value)}
                    /> */}
                    <AutocompleteAirports setLocation={setToLocation}/>

                </MKBox>
                <MKBox display="flex" alignItems="center" gap={1}>
                    <label>FROM:</label>
                    <MKInput
                        type="date"
                        value={from}
                        onChange={(e) => setFrom(e.target.value)}
                    />
                </MKBox>
                <MKBox display="flex" alignItems="center" gap={1}>
                    <label>TO:</label>
                    <MKInput
                        type="date"
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                    />
                </MKBox>
                <MKBox display="flex" alignItems="center" gap={1}>
                    <label>Adults:</label>
                    <MKInput
                        type="number"
                        value={adults}
                        onChange={(e) => setAdults(e.target.value)}
                    />
                </MKBox>
                <MKBox display="flex" alignItems="center" gap={1}>
                    <label>Class:</label>
                    <MKInput
                        type="text"
                        value={cabinClass}
                        onChange={(e) => setCabinClass(e.target.value)}
                    />
                </MKBox>

                <MKBox display="flex" alignItems="center" gap={1}>
                    <label>Currency:</label>
                    <MKInput
                        type="text"
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                    />
                </MKBox>
            </MKBox>
            <button type="submit">Submit</button>
        </form>
    );
};

export default FormFlights;
