import { useState } from "react";
import { useList, useOne, useUpdate } from "@refinedev/core";
import {
  BankOutlined,
  CalendarOutlined,
  ColumnWidthOutlined,
  EnvironmentOutlined,
  MailOutlined,
  PhoneOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import { useParams } from "react-router-dom";
import { Card, DatePicker, Input, Select, Space } from "antd";
import moment from "moment";
import PhoneInput from "react-phone-input-2";

import { capitalizeWords } from "@/utilities";
import { IClient, INotes } from "@/types/client";
import { SingleElementForm, Text } from "@/components";

export const InfoForm = () => {
  const id = useParams().id;
  const [activeForm, setActiveForm] = useState<
    | "email"
    | "address"
    | "name"
    | "contact"
    | "date_of_birth"
    | "gender"
    | "nationality"
  >();

  const { data: client, isLoading } = useOne<IClient>({
    resource: "clients",
    id,
    queryOptions: {
      enabled: !!id,
    },
    meta: {
      fields: ["*"],
    },
  });

  const { data: notesData } = useList<INotes>({
    resource: "notes",
    filters: [
      {
        field: "user_id",
        operator: "eq",
        value: id,
      },
    ],
  });

  const { mutate: updateNotes } = useUpdate({
    resource: "notes",
    mutationOptions: {
      onSuccess: () => {},
      onError: () => {},
    },
  });

  const {
    address,
    contact,
    date_of_birth,
    email,
    gender,
    // is_authorized,
    name,
    nationality,
  } = client?.data || {};

  const [currentName, setCurrentName] = useState<string | undefined>(name);

  const getActiveForm = (args: { formName: keyof IClient }) => {
    const { formName } = args;

    if (activeForm === formName) {
      return "form";
    }

    if (!client?.data?.[formName]) {
      return "empty";
    }

    return "view";
  };

  const handleUpdateName = async (newName: string) => {
    if (notesData?.data) {
      const updatePromises = notesData.data.map((note) =>
        updateNotes({
          resource: "notes",

          id: note.id,
          values: { created_by: newName },
        })
      );

      try {
        await Promise.all(updatePromises);
      } catch (error) {
        console.error("Error updating notes:", error);
      }
    }
  };

  return (
    <Card
      title={
        <Space size={15}>
          <ShopOutlined className="sm" />
          <Text>Client Info</Text>
        </Space>
      }
      style={{
        maxWidth: "500px",
      }}
    >
      <SingleElementForm
        loading={isLoading}
        style={{
          padding: "0.5rem 1rem",
        }}
        icon={<ColumnWidthOutlined className="tertiary" />}
        state={getActiveForm({ formName: "name" })}
        itemProps={{
          name: "name",
          label: "Name",
        }}
        view={<Text>{name}</Text>}
        onClick={() => setActiveForm("name")}
        onUpdate={() => {
          handleUpdateName(currentName || "");
          setActiveForm(undefined);
        }}
        onCancel={() => setActiveForm(undefined)}
      >
        <Input
          autoFocus
          defaultValue={name}
          onChange={(e) => {
            setCurrentName(e.target.value);
          }}
          style={{
            width: "100%",
          }}
        />
      </SingleElementForm>

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

      <SingleElementForm
        loading={isLoading}
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
          inputStyle={{
            width: "100%",
          }}
        />
      </SingleElementForm>

      <SingleElementForm
        loading={isLoading}
        style={{
          padding: "0.5rem 1rem",
        }}
        icon={<CalendarOutlined className="tertiary" />}
        state={getActiveForm({ formName: "date_of_birth" })}
        itemProps={{
          name: "date_of_birth",
          label: "DOB",
        }}
        view={<Text>{moment(date_of_birth).format("LL")}</Text>}
        onClick={() => setActiveForm("date_of_birth")}
        onUpdate={() => setActiveForm(undefined)}
        onCancel={() => setActiveForm(undefined)}
      >
        <DatePicker
          autoFocus
          placeholder="DOB"
          style={{
            width: "100%",
          }}
          format="DD-MM-YYYY"
        />
      </SingleElementForm>

      <SingleElementForm
        loading={isLoading}
        style={{
          padding: "0.5rem 1rem",
        }}
        icon={<EnvironmentOutlined className="tertiary" />}
        state={getActiveForm({ formName: "gender" })}
        itemProps={{
          name: "gender",
          label: "Gender",
        }}
        view={<Text>{capitalizeWords(gender)}</Text>}
        onClick={() => setActiveForm("gender")}
        onUpdate={() => setActiveForm(undefined)}
        onCancel={() => setActiveForm(undefined)}
      >
        <Select
          autoFocus
          defaultValue={gender || ""}
          options={genderOptions}
          placeholder="Gender"
          style={{
            width: "100%",
          }}
        />
      </SingleElementForm>
      <SingleElementForm
        loading={isLoading}
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

const genderOptions: {
  label: string;
  value: "male" | "female" | "others";
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