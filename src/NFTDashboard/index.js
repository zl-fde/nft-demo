import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import axios from 'axios';
import './NFTDashboard.css'; 
import NFTDetailsPopup from './NFTDetailsPopup';
const NFTDashboard = () => {
  const [connectedWallet, setConnectedWallet] = useState(null);
  const [nfts, setNFTs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState(null);
  const [page, setPage] = useState(null);
  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();
        setConnectedWallet(accounts[0]);
      } else {
        alert('Please install MetaMask or a compatible wallet to connect.');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };
  const fetchNFTs = async () => {
    setIsLoading(true);
    const apiKey = `GEDFqNSZ_LdDoKxD53oSAAT2Ag-Emdtt`
    const baseURL = `https://eth-mainnet.g.alchemy.com/nft/v2/${apiKey}/getNFTs/`;
    const ownerAddr = `0x5e765C6A318502FF2F6eF0D951e84F8dAE7FA3c9`;
    const fetchURL = `${baseURL}?owner=${ownerAddr}&withMetadata=true&pageSize=100&pageKey=${page}`;
    try {
      const response = await axios.get(fetchURL);
      const { data: { ownedNfts:newNFTs,pageKey } } = response;
      
      setNFTs((prevNFTs) => [...prevNFTs, ...newNFTs]);
      setPage(pageKey);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error('Error fetching NFTs:', error);
    }
  };

  const handleNFTClick = (nft) => {
    setSelectedNFT(nft);
  };

  const handlePopupClose = () => {
    setSelectedNFT(null);
  };

  const handleScroll = () => {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;

    if (!isLoading && scrollTop + clientHeight >= scrollHeight - 20) {
      fetchNFTs();
    }
  };

  useEffect(() => {
    if (connectedWallet) {
      fetchNFTs();
    }
  }, [connectedWallet]);
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [page, isLoading]);
  return (
    <div className="container">
      <h1>NFT Dashboard</h1>
      {connectedWallet ? (
        <p>Connected Wallet: {connectedWallet}</p>
      ) : (
        <button onClick={connectWallet}>Connect Wallet</button>
      )}
      {!isLoading&&
      nfts.length > 0 ? (
        <div className="grid-container">
          {nfts.map((nft) => (
            <div key={nft.id.tokenId} className="nft-item" onClick={() => handleNFTClick(nft)}>
               
              <img src={nft.metadata.image} alt={nft.metadata.name} />
              <p style={{fontWeight:'bold'}}>ID: {parseInt(nft.id.tokenId)}</p>
              <p> {nft.contractMetadata.openSea.collectionName}</p>
            </div>
          ))}
        </div>
        
      ) : (
        !isLoading && <p>No NFTs found.</p>
      )}
      {isLoading && <p>Loading...</p>}
      {selectedNFT && (
        <NFTDetailsPopup
          nft={selectedNFT}
          onClose={handlePopupClose}
        />
      )}
    </div>
  );
};

export default NFTDashboard;
