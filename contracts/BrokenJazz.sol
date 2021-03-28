// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// Author: Francesco Sullo <francesco@sullo.co>
// BrokenJazz website: https://brokenjazz.cc

contract BrokenJazz is
ERC721URIStorage,
Ownable
{
    mapping(uint256 => address) public approvedClaimers;

    modifier onlyApprovedClaimer(uint256 tokenId) {
        require(approvedClaimers[tokenId] == msg.sender, "BrokenJazz: not approved");
        _;
    }

    constructor(string memory tokenName, string memory symbol)
    ERC721(tokenName, symbol){
    }

    function approveClaimer(address claimer, uint256 tokenId)
    public
    onlyOwner
    {
        require(claimer != address(0), "BrokenJazz: address 0?");
        require(!_exists(tokenId), "BrokenJazz: token already minted");
        approvedClaimers[tokenId] = claimer;
    }

    function claimToken(uint256 tokenId, string memory tokenURI)
    public
    onlyApprovedClaimer(tokenId)
    returns (uint256)
    {
        bytes memory tokenURIBytes = bytes(tokenURI);
        require(tokenURIBytes.length == 67, "BrokenJazz: invalid tokenURI");
        _mint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI);
        return tokenId;
    }

    function awardToken(address addr, uint256 tokenId, string memory tokenURI)
    public
    onlyOwner
    returns (uint256)
    {
        bytes memory tokenURIBytes = bytes(tokenURI);
        require(tokenURIBytes.length == 67, "BrokenJazz: invalid tokenURI");
        _mint(addr, tokenId);
        _setTokenURI(tokenId, tokenURI);
        return tokenId;
    }

}
