import Hero from './components/Hero.jsx';
import PopularRoutes from './components/PopularRoutes.jsx';
import HowItWorks from './components/HowItWorks.jsx';
import './Home.css';

export default function Home() {
  return (
    <>
      <Hero />
      <PopularRoutes />
      <HowItWorks />
    </>
  );
}
