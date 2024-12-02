import { supabaseClient } from "@/lib/supbaseClient";
import { TRegisterType } from "@/types/client";
import ENV from "@/env";
import { notification } from "antd";

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

export const generateInviteLink = async ({ token }: { token: string }) => {
  try {
    // Generate the invite link
    const inviteLink = `${ENV.REACT_APP_URL}/accept-invite?token=${token}`;
    return inviteLink;
  } catch (error) {
    console.error("Error generating invite link:", error);
    return null;
  }
};

export const sendInviteEmail = async ({
  email,
  inviteLink,
}: {
  email: string;
  inviteLink: string;
}) => {
  try {
    const response = await fetch(
      "https://hkyyirvjystbqgjkiafu.supabase.co/functions/v1/send-email",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${ENV.SUPABASE_SERVICE_ROLE_KEY}`, // Replace with your actual Service Role Key
        },
        body: JSON.stringify({
          email: email,
          subject: "You're Invited to Join Conceirge Service Application",
          // message: `Thank you for signing up! Click <a href=${inviteLink}>here</a> to verify your email.`,
          message: `
   
    <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f7fa;">
      <table role="presentation" style="width: 100%; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);">
        <tr>
          <td style="text-align: center; padding-bottom: 20px;">
            <h1 style="color: #4CAF50; font-size: 26px;">You're Invited to Join Conceirge Service Application!</h1>
          </td>
        </tr>
        <tr>
          <td style="padding-bottom: 20px;">
            <p style="font-size: 16px; color: #333333; line-height: 1.6;">
              We are excited to have you on board! You’ve been invited to join our community. To get started, simply click the button below to accept your invitation and complete your registration.
            </p>
          </td>
        </tr>
        <tr>
          <td style="text-align: center; padding-bottom: 20px;">
            <a href="${inviteLink}" style="display: inline-block; padding: 12px 24px; background-color: #4CAF50; color: white; font-size: 18px; text-decoration: none; border-radius: 5px; border: 1px solid #4CAF50;">
              Accept Your Invitation
            </a>
          </td>
        </tr>
        <tr>
          <td style="padding-top: 20px; font-size: 14px; color: #888888; text-align: center;">
            <p>If you have any questions or need assistance, feel free to contact us at <a href="mailto:support@yourcompany.com" style="color: #4CAF50;">support@yourcompany.com</a>.</p>
          </td>
        </tr>
      </table>
    </body>
  
  `,
        }),
      }
    );

    if (response.ok) {
      notification.success({
        message: "Email Sent Successfully",
        description: "",
      });
      return { success: true, message: "Email sent successfully" };
    }
  } catch (error: any) {
    notification.error({ message: `${error.message}` });
    return { success: false, error: error };
  }
};

// Function to get user data from invites table

export const getUserFromInvites = async ({token}:{token: string}) => {
  try {
    const data = await supabaseClient.from("invites").select("*").eq("token",token).single();
    console.log(data,"data")
    if(data?.data){
      return data?.data;
    }
  } catch (error) {
    console.error(error);
  }
};
