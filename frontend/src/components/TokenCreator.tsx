import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { Contract } from 'ethers';
import { useAccount } from 'wagmi';
import { useEthersSigner } from '../hooks/useEthersSigner';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../config/contracts';
import '../styles/TokenCreator.css';

type TokenCreatorProps = {
  onTokenCreated: () => void;
};

const DEFAULT_SUPPLY = '1000000000';

export function TokenCreator({ onTokenCreated }: TokenCreatorProps) {
  const { isConnected } = useAccount();
  const signerPromise = useEthersSigner();

  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [supply, setSupply] = useState(DEFAULT_SUPPLY);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'pending' | 'confirming' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const parsedSupply = useMemo(() => {
    const trimmed = supply.trim();
    if (!trimmed) {
      return 0n;
    }

    try {
      return BigInt(trimmed);
    } catch (error) {
      return 0n;
    }
  }, [supply]);

  const resetForm = () => {
    setName('');
    setSymbol('');
    setSupply(DEFAULT_SUPPLY);
    setTxHash(null);
    setErrorMessage(null);
    setStatus('idle');
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!signerPromise || !isConnected) {
      setErrorMessage('Connect your wallet before creating a token.');
      return;
    }

    if (!name.trim() || !symbol.trim()) {
      setErrorMessage('Name and symbol are required.');
      return;
    }

    setStatus('pending');
    setErrorMessage(null);
    setTxHash(null);

    try {
      const signer = await signerPromise;
      if (!signer) {
        throw new Error('Signer unavailable');
      }

      const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      const tx = await contract.createToken(name.trim(), symbol.trim().toUpperCase(), parsedSupply);
      setStatus('confirming');
      setTxHash(tx.hash);
      await tx.wait();

      setStatus('success');
      onTokenCreated();
    } catch (error) {
      console.error('Token creation failed', error);
      setErrorMessage(error instanceof Error ? error.message : 'Unknown error');
      setStatus('error');
    }
  };

  const isSubmitting = status === 'pending' || status === 'confirming';

  return (
    <div className="creator-card">
      <h2>Create a confidential token</h2>
      <p className="creator-description">
        Deploys a brand new ERC7984 token. If you skip the supply, the default {DEFAULT_SUPPLY} tokens are minted to
        your wallet.
      </p>

      <form className="creator-form" onSubmit={handleSubmit}>
        <label>
          <span>Token name</span>
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Hidden Genesis Token"
          />
        </label>

        <label>
          <span>Symbol</span>
          <input
            type="text"
            value={symbol}
            onChange={(event) => setSymbol(event.target.value.replace(/\s+/g, '').toUpperCase())}
            placeholder="HGT"
            maxLength={6}
          />
        </label>

        <label>
          <span>Total supply (optional)</span>
          <input
            type="number"
            value={supply}
            onChange={(event) => setSupply(event.target.value)}
            min="0"
            step="1"
            placeholder={DEFAULT_SUPPLY}
          />
          <small>Leave empty to use the default supply.</small>
        </label>

        {errorMessage && <div className="creator-error">⚠️ {errorMessage}</div>}

        {txHash && (
          <div className="creator-tx">
            Transaction hash:
            <a
              href={`https://sepolia.etherscan.io/tx/${txHash}`}
              target="_blank"
              rel="noreferrer"
            >
              {txHash}
            </a>
          </div>
        )}

        <button type="submit" disabled={!isConnected || isSubmitting}>
          {status === 'pending' && 'Waiting for signature...'}
          {status === 'confirming' && 'Confirming transaction...'}
          {status === 'success' && 'Token minted!'}
          {status === 'idle' && 'Deploy token'}
          {status === 'error' && 'Try again'}
        </button>
        {status === 'success' && (
          <button type="button" className="creator-reset" onClick={resetForm}>
            Create another token
          </button>
        )}
      </form>
    </div>
  );
}
