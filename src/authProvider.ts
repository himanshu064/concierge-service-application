import { redirect, useNavigate } from "react-router-dom";

import { AuthBindings } from "@refinedev/core";

import supabaseClient from "@/api/db/connect";

import {
  showErrorNotificaton,
  // showErrorNotificaton,
  showSuccesNotificaton,
} from "./providers/notifications";
// import { useDispatch } from "./store";
import { store } from "./store";
import { loginAction, registerAction } from "./store/slices/userSlice";
// const dispatch = useDispatch();

const authProvider: AuthBindings = {
  login: async ({ email, password }) => {
    try {
      const response = await store.dispatch(loginAction({ email, password })).unwrap();
      console.log(response)
      // Dispatch succeeded; show success notification.
      showSuccesNotificaton({ description: "Login Success" });
  
      // Return the success response.
      return {
        success: true,
      };
    } catch (error: any) {
      // Dispatch failed; show error notification.
      showErrorNotificaton({ description: `Login Failed: ${error.message || error}` });
  
      // Return the failure response.
      return {
        success: false,
        error,
      };
    }
  },  
  register: async ({ email, password, providerName }) => {
    // You can handle the register process according to your needs.
    try {
      store
        .dispatch(registerAction({ email, password }))
        .unwrap()
        .then(() => {
          showSuccesNotificaton({ description: "Registration successful" });
        })
        .catch((error)=>{
          console.log(error,"error");
          showErrorNotificaton({description:error});
        })
        return {
          success: true,
        };
    } catch (error) {
      // showErrorNotificaton({ error });
      return {
        success: false,
        error: {
          name: "Register Error",
          message: "Invalid email or password",
        },
      };
    }
    // If the process is successful.
   

  
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
