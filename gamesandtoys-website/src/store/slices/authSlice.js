import { createSlice } from "@reduxjs/toolkit";
import * as jwtDecodeModule from "jwt-decode";
const initialToken = localStorage.getItem("token");
console.log("Token iniziale:", initialToken);
console.log(jwtDecodeModule);
const jwtDecode = jwtDecodeModule.jwtDecode;
console.log(jwtDecode);
const initialCategory = initialToken ? jwtDecode(initialToken).category : null;

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: initialToken || null,
    isAuthenticated: !!initialToken,
    userCategory: initialCategory,
  },
  reducers: {
    login: (state, action) => {
      state.token = action.payload;
      state.isAuthenticated = true;
      const decoded = jwtDecode(action.payload);
      state.userCategory = decoded.category;
      localStorage.setItem("token", action.payload);
    },
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      state.userCategory = null;
      localStorage.removeItem("token");
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
