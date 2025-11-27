# Hidden Genesis – Confidential ERC7984 Token Factory

Hidden Genesis lets anyone mint their own confidential ERC7984 tokens powered by Zama’s FHE rails. A factory contract deploys new tokens with encrypted balances, records every deployment on-chain, and a React/Vite front end exposes the full workflow on Sepolia without mocks or localhost dependencies.

## What this solves
- Self-service confidential token launches: creators choose name, symbol, and optional initial supply (defaults to 1,000,000,000) and receive a fresh ERC7984 token.
- On-chain registry: every deployment is indexed by the factory so users can read all tokens or filter by creator.
- Production-ready references: contracts, deployment scripts, tasks, tests, and a connected front end wired to the real factory ABI.
- No data leaks: balances stay encrypted through ERC7984 and Zama’s FHE primitives while remaining tradable on public chains.

## Advantages
- **FHE-native tokens**: `ConfidentialToken` extends ERC7984 and mints encrypted supply with `FHE.asEuint64`.
- **Deterministic defaults**: zero supply input mints the canonical 1,000,000,000 tokens to the creator; custom supplies are also supported.
- **Auditable history**: `TokenCreated` events plus on-chain metadata from `getAllTokens` / `getTokensByCreator` keep a transparent record.
- **Full-stack delivery**: Hardhat deploy + tasks, unit and Sepolia integration tests, and a live Vite front end using ethers for writes and viem for reads.
- **Environment-light UI**: the front end is preconfigured for Sepolia without environment variables; contract ABI/address are pulled from deployments.

## Tech stack
- **Smart contracts**: Solidity 0.8.27, ERC7984 from `confidential-contracts-v91`, FHE primitives from `@fhevm/solidity`.
- **Frameworks & tooling**: Hardhat + hardhat-deploy, ethers v6, TypeChain, gas reporter, solidity-coverage, Chai/Mocha.
- **Relayer/FHE infra**: Zama FHEVM plugin (`@fhevm/hardhat-plugin`) and configs from `@fhevm/solidity`.
- **Frontend**: React 18 + Vite + TypeScript, RainbowKit + wagmi (viem) for reads, ethers for writes, custom CSS (no Tailwind), Sepolia-only network.

## Repository map
- `contracts/ConfidentialTokenFactory.sol` – deploys new confidential tokens, stores metadata, exposes getters.
- `contracts/ConfidentialToken.sol` – ERC7984 token with encrypted minting and factory-only mint hook.
- `deploy/deploy.ts` – hardhat-deploy script that registers the factory.
- `tasks/` – helper tasks (`task:factory-address`, `task:create-token`, `task:list-tokens`) for CLI flows.
- `test/` – unit coverage for factory behavior and an opt-in Sepolia integration check.
- `frontend/` – Vite app that lets users deploy tokens and browse all factory outputs; uses the generated ABI from `deployments/sepolia`.
- `deployments/sepolia/ConfidentialTokenFactory.json` – source of truth ABI and address to wire into the UI.

## Prerequisites
- Node.js 20+
- npm 7+
- An Infura API key for Sepolia RPC access.
- A funded EOA private key (hex string) for deployments and task execution. Use `PRIVATE_KEY`; do not use a mnemonic.

## Backend setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create `.env` in the repo root (dotenv is already loaded in `hardhat.config.ts`):
   ```
   PRIVATE_KEY=0xYourPrivateKeyHere        # required for Sepolia deploys
   INFURA_API_KEY=your_infura_key          # required for sepolia RPC
   ETHERSCAN_API_KEY=optional_verify_key   # optional, for contract verification
   ```
   The networks config consumes `PRIVATE_KEY` (no mnemonic) and `INFURA_API_KEY`.
3. Build & test:
   ```bash
   npm run compile
   npm run test
   ```

## Local development
- Start a local node (Hardhat FHE-ready):
  ```bash
  npm run chain
  ```
- Deploy the factory locally:
  ```bash
  npm run deploy:localhost
  ```
- Interact via tasks:
  ```bash
  npx hardhat task:create-token --network localhost --name "Local Token" --symbol LOC --supply 5000
  npx hardhat task:list-tokens --network localhost
  ```

## Sepolia deployment
- Ensure `.env` has `PRIVATE_KEY` and `INFURA_API_KEY`.
- Deploy:
  ```bash
  npm run deploy:sepolia
  ```
- Optional verification:
  ```bash
  npm run verify:sepolia
  ```
- Smoke test against the live factory:
  ```bash
  npm run test:sepolia
  ```

## Contract interactions (CLI)
- Show the factory address:
  ```bash
  npx hardhat task:factory-address --network sepolia
  ```
- Create a confidential token (default supply when `--supply 0` or omitted):
  ```bash
  npx hardhat task:create-token --network sepolia --name "Genesis" --symbol GNS --supply 2500000
  ```
- List every deployment:
  ```bash
  npx hardhat task:list-tokens --network sepolia
  ```

## Frontend usage
1. Install UI dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. Wire the live contract:
   - Copy the factory ABI and address from `../deployments/sepolia/ConfidentialTokenFactory.json`.
   - Update `frontend/src/config/contracts.ts` with that address and ABI (the UI intentionally avoids env vars).
3. Run the app:
   ```bash
   npm run dev -- --host
   ```
4. Workflow:
   - Connect a Sepolia wallet via RainbowKit.
   - Fill name, symbol (auto uppercased), and optional supply. The default 1,000,000,000 mints to the creator.
   - After confirmation, the gallery fetches `getAllTokens` and `getTokensByCreator` via viem, displaying every live deployment plus your own list.

## Future plans
- Add mint/burn/transfer extensions on the confidential token with FHE-aware access controls.
- Surface per-token analytics (supply, holders) via an indexer instead of direct RPC scanning.
- Batch deployments and role-based factories for team launches.
- UI refinements: filtering, search, and notification toasts for confirmations.
- Optional verifier hooks and relayer support for gas sponsorship once Zama relayer flows are finalized.

## License
BSD-3-Clause-Clear. See `LICENSE` for details.
