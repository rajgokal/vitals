'use client';

import { useState, useEffect } from 'react';

interface UseWearableDataOptions {
  endpoint: string;
  params?: Record<string, string>;
}

interface UseWearableDataResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useWearableData<T>({ endpoint, params }: UseWearableDataOptions): UseWearableDataResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const queryString = params
    ? '?' + new URLSearchParams(params).toString()
    : '';

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(`/api/wearables/${endpoint}${queryString}`)
      .then(res => {
        if (!res.ok) throw new Error(`${res.status}`);
        return res.json();
      })
      .then(d => { if (!cancelled) setData(d); })
      .catch(e => { if (!cancelled) setError(e.message); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [endpoint, queryString, tick]);

  return { data, loading, error, refetch: () => setTick(t => t + 1) };
}
