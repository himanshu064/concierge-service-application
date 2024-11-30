import { supabaseClient } from "@/lib/supbaseClient";
import { IContact } from "@/types/client";

export const fetchSpecificClientDetailsByClientId = async (
  clientId: string,
  fields: string
): Promise<{ data: IContact[] | null; error: Error | null }> => {
  if (!clientId) {
    throw new Error("Company ID is required to fetch clients.");
  }

  try {
    const { data, error } = await supabaseClient
      .from("clients")
      .select(fields)
      .eq("id", clientId);

    if (error) {
      console.error("Error fetching clients:", error);
      return { data: null, error };
    }

    return { data: data as unknown as IContact[], error: null };
  } catch (err) {
    console.error("Unexpected error fetching clients:", err);
    return {
      data: null,
      error: err instanceof Error ? err : new Error(String(err)),
    };
  }
};

export const fetchClientDetailsByClientId = async (clientId: string) => {
  if (!clientId) {
    throw new Error("Company ID is required to fetch clients.");
  }

  try {
    const { data, error } = await supabaseClient
      .from("clients")
      .select("*")
      .eq("id", clientId);

    if (error) {
      console.error("Error fetching clients:", error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (err) {
    console.error("Unexpected error fetching clients:", err);
    return { data: null, error: err };
  }
};

export const fetchNotesOfAClient = async (clientId: string) => {
  if (!clientId) {
    throw new Error("Company ID is required to fetch clients.");
  }

  try {
    const { data, error } = await supabaseClient
      .from("notes")
      .select("*")
      .eq("user_id", clientId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching clients:", error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (err) {
    console.error("Unexpected error fetching clients:", err);
    return { data: null, error: err };
  }
};

export const deleteNoteOfAClient = async (noteId?: string) => {
  if (!noteId) {
    throw new Error("Company ID is required to fetch clients.");
  }

  try {
    const { error } = await supabaseClient
      .from("notes")
      .delete()
      .eq("id", noteId);

    if (error) {
      console.error("Error fetching clients:", error);
      return { data: null, error };
    }

    return { error: null };
  } catch (err) {
    console.error("Unexpected error fetching clients:", err);
    return { data: null, error: err };
  }
};

export const updateNoteOfAClient = async (text?: string, noteId?: string) => {
  if (!noteId) {
    throw new Error("Company ID is required to fetch clients.");
  }

  try {
    const { error } = await supabaseClient
      .from("notes")
      .update({ text })
      .eq("id", noteId);

    if (error) {
      console.error("Error fetching clients:", error);
      return { error };
    }

    return { error: null };
  } catch (err) {
    console.error("Unexpected error fetching clients:", err);
    return { error: err };
  }
};

export const addNoteForAClient = async (
  clientId?: string,
  clientName?: string,
  text?: string
) => {
  if (!clientId) {
    throw new Error("Auth ID is required to fetch clients.");
  }

  try {
    const { data, error } = await supabaseClient
      .from("notes")
      .insert([
        {
          created_by: clientName,
          user_id: clientId,
          text: text,
          created_at: new Date().toISOString(),
        },
      ])
      .select("*")
      .single();

    if (error) {
      console.error("Error fetching client:", error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (err) {
    console.error("Unexpected error fetching client:", err);
    return { data: null, error: err };
  }
};

export const fetchClientByAuthId = async (authId?: string) => {
  if (!authId) {
    throw new Error("Auth ID is required to fetch clients.");
  }

  try {
    const { data, error } = await supabaseClient
      .from("clients")
      .select("*")
      .eq("auth_id", authId);

    if (error) {
      console.error("Error fetching client:", error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (err) {
    console.error("Unexpected error fetching client:", err);
    return { data: null, error: err };
  }
};
