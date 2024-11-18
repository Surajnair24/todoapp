// src/LandingPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import './landingpage.css';

function LandingPage() {
  return (
    <div className="container">
      <h1>To Do App</h1>
      <h4>New User? Please </h4>
      <Link to="/sign-up" >Sign Up</Link>
      <h5>Already signed up? Please </h5>
      <Link to="/login" >Login</Link>
    </div>
  );
}

export default LandingPage;
