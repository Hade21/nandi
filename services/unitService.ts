import { MarkerTypes, UnitTypes } from "@/types";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface UnitState {
  units: UnitTypes[];
  searchQuery: string;
  markers: MarkerTypes[];
  selectedUnit: {
    id: string;
    name: string;
    type: string;
    egi: string;
    locationName: string;
  };
  openModal: boolean;
  isUpdating: boolean;
}

const initialState: UnitState = {
  units: [],
  searchQuery: "",
  markers: [],
  selectedUnit: {
    id: "",
    name: "",
    type: "",
    egi: "",
    locationName: "",
  },
  openModal: false,
  isUpdating: false,
};

function removeDuplicate(arr: any, value: any) {
  let index = 0;
  if (arr[0] && arr[0].id) {
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
          const cleanedArr = removeDuplicate(state.units, unit.id);
          state.units = [...cleanedArr, unit];
        });
      }
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setMarkers: (state, action: PayloadAction<MarkerTypes[]>) => {
      if (action.payload[0]?.label === "Current Location") {
        let cleanedArr = removeDuplicate(
          state.markers,
          action.payload[0].label
        );
        state.markers = [...cleanedArr, action.payload[0]];
      } else {
        state.markers = action.payload;
      }
    },
    setSelectedUnit: (
      state,
      action: PayloadAction<Pick<UnitState, "selectedUnit">>
    ) => {
      state.selectedUnit = action.payload.selectedUnit;
    },
    setOpenModal: (state, action: PayloadAction<boolean>) => {
      state.openModal = action.payload;
    },
    setIsUpdating: (state, action: PayloadAction<boolean>) => {
      state.isUpdating = action.payload;
    },
  },
});

export const {
  setSearchQuery,
  setUnits,
  setMarkers,
  setSelectedUnit,
  setOpenModal,
  setIsUpdating,
} = unitSlice.actions;

export default unitSlice.reducer;
