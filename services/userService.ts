import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  isGuest: boolean;
}

const initialState: UserState = {
  isGuest: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setIsGuest: (state, action: PayloadAction<boolean>) => {
      state.isGuest = action.payload;
    },
  },
});

export const { setIsGuest } = userSlice.actions;
export default userSlice.reducer;
