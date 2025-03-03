export type AuthRequest = {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
};

export type LoginResponse = {
  data: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    token: {
      accessToken: string;
      refreshToken: string;
    };
  };
};

export type RegisterResponse = {
  data: {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
  };
};

export interface ErrorType {
  data: {
    errors: {
      message: string;
      error?: string;
      statusCode: number;
    };
  };
  status?: number;
  statusCode?: number;
}

export type NotFound = {
  data: { errors: string };
};

export type LocationTypes = {
  id: string;
  long: number;
  lat: number;
  alt: number;
  location: string;
  dateTime: string;
  createdBy: string;
};

export type UnitTypes = {
  id?: string;
  name: string;
  type: string;
  egi: string;
  locations?: LocationTypes[];
  createdBy?: string;
};

export type AuthorizationTypes = {
  accessToken: string;
  refreshToken?: string;
  id?: string;
};

export type UnitResponse = {
  data: UnitTypes;
};

export type UnitsResponse = {
  data: UnitTypes[];
};

export type UserData = {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  role: string;
};

export type UserResponse = {
  data: UserData;
};

export type MarkerTypes = {
  latitude: number;
  longitude: number;
  label: string;
  locationName?: string;
  timeStamp?: string;
  heading?: number | null;
};

export type LocationBody = {
  long: string;
  lat: string;
  alt: string;
  location: string;
  dateTime: string;
};

export type LocationResponse = {
  data: LocationTypes;
};

export type UsersResponse = {
  data: UserData[];
};

export type ChangeRoleResponse = {
  data: UserData;
};

export type ResetPasswordRequest = {
  newPassword: string;
  token: string;
};
