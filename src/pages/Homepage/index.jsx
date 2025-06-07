import Hero from "./components/Hero";
import Features from "./components/Features";
import Benefits from "./components/Benefits";
import Theme from "./components/Theme";
import HowToOrder from "./components/HowToOrder";
import Guarantee from "./components/Guarantee";

function Home() {
  return (
    <div className="font-primary">
      <Hero />
      <Theme />
      <Features />
      <Benefits />
      <Guarantee />
      <HowToOrder />
    </div>
  );
}

export default Home;
