import type { Tables } from "../utils/supabase/database.types";

type EventWithURL = Tables<"event"> & { herofileURL: string };
