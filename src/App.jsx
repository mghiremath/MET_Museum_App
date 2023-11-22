import CollectionPage from "./components/CollectionPage";
import CollectionDetails from "./components/CollectionDetails";
import HomePage from "./components/HomePage";
import Search from "./components/Search";
import NotFoundPage from "./components/NotFoundPage";
import BadRequestPage from "./components/BadRequestPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Link } from "react-router-dom";

function App() {
  return (
    <>
      <div className="App">
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/collection/page/:page" element={<CollectionPage />} />
            <Route path="/collection/:id" element={<CollectionDetails />} />
            <Route path="/search" element={<Search />} />
            <Route path="/400" element={<BadRequestPage />} />
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Router>
      </div>
    </>
  );
}

export default App;
