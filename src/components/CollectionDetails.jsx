import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./CollectionDetails.css";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import MET_logo from "../img/met-banner.jpg";
import fallBackImage from "../img/FallBackImage.jpg";
import { Link } from "react-router-dom";

function CollectionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [objectDetails, setObjectDetails] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isNaN(id) || parseInt(id) <= 0) {
          navigate("/400");
          return;
        }

        const response = await axios.get(
          `https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`
        );
        setObjectDetails(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        if (error.response && error.response.status === 404) {
          navigate("/404");
        } else {
          setError(error.response ? error.response.data : "An error occurred.");
        }
      }
    };

    fetchData();
  }, [id, navigate]);

  if (error) {
    return (
      <div className="error">
        <h2>Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!objectDetails) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="bannerContainer">
      <Link to={"/"}>
        {" "}
        <img src={MET_logo} className="App-logo-collectionDetails" alt="logo" />
      </Link>
      <div className="objectDetails">
        <div className="centeredImageContainer">
          {objectDetails.primaryImage ? (
            <img
              className="fullScreenImage"
              src={objectDetails.primaryImage}
              alt={objectDetails.title || "N/A"}
            />
          ) : (
            <img className="fullScreenImage" src={fallBackImage} />
          )}
          <h2>{objectDetails.title || "N/A"}</h2>
        </div>

        <div className="fullWidthBanner">
          <Carousel showThumbs={false} infiniteLoop autoPlay showStatus={false}>
            <div className="carousel-slide">
              <strong>
                Artist: {objectDetails.artistDisplayName || "N/A"}
              </strong>
            </div>
            <div className="carousel-slide">
              <strong>
                Artist Bio: {objectDetails.artistDisplayBio || "N/A"}
              </strong>
            </div>
            <div className="carousel-slide">
              <strong>
                Artist Gender: {objectDetails.artistGender || "N/A"}
              </strong>
            </div>
            <div className="carousel-slide">
              <strong>Date: {objectDetails.objectDate || "N/A"}</strong>
            </div>
            <div className="carousel-slide">
              <strong>Department: {objectDetails.department || "N/A"}</strong>
            </div>
            <div className="carousel-slide">
              <strong>Medium: {objectDetails.medium || "N/A"}</strong>
            </div>
            <div className="carousel-slide">
              <strong>
                Classification: {objectDetails.classification || "N/A"}
              </strong>
            </div>
            <div className="carousel-slide">
              <strong>Country: {objectDetails.country || "N/A"}</strong>
            </div>
            <div className="carousel-slide">
              <strong>Culture: {objectDetails.culture || "N/A"}</strong>
            </div>
            <div className="carousel-slide">
              <strong>Credit Line: {objectDetails.creditLine || "N/A"}</strong>
            </div>
            <div className="carousel-slide">
              <strong>
                MET URL:{" "}
                {objectDetails.objectURL ? (
                  <a
                    href={objectDetails.objectURL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Click here to view on MET Website
                  </a>
                ) : (
                  <strong>N/A</strong>
                )}
              </strong>
            </div>
          </Carousel>
        </div>
      </div>
    </div>
  );
}
export default CollectionDetails;
