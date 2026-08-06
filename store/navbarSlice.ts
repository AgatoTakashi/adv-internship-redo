import { createSlice } from "@reduxjs/toolkit";

interface NavbarState {
  isVisible: boolean;
}

const initialState: NavbarState = {
  isVisible: true,
};

const navbarSlice = createSlice({
  name: "navbar",
  initialState,
  reducers: {
    toggleNavbarVisibility: (state) => {
      state.isVisible = !state.isVisible;
    },
    setNavbarVisibility: (state, action: { payload: boolean }) => {
      state.isVisible = action.payload;
    },
  },
});

export const { toggleNavbarVisibility, setNavbarVisibility } = navbarSlice.actions;
export default navbarSlice.reducer;
