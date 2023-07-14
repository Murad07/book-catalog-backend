export type ILoginUser = {
  phoneNumber: string;
  password: string;
};

export type ILoginUserResponse = {
  accessToken: string;
  refreshToken?: string;
};

export type ITokenResponse = {
  accessToken: string;
  refreshToken?: string;
};
