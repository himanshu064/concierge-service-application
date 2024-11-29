import { useEffect, useState } from "react";

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
import type { ICompanyInfoFormProps, TCompanySize } from "@/types/client";
import { supabaseClient } from "@/lib/supbaseClient";
import PhoneInput from "react-phone-input-2";
import moment from "moment";
import { useParams } from "react-router-dom";

export const CompanyInfoForm: React.FC<ICompanyInfoFormProps> = () => {
  const [activeForm, setActiveForm] = useState<
    | "email"
    | "address"
    | "name"
    | "contact"
    | "date_of_birth"
    | "gender"
    | "nationality"
  >();
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabaseClient
          .from("clients")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;

        setData(data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const { name, email, address, contact, date_of_birth, gender, nationality } =
    data || {};

  const getActiveForm = (args: any) => {
    const { formName } = args;

    if (activeForm === formName) {
      return "form";
    }

    if (!data?.[formName]) {
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
        view={<Text>{name}</Text>}
        onClick={() => setActiveForm("name")}
        onUpdate={() => setActiveForm(undefined)}
        onCancel={() => setActiveForm(undefined)}
      >
        <Input
          autoFocus
          defaultValue={name}
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
        view={<Text>{email || null}</Text>}
        onClick={() => setActiveForm("email")}
        onUpdate={() => setActiveForm(undefined)}
        onCancel={() => setActiveForm(undefined)}
      >
        <Input autoFocus placeholder="Email" defaultValue={email || null} />
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
        view={<Text>{address}</Text>}
        onClick={() => setActiveForm("address")}
        onUpdate={() => setActiveForm(undefined)}
        onCancel={() => setActiveForm(undefined)}
      >
        <Input
          autoFocus
          defaultValue={address}
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
        view={<Text>{contact}</Text>}
        onClick={() => setActiveForm("contact")}
        onUpdate={() => setActiveForm(undefined)}
        onCancel={() => setActiveForm(undefined)}
      >
        <PhoneInput
          country={"us"}
          value={contact}
          onChange={(phone) => {
            console.log(phone);
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
        view={<Text>{date_of_birth}</Text>}
        onClick={() => setActiveForm("date_of_birth")}
        onUpdate={() => setActiveForm(undefined)}
        onCancel={() => setActiveForm(undefined)}
      >
        <DatePicker
          autoFocus
          defaultValue={date_of_birth ? moment(date_of_birth) : null}
          placeholder="DOB"
          style={{
            width: "100%",
          }}
          format="YYYY-MM-DD"
          onChange={(date, dateString) => {
            console.log(date, dateString);
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
        view={<Text>{gender}</Text>}
        onClick={() => setActiveForm("gender")}
        onUpdate={() => setActiveForm(undefined)}
        onCancel={() => setActiveForm(undefined)}
      >
        <Select
          autoFocus
          defaultValue={gender || ""}
          options={companySizeOptions}
          placeholder="Gender"
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
        icon={<EnvironmentOutlined className="tertiary" />}
        state={getActiveForm({ formName: "nationality" })}
        itemProps={{
          name: "nationality",
          label: "Nationality",
        }}
        view={<Text>{nationality}</Text>}
        onClick={() => setActiveForm("nationality")}
        onUpdate={() => setActiveForm(undefined)}
        onCancel={() => setActiveForm(undefined)}
      >
        <Input
          autoFocus
          defaultValue={nationality || ""}
          placeholder="Nationality"
          style={{
            width: "100%",
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
