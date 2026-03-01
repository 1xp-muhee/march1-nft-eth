// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract March1NFT is ERC721URIStorage, Ownable {
    uint256 public nextTokenId = 1;
    uint256 public constant MAX_SUPPLY = 100;
    uint256 public mintPrice = 0.003 ether;

    constructor(address initialOwner) ERC721("March1Spirit", "MARCH1") Ownable(initialOwner) {}

    function mint(address to, string memory tokenURI_) external payable {
        require(nextTokenId <= MAX_SUPPLY, "Sold out");
        require(msg.value >= mintPrice, "Insufficient ETH");

        uint256 tokenId = nextTokenId;
        nextTokenId++;

        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI_);
    }

    function setMintPrice(uint256 newPrice) external onlyOwner {
        mintPrice = newPrice;
    }

    function withdraw(address payable to) external onlyOwner {
        (bool ok,) = to.call{value: address(this).balance}("");
        require(ok, "Withdraw failed");
    }
}
