import axios from "axios";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./CollectionPage.css";
import fallBackImage from "../img/FallBackImage.jpg";
import MET_logo from "../img/THE_MET.jpg";
import {
  Tooltip,
  Slide,
  AppBar,
  Toolbar,
  Typography,
  Box,
} from "@mui/material";
import Fab from "@mui/material/Fab";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

function CollectionPage() {
  const navigate = useNavigate();
  const { page } = useParams();
  const query = useQuery();
  const departmentIds = query.get("departmentIds");
  const [objects, setObjects] = useState([]);
  const ITEMS_PER_PAGE = 50;
  const [total, setTotal] = useState(0);
  const [error, setError] = useState(null);
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
  const [departmentName, setDepartmentName] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let endpoint = `https://collectionapi.metmuseum.org/public/collection/v1/objects?page=${page}`;
        if (departmentIds) {
          endpoint += `&departmentIds=${departmentIds}`;
        }

        const response = await axios.get(endpoint);
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
        const objectDetailsResponses = await Promise.all(objectDetailsPromises);
        const allObjectDetails = objectDetailsResponses.map(
          (result) => result.data
        );
        if (departmentIds) {
          const departmentName = allObjectDetails[0].department;
          setDepartmentName(departmentName);
        }
        setObjects(allObjectDetails);
        setTotal(response.data.total);
      } catch (error) {
        console.error("Error fetching data:", error);
        if (error.response.status === 400) {
          navigate("/400");
        } else {
          setError(error.response ? error.response.data : "An error occurred.");
        }
      }
    };

    if (isNaN(page) || parseInt(page) <= 0) {
      navigate("/400");
    } else {
      fetchData();
    }
  }, [page, departmentIds, navigate]);

  if (error) {
    return (
      <div className="error">
        <h2>Error</h2>
        <p>{error}</p>
      </div>
    );
  }
  if (!objects) {
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
            <Box display="flex" alignItems="center">
              <Link to={"/"}>
                {" "}
                <img
                  src={MET_logo}
                  className="App-logo-collectionPage"
                  alt="logo"
                />
              </Link>
              <Typography variant="h3" className="App-title">
                {departmentName
                  ? `You're in '${departmentName}' department of MET Museum.(Page ${page})`
                  : `You're in page ${page} of MET Museum collection.`}
              </Typography>
            </Box>
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
          {objects.map((object) => (
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
              to={`/collection/page/${parseInt(page) - 1}${
                departmentIds ? `?departmentIds=${departmentIds}` : ""
              }`}
              className="prev-link"
              onClick={scrollToTop}
            >
              Previous
            </Link>
          )}
          {page < totalPages && (
            <Link
              to={`/collection/page/${parseInt(page) + 1}${
                departmentIds ? `?departmentIds=${departmentIds}` : ""
              }`}
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
            to={`/collection/page/${parseInt(page) - 1}${
              departmentIds ? `?departmentIds=${departmentIds}` : ""
            }`}
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
            to={`/collection/page/${parseInt(page) + 1}${
              departmentIds ? `?departmentIds=${departmentIds}` : ""
            }`}
            onClick={scrollToTop}
          >
            <ArrowForwardIcon />
          </Fab>
        )}
      </div>
    </div>
  );
}

export default CollectionPage;
