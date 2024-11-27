import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import db from "@/api/db/connect";
import { ISignIn } from "@/types/auth";

import { unwrapError } from "../helpers";

export const register = createAsyncThunk(
  "user/register",
  async (credentials: ISignIn, thunkAPI) => {
    try {
      const response = db.auth.signUp(credentials);
      console.log(response);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(unwrapError(error));
    }
  }
);
export const login = createAsyncThunk(
  "user/login",
  async (credentials: ISignIn, thunkAPI) => {
    try {
      const response = db.auth.signInWithPassword(credentials);
      if (response) {
        return response;
      }
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
    builder.addCase(login.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(login.fulfilled, (state) => {
      state.loading = false;
    });
  },
});

export default userSlice.reducer;
