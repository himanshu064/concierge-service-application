import {
  BaseKey,
  BaseRecord,
  useDelete,
  useGetIdentity,
} from "@refinedev/core";
import {
  DeleteOutlined,
  EyeOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import supabaseAdmin from "@/lib/supabaseAdmin";
import { List, useTable } from "@refinedev/antd";
import { Space, Table, Button, Popconfirm, Tooltip, Tag } from "antd";
//   import { useCallback, useEffect } from "react";
//   import ENV from "@/env";
import { isUserAdmin } from "@/utilities";
import { IClient } from "@/types/client";
import generateColorFromText from "@/utilities/generate-color-from-name";

//   const { ADMIN_ACCOUNTS } = ENV;

const VendorList = () => {
  const navigate = useNavigate();

  const { mutate } = useDelete();
  const { data: user } = useGetIdentity<IClient>();

  const { tableProps } = useTable({
    syncWithLocation: true,
    filters: {
      defaultBehavior: "replace",
      initial: [],
    },
    sorters: {
      initial: [{ field: "created_at", order: "desc" }],
    },
  });

  const handleDelete = async (record: BaseRecord) => {
    try {
      await supabaseAdmin.auth.admin.deleteUser(record.auth_id);

      mutate({
        resource: "vendors",
        id: record.id as BaseKey,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <List>
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="id" title={"ID"} />
        <Table.Column dataIndex="company_name" title={"Company Name"} />
        <Table.Column dataIndex="contact_person" title={"Contact Person"} />
        <Table.Column dataIndex="contact_number" title={"Contact Number"} />
        <Table.Column dataIndex="email" title={"Email Id"} />
        <Table.Column dataIndex="address" title={"Address"} />
        <Table.Column
          dataIndex="services_offered"
          title={"Services Offered"}
          render={(_, record) => {
            return (
              <div style={{ display: "flex", gap: "7px" }}>
                {record.services_offered.map(
                  (service: string, index: number) => {
                    console.log(service, "services");
                    return (
                      <>
                        <Tag color={generateColorFromText(service)} key={index}>
                          {service}
                        </Tag>
                      </>
                    );
                  }
                )}
              </div>
            );
          }}
        />
        <Table.Column
          title={"Actions"}
          dataIndex="actions"
          render={(_, record: BaseRecord) => (
            <Space>
              <Tooltip
                title={
                  record.is_authorized === "pending"
                    ? "Pending approval"
                    : "View"
                }
                placement="top"
              >
                <Button
                  icon={<EyeOutlined />}
                  size="small"
                  onClick={() => navigate(`/vendors/edit/${record.id}`)}
                  disabled={record.is_authorized === "pending"}
                />
              </Tooltip>
              {isUserAdmin(user) && (
                <Tooltip title={"Delete"} placement="top">
                  <Popconfirm
                    title="Delete this user"
                    description="Are you sure to delete this user?"
                    onConfirm={() => {
                      handleDelete(record);
                    }}
                    okText="Delete"
                    cancelText="Cancel"
                    icon={<QuestionCircleOutlined style={{ color: "red" }} />}
                  >
                    <Button
                      icon={<DeleteOutlined style={{ color: "#f00" }} />}
                      size="small"
                      style={{ borderColor: "#f00" }}
                    />
                  </Popconfirm>
                </Tooltip>
              )}
            </Space>
          )}
        />
      </Table>
    </List>
  );
};

export default VendorList;
