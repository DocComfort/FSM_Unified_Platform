export type UUID = string;

export interface BaseEntity {
  id: UUID;
  createdAt: string;
  updatedAt: string;
}

export interface Customer extends BaseEntity {
  companyName: string;
  primaryContact: string;
  email?: string;
  phone?: string;
}

export interface ServiceOrder extends BaseEntity {
  customerId: UUID;
  technicianId: UUID;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  scheduledStart: string;
  scheduledEnd?: string;
  summary: string;
}

export interface Equipment extends BaseEntity {
  customerId: UUID;
  make: string;
  model: string;
  serialNumber?: string;
  installedAt?: string;
}

export type EntityMap = {
  customers: Customer;
  serviceOrders: ServiceOrder;
  equipment: Equipment;
};
