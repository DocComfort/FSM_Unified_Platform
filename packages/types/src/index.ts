export type UUID = string;

import type { Database } from './generated/supabase';

export * from './generated/supabase';
export type { Database };

type Tables = Database['public']['Tables'];

export type Customer = Tables['customers']['Row'];
export type ServiceOrder = Tables['jobs']['Row'];
export type Equipment = Tables['equipment']['Row'];

export type EntityMap = {
  customers: Customer;
  serviceOrders: ServiceOrder;
  equipment: Equipment;
};
