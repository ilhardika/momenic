import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/Homepage";
import ThemePage from "./pages/ThemePage";
import Navbar from "./components/Navbar";
import Music from "./pages/Music";
import Pricelist from "./pages/Pricelist/";
import VideoPage from "./pages/VideoPage";
import Portfolio from "./pages/Portfolio";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/tema" element={<ThemePage />} />
          <Route path="/pricelist" element={<Pricelist />} />
          <Route path="/musik" element={<Music />} />
          {/* <Route path="/video" element={<VideoPage />} /> */}
          {/* <Route path="/portfolio" element={<Portfolio />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
