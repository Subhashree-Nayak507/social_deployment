import { createSlice } from "@reduxjs/toolkit";

// Get initial theme from localStorage or default to "coffee"
const initialTheme = localStorage.getItem("chat-theme") || "coffee";

const themeSlice = createSlice({
  name: "theme",
  initialState: {
    theme: initialTheme,
  },
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem("chat-theme", action.payload);
    },
  },
});

export const { setTheme } = themeSlice.actions;
export default themeSlice.reducer;
