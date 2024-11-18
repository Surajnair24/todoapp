import React, { Component } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import './landingpage.css';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      redirect: false,
      error: '', // Variable for storing error messages
    };
  }

  // Handle form input changes
  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  // Handle login form submission
  handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = this.state;

    try {
      // Make API call to login
      const response = await axios.post('http://localhost/api/login.php', { email, password });

      if (response.data.status === 'error') {
        // If the response contains an error, set the error message in the state
        this.setState({ error: response.data.message });
      } else {
        // If login is successful, set redirect state to true
        alert('Login successful');
        this.setState({ redirect: true });
      }
    } catch (error) {
      this.setState({ error: 'An error occurred. Please try again later.' });
    }
  };

  render() {
    // If redirect state is true, navigate to the Dashboard and pass the username
    if (this.state.redirect) {
      return <Navigate to="/dashboard" state={{ username: this.state.email }} />;
    }

    return (
      <div className="auth-form">
        <h2>Login</h2>
        <form onSubmit={this.handleLogin}>
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
          <button type="submit">Login</button>
        </form>

        {this.state.error && (
          <div className="error-message" style={{ color: 'red', marginTop: '10px' }}>
            {this.state.error}
          </div>
        )}

        <p>New User? <a href="/sign-up">SignUp</a></p>
      </div>
    );
  }
}

export default Login;
