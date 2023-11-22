import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Tooltip,
  Slide,
  AppBar,
  Toolbar,
  Typography,
  Box,
  Fab,
  Grid,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import axios from "axios";
import { Link } from "react-router-dom";
import "./CollectionPage.css";
import fallBackImage from "../img/FallBackImage.jpg";
import MET_logo from "../img/THE_MET.jpg";
import "./Search.css";
function Search() {
  const [results, setResults] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initialQuery = params.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [error, setError] = useState(null);
  const ITEMS_PER_PAGE = 20;

  const [total, setTotal] = useState(0);
  const initialPage = parseInt(params.get("page") || "1");
  const [page, setPage] = useState(initialPage);

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  useEffect(
    () => {
      const fetchData = async () => {
        setLoading(true);
        try {
          const response = await axios.get(
            `https://collectionapi.metmuseum.org/public/collection/v1/search?q=${query}`
          );
          setLoading(false);

          if (response.data.total === 0) {
            navigate("/404");
            return;
          }

          const validPages = Math.ceil(response.data.total / ITEMS_PER_PAGE);
          if (page < 0 || page > validPages) {
            navigate("/404");
            return;
          }

          const startIndex = (page - 1) * ITEMS_PER_PAGE;
          const objectIDs = response.data.objectIDs.slice(
            startIndex,
            startIndex + ITEMS_PER_PAGE
          );

          const objectDetailsPromises = objectIDs.map((id) =>
            axios.get(
              `https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`
            )
          );

          const objectDetailsResponses = await Promise.allSettled(
            objectDetailsPromises
          );

          const validObjectDetails = objectDetailsResponses
            .filter((response) => {
              if (response.status === "rejected") {
                console.log(
                  "This objectID does not exist in the collection:",
                  response.reason
                );
                return false;
              }
              return true;
            })
            .map((response) => response.value.data);

          setResults(validObjectDetails);
          setTotal(response.data.total);
        } catch (error) {
          setLoading(false);
          console.error("Error fetching data:", error);
          if (error.response && error.response.status === 400) {
            navigate("/400");
          } else {
            setError(
              error.response ? error.response.data : "An error occurred."
            );
          }
        }
      };

      if (query) {
        fetchData();
      }
    },
    [query, page],
    [navigate]
  );
  useEffect(() => {
    setPage(parseInt(params.get("page") || "1"));
  }, [location.search]);

  if (!results) {
    return <div className="loading">Loading...</div>;
  }
  return (
    <div className="collection-container">
      <Slide
        direction="down"
        in={true}
        mountOnEnter
        unmountOnExit
        timeout={900}
      >
        <AppBar position="static" color="default">
          <Toolbar>
            <Grid container alignItems="center">
              <Grid item xs={12} sm={6}>
                <Box display="flex" alignItems="center">
                  <Link to={"/"}>
                    <img src={MET_logo} className="App-logo" alt="logo" />
                  </Link>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="h6" gutterBottom>
                  Search Results for: <strong>"{query}"</strong>
                </Typography>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
      </Slide>

      <br />
      <br />

      <Slide
        direction="right"
        in={true}
        mountOnEnter
        unmountOnExit
        timeout={600}
      >
        <div className="collection-grid">
          {results.map((object) => (
            <Link to={`/collection/${object.objectID}`} key={object.objectID}>
              <div
                className="collection-card"
                style={{
                  backgroundImage: `url(${
                    object.primaryImage ? object.primaryImage : fallBackImage
                  })`,
                  backgroundSize: "contain",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              ></div>

              <Tooltip title={object.title} arrow>
                <h2 className="collection-title">
                  {object.title.length > 25
                    ? object.title.substr(0, 25) + "..."
                    : object.title}
                </h2>
              </Tooltip>
              <Tooltip title={object.artistDisplayName} arrow>
                <p className="collection-artist">
                  {object.artistDisplayName.length > 25
                    ? object.artistDisplayName.substr(0, 25) + "..."
                    : object.artistDisplayName}
                </p>
              </Tooltip>
              <Tooltip title={object.objectDate} arrow>
                <p className="collection-date">
                  {object.objectDate.length > 25
                    ? object.objectDate.substr(0, 25) + "..."
                    : object.objectDate}
                </p>
              </Tooltip>
            </Link>
          ))}
        </div>
      </Slide>

      <Slide direction="up" in={true} mountOnEnter unmountOnExit timeout={900}>
        <div className="pagination">
          {page > 1 && (
            <Link
              to={`/search?q=${query}&page=${parseInt(page) - 1}`}
              className="prev-link"
              onClick={scrollToTop}
            >
              Previous
            </Link>
          )}
          {page < totalPages && (
            <Link
              to={`/search?q=${query}&page=${parseInt(page) + 1}`}
              className="next-link"
              onClick={scrollToTop}
            >
              Next
            </Link>
          )}
        </div>
      </Slide>
      <div className="pagination-arrow">
        {page > 1 && (
          <Fab
            color="primary"
            aria-label="previous"
            style={{ position: "fixed", left: "10px", top: "50%" }}
            component={Link}
            to={`/search?q=${query}&page=${parseInt(page) - 1}`}
            onClick={scrollToTop}
          >
            <ArrowBackIcon />
          </Fab>
        )}

        {page < totalPages && (
          <Fab
            color="primary"
            aria-label="next"
            style={{ position: "fixed", right: "10px", top: "50%" }}
            component={Link}
            to={`/search?q=${query}&page=${parseInt(page) + 1}`}
            onClick={scrollToTop}
          >
            <ArrowForwardIcon />
          </Fab>
        )}
      </div>
    </div>
  );
}

export default Search;
