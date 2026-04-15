// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract FuturisticNFT is ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;
    mapping(uint256 => uint256) public votes;

    event NFTMinted(address indexed recipient, uint256 indexed tokenId, string tokenURI);
    event NFTVoted(uint256 indexed tokenId, uint256 totalVotes);

    constructor() ERC721("FuturisticArt", "FART") Ownable(msg.sender) {}

    function mintNFT(address recipient, string memory tokenURI) public returns (uint256) {
        // Hozircha hamma mint qila olsin (demo uchun), lekin aslida onlyOwner bo'lishi mumkin
        uint256 tokenId = _nextTokenId++;
        _safeMint(recipient, tokenId);
        _setTokenURI(tokenId, tokenURI);
        
        emit NFTMinted(recipient, tokenId, tokenURI);
        return tokenId;
    }

    function vote(uint256 tokenId) public {
        require(_ownerOf(tokenId) != address(0), "NFT mavjud emas");
        votes[tokenId] += 1;
        
        emit NFTVoted(tokenId, votes[tokenId]);
    }

    function getVotes(uint256 tokenId) public view returns (uint256) {
        return votes[tokenId];
    }

    function totalNFTs() public view returns (uint256) {
        return _nextTokenId;
    }
}
