import React, { Component } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom'; 
import './landingpage.css';

class SignUp extends Component {
  constructor(props) {
    super(props);
    // Initialize state
    this.state = {
      email: '',
      password: '',
      confirmPassword: '',
      redirect: false,
      error: '', // Variable for storing error messages
    };
  }

  // Handle form input changes
  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    });
  };

  // Handle sign-up form submission
  handleSignUp = async (e) => {
    e.preventDefault();
    const { email, password, confirmPassword } = this.state;

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      // Make API call to sign up
      const response = await axios.post('http://localhost/api/signup-api.php', { email, password });

      // Check the response from the server
      if (response.data.status === 'error') {
        // If the response contains an error, set the error message in the state
        this.setState({ error: response.data.message });
      } else {
        // If sign-up is successful, set redirect state to true
        alert('Sign up successful');
        this.setState({ redirect: true });
      }
    } catch (error) {
      // In case of a network error or other issues
      this.setState({ error: 'An error occurred. Please try again later.' });
    }
  };

  render() {
    // If redirect state is true, navigate to the login page
    if (this.state.redirect) {
      return <Navigate to="/login" />;
    }

    return (
      <div className="auth-form">
        <h2>Sign Up</h2>
        <form onSubmit={this.handleSignUp}>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={this.state.email}
            onChange={this.handleInputChange}
            required
          />
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={this.state.password}
            onChange={this.handleInputChange}
            required
          />
          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={this.state.confirmPassword}
            onChange={this.handleInputChange}
            required
          />
          <button type="submit">Sign Up</button>
        </form>

        {/* Display error message if there is one */}
        {this.state.error && (
          <div className="error-message" style={{ color: 'red', marginTop: '10px' }}>
            {this.state.error}
          </div>
        )}

        <p>Already have an account? <a href="/login">Login</a></p>
      </div>
    );
  }
}

export default SignUp;
