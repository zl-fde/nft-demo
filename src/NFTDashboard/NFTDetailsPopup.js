import React from 'react';
import './NFTDetailsPopup.css'; 
const NFTDetailsPopup = ({ nft, onClose }) => {
  return (
    <div className="popup">
      <div className="popup-content">
    
        <h2>{nft.title}</h2>
        <p>{nft.description}</p>
        <button className="close-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default NFTDetailsPopup;
