import { AuthBindings } from "@refinedev/core";

import supabaseClient from "@/api/db/connect";

const authProvider: AuthBindings = {
  login: async ({ email, password }) => {
    try {
      const { error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });

      if (!error) {
        alert("Check your email for the login link!");
        return {
          success: true,
        };
      }

      throw error;
    } catch (e: any) {
      alert(e.message);
      return {
        success: false,
        e,
      };
    }
  },
  register: async ({ email, password, providerName }) => {
    // You can handle the register process according to your needs.

    // If the process is successful.
    return {
      success: true,
    };

    return {
      success: false,
      error: {
        name: "Register Error",
        message: "Invalid email or password",
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
