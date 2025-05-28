import { createSlice } from "@reduxjs/toolkit";
import * as jwtDecodeModule from "jwt-decode";
const initialToken = localStorage.getItem("token");
const jwtDecode = jwtDecodeModule.jwtDecode;
const initialCategory = initialToken ? jwtDecode(initialToken).category : null;

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: initialToken || null,
    isAuthenticated: !!initialToken,
    userCategory: initialCategory,
    userName: initialToken ? jwtDecode(initialToken).name : "Profilo", // qui aggiungo il nome
    userCredito: 0, // default
  },
  reducers: {
    login: (state, action) => {
      state.token = action.payload;
      state.isAuthenticated = true;
      const decoded = jwtDecode(action.payload);
      state.userCategory = decoded.category;
      state.userName = decoded.name;
      state.userCredito = 0; // lo aggiorniamo dopo fetch profilo
      localStorage.setItem("token", action.payload);
    },
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      state.userCategory = null;
      state.userName = null;
      state.userCredito = 0;
      localStorage.removeItem("token");
    },
    setUserData: (state, action) => {
      // action.payload deve contenere { userName, userCategory, userCredito }
      state.userName = action.payload.userName || state.userName;
      state.userCategory = action.payload.userCategory || state.userCategory;
      state.userCredito = action.payload.userCredito || 0;
    },
  },
});

export const { login, logout, setUserData } = authSlice.actions;
export default authSlice.reducer;
