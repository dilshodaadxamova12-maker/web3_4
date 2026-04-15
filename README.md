# Futuristic NFT dApp

Ushbu loyiha NFT yaratish (Mint), ko'rish va ular uchun ovoz berish (Vote) imkoniyatini beruvchi Web3 ilovadir.

## Texnologiyalar
- **Smart-kontrakt**: Solidity, OpenZeppelin (ERC721), Hardhat 3.
- **Frontend**: React, Vite, ethers.js.
- **Dizayn**: Premium Glassmorphism UI.

## O'rnatish

### 1. Smart-kontraktni sozlash
```bash
cd contracts
npm install
npx hardhat compile
# Local node ishga tushirish (ixtiyoriy)
# npx hardhat node
# Deploy qilish
# npx hardhat run scripts/deploy.js --network localhost
```

### 2. Frontendni sozlash
```bash
cd frontend
npm install
npm run dev
```

## Loyiha Arxitekturasi
- `contracts/`: Smart-kontrakt kodi va Hardhat sozlamalari.
- `frontend/`: React ilovasi.
- `FuturisticNFT.sol`: NFT minting va ovoz berish logikasi.

## Muallif
[Odilbek](https://github.com/odilbek315)
