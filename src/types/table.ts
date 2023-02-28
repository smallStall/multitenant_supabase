import { Database } from "./supabase";
type Tables = Database["public"]["Tables"];
export type Profile = Tables["profiles"]["Row"];
export type Todo = Tables["todos"]["Row"];

export type ProfilesTodos = {
  user_name: string;
  todos: Todo[];
};
