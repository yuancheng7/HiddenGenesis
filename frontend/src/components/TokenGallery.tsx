import { useEffect, useMemo } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../config/contracts';
import '../styles/TokenGallery.css';

type TokenRecord = {
  tokenAddress: string;
  name: string;
  symbol: string;
  creator: string;
  totalSupply: bigint;
};

type TokenGalleryProps = {
  refreshKey: number;
};

export function TokenGallery({ refreshKey }: TokenGalleryProps) {
  const { address, isConnected } = useAccount();

  const {
    data: allTokenData,
    refetch: refetchAllTokens,
    isPending: isLoadingAll,
  } = useReadContract({
    abi: CONTRACT_ABI,
    address: CONTRACT_ADDRESS,
    functionName: 'getAllTokens',
    query: {
      refetchOnWindowFocus: false,
    },
  });

  const { data: userTokenData, refetch: refetchUserTokens } = useReadContract({
    abi: CONTRACT_ABI,
    address: CONTRACT_ADDRESS,
    functionName: 'getTokensByCreator',
    args: address ? [address] : undefined,
    query: {
      enabled: Boolean(address),
      refetchOnWindowFocus: false,
    },
  });

  useEffect(() => {
    if (refreshKey === 0) {
      return;
    }

    refetchAllTokens?.();
    if (address) {
      refetchUserTokens?.();
    }
  }, [refreshKey, address, refetchAllTokens, refetchUserTokens]);

  const allTokens: TokenRecord[] = useMemo(() => {
    if (!allTokenData) {
      return [];
    }
    return allTokenData as TokenRecord[];
  }, [allTokenData]);

  const userTokens: TokenRecord[] = useMemo(() => {
    if (!userTokenData) {
      return [];
    }
    return userTokenData as TokenRecord[];
  }, [userTokenData]);

  const hasTokens = allTokens.length > 0;
  const isLoading = isLoadingAll;

  return (
    <div className="gallery-card">
      <div className="gallery-header">
        <div>
          <h2>Deployed tokens</h2>
          <p>Every token listed below is live on Sepolia with confidential ERC7984 semantics.</p>
        </div>
        <div className="gallery-pill">{allTokens.length} deployments</div>
      </div>

      {isLoading && <div className="gallery-empty">Loading tokens...</div>}

      {!isLoading && !hasTokens && (
        <div className="gallery-empty">
          <p>No tokens yet. Be the first to deploy one.</p>
        </div>
      )}

      {hasTokens && (
        <div className="gallery-list">
          {allTokens.map((token) => (
            <article key={token.tokenAddress} className="gallery-item">
              <div>
                <div className="gallery-name">{token.name}</div>
                <div className="gallery-symbol">{token.symbol}</div>
              </div>
              <dl>
                <div>
                  <dt>Creator</dt>
                  <dd>
                    <a
                      href={`https://sepolia.etherscan.io/address/${token.creator}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {token.creator}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt>Token</dt>
                  <dd>
                    <a
                      href={`https://sepolia.etherscan.io/address/${token.tokenAddress}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {token.tokenAddress}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt>Total supply</dt>
                  <dd>{token.totalSupply.toString()}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      )}

      {isConnected && (
        <section className="gallery-user">
          <header>
            <h3>Your deployments</h3>
            <span>{userTokens.length}</span>
          </header>
          {userTokens.length === 0 && <p className="gallery-empty">You have not deployed any tokens yet.</p>}
          {userTokens.length > 0 && (
            <ul>
              {userTokens.map((token) => (
                <li key={token.tokenAddress}>
                  <span>{token.name}</span>
                  <code>{token.tokenAddress}</code>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}
