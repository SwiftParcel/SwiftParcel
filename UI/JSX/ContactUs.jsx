import React, { Component } from "react";
import './ContactUs.css';
import fb from '../Images/facebook.png';
import twitter from '../Images/twitter.png';
import insta from '../Images/instagram.png';
import linkedin from '../Images/linkedin.png';
import backgroundImage from '../Images/hero-landing.jpg'; // Verify the correct path

class ContactUs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: '',
      success: '',
    };
  }

  onContactUsSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const Name = form.Name.value.trim();
    const Email = form.Email.value.trim();
    const Message = form.Message.value.trim();

    this.setState({ error: '' });

    const contactData = {
      Name,
      Email,
      Message,
    };

    try {
      const response = await fetch('http://localhost:8000/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
            mutation {
              addContactData(contactData: {
                Name: "${contactData.Name}"
                Email: "${contactData.Email}"
                Message: "${contactData.Message}"
              }) {
                id
                Name
                Email
                Message
              }
            }
          `,
        }),
      });

      const result = await response.json();
      if (result.errors) {
        this.setState({ success: '', error: result.errors[0].message });
      } else {
        this.setState({ success: 'Message sent successfully', error: '' });
        form.reset(); // Clear form fields on success
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      this.setState({ success: '', error: 'An error occurred. Please try again later.' });
    }
  };

  render() {
    return (
      <div className="contact-us-container">
        {/* Hero Section */}
        <section className="contactus-hero" style={{ backgroundImage: `url(${backgroundImage})` }}>
          <div className="contactus-hero-overlay">
            <div className="contactus-hero-content">
              <h1>Contact Us</h1>
              <h2>Get in Touch With Us</h2>
            </div>
          </div>
        </section>

        {/* Contact Information Section */}
        <section className="contact-address">
          <div className="feature-cards">
            <div className="feature-card">
              <h3>Our Address</h3>
              <p>11 Kent Street</p>
              <p>Waterloo</p>
              <p>Canada</p>
            </div>
            <div className="feature-card">
              <h3>Contact Information</h3>
              <p>Email: swiftparcels@swift.ca</p>
              <p>Phone: 455-456-6767</p>
            </div>
            <div className="feature-card">
              <h3>Follow Us</h3>
              <div className="social-media">
                <a href="#"><img src={fb} alt="Facebook" /></a>
                <a href="#"><img src={twitter} alt="Twitter" /></a>
                <a href="#"><img src={linkedin} alt="LinkedIn" /></a>
                <a href="#"><img src={insta} alt="Instagram" /></a>
              </div>
            </div>
            <div className="feature-card">
              <h3>Business Hours</h3>
              <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
              <p>Saturday: 10:00 AM - 4:00 PM</p>
              <p>Sunday: Closed</p>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="contact-form">
          <form onSubmit={this.onContactUsSubmit} name="contactUs">
            <h1>Send Us A Message</h1>
            <input type="text" placeholder="Name" name="Name" id="Name" required />
            <input type="email" placeholder="Email" name="Email" id="Email" required />
            <textarea id="Message" name="Message" placeholder="Message" rows="4" required></textarea>
            <div className="form-feedback">
              {this.state.error && <div className="error-message">{this.state.error}</div>}
              {this.state.success && <div className="success-message">{this.state.success}</div>}
            </div>
            <button type="submit" className="submit-button">Send Message</button>
          </form>
        </section>

        {/* Map Section */}
        <section className="map-section">
          <h2>Find Us Here</h2>
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2886.5090306034555!2d-80.52982868456686!3d43.47374447912707!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882bf3a12c23a2d9%3A0x0!2zNDPCsDI4JzI0LjciTiA4MMKwMzEnMzUuNyJX!5e0!3m2!1sen!2sca!4v1683573244227!5m2!1sen!2sca" 
            width="600" 
            height="450" 
            style={{ border: 0 }} 
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade">
          </iframe>
        </section>

        {/* Additional Information Section */}
        <section className="additional-info">
          <h2>Why Contact Us?</h2>
          <p>We are here to assist you with any inquiries or support you may need. Contact us for:</p>
          <ul>
            <li>General information about our services</li>
            <li>Assistance with placing an order</li>
            <li>Help with an existing order</li>
            <li>Providing feedback</li>
            <li>Any other questions you may have</li>
          </ul>
        </section>
      </div>
    );
  }
}

export default ContactUs;
