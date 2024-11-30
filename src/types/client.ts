import { TRoles } from "./role";

export interface ISalesOwner {
  id: string;
  avatar_url: string;
  name: string;
}

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

export interface IUsers {
  id: string;
  name: string;
  avatar_url?: string;
  role?: string;
  email?: string;
}

export interface IContact {
  id: string;
  name: string;
  email: string;
  contact?: string;
  address?: string;
  date_of_birth?: string;
}

export interface ICompanyInfoFormProps {
  company: IClient | null;
  loading: boolean;
  onUpdateCompany?: (updatedCompany: IClient) => void;
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

export type TSalesOwnerInputProps = {
  salesOwner: {
    id: string;
    name: string;
    avatar_url?: string;
  } | null;
  onChange: (value: string) => void;
  loading: boolean;
  users: IUsers[];
};

export type TAuthorizedStatus = "approved" | "pending";
export type TBusinessType = "B2B" | "B2C" | "B2G";

export type TCompanySize = "male" | "female" | "others";

export type TRegisterType = "self" | "invited";

export type TIndustry =
  | "AEROSPACE"
  | "AGRICULTURE"
  | "AUTOMOTIVE"
  | "CHEMICALS"
  | "CONSTRUCTION"
  | "DEFENSE"
  | "EDUCATION"
  | "ENERGY"
  | "FINANCIAL_SERVICES"
  | "FOOD_AND_BEVERAGE"
  | "GOVERNMENT"
  | "HEALTHCARE"
  | "HOSPITALITY"
  | "INDUSTRIAL_MANUFACTURING"
  | "INSURANCE"
  | "LIFE_SCIENCES"
  | "LOGISTICS"
  | "MEDIA"
  | "MINING"
  | "NONPROFIT"
  | "OTHER"
  | "PHARMACEUTICALS"
  | "PROFESSIONAL_SERVICES"
  | "REAL_ESTATE"
  | "RETAIL"
  | "TECHNOLOGY"
  | "TELECOMMUNICATIONS"
  | "TRANSPORTATION"
  | "UTILITIES";
