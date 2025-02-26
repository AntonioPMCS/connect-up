import { createContext, useContext } from "react";
import { Address } from "../types/Address";

interface UpProviderContextType {
  provider: any,
  client: any;
  chainId: number;
  accounts: Array<Address>;
  contextAccounts: Array<Address>;
  walletConnected: boolean;
}

const UpProviderContext = createContext<UpProviderContextType>({
  provider: null,
  client: null,
  chainId: 0,
  accounts: [],
  contextAccounts: [],
  walletConnected: false,
})


export function useUpProvider() {
  const context = useContext(UpProviderContext)
  if (!context) {
    throw new Error('useUpProvider must be used within a UpProvider')
  }
  return context
}


export default UpProviderContext