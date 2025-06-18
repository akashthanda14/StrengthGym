import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Facilities } from './components/Facilities';
import { Pricing } from './components/Pricing';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import AppleCarousel from './components/AppleCarousel';
import ClientSlideShow from './components/ClientSlideShow';
import SocialFeeds from './components/SocialFeeds';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import AdminDashboard from './components/AdminDashboard';
import ClientDashboard from './components/ClientDashboard';
import { Carousel } from './components/ui/carousel';

type SlideData = {
  title: string;
  button: string;
  src: string;
};

function Home() {

const slides: SlideData[] = [
  {
    title: "Client Transformation 1",
    button: "View More",
    src: "https://res.cloudinary.com/dmt4dj8ft/image/upload/v1748902624/IMG_1130_okrpa4.jpg"
  },
  {
    title: "Client Transformation 2",
    button: "View More",
    src: "https://res.cloudinary.com/dmt4dj8ft/image/upload/v1748902623/0250e939-6894-4359-ab2e-54f03827ee02_myvsmw.jpg"
  },
  {
    title: "Client Transformation 3",
    button: "View More",
    src: "https://res.cloudinary.com/dmt4dj8ft/image/upload/v1748902623/2e7c345e-b97a-4c29-9806-00ea624a5daf_2_tkcvti.jpg"
  },
  {
    title: "Client Transformation 4",
    button: "View More",
    src: "https://res.cloudinary.com/dmt4dj8ft/image/upload/v1748902621/983ecf4e-efa3-4231-8886-2aac7e619b98_yfv42q.jpg"
  },
  {
    title: "Client Transformation 5",
    button: "View More",
    src: "https://res.cloudinary.com/dmt4dj8ft/image/upload/v1748902622/8033ccbe-c9e0-47e6-b2af-89699b34a67e_tqskc8.jpg"
  },
  {
    title: "Client Transformation 6",
    button: "View More",
    src: "https://res.cloudinary.com/dmt4dj8ft/image/upload/v1748902621/5fc74786-a26c-4dfb-9b32-9c1e769ce484_ihl2fs.jpg"
  },
  {
    title: "Client Transformation 7",
    button: "View More",
    src: "https://res.cloudinary.com/dmt4dj8ft/image/upload/v1748902621/80b83e26-3edc-47c1-9366-9d43ad6a8e71_i61yej.jpg"
  },
  {
    title: "Client Transformation 8",
    button: "View More",
    src: "https://res.cloudinary.com/dmt4dj8ft/image/upload/v1748902620/f6cc1f43-2430-4c07-8216-0922e043d559_jouenq.jpg"
  },
  {
    title: "Client Transformation 9",
    button: "View More",
    src: "https://res.cloudinary.com/dmt4dj8ft/image/upload/v1748902620/dd9ecb1e-759f-48ae-86b2-2733ebb0b62e_c9wi8f.jpg"
  }
];



  return (
    <>
      <Navbar />
      <main>
        <Hero />
         <Carousel slides={slides} />
        <About />
        <AppleCarousel />
        <Facilities />
        <Pricing />
        <Contact />
        <SocialFeeds />
      
       </main>
      <Footer />
    </>
  );
}

function App() {
  useEffect(() => {
    // 🔁 Ping the backend on initial load to wake it up
    fetch('https://strengthgymbackend.onrender.com/api/test')
      .then((res) => res.json())
      .then((data) => console.log(data.message))
      .catch((err) => console.error('Wakeup ping failed:', err));
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gym-dark text-white">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/client/dashboard" element={<ClientDashboard />} />
          <Route path="*" element={<div className="p-8">404 - Page Not Found</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
