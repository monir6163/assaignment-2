export type IUser = {
  id?: number;
  name: string;
  email: string;
  phone: string;
  role: "admin" | "customer";
  password?: string;
};
