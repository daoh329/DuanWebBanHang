//App.js
import React from 'react';
import { BrowserRouter, Routes, Route, } from 'react-router-dom';
import '../views/App.scss';
import Home from './Home/Home';
import Nav from './Nav/Nav'
import Footer from './Footer/Footer';
import Detail from './Detail/Detail';


import Login from './Login/Login.js';
const App = () => {
  return (
    <div className='App'>
      <BrowserRouter>
        <Nav />
        <header>
          <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/detail/:id" element={<Detail />} />
          <Route path="/login" element={<Login />} />
          </Routes>
        </header>
        <Footer />
      </BrowserRouter>
    </div>
  );
};

export default App;