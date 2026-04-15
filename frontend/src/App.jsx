import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import abiData from './contracts/abi.json';
import './App.css';

// Eslatma: Bu manzilni smart-kontraktni deploy qilgandan so'ng yangilash kerak
const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; 

function App() {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [nfts, setNfts] = useState([]);
  const [mintUri, setMintUri] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', msg: '' });

  // Hamyon ulanganligini tekshirish
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        setAccount(accounts[0] || null);
      });
    }
  }, []);

  async function connectWallet() {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const nftContract = new ethers.Contract(CONTRACT_ADDRESS, abiData.abi, signer);
        setContract(nftContract);
        loadNFTs(nftContract);
      } catch (err) {
        console.error("Hamyonni ulashda xatolik:", err);
      }
    } else {
      alert("Iltimos, MetaMask hamyonini o'rnating!");
    }
  }

  async function loadNFTs(nftContract) {
    try {
      const total = await nftContract.totalNFTs();
      const items = [];
      for (let i = 0; i < Number(total); i++) {
        const uri = await nftContract.tokenURI(i);
        const votes = await nftContract.getVotes(i);
        items.push({ id: i, uri, votes: votes.toString() });
      }
      setNfts(items);
    } catch (err) {
      console.error("NFT-larni yuklashda xatolik:", err);
    }
  }

  async function mintNFT() {
    if (!contract || !mintUri) return;
    setLoading(true);
    setStatus({ type: '', msg: '' });
    try {
      const tx = await contract.mintNFT(account, mintUri);
      await tx.wait();
      setStatus({ type: 'success', msg: 'NFT muvaffaqiyatli yaratildi (Minted)!' });
      setMintUri('');
      loadNFTs(contract);
    } catch (err) {
      setStatus({ type: 'error', msg: 'Mint qilishda xatolik yuz berdi.' });
      console.error(err);
    }
    setLoading(false);
  }

  async function vote(tokenId) {
    if (!contract) return;
    try {
      const tx = await contract.vote(tokenId);
      await tx.wait();
      loadNFTs(contract);
    } catch (err) {
      console.error("Ovoz berishda xatolik:", err);
    }
  }

  return (
    <div className="App">
      <nav className="navbar">
        <div className="logo">FUTURISTIC NFT</div>
        {account ? (
          <div className="wallet-info">
             <span className="address">{account.substring(0, 6)}...{account.substring(38)}</span>
          </div>
        ) : (
          <button onClick={connectWallet}>Connect Wallet</button>
        )}
      </nav>

      <section className="glass-card mint-panel">
        <h2>Yangi NFT Mint qilish</h2>
        <p>Rasm URI manzilini kiriting (IPFS yoki URL)</p>
        <div className="mint-form">
          <input 
            type="text" 
            placeholder="https://ipfs.io/ipfs/..." 
            value={mintUri} 
            onChange={(e) => setMintUri(e.target.value)}
          />
          <button onClick={mintNFT} disabled={loading || !account}>
            {loading ? 'Minting...' : 'Yaratish'}
          </button>
        </div>
        {status.msg && <div className={`status-msg ${status.type}`}>{status.msg}</div>}
      </section>

      <div className="grid">
        {nfts.length > 0 ? nfts.map((nft) => (
          <div key={nft.id} className="glass-card nft-card">
            <img 
              src={nft.uri} 
              alt={`NFT #${nft.id}`} 
              className="nft-image" 
              onError={(e) => { e.target.src = 'https://via.placeholder.com/300x200?text=Futuristic+NFT'; }}
            />
            <div className="nft-details">
              <h3>Token ID: #{nft.id}</h3>
              <div className="votes-count">⭐ Ovozlar: {nft.votes}</div>
              <button className="vote-btn" onClick={() => vote(nft.id)}>Ovoz berish</button>
            </div>
          </div>
        )) : (
          <div className="no-nfts">Hali NFT-lar mavjud emas. Birinchisini yarating!</div>
        )}
      </div>
    </div>
  );
}

export default App;
