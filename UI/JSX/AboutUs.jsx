import React from 'react';
import './AboutUs.css';
import { Link } from 'react-router-dom';

// Import images
import TeamImage from '../Images/hero-landing.jpg';
import Tracking from '../Images/tracking-icon.svg';
import Support from '../Images/support-icon.svg';
import Platform from '../Images/platform-icon.svg';
import Storage from '../Images/storage-icon.svg';
import Client1 from '../Images/client-1.jpg';
import Client2 from '../Images/client-2.jpg';
import Client3 from '../Images/client-3.jpg';

const AboutUs = () => {
  return (
    <div className="about-us-container">
      <header className="about-hero">
        <div className="hero-content">
          <h1>About Swift Parcels</h1>
          <p>Effortless Shipping, Efficient Tracking</p>
        </div>
      </header>

      <section className="about-intro">
        <div className="intro-content">
          <h2>Welcome to Swift Parcels</h2>
          <p>
            Swift Parcels is dedicated to providing a seamless shipping experience with real-time tracking and reliable delivery options. Our platform is designed with the user in mind, offering intuitive and easy-to-use features to ensure your parcels are managed effortlessly.
          </p>
          <img src={TeamImage} alt="Our Team" className="team-image"/>
        </div>
      </section>

      <section className="features-section">
        <h2>Why Choose Swift Parcels?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <img src={Tracking} alt="Efficient Tracking" />
            <h3>Efficient Parcel Tracking</h3>
            <p>Stay informed every step of the way with our real-time parcel tracking feature.</p>
          </div>
          <div className="feature-card">
            <img src={Storage} alt="Convenient Delivery" />
            <h3>Convenient Delivery Options</h3>
            <p>Choose from a range of convenient delivery options tailored to fit your schedule.</p>
          </div>
          <div className="feature-card">
            <img src={Platform} alt="User-Friendly Platform" />
            <h3>User-Friendly Platform</h3>
            <p>Experience hassle-free parcel management with our intuitive platform.</p>
          </div>
          <div className="feature-card">
            <img src={Support} alt="Customer Support" />
            <h3>Dedicated Customer Support</h3>
            <p>Our dedicated customer support team is here to help you every step of the way.</p>
          </div>
        </div>
      </section>

      <section className="interactive-section">
        <div className="interactive-content">
          <h2>Delivering Locally and Globally with Ease</h2>
          <p>
            Whether it's right in your neighborhood or across oceans, Swift Parcels has everything you need to be your trusted shipping partner. From local deliveries to global shipments, we cover addresses nationwide and over 220 countries worldwide.
          </p>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-content">
          <div className="cta-text">
            <h2>Save on Every Delivery</h2>
            <p>
              Unlock incredible savings and personalized shipping solutions with a complimentary Swift account. Benefit from exclusive discounts, tailored shipping options, and more.
            </p>
            <Link to="/openAccount" className="cta-button">Open Swift Account</Link>
          </div>
          <div className="cta-image">
            <img src={Tracking} alt="Save on Delivery" />
          </div>
        </div>
      </section>

      <section className="testimonials">
        <h2>Hear From Our Happy Shippers</h2>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <img src={Client1} alt="Lisa M." />
            <h4>Lisa M. - Vancouver, BC</h4>
            <p>"I've been using Swift Parcels for both my business and personal shipments, and I couldn't be happier. The secure storage and flexible delivery options make it so easy to manage my parcels."</p>
          </div>
          <div className="testimonial-card">
            <img src={Client2} alt="John D." />
            <h4>John D. - Toronto, ON</h4>
            <p>"Swift Parcels has completely transformed the way I handle my shipping needs. Their real-time tracking and reliable delivery options give me peace of mind every time I send a package."</p>
          </div>
          <div className="testimonial-card">
            <img src={Client3} alt="Emily S." />
            <h4>Emily S. - Calgary, AB</h4>
            <p>"Swift Parcels has been a game-changer for my online business. The platform is so easy to use, and the delivery options are incredibly convenient. The customer support team is always friendly."</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
