/**
 * @component UpProvider
 * @description Context provider that manages Universal Profile (UP) wallet connections and state
 * for LUKSO blockchain interactions on Grid. It handles wallet connection status, account management, and chain
 * information while providing real-time updates through event listeners.
 *
 * @provides {UpProviderContext} Context containing:
 * - provider: UP-specific wallet provider instance
 * - client: Viem wallet client for blockchain interactions
 * - chainId: Current blockchain network ID
 * - accounts: Array of connected wallet addresses
 * - contextAccounts: Array of Universal Profile accounts
 * - walletConnected: Boolean indicating active wallet connection
 * - selectedAddress: Currently selected address for transactions
 * - isSearching: Loading state indicator
 */

import { createClientUPProvider } from "@lukso/up-provider";
import { createWalletClient, custom, WalletClient} from "viem";
import { luksoTestnet, lukso } from "viem/chains";
import { useEffect, useState, ReactNode, useMemo } from "react";
import { Address } from "../types/Address";
import UpProviderContext from "./UpProviderContext";

const provider = (typeof window !== 'undefined') ? createClientUPProvider() : null

const UpProvider = ({children}: {children: ReactNode}) => {
  const [chainId, setChainId] = useState<number>(0);
  const [accounts, setAccounts] = useState<Array<Address>>([]);
  const [contextAccounts, setContextAccounts] = useState<Array<Address>>([]);
  const [walletConnected, setWalletConnected] = useState<boolean>(false);
 
  const client: WalletClient | null = useMemo(() => {
    if (provider && chainId) {
      return createWalletClient({
        chain:chainId === 42? lukso : luksoTestnet,
        transport: custom(provider)
      });
    }
    return null;
  }, [chainId])

  useEffect(() => {
    let mounted = true;

    async function init() {
      try {
        if (!client || !provider) return;

        const _chainId = (await provider.request('eth_chainId') as number);
        if (!mounted) return
        setChainId(_chainId);

        const _accounts = (await provider.request('eth_accounts') as Array<Address>);
        if (!mounted) return
        setAccounts(_accounts);

        const _contextAccounts = provider.contextAccounts;
        if (!mounted) return
        setContextAccounts(_contextAccounts);

        setWalletConnected(_accounts.length> 0 && _contextAccounts.length > 0);
      
      } catch (error) {
        console.error(error);
      }
    }

    init();

    if (provider) {
      const accountsChanged = (_accounts: Array<Address>) => {
        setAccounts(_accounts);
        setWalletConnected(_accounts.length > 0 && contextAccounts.length > 0);
      };

      const contextAccountsChanged = (_accounts: Array<Address>) => {
        setContextAccounts(_accounts);
        setWalletConnected(_accounts.length > 0 && contextAccounts.length > 0);
      }
      
      const chainChanged = (_chaindId: number) => {
        setChainId(_chaindId);
      };
      provider.on("accountsChanged", accountsChanged);
      provider.on("contextAccountsChanged", contextAccountsChanged)
      provider.on("chainChanged", chainChanged);

      return () => {
        mounted = false;
        provider.removeListener("accountsChanged", accountsChanged);
        provider.removeListener("contextAccountsChanged",contextAccountsChanged);
        provider.removeListener("chainChanged", chainChanged);
      };
    }
  }, [client, accounts[0], contextAccounts[0]]);

  return (
    <UpProviderContext.Provider
      value = {{
        provider,
        client,
        chainId,
        accounts,
        contextAccounts,
        walletConnected,
      }}>
        <div className="min-h-screen flex items-center justify-center">
          {children}
        </div>
      </UpProviderContext.Provider>
  )
}

export default UpProvider;