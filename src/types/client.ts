export interface ISalesOwner {
  id: string;
  avatar_url: string;
  name: string;
}

export interface ICompany {
  id: string;
  name?: string;
  avatar_url?: string;
  email?: string;
  address?: string;
  contact?: string;
  date_of_birth?: string;
  gender?: string;
  nationality?: string;
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
  jobTitle: string;
  status: string;
  email: string;
  phone: string;
  avatar_url: string;
}

export interface ICompanyContactsTableProps {
  companyId: string;
  loading: boolean;
}

export interface ICompanyInfoFormProps {
  company: ICompany | null;
}

export type TCompanyTitleFormProps = {
  company: ICompany | null;
  users: IUsers[];
  loading: boolean;
};

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

export type TBusinessType = "B2B" | "B2C" | "B2G";

export type TCompanySize = "male" | "female" | "others";

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
