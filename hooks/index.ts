import { DependencyList, useCallback, useEffect, useState } from "react";

type PromiseReturnType<T, P> = T extends (args: P) => Promise<infer R> ? R : any;
export function useAsyncCallback<T extends (args: P) => Promise<any>, R extends PromiseReturnType<T, P>, P>(asyncFn: T, params: P, immediate = true) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<R>(null);
  const [error, setError] = useState<{ message: string } | null>(null);

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
