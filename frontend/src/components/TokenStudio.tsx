import { useState } from 'react';
import { Header } from './Header';
import { TokenCreator } from './TokenCreator';
import { TokenGallery } from './TokenGallery';
import '../styles/TokenStudio.css';

export function TokenStudio() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleCreated = () => {
    setRefreshKey((current) => current + 1);
  };

  return (
    <div className="studio-app">
      <Header />
      <main className="studio-main">
        <section className="studio-hero">
          <div>
            <p className="studio-eyebrow">Confidential ERC7984 factory</p>
            <h1>Create fully homomorphic tokens in seconds</h1>
            <p>
              Choose a name, symbol, and optional max supply. Every deployment mints an ERC7984 token that keeps
              balances encrypted with Zama&apos;s FHE rails while remaining tradable on Sepolia.
            </p>
          </div>
        </section>
        <section className="studio-grid">
          <TokenCreator onTokenCreated={handleCreated} />
          <TokenGallery refreshKey={refreshKey} />
        </section>
      </main>
    </div>
  );
}
