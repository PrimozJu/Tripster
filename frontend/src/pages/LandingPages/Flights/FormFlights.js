import React, { useState } from "react";
import MKBox from "components/MKBox";
import MKInput from "components/MKInput";


const FormFlights = ({ handleForm }) => {
    const [fromLocation, setFromLocation] = useState("LJU");
    const [toLocation, setToLocation] = useState("JFK");
    const [from, setFrom] = useState("2023-06-01");
    const [to, setTo] = useState("2023-06-05");
    const [adults, setAdults] = useState(1);
   
    const [currency, setCurrency] = useState("EUR");
    
    const [cabinClass, setCabinClass] = useState("M"); //M - economy, C - business, F - first

    const handleSubmit = (e) => {
        e.preventDefault();
        const params = {
            fromLocation: fromLocation.toString(),
            toLocation: toLocation.toString(),
            from: from.toString(),
            to: to.toString(),
            adults: adults.toString(),
            currency: currency.toString(),
            cabinClass: cabinClass.toString(),
        };
        handleForm(params);
    };

    return (
        <form onSubmit={handleSubmit}>
            <MKBox display="flex" flexDirection="column" gap={2}>
                <MKBox display="flex" alignItems="center" gap={1}>
                    <label>From where :</label>
                    <MKInput
                        type="text"
                        value={fromLocation}
                        onChange={(e) => setFromLocation(e.target.value)}
                    />
                </MKBox>
                <MKBox display="flex" alignItems="center" gap={1}>
                    <label>To where :</label> {/* primeri airport kod da nebos rabo iskat VIE MAD BCN JFK ATH LHR LJU ZAG */}
                    <MKInput
                        type="text"
                        value={toLocation}
                        onChange={(e) => setToLocation(e.target.value)}
                    />
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
