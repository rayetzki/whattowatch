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