import { UserData } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  isGuest: boolean;
  users: UserData[];
  changedRole: UserData[];
}

const initialState: UserState = {
  isGuest: false,
  users: [],
  changedRole: [],
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setIsGuest: (state, action: PayloadAction<boolean>) => {
      state.isGuest = action.payload;
    },
    setUser: (state, action: PayloadAction<UserData[]>) => {
      state.users = action.payload;
    },
    setChagedRole: (state, action: PayloadAction<UserData>) => {
      if (!state.changedRole.find((user) => user.id === action.payload.id)) {
        state.changedRole.push(action.payload);
      } else {
        const changed = state.changedRole.filter(
          (user) => user.id !== action.payload.id
        );
        state.changedRole = changed;
        state.changedRole.push(action.payload);
      }
    },
  },
});

export const { setIsGuest, setUser, setChagedRole } = userSlice.actions;
export default userSlice.reducer;
