export interface User {
  id: number;
  username: string;
  name: string;
  roleIds: number[];
  department?: string;
  phoneNumber?: string;
  initPassword?: boolean;
}