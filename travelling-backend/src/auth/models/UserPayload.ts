export interface UserPayload {
  sub: string;
  email: string;
  name: string;
  userRole: string;
  iat?: number;
  exp?: number;
}
