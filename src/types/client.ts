export interface IClient {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

export type TDays =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";
