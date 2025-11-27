// ConfidentialTokenFactory deployment on Sepolia (update address after deployment)
export const CONTRACT_ADDRESS = '0x6140e756Fc548c3e1748bf312562Ec88c41118B5' as const;

// ABI copied from deployments/sepolia/ConfidentialTokenFactory.json
export const CONTRACT_ABI = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "creator",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "tokenAddress",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "symbol",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint64",
        "name": "supply",
        "type": "uint64"
      }
    ],
    "name": "TokenCreated",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "DEFAULT_SUPPLY",
    "outputs": [
      {
        "internalType": "uint64",
        "name": "",
        "type": "uint64"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "symbol",
        "type": "string"
      },
      {
        "internalType": "uint64",
        "name": "initialSupply",
        "type": "uint64"
      }
    ],
    "name": "createToken",
    "outputs": [
      {
        "internalType": "address",
        "name": "tokenAddress",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllTokens",
    "outputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "tokenAddress",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "symbol",
            "type": "string"
          },
          {
            "internalType": "address",
            "name": "creator",
            "type": "address"
          },
          {
            "internalType": "uint64",
            "name": "totalSupply",
            "type": "uint64"
          }
        ],
        "internalType": "struct ConfidentialTokenFactory.TokenRecord[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "index",
        "type": "uint256"
      }
    ],
    "name": "getToken",
    "outputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "tokenAddress",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "symbol",
            "type": "string"
          },
          {
            "internalType": "address",
            "name": "creator",
            "type": "address"
          },
          {
            "internalType": "uint64",
            "name": "totalSupply",
            "type": "uint64"
          }
        ],
        "internalType": "struct ConfidentialTokenFactory.TokenRecord",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTokenCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "creator",
        "type": "address"
      }
    ],
    "name": "getTokensByCreator",
    "outputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "tokenAddress",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "symbol",
            "type": "string"
          },
          {
            "internalType": "address",
            "name": "creator",
            "type": "address"
          },
          {
            "internalType": "uint64",
            "name": "totalSupply",
            "type": "uint64"
          }
        ],
        "internalType": "struct ConfidentialTokenFactory.TokenRecord[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;
