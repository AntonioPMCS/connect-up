import { useState, useCallback, useEffect, useContext } from 'react';
import './App.css'
import { createClientUPProvider } from '@lukso/up-provider';
import { Address } from './types/Address';
import UpProviderContext from './context/UpProviderContext';

// Import the LUKSO web-components library
let promise: Promise<unknown> | null = null;
if (typeof window !== "undefined") {
  promise = import("@lukso/web-components");
}

const provider = createClientUPProvider();

function App() {
  // Track connected accounts
  const {
    accounts, 
    contextAccounts, 
    walletConnected
  } = useContext(UpProviderContext)

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Load web component here if needed
    promise?.then(() => {
      setMounted(true);
    });
  }, []);


  return (
    <>
      <h2>
        Grid Host: {contextAccounts[0]}
      </h2>
      <h2>
        Connected Profile: {walletConnected? 'True' : 'False'} - {accounts[0]}
      </h2>
    </>
  )
}

export default App
