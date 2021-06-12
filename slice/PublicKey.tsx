import { createSlice } from "@reduxjs/toolkit";

// var data:dataItem
const publicKey = {
  n: "",
  e: "",
};
const slice = createSlice({
  name: "PublicKey",
  initialState: publicKey,

  reducers: {
    PublicKey: (state, action) => {
      state.e = action.payload.e;
      state.n = action.payload.n;
    },
  },
});
const { reducer, actions } = slice;
export const { PublicKey } = actions;
export default reducer;
