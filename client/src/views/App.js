//App.js
import React from 'react';
import { BrowserRouter, Routes, Route, } from 'react-router-dom';
import '../views/App.scss';
import Home from './Home/Home';
import Nav from './Nav/Nav'
import Footer from './Footer/Footer';
const App = () => {
  return (
    <div className='App'>
      <BrowserRouter>
        <Nav />
        <header>
          <Routes>
          <Route path="/home" element={<Home />} />
          </Routes>
        </header>
        <Footer />
      </BrowserRouter>
    </div>
  );
};

export default App;
