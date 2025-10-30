import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Customer, ServiceOrder } from '@fsm/types';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

export class SupabaseService {
  private readonly client: SupabaseClient;

  constructor(config: SupabaseConfig) {
    this.client = createClient(config.url, config.anonKey);
  }

  async listCustomers(): Promise<Customer[]> {
    const { data, error } = await this.client.from('customers').select('*');
    if (error) throw error;
    return data as Customer[];
  }

  async listServiceOrders(): Promise<ServiceOrder[]> {
    const { data, error } = await this.client.from('service_orders').select('*');
    if (error) throw error;
    return data as ServiceOrder[];
  }
}
