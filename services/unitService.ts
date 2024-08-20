import { MarkerTypes, UnitTypes } from "@/types";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface UnitState {
  units: UnitTypes[];
  searchQuery: string;
  markers: MarkerTypes[];
}

const initialState: UnitState = {
  units: [],
  searchQuery: "",
  markers: [],
};

function removeDuplicate(arr: any, value: any) {
  let index = 0;
  if (arr[0].id) {
    while (index < arr.length) {
      if (arr[index].id === value) {
        arr.splice(index, 1);
      } else {
        index++;
      }
    }
    return arr;
  } else {
    while (index < arr.length) {
      if (arr[index].label === value) {
        arr.splice(index, 1);
      } else {
        index++;
      }
    }
    return arr;
  }
}

export const unitSlice = createSlice({
  name: "unit",
  initialState,
  reducers: {
    setUnits: (state, action: PayloadAction<UnitTypes[]>) => {
      if (!state.units) {
        state.units = action.payload;
      } else {
        action.payload.forEach((unit) => {
          state.units = [...state.units, unit];
        });
      }
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setMarkers: (state, action: PayloadAction<MarkerTypes[]>) => {
      // if (!state.markers) {
      //   state.markers = action.payload;
      // } else {
      //   action.payload.forEach((marker) => {
      //     const cleanedArr = removeDuplicate(state.markers, marker.label);
      //     state.markers = [...cleanedArr, marker];
      //   });
      // }

      state.markers = action.payload;
    },
  },
});

export const { setSearchQuery, setUnits, setMarkers } = unitSlice.actions;

export default unitSlice.reducer;
