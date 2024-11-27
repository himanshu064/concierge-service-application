import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import api from "@/api";

import { unwrapError } from "../helpers";

export const listClientByIdAction = createAsyncThunk(
  "counter/listClientById",
  async (_, thunkAPI) => {
    try {
      const response = await api.clients.listClientById();
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(unwrapError(error));
    }
  }
);

interface CounterState {
  value: number;
}

const initialState: CounterState = {
  value: 0,
};

const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
  },
  extraReducers: (builder) => {
    // Add extra reducers here
    builder.addCase(counterSlice.actions.increment, (state) => {
      state.value += 1;
    });
    builder.addCase(counterSlice.actions.decrement, (state) => {
      state.value -= 1;
    });
  },
});

export const { increment, decrement, incrementByAmount } = counterSlice.actions;
export default counterSlice.reducer;
