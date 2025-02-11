import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./Theme/Theme";

export const store = configureStore({
  reducer: {
    theme: themeReducer,
  },
});
