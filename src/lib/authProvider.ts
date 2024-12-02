/* eslint-disable @typescript-eslint/no-explicit-any */
import { AuthBindings } from "@refinedev/core";

import { supabaseClient } from "./supbaseClient";
import {
  checkUserExists,
  getUserAuthStatus,
  registerUser,
} from "@/services/auth";
import { notification } from "antd";

const authProvider: AuthBindings = {
  login: async ({ email, password, providerName }) => {
    // sign in with oauth
    try {
      if (providerName) {
        const { data, error } = await supabaseClient.auth.signInWithOAuth({
          provider: providerName,
        });

        if (error) {
          return {
            success: false,
            error,
          };
        }

        if (data?.url) {
          return {
            success: true,
            redirectTo: "/",
          };
        }
      }
      const authStatus = await getUserAuthStatus({ email });

      if (authStatus.user?.is_authorized === "pending") {
        // Clear session if user is not authorized
        await supabaseClient.auth.signOut();

        notification.error({
          description:
            "Please wait for admin approval to gain access to the system. ",
          message: "Awaiting Admin Approval",
        });
        return {
          success: false,
          error: {
            message:
              "Please wait for admin approval to gain access to the system.",
            name: "Awaiting Admin Approval",
          },
        };
      }

      // sign in with email and password
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return {
          success: false,
          error,
        };
      }

      if (data?.user) {
        return {
          success: true,
          redirectTo: "/",
          successNotification: {
            message: "User Logged In Successfull!",
            description: "Login Successfull",
          },
        };
      }
    } catch (error: any) {
      return {
        success: false,
        error,
      };
    }

    return {
      success: false,
      error: {
        message: "Login failed",
        name: "Invalid email or password",
      },
    };
  },

  register: async ({ email, password, name }) => {
    try {
      // Check if the user already exists
      const userCheckResult = await checkUserExists({ email });
      if (userCheckResult.exists === true) {
        notification.error({
          message: "Sign-up Failed",
          description: "User already exists!",
        });
        return {
          success: false,
          error: {
            message: "User already exists!",
            name: "Sign-up Failed",
          },
        };
      }

      // Sign up with email and password
      const { data: authData, error: authError } =
        await supabaseClient.auth.signUp({
          email,
          password,
        });

      if (authError) {
        notification.error({
          message: "Sign-up Failed",
          description: authError.message || "Authentication failed.",
        });
        return {
          success: false,
          error: {
            message: authError.message || "Authentication failed.",
            name: "Sign-up Failed",
          },
        };
      }

      if (!authData) {
        notification.error({
          message: "Sign-up Failed",
          description: "Unexpected error during sign-up.",
        });
        return {
          success: false,
          error: {
            message: "Unexpected error during sign-up.",
            name: "Sign-up Failed",
          },
        };
      }
      // Register the user in the database in users table
      const auth_id = authData.user?.id;
      const registrationResult = await registerUser({
        name,
        email,
        auth_id: auth_id || "",
        register_type: "self",
      });

      if (!registrationResult.success) {
        notification.error({
          message: "Registration Failed",
          description:
            registrationResult.error?.message || "User registration failed.",
        });
        return {
          success: false,
          error: {
            message:
              registrationResult.error?.message || "User registration failed.",
            name: "Registration Failed",
          },
        };
      }

      // Success response
      notification.success({
        message: "Registration Successful",
        description:
          "You will be able log in once the admin approves your account.",
      });

      return {
        success: true,
        redirectTo: "/login",
      };
    } catch (error: any) {
      // Handle unexpected errors
      notification.error({
        message: "Register Failed",
        description:
          error.message || "An unknown error occurred during registration.",
      });

      return {
        success: false,
        error: {
          message:
            error.message || "An unknown error occurred during registration.",
          name: "Register Failed",
        },
      };
    }
  },

  forgotPassword: async ({ email }) => {
    try {
      const { data, error } = await supabaseClient.auth.resetPasswordForEmail(
        email,
        {
          redirectTo: `${window.location.origin}/update-password`,
        }
      );

      if (error) {
        return {
          success: false,
          error,
        };
      }

      if (data) {
        return {
          success: true,
        };
      }
    } catch (error: any) {
      return {
        success: false,
        error,
      };
    }

    return {
      success: false,
      error: {
        message: "Forgot password failed",
        name: "Invalid email",
      },
    };
  },
  updatePassword: async ({ password }) => {
    try {
      const { data, error } = await supabaseClient.auth.updateUser({
        password,
      });

      if (error) {
        return {
          success: false,
          error,
        };
      }

      if (data) {
        return {
          success: true,
          redirectTo: "/",
        };
      }
    } catch (error: any) {
      return {
        success: false,
        error,
      };
    }
    return {
      success: false,
      error: {
        message: "Update password failed",
        name: "Invalid password",
      },
    };
  },
  logout: async () => {
    const { error } = await supabaseClient.auth.signOut();

    if (error) {
      return {
        success: false,
        error,
      };
    }

    return {
      success: true,
      redirectTo: "/",
    };
  },
  onError: async (error) => {
    console.error(error);
    return { error };
  },
  check: async () => {
    try {
      const { data } = await supabaseClient.auth.getSession();
      const { session } = data;

      if (!session) {
        return {
          authenticated: false,
          error: {
            message: "Check failed",
            name: "Session not found",
          },
          logout: true,
          redirectTo: "/login",
        };
      }
    } catch (error: any) {
      return {
        authenticated: false,
        error: error || {
          message: "Check failed",
          name: "Not authenticated",
        },
        logout: true,
        redirectTo: "/login",
      };
    }

    return {
      authenticated: true,
    };
  },
  getPermissions: async () => {
    const user = await supabaseClient.auth.getUser();

    if (user) {
      return user.data.user?.role;
    }

    return null;
  },
  getIdentity: async () => {
    const { data } = await supabaseClient.auth.getUser();

    if (data?.user) {
      return {
        ...data.user,
        name: data.user.email,
      };
    }

    return null;
  },
};

export default authProvider;
