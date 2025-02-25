import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/Homepage";
import ThemePage from "./pages/ThemePage";
import VideoPage from "./pages/VideoPage";
import Navbar from "./components/Navbar";
import Portfolio from "./pages/Portfolio";
import Music from "./pages/Music"; // Add this import

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/tema" element={<ThemePage />} />
          <Route path="/video" element={<VideoPage />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/musik" element={<Music />} /> {/* Add this route */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
