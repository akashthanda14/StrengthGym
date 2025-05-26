import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Facilities } from './components/Facilities';
import { Pricing } from './components/Pricing';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import AppleCarousel from './components/AppleCarousel';
import SocialFeeds from './components/SocialFeeds';

function App() {

 
  return (
    <div className="min-h-screen bg-gym-dark">
      <Navbar />
      <main>
        <Hero />
        <About />
         <AppleCarousel/>
        <Facilities />
        <Pricing />
        <Contact />
        <SocialFeeds/>
      </main>
      <Footer />
    </div>
  );
}

export default App;