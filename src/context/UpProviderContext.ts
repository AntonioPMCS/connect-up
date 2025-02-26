import { createContext } from "react";
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

export default UpProviderContext