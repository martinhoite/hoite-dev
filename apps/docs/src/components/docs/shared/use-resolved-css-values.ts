import { useEffect, useState } from 'react';

export function useResolvedCssValues(tokens: readonly string[]) {
  const [values, setValues] = useState<Record<string, string>>({});
  const tokenKey = JSON.stringify(tokens);

  useEffect(() => {
    const root = document.documentElement;
    const computedStyle = window.getComputedStyle(root);
    const stableTokens = JSON.parse(tokenKey) as string[];
    const nextValues = Object.fromEntries(
      stableTokens.map((token) => [token, computedStyle.getPropertyValue(token).trim()]),
    );

    setValues(nextValues);
  }, [tokenKey]);

  return values;
}
