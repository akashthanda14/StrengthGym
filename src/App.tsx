// src/App.tsx
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

function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <ClientSlideShow />
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
  return (
    <Router>
      <div className="min-h-screen bg-gym-dark text-white">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/client/dashboard" element={<ClientDashboard />} />
          {/* Add a fallback 404 route */}
          <Route path="*" element={<div className="p-8">404 - Page Not Found</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
