import { unitApi } from "@/services/unitApi";
import unitReducer from "@/services/unitService";
import { userApi } from "@/services/userApi";
import { configureStore } from "@reduxjs/toolkit";

export const makeStore = () => {
  return configureStore({
    reducer: {
      [userApi.reducerPath]: userApi.reducer,
      [unitApi.reducerPath]: unitApi.reducer,
      units: unitReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat([userApi.middleware, unitApi.middleware]),
  });
};

export type AppStore = ReturnType<typeof makeStore>;

export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
