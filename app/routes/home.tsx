import { useCallback, useEffect, useMemo, useState } from "react";
import type { Route } from "./+types/home";
import { usePlaidLink } from "react-plaid-link";
import { Welcome } from "~/welcome/welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}
export const PLAID_CLIENT_ID = "68dcede837fe0500269e7b2f";
export const PLAID_API_KEY = "45006eaa9c79abfa3de1ba08930488";

export default function Home() {
  const [token, setToken] = useState();

  const onSuccess = useCallback(async (public_token: string, metadata) => {
    // send token to server

    console.log("token", token);
    console.log("metadata", metadata);

    const processorToken = await fetch(
      "https://test-embeddables-g50x6erea-kims-projects-3d64e480.vercel.app/plaid/moov-processor-token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          public_token: metadata.public_token,
          account_id: metadata.account_id,
        }),
      }
    );

    const data = await processorToken.json();

    console.log("processorToken", data);

    const WIO_MOOV_ACCOUNT_ID = "14081a1e-eba0-4779-8572-db820ce73777";

    const moovPlaidBankAccount = await fetch(
      `https://test-embeddables-g50x6erea-kims-projects-3d64e480.vercel.app/accounts/${WIO_MOOV_ACCOUNT_ID}/add-plaid-link`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          processor_token: data.processor_token,
          public_token: metadata.public_token,
        }),
      }
    );
    const z = await moovPlaidBankAccount.json();

    console.log("z", z);
  }, []);

  const fetchToken = useCallback(async () => {
    try {
      const res = await fetch(
        "https://test-embeddables-g50x6erea-kims-projects-3d64e480.vercel.app/plaid/create-token",
        {
          method: "POST",
        }
      );
      const data = await res.json();

      setToken(data.link_token);
    } catch (error) {}
  }, []);

  const config = useMemo(
    () => ({
      clientName: "The mock app",
      env: "sandbox",
      product: ["auth", "transactions", "link"],
      publicKey: "68dcede837fe0500269e7b2f",
      onSuccess,
      token,
    }),
    [token]
  );

  const { open, ready, error } = usePlaidLink(config);

  useEffect(() => {
    (async () => {
      await fetchToken();
    })();
  }, []);

  return (
    <div className="flex w-full h-screen items-center justify-center">
      <button
        className="p-4 border-2 glow-box w-48 text-black duration-500 border-white rounded-xl hover:scale-105 transition-all cursor-pointer"
        onClick={async () => {
          if (ready) {
            open();
          }
        }}>
        Open Plaid
      </button>
    </div>
  );
}
