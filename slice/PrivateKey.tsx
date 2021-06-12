import { createSlice } from "@reduxjs/toolkit";

// var data:dataItem
const privateKey = {
  n: "",
  e: "",
  d: "",
  p: "",
  q: "",
  dmp1: "",
  dmq1: "",
  coeff: "",
};
const slice = createSlice({
  name: "PrivateKey",
  initialState: privateKey,

  reducers: {
    PrivateKey: (state, action) => {
      state.n = action.payload.n;
      state.e = action.payload.e;
      state.d = action.payload.d;
      state.p = action.payload.p;
      state.q = action.payload.q;
      state.dmp1 = action.payload.dmp1;
      state.dmq1 = action.payload.dmq1;
      state.coeff = action.payload.coeff;
    },
  },
});
const { reducer, actions } = slice;
export const { PrivateKey } = actions;
export default reducer;
