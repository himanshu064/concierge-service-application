import { TRoles } from "./role";

export interface IClient {
  id: string;
  name?: string;
  email?: string;
  contact?: string;
  address?: string;
  date_of_birth?: string;
  gender?: string;
  nationality?: string;
  auth_id?: string;
  is_authorized?: TAuthorizedStatus;
  register_type?: TRegisterType;
  role: TRoles;
}

export interface IInvitesRecord{
  id?: string;
  name?: string;
  email: string;
  date_of_birth?: string;
  contact?: string;
  address?: string;
  gender?: string;
  nationality?: string;
  token?: string;
  expires_at?: string;
}
export interface IRegister{
  email:string;
  password: string;
}
export interface INotes {
  id?: string;
  text?: string;
  created_at?: Date;
  created_by?: string;
  user_id?: string;
  name?: string;
}

export type TTitleInputProps = {
  value: string;
  onChange: (value: string) => void;
  loading: boolean;
};

export type TAuthorizedStatus = "approved" | "pending";

export type TGenderType = "male" | "female" | "others";

export type TRegisterType = "self" | "invited";
