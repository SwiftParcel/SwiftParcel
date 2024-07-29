import React, { useEffect, useRef } from 'react';

const Autocomplete = ({ id, label, onPlaceSelected }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
      types: ['geocode'],
    });

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      onPlaceSelected(place);
    });

    // Apply custom styles to the autocomplete dropdown
    const styleNode = document.createElement('style');
    styleNode.innerHTML = `
      .pac-container {
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1) !important;
        border-radius: 8px !important;
        border: 1px solid #ddd !important;
        font-family: 'Arial', sans-serif !important;
      }
      .pac-item {
        padding: 10px !important;
        cursor: pointer;
      }
      .pac-item:hover {
        background-color: #ffa500 !important;
      }
      .pac-item-query {
        font-weight: bold;
        color: #333;
      }
    `;
    document.head.appendChild(styleNode);

    return () => {
      document.head.removeChild(styleNode);
    };
  }, [onPlaceSelected]);

  const inputStyle = {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    boxSizing: 'border-box',
  };

  const containerStyle = {
    position: 'relative',
  };

  return (
    <div style={containerStyle}>
      <label htmlFor={id}>{label}</label>
      <input ref={inputRef} id={id} style={inputStyle} type="text" />
    </div>
  );
};

export default Autocomplete;
