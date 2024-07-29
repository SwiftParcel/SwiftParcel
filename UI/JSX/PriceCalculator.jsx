import React, { useState } from 'react';
import Autocomplete from './Autocomplete.jsx';
import './PriceCalculator.css';
import { Link } from 'react-router-dom';
import quoting from "../Images/quoting.jpg"

const PriceCalculator = () => {
  const [formData, setFormData] = useState({
    weight: '',
    length: '',
    width: '',
    height: '',
    origin: '',
    destination: '',
  });
  const [prices, setPrices] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handlePlaceSelected = (place, name) => {
    setFormData({
      ...formData,
      [name]: place.formatted_address,
    });
  };

  const calculatePrices = () => {
    const { weight, length, width, height } = formData;
    const basePrice = weight * 5 + (length / 100) * (width / 100) * (height / 100) * 2; // Base price calculation

    return {
      express: (basePrice * 2).toFixed(2), // 2x cost for express
      recommendation: (basePrice * 1.5).toFixed(2), // 1.5x cost for recommendation
      standard: (basePrice * 1).toFixed(2), // 1x cost for standard
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const prices = calculatePrices();
    setPrices(prices);
  };

  const handleSelectOption = (option) => {
    setSelectedOption(option);
  };

  const handleCancel = () => {
    setSelectedOption(null);
    setPrices(null);
    setFormData({
      weight: '',
      length: '',
      width: '',
      height: '',
      origin: '',
      destination: '',
    });
  };

  return (
    <div className="price-container">
      <div className="price-left">
        <h2>Price Calculator</h2>
        <form onSubmit={handleSubmit}>
          <Autocomplete
            id="origin"
            label="From*"
            onPlaceSelected={(place) => handlePlaceSelected(place, 'origin')}
          />
          <Autocomplete
            id="destination"
            label="To*"
            onPlaceSelected={(place) => handlePlaceSelected(place, 'destination')}
          />
          <div className="price-form-group">
            <label>Weight (kg):</label>
            <input type="number" name="weight" value={formData.weight} onChange={handleChange} required />
          </div>
          <div className="price-form-group-row">
            <div className="price-form-group">
              <label>Length (cm):</label>
              <input type="number" name="length" value={formData.length} onChange={handleChange} required />
            </div>
            <div className="price-form-group">
              <label>Width (cm):</label>
              <input type="number" name="width" value={formData.width} onChange={handleChange} required />
            </div>
            <div className="price-form-group">
              <label>Height (cm):</label>
              <input type="number" name="height" value={formData.height} onChange={handleChange} required />
            </div>
          </div>
          <button type="submit" className="price-button">Calculate</button>
        </form>
      </div>
      <div className="price-right">
        {!prices ? (
          <div className="price-info">
            <img src={quoting} alt="Swift Parcels" className="price-image" />
            <p>Swift Parcels offers the best shipping rates with reliable and fast delivery. Whether you choose express or standard delivery, you can trust us to handle your parcels with care.</p>
          </div>
        ) : (
          <div className="price-options">
            <div className={`price-option ${selectedOption === 'recommendation' ? 'price-selected' : ''}`} onClick={() => handleSelectOption('recommendation')}>
              <div className="price-details">
                <h3>OUR RECOMMENDATION</h3>
                <p>Deliver within 2 Days</p>
                <p className="price">${prices.recommendation}</p>
                <p>Express Delivery</p>
              </div>
              <div className="price-dimensions">
                <p>Weight: {formData.weight} kg</p>
                <p>Dimensions: {formData.length} x {formData.width} x {formData.height} cm</p>
              </div>
            </div>
            <div className={`price-option ${selectedOption === 'standard' ? 'price-selected' : ''}`} onClick={() => handleSelectOption('standard')}>
              <div className="price-details">
                <h3>LOWEST COST</h3>
                <p>Deliver within a week</p>
                <p className="price">${prices.standard}</p>
                <p>Standard Delivery</p>
              </div>
              <div className="price-dimensions">
                <p>Weight: {formData.weight} kg</p>
                <p>Dimensions: {formData.length} x {formData.width} x {formData.height} cm</p>
              </div>
            </div>
            <div className={`price-option ${selectedOption === 'express' ? 'price-selected' : ''}`} onClick={() => handleSelectOption('express')}>
              <div className="price-details">
                <h3>FASTEST</h3>
                <p>Next Day Delivery</p>
                <p className="price">${prices.express}</p>
                <p>Express Early Delivery</p>
              </div>
              <div className="price-dimensions">
                <p>Weight: {formData.weight} kg</p>
                <p>Dimensions: {formData.length} x {formData.width} x {formData.height} cm</p>
              </div>
            </div>
            <div className="price-actions">
              <button onClick={handleCancel} className="price-button price-cancel">Cancel</button>
              <Link to="/userCollectionRequest">
              <button className="price-button price-request">Request Pickup</button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PriceCalculator;
