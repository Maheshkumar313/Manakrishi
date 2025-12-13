export enum UserRole {
  FARMER = 'FARMER',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  phone: string;
  role: UserRole;
  name?: string;
}

export enum BookingStatus {
  REQUESTED = 'REQUESTED',
  SCHEDULED = 'SCHEDULED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Booking {
  id: string;
  userId: string;
  userPhone: string;
  cropType: string;
  acres: number;
  pesticide: string;
  location: Coordinates | null;
  locationAddress?: string; // Optional manual text address
  status: BookingStatus;
  createdAt: number; // timestamp
  scheduledDate?: number; // timestamp
}

export type Language = 'en' | 'hi' | 'te';