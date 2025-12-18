import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import HomePage from "./pages/Homepage";
import Navbar from "./components/Navbar";

// Lazy load non-critical pages
const ThemePage = lazy(() => import("./pages/ThemePage"));
const Pricelist = lazy(() => import("./pages/Pricelist/"));
const Music = lazy(() => import("./pages/Music"));

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Navbar />
        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-screen">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3F4D34]"></div>
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/tema" element={<ThemePage />} />
            <Route path="/pricelist" element={<Pricelist />} />
            <Route path="/musik" element={<Music />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}

export default App;
