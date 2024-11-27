import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import db from "@/api/db/connect";

import { unwrapError } from "../helpers";

export const registerAction = createAsyncThunk(
  "user/register",
  async ({ email, password }: { email: string; password: string }, thunkAPI) => {
    try {
      const response = db.auth.signUp({
        email,
        password,
      });
      console.log(response);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(unwrapError(error));
    }
  }
);

export const loginAction = createAsyncThunk(
  "user/login",
  async ({ email, password }: { email: string; password: string }, thunkAPI) => {
    try {
      const { error } = await db.auth.signInWithPassword({
        email,
        password,
      });

      if (!error) {
        alert("Check your email for the login link!");
        return {
          success: true,
        };
      }
      return { success: false };

    } catch (error) {
      return thunkAPI.rejectWithValue(unwrapError(error));
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: {},
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    // Add extra reducers here
    builder.addCase(loginAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(loginAction.fulfilled, (state) => {
      state.loading = false;
    });
  },
});

export default userSlice.reducer;
