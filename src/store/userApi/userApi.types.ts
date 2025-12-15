export interface User {
  id: string;
  username: string;
  email: string;
  roleName: string;
  token: string;
}

export interface IUserAuthResponse {
  user: User;
  token: string;
}
