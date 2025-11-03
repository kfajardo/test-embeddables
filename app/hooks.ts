import { useCallback } from "react";
import { fetchMoovTokenByID, fetchPlaidToken } from "./utils";

export const useMoovMethods = () => {
  const generateMoovToken = useCallback(async (selectedAccount) => {
    return await fetchMoovTokenByID(selectedAccount);
  }, []);

  return {
    generateMoovToken,
  };
};

export const usePlaidMethods = () => {
  const generatePlaidToken = useCallback(async () => {
    return await fetchPlaidToken();
  }, []);

  return { generatePlaidToken };
};
