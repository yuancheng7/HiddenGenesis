// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.27;

import {ERC7984} from "confidential-contracts-v91/contracts/token/ERC7984/ERC7984.sol";
import {ZamaEthereumConfig} from "@fhevm/solidity/config/ZamaConfig.sol";
import {FHE, euint64} from "@fhevm/solidity/lib/FHE.sol";

/// @title ConfidentialToken
/// @notice ERC7984 token deployed through ConfidentialTokenFactory
contract ConfidentialToken is ERC7984, ZamaEthereumConfig {
    /// @notice Address of the factory that deployed this token.
    address public immutable factory;

    /// @notice Original creator that requested the deployment.
    address public immutable creator;

    /// @notice Amount that was minted at creation time.
    uint64 public immutable initialSupply;

    error OnlyFactory();

    constructor(
        string memory tokenName,
        string memory tokenSymbol,
        address creatorAddress,
        address initialHolder,
        uint64 supplyToMint
    ) ERC7984(tokenName, tokenSymbol, "") {
        require(bytes(tokenName).length > 0, "Name required");
        require(bytes(tokenSymbol).length > 0, "Symbol required");
        require(creatorAddress != address(0), "Invalid creator");
        require(initialHolder != address(0), "Invalid holder");

        factory = msg.sender;
        creator = creatorAddress;
        initialSupply = supplyToMint;

        if (supplyToMint > 0) {
            euint64 encryptedSupply = FHE.asEuint64(supplyToMint);
            _mint(initialHolder, encryptedSupply);
        }
    }

    /// @notice Additional minting hook reserved for the factory.
    function mint(address to, uint64 amount) external {
        if (msg.sender != factory) {
            revert OnlyFactory();
        }

        euint64 encryptedAmount = FHE.asEuint64(amount);
        _mint(to, encryptedAmount);
    }
}
