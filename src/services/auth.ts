import { supabaseClient } from "@/lib/supbaseClient";

// / Function to check if a user exists by email
export const checkUserExists = async ({ email }: { email: string }) => {
  console.log(email, "Email in checkUserExists");

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
  register_type: string;
}) => {
  const { data: newUser, error: insertError } = await supabaseClient
    .from("clients")
    .insert([{ name, email, auth_id, register_type }]);

  if (insertError) {
    console.error("Error inserting user:", insertError);
    return { success: false, error: insertError };
  }

  console.log("User added successfully:", newUser);
  return { success: true, user: newUser };
};
