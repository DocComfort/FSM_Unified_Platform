import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Customer, ServiceOrder, Database } from '@fsm/types';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

export class SupabaseService {
  private readonly client: SupabaseClient<Database>;

  constructor(config: SupabaseConfig) {
    this.client = createClient<Database>(config.url, config.anonKey);
  }

  async listCustomers(): Promise<Customer[]> {
    const { data, error } = await this.client
      .from('customers')
      .select('*')
      .order('company_name', { ascending: true });
    if (error) throw error;
    return data ?? [];
  }

  async listJobs(): Promise<ServiceOrder[]> {
    const { data, error } = await this.client
      .from('jobs')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data ?? [];
  }
}
