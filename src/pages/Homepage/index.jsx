import React from "react";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Benefits from "./components/Benefits";
import Theme from "./components/Theme";
import HowToOrder from "./components/HowToOrder";

function Home() {
  return (
    <div className="font-primary">
      <Hero />
      <Features />
      <Benefits />
      <Theme />
      <HowToOrder />
    </div>
  );
}

export default Home;
