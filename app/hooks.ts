import { useCallback } from "react";
import { fetchMoovTokenByID } from "./utils";

export const useMoovMethods = () => {
  const generateMoovToken = useCallback(async (selectedAccount) => {
    await fetchMoovTokenByID(selectedAccount);
  }, []);

  return {
    generateMoovToken,
  };
};

export const usePlaidMethods = () => {
  const generatePlaidToken = useCallback(async () => {
    await generatePlaidToken();
  }, []);

  return { generatePlaidToken };
};
