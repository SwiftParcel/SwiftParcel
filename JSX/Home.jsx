
import React from 'react';
import { Link } from "react-router-dom";
import './Home.css';

import backgroundImage from '../Images/hero-landing.jpg';
import TrackingIcon from '../Images/tracking-icon.svg';
import DeliveryIcon from '../Images/delivery-icon.svg';
import PlatformIcon from '../Images/platform-icon.svg';
import SupportIcon from '../Images/support-icon.svg';
import OpenAccount from '../Images/openac-img.jpg';
import Client1 from '../Images/client-1.jpg';
import Client2 from '../Images/client-2.jpg';
import Client3 from '../Images/client-3.jpg';
const Home = () => {
  return (
    <div className="home-container">
      <section className="home-hero" style={{ backgroundImage: `url(${backgroundImage})`}}>
        <div className="hero-overlay">
          <div className="hero-content">
            <h1>Your Package, Our Priority</h1>
            <h2>Track Your Package</h2>
            <form>
              <input type="text" placeholder="Tracking ID" /><br></br>
              <button type="submit">Track</button>
            </form>
           
          </div>
        </div>
      </section>
      <section className="key-features">
        <div className="feature-card">
          <img src={TrackingIcon} alt="Tracking Icon" />
          <h3>Efficient Parcel Tracking</h3>
          <p>Stay informed every step of the way with our real-time parcel tracking feature. Know exactly where your parcel is from dispatch to delivery, ensuring peace of mind and eliminating uncertainty.</p>
        </div>
        <div className="feature-card">
          <img src={DeliveryIcon} alt="Delivery Icon" />
          <h3>Convenient Delivery Options</h3>
          <p>Choose from a range of convenient delivery options tailored to fit your schedule and preferences. Whether it's same-day delivery, scheduled pickups, or flexible delivery times, we've got you covered.</p>
        </div>
        <div className="feature-card">
          <img src={PlatformIcon} alt="Platform Icon" />
          <h3>User-Friendly Platform</h3>
          <p>Experience hassle-free parcel management with our intuitive and user-friendly platform. Easily schedule pickups, track deliveries, and manage your parcels with just a few clicks, anytime, anywhere.</p>
        </div>
        <div className="feature-card">
          <img src={SupportIcon} alt="Support Icon" />
          <h3>Dedicated Customer Support</h3>
          <p>Have a question or need assistance? Our dedicated customer support team is here to help you every step of the way. Get prompt and personalized support to ensure a seamless parcel management experience.</p>
        </div>
      </section>
      <section className="unique-text-section">
        <div className="text-content">
          <h2><strong>Delivering Locally and Globally with Ease</strong></h2>
          <p>Whether it's right in your neighborhood or across oceans, Swift Parcels has everything you need to be your trusted shipping partner. With a comprehensive range of domestic and international services, we ensure your packages reach their destinations seamlessly. From local deliveries to global shipments, we cover addresses nationwide and over 220 countries worldwide. Swift Parcels: Going the distance, every time.</p>
        </div>
      </section>
      <section className="save-section">
        <div className="section-content">
          <div className="text">
            <h2>Save on Every Delivery</h2>
            <p>Unlock incredible savings and personalized shipping solutions with a complimentary Swift account. Benefit from exclusive discounts, tailored shipping options, and more. Join today to optimize your shipping experience and save on every shipment.</p>
            <Link to="/openAccount" className='signin'>
            <button>Open Swift Account</button>
            </Link>
          </div>
          <div className="image">
            <img src={OpenAccount} alt="Illustration" />
          </div>
        </div>
      </section>

      <section className="client">
      <div className="section__container client__container">
        <h2 className="section__header">Hear From Our Happy Shippers</h2>
        <div className="client__grid">
          <div className="client__card">
            <img src={Client1} alt="client" /> 
            <h4>Lisa M. - Vancouver, BC</h4>
            <p>
            "I've been using Swift Parcels for both my business and personal shipments, and I couldn't be happier. The secure storage and flexible delivery options make it so easy to manage my parcels. Plus, the exclusive discounts are a fantastic bonus!"
            </p>
          </div>
          <div className="client__card">
            <img src={Client2} alt="client" />
            <h4>John D. - Toronto, ON</h4>
            <p>
            "Swift Parcels has completely transformed the way I handle my shipping needs. Their real-time tracking and reliable delivery options give me peace of mind every time I send a package. The customer support team is always prompt and helpful. Highly recommend!"
            </p>
          </div>
          <div className="client__card">
            <img src={Client3} alt="client" />
            <h4>Emily S. - Calgary, AB</h4>
            <p>
            "Swift Parcels has been a game-changer for my online business. The platform is so easy to use, and the delivery options are incredibly convenient. The customer support team is always friendly and quick to resolve any issues. I love the peace of mind Swift Parcels provides!"
            </p>
          </div>
        </div>
      </div>
    </section>
    </div>
  )
};


export default Home;
