import { useCallback, useEffect, useState } from "react";

type PromiseReturnType<T> = T extends () => Promise<infer R> ? R : unknown;
export function useAsync<Fn extends () => Promise<any> = () => Promise<any>>(asyncFn: Fn) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<PromiseReturnType<Fn>>();
  const [error, setError] = useState<Error>();

  const callback = useCallback(async () => {
    setIsLoading(true);
    setResult(undefined);
    setError(undefined);

    try {
      const res = await asyncFn();
      setResult(res);
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      setError(e);
    }
  }, [asyncFn]);

  return {
    isLoading,
    error,
    result,
    callback,
  };
}

export function useAsyncOnce<T extends () => Promise<any>>(asyncFn: T) {
  const { isLoading, error, result, callback } = useAsync(asyncFn);
  useEffect(() => {
    callback()
  }, []);

  return {
    isLoading,
    error,
    result,
  };
};
