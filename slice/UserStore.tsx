import { createSlice } from "@reduxjs/toolkit";
import dataUser from "../data/dataUser";

// var data:dataItem
const data: any = {};
const slice = createSlice({
  name: "UserStore",
  initialState: data,

  reducers: {
    UserStore: (state, action) => {
      state = {
        ...action.payload,
      };
      return state;
    },
  },
});
const { reducer, actions } = slice;
export const { UserStore } = actions;
export default reducer;
