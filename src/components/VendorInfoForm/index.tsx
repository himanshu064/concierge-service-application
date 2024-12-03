import { useState } from "react";
import { useOne } from "@refinedev/core";
import {
  BankOutlined,
  ColumnWidthOutlined,
  MailOutlined,
  PhoneOutlined,
  ShopOutlined,
  TagsOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useParams } from "react-router-dom";
import { Card, Input, Space, Tag } from "antd";
import PhoneInput from "react-phone-input-2";

import { SingleElementForm, Text } from "@/components";
import { IVendor } from "@/types/vendor";
import generateColorFromText from "@/utilities/generate-color-from-name";

export const VendorInfoForm = () => {
  const id = useParams().id;
  const [activeForm, setActiveForm] = useState<
    | "company_name"
    | "contact_person"
    | "email"
    | "address"
    | "contact_number"
    | "services_offered"
  >();

  const { data: vendor, isLoading } = useOne<IVendor>({
    resource: "vendors",
    id,
    queryOptions: {
      enabled: !!id,
    },
    meta: {
      fields: ["*"],
    },
  });

  const {
    company_name,
    contact_person,
    email,
    address,
    contact_number,
    services_offered,
  } = vendor?.data || {};

  const getActiveForm = (args: { formName: keyof IVendor }) => {
    const { formName } = args;

    if (activeForm === formName) {
      return "form";
    }

    if (!vendor?.data?.[formName]) {
      return "empty";
    }

    return "view";
  };

  return (
    <Card
      title={
        <Space size={15}>
          <ShopOutlined className="sm" />
          <Text>Vendor Info</Text>
        </Space>
      }
      style={{
        maxWidth: "500px",
      }}
    >
      {/* Company Name  */}
      <SingleElementForm
        loading={isLoading}
        style={{
          padding: "0.5rem 1rem",
        }}
        icon={<ColumnWidthOutlined className="tertiary" />}
        state={getActiveForm({ formName: "company_name" })}
        itemProps={{
          name: "company_name",
          label: "Company Name",
        }}
        view={<Text>{company_name}</Text>}
        onClick={() => setActiveForm("company_name")}
        onUpdate={() => setActiveForm(undefined)}
        onCancel={() => setActiveForm(undefined)}
      >
        <Input
          autoFocus
          defaultValue={company_name}
          style={{
            width: "100%",
          }}
        />
      </SingleElementForm>
      {/* Contact Person  */}
      <SingleElementForm
        loading={isLoading}
        style={{
          padding: "0.5rem 1rem",
        }}
        icon={<UserOutlined className="tertiary" />}
        state={getActiveForm({ formName: "contact_person" })}
        itemProps={{
          name: "contact_person",
          label: "Contact Person",
        }}
        view={<Text>{contact_person}</Text>}
        onClick={() => setActiveForm("contact_person")}
        onUpdate={() => setActiveForm(undefined)}
        onCancel={() => setActiveForm(undefined)}
      >
        <Input
          autoFocus
          placeholder="contact_person"
          defaultValue={contact_person}
        />
      </SingleElementForm>
      {/* Email  */}
      <SingleElementForm
        loading={isLoading}
        style={{
          padding: "0.5rem 1rem",
        }}
        icon={<MailOutlined className="tertiary" />}
        state={getActiveForm({ formName: "email" })}
        itemProps={{
          name: "email",
          label: "Email",
        }}
        view={<Text>{email}</Text>}
        onClick={() => setActiveForm("email")}
        onUpdate={() => setActiveForm(undefined)}
        onCancel={() => setActiveForm(undefined)}
      >
        <Input autoFocus placeholder="Email" defaultValue={email} />
      </SingleElementForm>
      {/* Contact Number  */}
      <SingleElementForm
        loading={isLoading}
        style={{
          padding: "0.5rem 1rem",
        }}
        icon={<PhoneOutlined className="tertiary" />}
        state={getActiveForm({ formName: "contact_number" })}
        itemProps={{
          name: "contact_number",
          label: "Contact Number",
        }}
        view={<Text>{contact_number}</Text>}
        onClick={() => setActiveForm("contact_number")}
        onUpdate={() => setActiveForm(undefined)}
        onCancel={() => setActiveForm(undefined)}
      >
        <PhoneInput
          country={"us"}
          value={contact_number}
          inputStyle={{
            width: "100%",
          }}
        />
      </SingleElementForm>
      {/* Address  */}
      <SingleElementForm
        loading={isLoading}
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

      {/* Services Offered  */}
      <SingleElementForm
        loading={isLoading}
        style={{
          padding: "0.5rem 1rem",
        }}
        icon={<TagsOutlined className="tertiary" />}
        itemProps={{
          name: "services_offered",
          label: "Services Offered",
        }}
        view={
          <div className="tags-in-vIf">
            {services_offered?.map((service, idx) => {
              return (
                <div key={idx}>
                  <Tag color={generateColorFromText(service)}>{service}</Tag>
                </div>
              );
            })}
          </div>
        }
      ></SingleElementForm>
    </Card>
  );
};
