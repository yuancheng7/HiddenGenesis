import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Hidden Genesis',
  projectId: 'b45be2efc28d4b1cb1c9ff35e5ad9d63',
  chains: [sepolia],
  ssr: false,
});
