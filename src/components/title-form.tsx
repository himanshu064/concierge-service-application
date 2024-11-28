import { useState, useEffect } from "react";
import { useForm } from "@refinedev/antd";
import { EditOutlined } from "@ant-design/icons";
import { Button, Form, Select, Skeleton, Space } from "antd";
import { CustomAvatar, SelectOptionWithAvatar, Text } from "@/components";
import { supabaseClient } from "@/lib/supbaseClient";
import { getNameInitials } from "@/utilities";
import styles from "./title-form.module.css";

export const CompanyTitleForm = () => {
  const { formProps, onFinish } = useForm({
    redirect: false,
  });

  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

  // Fetch company data using Supabase
  useEffect(() => {
    const fetchCompanyData = async () => {
      const { data, error } = await supabaseClient
        .from("clients")
        .select("*")
        .single();

      if (error) {
        console.error("Error fetching company data:", error);
      } else {
        setCompany(data);
      }
      setLoading(false);
    };

    fetchCompanyData();
  }, []);

  // Fetch users for the Sales Owner input using Supabase
  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabaseClient
        .from("users")
        .select("id, name, avatar_url");

      if (error) {
        console.error("Error fetching users:", error);
      } else {
        setUsers(data);
      }
    };

    fetchUsers();
  }, []);

  return (
    <Form {...formProps}>
      <Space size={16}>
        <CustomAvatar
          size="large"
          shape="square"
          src={company?.avatar_url}
          name={getNameInitials(company?.name || "")}
          style={{
            width: 96,
            height: 96,
            fontSize: 48,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "none",
          }}
        />
        <Space direction="vertical" size={0}>
          <Form.Item name="name" required noStyle>
            <TitleInput
              value={company?.name}
              loading={loading}
              onChange={(value) => {
                return onFinish?.({
                  name: value,
                });
              }}
            />
          </Form.Item>
          <SalesOwnerInput
            salesOwner={company?.sales_owner}
            loading={loading}
            onChange={(value) => {
              onFinish?.({
                salesOwnerId: value,
              });
            }}
            users={users}
          />
        </Space>
      </Space>
    </Form>
  );
};

const TitleInput = ({
  value,
  onChange,
  loading,
}: {
  value: string;
  onChange: () => void;
  loading: boolean;
  users: string;
}) => {
  return (
    <Text
      className={styles.title}
      size="xl"
      strong
      editable={{
        onChange,
        triggerType: ["text", "icon"],
        icon: <EditOutlined className={styles.titleEditIcon} />,
      }}
    >
      {loading ? (
        <Skeleton.Input size="small" style={{ width: 200 }} active />
      ) : (
        value
      )}
    </Text>
  );
};

const SalesOwnerInput = ({
  salesOwner,
  onChange,
  loading,
  users,
}: {
  salesOwner: string;
  onChange: () => void;
  loading: boolean;
  users: string;
}) => {
  const [isEdit, setIsEdit] = useState(false);

  return (
    <div
      className={styles.salesOwnerInput}
      role="button"
      onClick={() => {
        setIsEdit(true);
      }}
    >
      <Text
        type="secondary"
        style={{
          marginRight: 12,
        }}
      >
        Sales Owner:
      </Text>
      {loading && <Skeleton.Input size="small" style={{ width: 120 }} active />}
      {!isEdit && !loading && (
        <>
          <CustomAvatar
            size="small"
            src={salesOwner?.avatar_url}
            style={{
              marginRight: 4,
            }}
          />
          <Text>{salesOwner?.name}</Text>
          <Button
            type="link"
            icon={<EditOutlined className={styles.salesOwnerInputEditIcon} />}
          />
        </>
      )}
      {isEdit && !loading && (
        <Form.Item name={["salesOwner", "id"]} noStyle>
          <Select
            defaultOpen={true}
            autoFocus
            onDropdownVisibleChange={(open) => {
              if (!open) {
                setIsEdit(false);
              }
            }}
            onClick={(e) => {
              e.stopPropagation();
            }}
            onChange={(value) => {
              onChange?.(value);
            }}
            options={users.map(
              ({
                id,
                name,
                avatar_url,
              }: {
                id: string;
                name: string;
                avatar_url: string;
              }) => ({
                value: id,
                label: (
                  <SelectOptionWithAvatar
                    name={name}
                    avatarUrl={avatar_url ?? undefined}
                  />
                ),
              })
            )}
          />
        </Form.Item>
      )}
    </div>
  );
};
