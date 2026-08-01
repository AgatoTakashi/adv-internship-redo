import { createSlice } from "@reduxjs/toolkit";

const modalSlice = createSlice({
  name: "modal",
  initialState: {
    open: false,
    mode: "login",
  },
  reducers: {
    openModal: (state, action) => {
      state.open = true;
      state.mode = action.payload;
    },
    closeModal: (state) => {
      state.open = false;
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;
