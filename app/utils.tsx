export const fetchMoovTokenByID = async (id: string) => {
  const res = await fetch(
    `https://test-embeddables-be.vercel.app/accessToken?accountID=${id}`
  );

  const data = await res.json();

  return data;
};

export const fetchPlaidToken = async () => {
  const res = await fetch(
    "https://test-embeddables-be.vercel.app/plaid/create-token",
    {
      method: "POST",
    }
  );

  const data = await res.json();

  return data;
};

export const createProcessToken = async (
  publicToken: string,
  bankAccountID: string
) => {
  const response = await fetch(
    "https://test-embeddables-be.vercel.app/plaid/moov-processor-token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        public_token: publicToken,
        account_id: bankAccountID,
      }),
    }
  );

  return response;
};

export const fetchAllMoovAccounts = async () => {
  const result = await fetch("https://test-embeddables-be.vercel.app/accounts");
  const data = await result.json();

  return data;
};
