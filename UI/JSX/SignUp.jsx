import React, { Component } from 'react';

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: '',
      success: '',
    };
  }

  onCreateAccount = async (e) => {
    e.preventDefault();
    const form = document.forms.createAccount;

    const Password = form.Password.value.trim();
    const Email = form.Email.value.trim();
    const Name = form.Name.value.trim();
    const Contact = form.Contact.value.trim();
    const ConfirmPassword = form.ConfirmPassword.value.trim();

    if (Password !== ConfirmPassword) {
      this.setState({ error: 'Password mismatch' });
      return;
    }

    if (!/^[a-zA-Z ]+$/.test(Name)) {
      this.setState({ error: 'Name should contain only letters' });
      return;
    }

    try {
      // Check if email already exists
      const emailExists = await this.checkEmailExists(Email);
      if (emailExists) {
        this.setState({ error: 'Email already exists' });
        return;
      }

      // Proceed with user creation if email doesn't exist
      const response = await fetch('http://localhost:8000/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
            mutation addUser($user: UserInput!) {
              addUser(user: $user) {
                cust_ID
                Cust_name
                cust_contact
                cust_email
                log_id
              }
            }
          `,
          variables: {
            user: {
              Cust_name: Name,
              cust_contact: Contact,
              cust_email: Email,
              username: Email,
              password: Password,
            },
          },
        }),
      });

      const result = await response.json();

      if (result.errors) {
        this.setState({ success: '', error: result.errors[0].message });
      } else {
        this.setState({ success: 'Registration successful', error: '' });
      }
    } catch (error) {
      console.error('Error creating account:', error);
      this.setState({ error: 'Failed to create account' });
    }
  };

  // Function to check if email exists
  checkEmailExists = async (email) => {
    try {
      const response = await fetch('http://localhost:8000/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
            query CheckEmail($Email: String!) {
              checkEmail(Email: $Email) {
                cust_email
              }
            }
          `,
          variables: {
            Email: email,
          },
        }),
      });

      const result = await response.json();
      return result.data.checkEmail !== null; // true if email exists, false otherwise
    } catch (error) {
      console.error('Error checking email existence:', error);
      return false; // return false in case of error
    }
  };

  render() {
    return (
      <div className="form-container sign-up-container">
        <form onSubmit={this.onCreateAccount} name="createAccount">
          <h1 className="h1-primary">Create Account</h1>
          <input type="text" placeholder="Name" name="Name" id="Name" required />
          <input type="email" placeholder="Email" name="Email" id="Email" required />
          <input type="tel" placeholder="Contact" name="Contact" id="Contact" />
          <input type="password" placeholder="Password" name="Password" id="Password" required />
          <input type="password" placeholder="Confirm Password" name="ConfirmPassword" id="ConfirmPassword" required />
          <div style={{ color: 'red' }}>{this.state.error}</div>
          <div style={{ color: 'green' }}>{this.state.success}</div>
          <button className="button">Sign Up</button>
        </form>
      </div>
    );
  }
}

export default SignUp;