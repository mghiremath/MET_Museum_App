import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MET_logo from "../img/met-pic.jpeg";
import {
  Slide,
  Typography,
  Button,
  Container,
  Grid,
  TextField,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import "./HomePage.css";

function HomePage() {
  const StyledButton = styled(Button)(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    "&:hover": {
      backgroundColor: theme.palette.secondary.main,
    },
  }));
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearchChange = (event) => {
    setQuery(event.target.value);
  };

  const handleSearchSubmit = () => {
    navigate(`/search?q=${query}`);
  };

  return (
    <Container>
      <Slide direction="up" in={true} mountOnEnter unmountOnExit timeout={500}>
        <header className="App-header">
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Link to={"/"}>
                {" "}
                <img src={MET_logo} className="App-logo-homePage" alt="logo" />
              </Link>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="h2" gutterBottom>
                Welcome to the Metropolitan Museum of Art Explorer
              </Typography>
            </Grid>
          </Grid>
        </header>
      </Slide>
      <Slide direction="up" in={true} mountOnEnter unmountOnExit timeout={1000}>
        <div className="App-intro">
          <Typography variant="h6" gutterBottom>
            Discover the vast collection of artworks, delve into the details of
            your favorite pieces, and learn more about various art departments.
          </Typography>
        </div>
      </Slide>
      <br />
      <br />
      <Slide direction="up" in={true} mountOnEnter unmountOnExit timeout={1500}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} sm={6}>
            <StyledButton
              variant="contained"
              component={Link}
              to="/collection/page/1"
              className="shining-box"
            >
              Explore the Collection
            </StyledButton>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Grid container spacing={-40} alignItems="center">
              <Grid item xs={10}>
                <form onSubmit={handleSearchSubmit}>
                  <TextField
                    id="search"
                    variant="outlined"
                    placeholder="Search the artifacts"
                    value={query}
                    onChange={handleSearchChange}
                  />
                </form>
              </Grid>
              <Grid item xs={2}>
                <Button
                  type="submit"
                  onClick={handleSearchSubmit}
                  variant="contained"
                  color="primary"
                  style={{ marginLeft: "0px" }}
                >
                  Search
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Slide>
    </Container>
  );
}
export default HomePage;
