import { supabaseClient } from "@/lib/supbaseClient";
import { TRegisterType } from "@/types/client";

// / Function to check if a user exists by email
export const checkUserExists = async ({ email }: { email: string }) => {
  const { data: existingUser, error: fetchError } = await supabaseClient
    .from("Users")
    .select("email")
    .eq("email", email)
    .single();

  if (fetchError) {
    console.error("Error fetching user:", fetchError);
    return { exists: false, error: fetchError };
  }

  return { exists: !!existingUser, user: existingUser };
};

// Function to register a new user
export const registerUser = async ({
  name,
  email,
  auth_id,
  register_type,
}: {
  name: string;
  email: string;
  auth_id: string;
  register_type: TRegisterType;
}) => {
  const { data: newUser, error: insertError } = await supabaseClient
    .from("clients")
    .insert([{ name, email, auth_id, register_type }]);

  if (insertError) {
    return { success: false, error: insertError };
  }

  return { success: true, user: newUser };
};

// Function to get user authorization status by email id form clients table
export const getUserAuthStatus = async ({ email }: { email: string }) => {
  console.log(email,"email")
  const { data: existingUser, error: fetchError } = await supabaseClient
    .from("clients")
    .select("is_authorized")
    .eq("email", email)
    .single();

  if (fetchError) {
    console.error("Error fetching user:", fetchError);
    return { exists: false, error: fetchError };
  }

  return { exists: !!existingUser, user: existingUser };
};
