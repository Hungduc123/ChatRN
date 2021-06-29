import { createSlice } from "@reduxjs/toolkit";

import typeAccountDoctor from "../data/typeAccountDoctor";

// var data:dataItem
const data: string | null = null;
const slice = createSlice({
  name: "AccountDoctorLogin",
  initialState: data,

  reducers: {
    AccountDoctorLogin: (state, action) => {
      state = action.payload;
    },
  },
});
const { reducer, actions } = slice;
export const { AccountDoctorLogin } = actions;
export default reducer;
