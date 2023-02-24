import { Database } from "./supabase";
type Tables = Database["public"]["Tables"];
export type Profiles = Tables["profiles"]["Row"];
export type Todos = Tables["todos"]["Row"];
