import React, { useEffect } from 'react';
import AOS from 'aos';
import "aos/dist/aos.css";
import './index.css';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';
// All pages
import CurrencyConverter from './pages/CurrencyConverter';
import Contact from './pages/Contact';
import About from './pages/About';

import { useDocTitle } from './hooks/CustomHook';
import ScrollToTop from './hooks/ScrollToTop';


function App() {
  useEffect(() => {
    const aos_init = () => {
      AOS.init({
        once: true,
        duration: 1000,
        easing: 'ease-out-cubic',
      });
    }

    window.addEventListener('load', () => {
      aos_init();
    });
  }, []);

  return (
    <>
      <Router>
        <ScrollToTop>
          <Routes>
            <Route path="/" element={<CurrencyConverter />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </ScrollToTop>
      </Router>
    </>
  );
}


export default App;

