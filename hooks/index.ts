import { useCallback, useEffect, useState } from "react";

export const useAsyncCallback = (asyncFn: (params: unknown[]) => unknown, params: unknown[], immediate = true) => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const executor = useCallback(async () => {
    setIsLoading(true);
    setResult(null);
    setError(null);

    try {
      const res = await asyncFn(params);
      setResult(res);
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      setError(e);
    }
  }, [asyncFn, params]);

  useEffect(() => {
    if (immediate) {
      executor();
    }
  }, [executor, params, immediate]);

  return {
    isLoading,
    error,
    result,
    executor,
  };
};
