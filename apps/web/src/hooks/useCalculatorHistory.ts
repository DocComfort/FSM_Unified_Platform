import { useEffect, useMemo, useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';
import type { Database } from '@fsm/types';

export type CalculatorType = Database['public']['Tables']['calculator_run_history']['Row']['calculator_type'];

export interface CalculatorRun<TInput, TResult> {
  id: string;
  createdAt: string;
  input: TInput;
  result?: TResult;
  notes?: string | null;
  source: 'local' | 'remote';
}

interface SaveRunOptions<TInput, TResult> {
  input: TInput;
  result?: TResult;
  notes?: string;
}

const LOCAL_KEY_PREFIX = 'fsm-calculator-history';
const LOCAL_LIMIT = 10;

function getLocalStorageKey(calculatorType: CalculatorType): string {
  return `${LOCAL_KEY_PREFIX}:${calculatorType}`;
}

function loadLocalRuns<TInput, TResult>(calculatorType: CalculatorType): CalculatorRun<TInput, TResult>[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(getLocalStorageKey(calculatorType));
    if (!raw) return [];
    return JSON.parse(raw) as CalculatorRun<TInput, TResult>[];
  } catch (error) {
    console.warn('Failed to parse calculator history from local storage', error);
    return [];
  }
}

function persistLocalRuns<TInput, TResult>(
  calculatorType: CalculatorType,
  runs: CalculatorRun<TInput, TResult>[]
) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(getLocalStorageKey(calculatorType), JSON.stringify(runs));
  } catch (error) {
    console.warn('Failed to persist calculator history', error);
  }
}

export function useCalculatorHistory<TInput, TResult>(calculatorType: CalculatorType) {
  const queryClient = useQueryClient();
  const [session, setSession] = useState<Session | null>(null);
  const [sessionReady, setSessionReady] = useState(false);
  const [localRuns, setLocalRuns] = useState<CalculatorRun<TInput, TResult>[]>(() =>
    loadLocalRuns<TInput, TResult>(calculatorType)
  );
  const hasSyncedLocalOnLogin = useRef(false);

  useEffect(() => {
    let isMounted = true;

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!isMounted) return;
        setSession(data.session ?? null);
        setSessionReady(true);
      })
      .catch(() => setSessionReady(true));

    const {
      data: authListener,
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setSessionReady(true);
    });

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  const remoteQuery = useQuery({
    queryKey: ['calculator-history', calculatorType, session?.user.id],
    queryFn: async () => {
      if (!session) return [] as CalculatorRun<TInput, TResult>[];
      const { data, error } = await supabase
        .from('calculator_run_history')
        .select('id, calculator_type, input_payload, result_payload, created_at, notes')
        .eq('calculator_type', calculatorType)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      return (
        data?.map((row) => ({
          id: row.id,
          createdAt: row.created_at ?? new Date().toISOString(),
          input: row.input_payload as TInput,
          result: (row.result_payload ?? undefined) as TResult | undefined,
          notes: row.notes,
          source: 'remote' as const,
        })) ?? []
      );
    },
    enabled: sessionReady && !!session,
  });

  useEffect(() => {
    if (!sessionReady || !session || hasSyncedLocalOnLogin.current) return;
    if (!localRuns.length) return;

    const unsynced = localRuns.filter((run) => run.source === 'local');
    if (!unsynced.length) {
      hasSyncedLocalOnLogin.current = true;
      return;
    }

    const syncRuns = async () => {
      try {
        await supabase.from('calculator_run_history').insert(
          unsynced.map((run) => ({
            calculator_type: calculatorType,
            input_payload: run.input,
            result_payload: run.result ?? null,
            notes: run.notes ?? null,
            profile_id: session.user.id,
            platform: 'web',
          }))
        );
        queryClient.invalidateQueries({
          queryKey: ['calculator-history', calculatorType, session.user.id],
        });
        hasSyncedLocalOnLogin.current = true;
        setLocalRuns([]);
        persistLocalRuns(calculatorType, []);
      } catch (error) {
        console.warn('Failed to sync local calculator runs', error);
      }
    };

    void syncRuns();
  }, [calculatorType, localRuns, queryClient, session, sessionReady]);

  const history = useMemo(() => {
    if (session && remoteQuery.data) {
      return remoteQuery.data;
    }
    return localRuns;
  }, [session, remoteQuery.data, localRuns]);

  const saveRun = async ({ input, result, notes }: SaveRunOptions<TInput, TResult>) => {
    const newRun: CalculatorRun<TInput, TResult> = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      input,
      result,
      notes: notes ?? null,
      source: session ? 'remote' : 'local',
    };

    if (!session) {
      setLocalRuns((prev) => {
        const next = [newRun, ...prev].slice(0, LOCAL_LIMIT);
        persistLocalRuns(calculatorType, next);
        return next;
      });
      return;
    }

    await supabase.from('calculator_run_history').insert({
      calculator_type: calculatorType,
      input_payload: input,
      result_payload: result ?? null,
      notes: notes ?? null,
      profile_id: session.user.id,
      platform: 'web',
    });
    queryClient.invalidateQueries({
      queryKey: ['calculator-history', calculatorType, session.user.id],
    });
  };

  const clearLocal = () => {
    setLocalRuns([]);
    persistLocalRuns(calculatorType, []);
  };

  return {
    history,
    saveRun,
    clearLocal,
    session,
    sessionReady,
    isRemoteLoading: remoteQuery.isLoading,
    remoteError: remoteQuery.error,
  };
}
