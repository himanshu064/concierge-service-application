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
import { capitalizeWords } from "@/utilities";
import dayjs from "dayjs";
import DateProvider from "@/providers/date-provider";

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
  const [tempCompany, setTempCompany] = useState<ICompany | null>(company);

  const createDefaultCompany = (): ICompany => ({
    id: "", // or some other default value
    name: "",
    avatar_url: "",
    email: "",
    address: "",
    contact: "",
    date_of_birth: null,
    gender: "",
    nationality: "",
    auth_id: "",
  });

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

  const handleCancel = () => {
    setActiveForm(undefined);
    setTempCompany(company);
  };

  const handleUpdateCompany = (field: keyof ICompany, value: string) => {
    setTempCompany((prev) => {
      if (prev === null) {
        return createDefaultCompany();
      }
      return {
        ...prev,
        [field]: value,
      };
    });
  };

  const handleConfirm = () => {
    if (tempCompany) {
      console.log(tempCompany, "tempCompany tempCompany");
      onUpdateCompany?.(tempCompany);
      setActiveForm(undefined);
    }
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
        onUpdate={handleConfirm}
        onCancel={handleCancel}
      >
        <Input
          autoFocus
          defaultValue={company?.name}
          onChange={(e) => handleUpdateCompany("name", e.target.value)}
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
        onUpdate={handleConfirm}
        onCancel={handleCancel}
      >
        <Input
          autoFocus
          placeholder="Email"
          defaultValue={company?.email}
          onChange={(e) => handleUpdateCompany("email", e.target.value)}
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
        onUpdate={handleConfirm}
        onCancel={handleCancel}
      >
        <Input
          autoFocus
          defaultValue={company?.address}
          onChange={(e) => handleUpdateCompany("address", e.target.value)}
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
        onUpdate={handleConfirm}
        onCancel={handleCancel}
      >
        <PhoneInput
          country={"us"}
          value={company?.contact}
          onChange={(phone) => handleUpdateCompany("contact", phone)}
          inputStyle={{
            width: "100%",
          }}
        />
      </SingleElementForm>

      {/* <SingleElementForm
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
        onUpdate={handleConfirm}
        onCancel={handleCancel}
      >
        <DatePicker
          autoFocus
          defaultValue={
            company?.date_of_birth &&
            moment(company?.date_of_birth, "YYYY-MM-DD", true).isValid()
              ? moment(company?.date_of_birth)
              : null
          }
          placeholder="DOB"
          style={{
            width: "100%",
          }}
          format="YYYY-MM-DD"
          onChange={(date) => {
            // date is a Moment object or null, dateString is a string

            // If date is valid, format it to a string
            const dateValueString = date ? date.format("YYYY-MM-DD") : "";

            handleUpdateCompany("date_of_birth", dateValueString); // Pass the formatted string
          }}
        />
      </SingleElementForm> */}
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
        view={<Text>{moment(company?.date_of_birth).format("LL")}</Text>}
        onClick={() => setActiveForm("date_of_birth")}
        onUpdate={handleConfirm}
        onCancel={handleCancel}
      >
        <DateProvider>
          <DatePicker
            autoFocus
            defaultValue={
              company?.date_of_birth
                ? dayjs(new Date(company.date_of_birth))
                : undefined
            }
            placeholder="DOB"
            style={{
              width: "100%",
            }}
            format="DD-MM-YYYY"
            onChange={(date) => {
              // date is a Moment object or null, dateString is a string

              // If date is valid, format it to a string
              const dateValueString = date ? date.format("YYYY-MM-DD") : "";

              handleUpdateCompany("date_of_birth", dateValueString); // Pass the formatted string
            }}
          />
        </DateProvider>
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
        view={<Text>{capitalizeWords(company?.gender || "")}</Text>}
        onClick={() => setActiveForm("gender")}
        onUpdate={handleConfirm}
        onCancel={handleCancel}
      >
        <Select
          autoFocus
          defaultValue={company?.gender || ""}
          options={companySizeOptions}
          placeholder="Gender"
          style={{
            width: "100%",
          }}
          onChange={(value) => handleUpdateCompany("gender", value)}
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
        onUpdate={handleConfirm}
        onCancel={handleCancel}
      >
        <Input
          autoFocus
          defaultValue={company?.nationality || ""}
          placeholder="Nationality"
          style={{
            width: "100%",
          }}
          onChange={(e) => handleUpdateCompany("nationality", e.target.value)}
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
