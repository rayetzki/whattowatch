import { useEffect } from "react";
import { useTransition } from "react";
import { useState } from "react";
import { use } from "react";

const cache = new Map();

export default function useQuery({ fn, key }) {
  if (!cache.has(key)) {
    cache.set(key, fn());
  }
  const promise = cache.get(key);
  const result = use(promise);
  return result;
}

export function useDebounce(value, delay) {
  const [isPending, startTransition] = useTransition();
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      startTransition(() => setDebouncedValue(value));
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return [isPending, debouncedValue];
}