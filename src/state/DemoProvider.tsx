import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useReducer, useState } from 'react';
import { BRAND } from '../config/brand.ts';
import type { DemoState } from '../models/index.ts';
import { freshDemo, reduceDemo, type DemoAction } from './demo.ts';
import { parseStoredDemo } from './storage.ts';

interface DemoContextValue { state: DemoState; dispatch: React.Dispatch<DemoAction>; ready: boolean; storageError: boolean }
const DemoContext = createContext<DemoContextValue | null>(null);
export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reduceDemo, undefined, freshDemo);
  const [ready, setReady] = useState(false);
  const [storageError, setStorageError] = useState(false);
  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(BRAND.storageKey).then(raw => {
      if (!active || !raw) return;
      dispatch({ type: 'HYDRATE', state: parseStoredDemo(raw) });
    }).catch(() => { if (active) setStorageError(true); }).finally(() => { if (active) setReady(true); });
    return () => { active = false; };
  }, []);
  useEffect(() => {
    if (!ready) return;
    AsyncStorage.setItem(BRAND.storageKey, JSON.stringify(state)).catch(() => setStorageError(true));
  }, [ready, state]);
  const value = useMemo(() => ({ state, dispatch, ready, storageError }), [state, ready, storageError]);
  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}
export function useDemo() { const value = useContext(DemoContext); if (!value) throw new Error('DemoProvider missing'); return value; }
