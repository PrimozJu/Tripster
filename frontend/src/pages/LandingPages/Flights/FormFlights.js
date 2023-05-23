import React, { useState } from "react";
import MKBox from "components/MKBox";
import MKInput from "components/MKInput";

const FormFlights = ({ handleForm }) => {
    const [location, setLocation] = useState("");
    const [checkin, setCheckin] = useState("");
    const [checkout, setCheckout] = useState("");
    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);
    const [infants, setInfants] = useState(0);
    const [pets, setPets] = useState(0);
    const [page, setPage] = useState(1);
    const [currency, setCurrency] = useState("EUR");

    const handleSubmit = (e) => {
        e.preventDefault();
        const params = {
            location: location.toString(),
            checkin: checkin.toString(),
            checkout: checkout.toString(),
            adults: adults.toString(),
            children: children.toString(),
            infants: infants.toString(),
            pets: pets.toString(),
            page: page.toString(),
            currency: currency.toString(),
        };
        handleForm(params);
    };

    return (
        <form onSubmit={handleSubmit}>
            <MKBox display="flex" flexDirection="column" gap={2}>
                <MKBox display="flex" alignItems="center" gap={1}>
                    <label>Location:</label>
                    <MKInput
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                    />
                </MKBox>
                <MKBox display="flex" alignItems="center" gap={1}>
                    <label>Checkin:</label>
                    <MKInput
                        type="date"
                        value={checkin}
                        onChange={(e) => setCheckin(e.target.value)}
                    />
                </MKBox>
                <MKBox display="flex" alignItems="center" gap={1}>
                    <label>Checkout:</label>
                    <MKInput
                        type="date"
                        value={checkout}
                        onChange={(e) => setCheckout(e.target.value)}
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
                    <label>Children:</label>
                    <MKInput
                        type="number"
                        value={children}
                        onChange={(e) => setChildren(e.target.value)}
                    />
                </MKBox>
                <MKBox display="flex" alignItems="center" gap={1}>
                    <label>Infants:</label>
                    <MKInput
                        type="number"
                        value={infants}
                        onChange={(e) => setInfants(e.target.value)}
                    />
                </MKBox>
                <MKBox display="flex" alignItems="center" gap={1}>
                    <label>Pets:</label>
                    <MKInput
                        type="number"
                        value={pets}
                        onChange={(e) => setPets(e.target.value)}
                    />
                </MKBox>
                <MKBox display="flex" alignItems="center" gap={1}>
                    <label>Page:</label>
                    <MKInput
                        type="number"
                        value={page}
                        onChange={(e) => setPage(e.target.value)}
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
