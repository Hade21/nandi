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
