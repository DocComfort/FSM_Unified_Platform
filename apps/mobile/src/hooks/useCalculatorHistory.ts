import { useEffect, useMemo, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { Session } from '@supabase/supabase-js';
import type { Database } from '@fsm/types';
import { supabase } from '../lib/supabase';

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

const LOCAL_KEY_PREFIX = '@fsm/calculator-history';
const LOCAL_LIMIT = 10;

const generateId = () => {
  const random = Math.random().toString(16).slice(2);
  return `${Date.now()}-${random}`;
};

function getLocalKey(calculatorType: CalculatorType) {
  return `${LOCAL_KEY_PREFIX}:${calculatorType}`;
}

export function useCalculatorHistory<TInput, TResult>(calculatorType: CalculatorType) {
  const queryClient = useQueryClient();
  const [session, setSession] = useState<Session | null>(null);
  const [sessionReady, setSessionReady] = useState(false);
  const [localRuns, setLocalRuns] = useState<CalculatorRun<TInput, TResult>[]>([]);
  const hasLoadedLocal = useRef(false);
  const hasSyncedLocalOnLogin = useRef(false);

  useEffect(() => {
    const loadLocalRuns = async () => {
      try {
        const raw = await AsyncStorage.getItem(getLocalKey(calculatorType));
        if (!raw) {
          hasLoadedLocal.current = true;
          return;
        }
        const parsed = JSON.parse(raw) as CalculatorRun<TInput, TResult>[];
        setLocalRuns(parsed);
      } catch (error) {
        console.warn('Failed to load calculator history', error);
      } finally {
        hasLoadedLocal.current = true;
      }
    };

    void loadLocalRuns();
  }, [calculatorType]);

  useEffect(() => {
    let mounted = true;

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!mounted) return;
        setSession(data.session ?? null);
        setSessionReady(true);
      })
      .catch(() => setSessionReady(true));

    const {
      data: subscription,
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setSessionReady(true);
    });

    return () => {
      mounted = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  const remoteQuery = useQuery({
    queryKey: ['mobile-calculator-history', calculatorType, session?.user.id],
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
    if (!localRuns.length) {
      hasSyncedLocalOnLogin.current = true;
      return;
    }

    const syncRuns = async () => {
      try {
        await supabase.from('calculator_run_history').insert(
          localRuns.map((run) => ({
            calculator_type: calculatorType,
            input_payload: run.input,
            result_payload: run.result ?? null,
            notes: run.notes ?? null,
            profile_id: session.user.id,
            platform: 'mobile',
          }))
        );
        queryClient.invalidateQueries({
          queryKey: ['mobile-calculator-history', calculatorType, session.user.id],
        });
        hasSyncedLocalOnLogin.current = true;
        setLocalRuns([]);
        await AsyncStorage.removeItem(getLocalKey(calculatorType));
      } catch (error) {
        console.warn('Failed to sync local calculator history', error);
      }
    };

    void syncRuns();
  }, [calculatorType, localRuns, queryClient, session, sessionReady]);

  const history = useMemo(() => {
    if (session && remoteQuery.data) return remoteQuery.data;
    return localRuns;
  }, [session, remoteQuery.data, localRuns]);

  const saveRun = async ({ input, result, notes }: SaveRunOptions<TInput, TResult>) => {
    if (!session) {
      const run: CalculatorRun<TInput, TResult> = {
        id: generateId(),
        createdAt: new Date().toISOString(),
        input,
        result,
        notes: notes ?? null,
        source: 'local',
      };
      const next = [run, ...localRuns].slice(0, LOCAL_LIMIT);
      setLocalRuns(next);
      await AsyncStorage.setItem(getLocalKey(calculatorType), JSON.stringify(next));
      return;
    }

    await supabase.from('calculator_run_history').insert({
      calculator_type: calculatorType,
      input_payload: input,
      result_payload: result ?? null,
      notes: notes ?? null,
      profile_id: session.user.id,
      platform: 'mobile',
    });
    queryClient.invalidateQueries({
      queryKey: ['mobile-calculator-history', calculatorType, session.user.id],
    });
  };

  const clearLocal = async () => {
    setLocalRuns([]);
    await AsyncStorage.removeItem(getLocalKey(calculatorType));
  };

  return {
    history,
    saveRun,
    clearLocal,
    session,
    sessionReady: sessionReady && hasLoadedLocal.current,
    isRemoteLoading: remoteQuery.isLoading,
  };
}
