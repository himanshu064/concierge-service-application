import {
  TypedUseSelectorHook,
  useDispatch as useAppDisaptch,
  useSelector as useAppSelector,
} from "react-redux";

import { configureStore } from "@reduxjs/toolkit";

import counterReducer from "./slices/counterSlice";
import userReducer from "./slices/userSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    user: userReducer, // Add more reducers here as needed
  },
});

// Infer types for the entire store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Custom hooks for usage in components
export const useDispatch: () => AppDispatch = useAppDisaptch;
export const useSelector: TypedUseSelectorHook<RootState> = useAppSelector;

// To use in any functional component import like this
// import {useDispatch, useSelector } from "@/store";
