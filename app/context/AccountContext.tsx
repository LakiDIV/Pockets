import React, { createContext, useContext, useState, useEffect } from 'react';
import { Account } from '@/app/types/account';
import { StorageUtils } from '@/app/utils/storage';

interface AccountContextType {
  selectedAccount: Account | null;
  setSelectedAccount: (account: Account) => void;
  accounts: Account[];
  refreshAccounts: () => Promise<void>;
  getLatestAccountData: (accountId: string) => Promise<Account | null>;
}

const AccountContext = createContext<AccountContextType | undefined>(undefined);

export function AccountProvider({ children }: { children: React.ReactNode }) {
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);

  const getLatestAccountData = async (accountId: string) => {
    const latestAccounts = await StorageUtils.getAccounts();
    return latestAccounts.find(acc => acc.id === accountId) || null;
  };

  const refreshAccounts = async () => {
    const loadedAccounts = await StorageUtils.getAccounts();
    setAccounts(loadedAccounts);

    // If there's no selected account or the selected account no longer exists
    // (was deleted), select the main account
    if (!selectedAccount || !loadedAccounts.find(acc => acc.id === selectedAccount.id)) {
      const mainAccount = loadedAccounts.find(acc => acc.type === 'main');
      if (mainAccount) {
        setSelectedAccount(mainAccount);
      }
    } else {
      // Update the selected account with fresh data
      const freshAccount = loadedAccounts.find(acc => acc.id === selectedAccount.id);
      if (freshAccount) {
        setSelectedAccount(freshAccount);
      }
    }
  };

  useEffect(() => {
    refreshAccounts();
  }, []);

  return (
    <AccountContext.Provider
      value={{
        selectedAccount,
        setSelectedAccount,
        accounts,
        refreshAccounts,
        getLatestAccountData,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
}

export function useAccount() {
  const context = useContext(AccountContext);
  if (context === undefined) {
    throw new Error('useAccount must be used within an AccountProvider');
  }
  return context;
} 