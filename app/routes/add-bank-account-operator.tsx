"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { GenericUserSelection } from "~/components/GenericUserSelection";
import { fetchAllMoovAccounts } from "~/utils";
import { useMoovMethods } from "~/hooks";
import type { Route } from "../+types/root";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "[OPERATOR] - Add Bank Account" },
    {
      name: "description",
      content: "Link your bank account securely as an Operator",
    },
  ];
}

export default function AddBankAccount() {
  const [accounts, setAccounts] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const moovRef = useRef(null);

  const { generateMoovToken } = useMoovMethods();

  useEffect(() => {
    if (selectedAccount) {
      // @ts-ignore
      if (window.Moov) {
        generateMoovToken(selectedAccount).then((result) => {
          let Moov = moovRef.current;

          Moov.token = result.access_token;
          Moov.accountID = selectedAccount;
          Moov.onResourceCreated = (result) => {
            console.log("BANK ACCOUNT SUCCESSFULLY ADDED", result);
          };
          Moov.microDeposits = false;
          Moov.onError = ({ errorType, error }) => {
            console.log(errorType); // "bankAccount", "plaid", etc
            console.error(error); // Error message
          };
        });
      } else {
        console.warn("Moov SDK not loaded yet");
      }
    }
  }, [selectedAccount]);

  const openInterface = () => {
    if (moovRef.current) {
      moovRef.current.open = true;
    }
  };

  const fetchAccounts = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchAllMoovAccounts();
      if (data.accounts?.length > 0) {
        setAccounts(data.accounts ?? []);
      }
    } catch (error) {
      console.error("There was an error fetching Moov accounts", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="flex flex-col w-full h-screen items-center justify-center gap-6 p-8">
      <div className="text-center space-y-4 flex flex-col items-center">
        <h1 className="text-4xl font-bold">[OPERATOR] - Add Bank Account</h1>
        <p className="text-gray-400 max-w-md">
          Securely link your bank account using Moov's native system of handling
          bank accounts.
        </p>
      </div>

      <div>
        {accounts?.length > 0 ? (
          <GenericUserSelection
            selectedItem={selectedAccount}
            data={accounts ?? []}
            isLoading={isLoading}
            onSelect={(account) => setSelectedAccount(account)}
          />
        ) : (
          <div>
            <button
              disabled={isLoading}
              className="text-black font-black cursor-pointer disabled:pointer-events-none disabled:opacity-25 disabled:cursor-not-allowed hover:scale-105 transition-all p-4 px-5 glow-box flex items-center gap-4"
              onClick={fetchAccounts}>
              Fetch Moov Accounts{" "}
              {isLoading && (
                <div className="inline-block animate-spin rounded-full h-3 w-3 border-b-2 border-green-600" />
              )}
            </button>
          </div>
        )}
      </div>

      {selectedAccount && (
        <button
          className="text-black font-black cursor-pointer hover:scale-105 transition-all p-4 px-5 glow-box"
          onClick={openInterface}>
          Link Bank Account with Moov
        </button>
      )}

      {/* @ts-ignore */}
      <moov-payment-methods ref={moovRef} />
    </div>
  );
}
