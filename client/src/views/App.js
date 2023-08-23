//App.js
import React from 'react';
import { BrowserRouter, Routes, Route, } from 'react-router-dom';
import '../views/App.scss';
import Home from './Home/Home';
import Nav from './Nav/Nav'
import Footer from './Footer/Footer';
import CardProduct from '../components/CardProduct';
import Detail from '../components/detail';
const App = () => {
  return (
    <div className='App'>
      <BrowserRouter>
        <Nav />
        <header>
          <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/card" element={<CardProduct />} />
          <Route path="/detail" element={<Detail />} />
          </Routes>
        </header>
        <Footer />
      </BrowserRouter>
    </div>
  );
};

export default App;