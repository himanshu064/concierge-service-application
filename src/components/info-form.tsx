import { useState } from "react";

import {
  BankOutlined,
  CalendarOutlined,
  ColumnWidthOutlined,
  EnvironmentOutlined,
  InfoCircleOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { Card, DatePicker, Input, Select, Space } from "antd";

import { SingleElementForm, Text } from "@/components";
import type {
  ICompany,
  ICompanyInfoFormProps,
  TCompanySize,
} from "@/types/client";
import PhoneInput from "react-phone-input-2";
import moment from "moment";

export const CompanyInfoForm: React.FC<ICompanyInfoFormProps> = ({
  company,
  loading,
  onUpdateCompany,
}) => {
  const [activeForm, setActiveForm] = useState<
    | "email"
    | "address"
    | "name"
    | "contact"
    | "date_of_birth"
    | "gender"
    | "nationality"
  >();

  const getActiveForm = (args: Partial<ICompany & { formName: string }>) => {
    const { formName } = args;

    if (activeForm === formName) {
      return "form";
    }

    if (!company?.[formName as keyof ICompany]) {
      return "empty";
    }

    return "view";
  };

  return (
    <Card
      title={
        <Space size={15}>
          <InfoCircleOutlined className="sm" />
          <Text>Client Info</Text>
        </Space>
      }
      style={{
        maxWidth: "500px",
      }}
    >
      <SingleElementForm
        loading={loading}
        style={{
          padding: "0.5rem 1rem",
        }}
        icon={<ColumnWidthOutlined className="tertiary" />}
        state={getActiveForm({ formName: "name" })}
        itemProps={{
          name: "name",
          label: "Client Name",
        }}
        view={<Text>{company?.name}</Text>}
        onClick={() => setActiveForm("name")}
        onUpdate={() => setActiveForm(undefined)}
        onCancel={() => setActiveForm(undefined)}
      >
        <Input
          autoFocus
          defaultValue={company?.name}
          onChange={(e) => {
            onUpdateCompany?.({
              ...company,
              nationality: e.target.value,
            } as ICompany);
          }}
          style={{
            width: "100%",
          }}
        />
      </SingleElementForm>
      <SingleElementForm
        loading={loading}
        style={{
          padding: "0.5rem 1rem",
        }}
        icon={<MailOutlined className="tertiary" />}
        state={getActiveForm({ formName: "email" })}
        itemProps={{
          name: "email",
          label: "Email",
        }}
        view={<Text>{company?.email || null}</Text>}
        onClick={() => setActiveForm("email")}
        onUpdate={() => setActiveForm(undefined)}
        onCancel={() => setActiveForm(undefined)}
      >
        <Input
          autoFocus
          placeholder="Email"
          defaultValue={company?.email}
          onChange={(e) => {
            onUpdateCompany?.({
              ...company,
              email: e.target.value,
            } as ICompany);
          }}
        />
      </SingleElementForm>
      <SingleElementForm
        loading={loading}
        style={{
          padding: "0.5rem 1rem",
        }}
        icon={<BankOutlined className="tertiary" />}
        state={getActiveForm({ formName: "address" })}
        itemProps={{
          name: "address",
          label: "Address",
        }}
        view={<Text>{company?.address}</Text>}
        onClick={() => setActiveForm("address")}
        onUpdate={() => setActiveForm(undefined)}
        onCancel={() => setActiveForm(undefined)}
      >
        <Input
          autoFocus
          defaultValue={company?.address}
          onChange={(e) => {
            onUpdateCompany?.({
              ...company,
              address: e.target.value,
            } as ICompany);
          }}
          style={{
            width: "100%",
          }}
        />
      </SingleElementForm>
      <SingleElementForm
        loading={loading}
        style={{
          padding: "0.5rem 1rem",
        }}
        icon={<PhoneOutlined className="tertiary" />}
        state={getActiveForm({ formName: "contact" })}
        itemProps={{
          name: "contact",
          label: "Contact Number",
        }}
        view={<Text>{company?.contact}</Text>}
        onClick={() => setActiveForm("contact")}
        onUpdate={() => setActiveForm(undefined)}
        onCancel={() => setActiveForm(undefined)}
      >
        <PhoneInput
          country={"us"}
          value={company?.contact}
          onChange={(phone) => {
            onUpdateCompany?.({ ...company, contact: phone } as ICompany);
          }}
          inputStyle={{
            width: "100%",
          }}
        />
      </SingleElementForm>

      <SingleElementForm
        loading={loading}
        style={{
          padding: "0.5rem 1rem",
        }}
        icon={<CalendarOutlined className="tertiary" />}
        state={getActiveForm({ formName: "date_of_birth" })}
        itemProps={{
          name: "date_of_birth",
          label: "DOB",
        }}
        view={<Text>{company?.date_of_birth}</Text>}
        onClick={() => setActiveForm("date_of_birth")}
        onUpdate={() => setActiveForm(undefined)}
        onCancel={() => setActiveForm(undefined)}
      >
        <DatePicker
          autoFocus
          defaultValue={
            company?.date_of_birth ? moment(company?.date_of_birth) : null
          }
          placeholder="DOB"
          style={{
            width: "100%",
          }}
          format="YYYY-MM-DD"
          onChange={(_, dateString) => {
            onUpdateCompany?.({
              ...company,
              date_of_birth: dateString,
            } as ICompany);
          }}
        />
      </SingleElementForm>
      <SingleElementForm
        loading={loading}
        style={{
          padding: "0.5rem 1rem",
        }}
        icon={<EnvironmentOutlined className="tertiary" />}
        state={getActiveForm({ formName: "gender" })}
        itemProps={{
          name: "gender",
          label: "Gender",
        }}
        view={<Text>{company?.gender}</Text>}
        onClick={() => setActiveForm("gender")}
        onUpdate={() => setActiveForm(undefined)}
        onCancel={() => setActiveForm(undefined)}
      >
        <Select
          autoFocus
          defaultValue={company?.gender || ""}
          options={companySizeOptions}
          placeholder="Gender"
          style={{
            width: "100%",
          }}
          onChange={(value) => {
            onUpdateCompany?.({ ...company, gender: value } as ICompany);
          }}
        />
      </SingleElementForm>
      <SingleElementForm
        loading={loading}
        style={{
          padding: "0.5rem 1rem",
        }}
        icon={<EnvironmentOutlined className="tertiary" />}
        state={getActiveForm({ formName: "nationality" })}
        itemProps={{
          name: "nationality",
          label: "Nationality",
        }}
        view={<Text>{company?.nationality}</Text>}
        onClick={() => setActiveForm("nationality")}
        onUpdate={() => setActiveForm(undefined)}
        onCancel={() => setActiveForm(undefined)}
      >
        <Input
          autoFocus
          defaultValue={company?.nationality || ""}
          placeholder="Nationality"
          style={{
            width: "100%",
          }}
          onChange={(e) => {
            onUpdateCompany?.({
              ...company,
              nationality: e.target.value,
            } as ICompany);
          }}
        />
      </SingleElementForm>
    </Card>
  );
};

const companySizeOptions: {
  label: string;
  value: TCompanySize;
}[] = [
  {
    label: "Male",
    value: "male",
  },
  {
    label: "Female",
    value: "female",
  },
  {
    label: "Rather not say",
    value: "others",
  },
];
