import type { Profile, Broker, Property, PropertyImage, PropertyRequest, UserRole, BrokerStatus, PropertyStatus, OperationType, Json } from "./domain";
export type { Json } from "./domain";

type Table<Row, Required extends keyof Row, Relations extends { foreignKeyName: string; columns: string[]; isOneToOne: boolean; referencedRelation: string; referencedColumns: string[] }[]> = {
  Row: Row;
  Insert: Pick<Row, Required> & Partial<Omit<Row, Required>>;
  Update: Partial<Row>;
  Relationships: Relations;
};
export type Database = {
  public: {
    Tables: {
      property_search_requests: Table<{ status: string; updated_at: string; handled_by: string | null; id: string; client_id: string; operation_type: OperationType; property_type: string; city: string; state: string; budget: number; bedrooms: number; message: string; created_at: string }, "client_id" | "operation_type" | "property_type" | "city" | "state" | "budget" | "bedrooms" | "message", []>;
      creci_checks: Table<{ id: string; broker_id: string; actor_id: string; creci: string; full_name: string; registration_state: string; result: string; notes: string; created_at: string }, "broker_id" | "actor_id" | "creci" | "full_name" | "registration_state" | "result" | "notes", []>;
      moderation_events: Table<{ id: string; actor_id: string; broker_id: string | null; property_id: string | null; previous_status: string; new_status: string; reason: string; created_at: string }, "actor_id" | "previous_status" | "new_status", []>;
      profiles: Table<Profile, "id", []>;
      brokers: Table<Broker, "profile_id" | "creci", [{ foreignKeyName: "brokers_profile_id_fkey"; columns: ["profile_id"]; isOneToOne: true; referencedRelation: "profiles"; referencedColumns: ["id"] }]>;
      properties: Table<Property, "broker_id" | "slug" | "operation_type" | "property_type" | "title" | "price" | "city" | "state" | "neighborhood" | "area", [{ foreignKeyName: "properties_broker_id_fkey"; columns: ["broker_id"]; isOneToOne: false; referencedRelation: "brokers"; referencedColumns: ["id"] }]>;
      property_images: Table<PropertyImage, "property_id" | "url", [{ foreignKeyName: "property_images_property_id_fkey"; columns: ["property_id"]; isOneToOne: false; referencedRelation: "properties"; referencedColumns: ["id"] }]>;
      property_requests: Table<PropertyRequest, "property_id" | "client_id" | "message", [{ foreignKeyName: "property_requests_property_id_fkey"; columns: ["property_id"]; isOneToOne: false; referencedRelation: "properties"; referencedColumns: ["id"] }, { foreignKeyName: "property_requests_client_id_fkey"; columns: ["client_id"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] }]>;
    };
    Views: { [_ in never]: never };
    Functions: {
      update_request_followup: { Args: { kind: string; target_id: string; expected_updated_at: string; decision: string }; Returns: undefined };
      record_creci_check: { Args: { target_id: string; expected_updated_at: string; expected_name: string; result: string; registration_state: string; notes: string }; Returns: undefined };
      is_admin: { Args: Record<string, never>; Returns: boolean };
      save_listing: { Args: { payload: Json; listing_id: string | null; submit_review: boolean; expected_updated_at: string | null }; Returns: string };
      moderate_listing: { Args: { entity: string; target_id: string; expected_status: string; decision: string; reason: string }; Returns: undefined };
    };
    Enums: { user_role: UserRole; broker_status: BrokerStatus; property_status: PropertyStatus; operation_type: OperationType };
    CompositeTypes: { [_ in never]: never };
  };
};
