import { createClientUPProvider } from "@lukso/up-provider";
import { createWalletClient, custom, WalletClient } from "viem";
import { luksoTestnet, lukso } from "viem/chains";
import { useEffect, useState, ReactNode, useMemo } from "react";
import { Address } from "../types/Address";
import UpProviderContext from "./UpProviderContext";

const UpProvider = ({ children }: { children: ReactNode }) => {
  const [provider] = useState(() =>
    typeof window !== "undefined" ? createClientUPProvider() : null
  );
  const [chainId, setChainId] = useState<number>(0);
  const [accounts, setAccounts] = useState<Array<Address>>([]);
  const [contextAccounts, setContextAccounts] = useState<Array<Address>>([]);
  const [walletConnected, setWalletConnected] = useState<boolean>(false);

  // ✅ Fetch chainId as soon as provider exists
  useEffect(() => {
    console.log("Running useEffect that fetches chainId");
    console.log("Provider value inside it: "+provider)
    if (!provider) return;

    async function fetchChainId() {
      console.log("Fetchin chainId...")
      try {
        console.log("Inside try block...")
        console.log(provider)
        const initialChainId = (provider as any).chainId;
        console.log("✅ Fetched initial chainId:", initialChainId);
        setChainId(Number(initialChainId));
      } catch (error) {
        console.error("❌ Error fetching chainId:", error);
      }
    }

    fetchChainId();
  }, [provider]); // 🔥 Runs when provider is ready

  // ✅ Create client only after chainId is fetched
  const client: WalletClient | null = useMemo(() => {
    if (provider && chainId !== 0) {
      console.log("✅ Creating wallet client with chainId:", chainId);
      return createWalletClient({
        chain: chainId === 42 ? lukso : luksoTestnet,
        transport: custom(provider),
      });
    }
    return null;
  }, [provider, chainId]);

  useEffect(() => {
    if (!client) {
      console.log("🚨 Client is null, skipping init.");
      return;
    }

    async function init() {
      try {
        console.log("Fetching accounts...");
        const _accounts = (await (client as any).getAddresses()) as Array<Address>;
        console.log("✅ Fetched accounts:", _accounts);
        setAccounts(_accounts);

        const _contextAccounts = provider?.contextAccounts || [];
        console.log("✅ Context accounts:", _contextAccounts);
        setContextAccounts(_contextAccounts);

        setWalletConnected(_accounts.length > 0 && _contextAccounts.length > 0);
      } catch (error) {
        console.error("❌ Error initializing wallet:", error);
      }
    }

    init();

    // 🔥 Handle provider events
    const handleAccountsChanged = (_accounts: Array<Address>) => {
      setAccounts(_accounts);
      setWalletConnected(_accounts.length > 0 && contextAccounts.length > 0);
    };

    const handleContextAccountsChanged = (_accounts: Array<Address>) => {
      setContextAccounts(_accounts);
      setWalletConnected(_accounts.length > 0 && _accounts.length > 0);
    };

    const handleChainChanged = (_chainId: number) => {
      console.log("🔄 Chain changed to:", _chainId);
      setChainId(_chainId);
    };

    (provider as any).on("accountsChanged", handleAccountsChanged);
    (provider as any).on("contextAccountsChanged", handleContextAccountsChanged);
    (provider as any).on("chainChanged", handleChainChanged);

    return () => {
      (provider as any).removeListener("accountsChanged", handleAccountsChanged);
      (provider as any).removeListener("contextAccountsChanged", handleContextAccountsChanged);
      (provider as any).removeListener("chainChanged", handleChainChanged);
    };
  }, [client, provider]);

  return (
    <UpProviderContext.Provider
      value={{
        provider,
        client,
        chainId,
        accounts,
        contextAccounts,
        walletConnected,
      }}
    >
      {children}
    </UpProviderContext.Provider>
  );
};

export default UpProvider;
