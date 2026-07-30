import { createSlice } from "@reduxjs/toolkit";

const modalSlice = createSlice({
  name: "modal",
  initialState: {
    open: false,
    mode: "login" as "login" | "register",
  },
  reducers: {
    openLogin: state => {
      state.open = true;
      state.mode = "login";
    },
    openRegister: state => {
      state.open = true;
      state.mode = "register";
    },
    closeModal: state => {
      state.open = false;
    },
  },
});

export const { openLogin, openRegister, closeModal } = modalSlice.actions;
export default modalSlice.reducer;
