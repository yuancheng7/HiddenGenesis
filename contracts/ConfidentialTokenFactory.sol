// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.27;

import {ConfidentialToken} from "./ConfidentialToken.sol";

/// @title ConfidentialTokenFactory
/// @notice Deploys ERC7984 tokens with default supply and stores metadata on-chain.
contract ConfidentialTokenFactory {
    uint64 public constant DEFAULT_SUPPLY = 1_000_000_000;

    struct TokenRecord {
        address tokenAddress;
        string name;
        string symbol;
        address creator;
        uint64 totalSupply;
    }

    TokenRecord[] private _tokens;
    mapping(address => uint256[]) private _creatorTokenIndexes;

    event TokenCreated(address indexed creator, address indexed tokenAddress, string name, string symbol, uint64 supply);

    /// @notice Deploys a new ConfidentialToken and persists metadata.
    /// @param name Token name chosen by the creator.
    /// @param symbol Token symbol chosen by the creator.
    /// @param initialSupply Optional initial supply (defaults to DEFAULT_SUPPLY when zero).
    /// @return tokenAddress Address of the newly created token contract.
    function createToken(
        string calldata name,
        string calldata symbol,
        uint64 initialSupply
    ) external returns (address tokenAddress) {
        require(bytes(name).length > 0, "Name required");
        require(bytes(symbol).length > 0, "Symbol required");

        uint64 supplyToMint = initialSupply > 0 ? initialSupply : DEFAULT_SUPPLY;

        ConfidentialToken token = new ConfidentialToken(name, symbol, msg.sender, msg.sender, supplyToMint);
        tokenAddress = address(token);

        TokenRecord memory record = TokenRecord({
            tokenAddress: tokenAddress,
            name: name,
            symbol: symbol,
            creator: msg.sender,
            totalSupply: supplyToMint
        });

        _tokens.push(record);
        _creatorTokenIndexes[msg.sender].push(_tokens.length - 1);

        emit TokenCreated(msg.sender, tokenAddress, name, symbol, supplyToMint);
    }

    /// @notice Number of tokens created through the factory.
    function getTokenCount() external view returns (uint256) {
        return _tokens.length;
    }

    /// @notice Returns metadata for a token stored at the provided index.
    function getToken(uint256 index) external view returns (TokenRecord memory) {
        require(index < _tokens.length, "Invalid index");
        return _tokens[index];
    }

    /// @notice Retrieves every token created through the factory.
    function getAllTokens() external view returns (TokenRecord[] memory) {
        TokenRecord[] memory records = new TokenRecord[](_tokens.length);
        for (uint256 i = 0; i < _tokens.length; i++) {
            records[i] = _tokens[i];
        }
        return records;
    }

    /// @notice Returns all tokens created by a specific address.
    function getTokensByCreator(address creator) external view returns (TokenRecord[] memory) {
        uint256[] storage indexes = _creatorTokenIndexes[creator];
        TokenRecord[] memory records = new TokenRecord[](indexes.length);
        for (uint256 i = 0; i < indexes.length; i++) {
            records[i] = _tokens[indexes[i]];
        }
        return records;
    }
}
