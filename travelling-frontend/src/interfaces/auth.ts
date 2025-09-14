import { UserRoleType } from ".";

export interface Login {
  email: string;
  password: string;
}

export interface DecodeJWTResponse {
  email: string;
  exp: number;
  iat: number;
  name: string;
  sub: string;
  userRole: UserRoleType;
}
