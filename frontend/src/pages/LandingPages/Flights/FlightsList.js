import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import Flights from './Flights';

function FlightsList({ data }) {
  console.log("nanaanan");
  return (
    <div className="container">
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4">
        {data.map((result) => (
          <div key={result.id} className="col mb-4">
            <div className="card h-100">
              <img src={result.images[0]} className="card-img-top" alt={result.name} />
              <div className="card-body">
                <h5 className="card-title">{result.name}</h5>
                <p className="card-text">
                  <strong>Address:</strong> {result.address}, {result.city}
                </p>
                <p className="card-text">
                  <strong>Price:</strong> {result.price.total} {result.price.currency}
                </p>
                <a href={result.url} className="btn btn-primary">Click here to book</a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FlightsList;

