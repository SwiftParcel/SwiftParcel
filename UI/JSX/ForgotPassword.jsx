import React, { Component } from 'react';

class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      error: '',
      successMessage: ''
    };
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    const { email } = this.state;

    try {
      const response = await fetch('http://localhost:8000/api/request-password-reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      if (response.ok) {
        this.setState({ successMessage: 'Password reset instructions sent to your email.', error: '' });
      } else {
        const errorData = await response.json();
        this.setState({ error: `Failed to request password reset. ${errorData.message}`, successMessage: '' });
      }
    } catch (error) {
      console.error('Error requesting password reset:', error);
      this.setState({ error: 'Failed to request password reset. Please try again.', successMessage: '' });
    }
  };

  handleChange = (e) => {
    this.setState({ email: e.target.value });
  };

  render() {
    const { email, error, successMessage } = this.state;

    return (
      <div className="forgot-password-container">
        <h2>Forgot Password?</h2>
        <form onSubmit={this.handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={this.handleChange}
            required
          />
          <button type="submit">Reset Password</button>
        </form>
        {error && <div className="error-message">{error}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}
      </div>
    );
  }
}

export default ForgotPassword;