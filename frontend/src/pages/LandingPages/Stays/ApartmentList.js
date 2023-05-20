import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import Slider from "react-slick"; // uvozite knjižnico "react-slick" za drsnik slik
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function ApartmentList({ data }) {
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  console.log("nanaanan");
  return (
    <div className="container">
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4">
        {data.map((result) => (
          <div key={result.id} className="col mb-4">
            <div className="card h-100">
              <Slider {...settings}>
                {result?.images.map((slika, index) => {
                  return (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <img
                        className="w-full align-middle rounded-lg"
                        src={`${slika}`}
                        style={{
                          objectFit: "cover",
                          height: "40vh",
                          width: "40%",
                          margin: "auto",
                        }}
                      />
                    </div>
                  );
                })}
              </Slider>
              {/* <img src={result.images[0]} className="card-img-top" alt={result.name} /> */}
              <div className="card-body">
                <h5 className="card-title">{result.name}</h5>
                <p className="card-text">
                  <strong>Address:</strong> {result.address}, {result.city}
                </p>
                <p className="card-text">
                  <strong>Price:</strong> {result.price.total}{" "}
                  {result.price.currency}
                </p>
                <a href={result.url} className="btn btn-primary">
                  Click here to book
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ApartmentList;
