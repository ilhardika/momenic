import Hero from "./components/Hero";
import Stats from "./components/Stats";
import Features from "./components/Features";
import Theme from "./components/Theme";
import Benefits from "./components/Benefits";
import PriceTable from "./components/PriceTable";
import HowToOrder from "./components/HowToOrder";
import FAQ from "./components/FAQ";
import Consultation from "./components/Consultation";
import Guarantee from "./components/Guarantee";

function Home() {
  return (
    <div className="font-primary">
      <div id="home"><Hero /></div>
      <Stats />
      <div id="fitur"><Features /></div>
      <div id="katalog"><Theme /></div>
      <Benefits />
      <PriceTable />
      <div id="cara-pesan"><HowToOrder /></div>
      <FAQ />
      <Consultation />
      <Guarantee />
    </div>
  );
}

export default Home;
