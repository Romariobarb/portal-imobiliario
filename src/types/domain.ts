export type UserRole = "client" | "broker" | "admin";
export type BrokerStatus = "pending" | "approved" | "rejected" | "suspended";
export type PropertyStatus = "draft" | "pending" | "approved" | "changes_requested" | "rejected" | "archived";
export type OperationType = "sale" | "rent";
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

type Timestamps = { created_at: string; updated_at: string };
export type Profile = Timestamps & { id: string; role: UserRole; full_name: string; phone: string | null };
export type Broker = Timestamps & { id: string; profile_id: string; status: BrokerStatus; creci: string; city: string | null; state: string | null; bio: string | null };
export type Property = Timestamps & {
  id: string; broker_id: string; slug: string; status: PropertyStatus;
  operation_type: OperationType; property_type: string; title: string;
  description: string; price: number; city: string; state: string;
  neighborhood: string; address: string | null; area: number;
  bedrooms: number; suites: number; bathrooms: number; parking_spaces: number;
  condominium_fee: number | null; property_tax: number | null;
  features: string[]; published_at: string | null;
};
export type PropertyImage = { id: string; property_id: string; url: string; alt: string | null; position: number; created_at: string };
export type PropertyRequest = { status: string; updated_at: string; handled_by: string | null; id: string; property_id: string; client_id: string; message: string; created_at: string };
