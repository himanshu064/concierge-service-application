import {
  BaseKey,
  BaseRecord,
  CrudFilter,
  useDelete,
  useGetIdentity,
  useUpdate,
} from "@refinedev/core";
import {
  CheckOutlined,
  DeleteOutlined,
  EyeOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import supabaseAdmin from "@/lib/supabaseAdmin";
import { List, useTable } from "@refinedev/antd";
import { Space, Table, Button, Tabs, Popconfirm, Tooltip } from "antd";
import { StatusTag } from "@/components";
import TabPane from "antd/es/tabs/TabPane";
import { useCallback, useEffect } from "react";
import ENV from "@/env";
import { isUserAdmin } from "@/utilities";
import { IClient } from "@/types/client";

const { ADMIN_ACCOUNTS } = ENV;

export const ClientList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { mutate } = useDelete();
  const { data: user } = useGetIdentity<IClient>();
  const { mutate: updateStatus } = useUpdate();

  const urlParams = new URLSearchParams(location.search);
  const initialTab = urlParams.get("tab") || "all";

  const { tableProps, setFilters, setSorters } = useTable({
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
        resource: "clients",
        id: record.id as BaseKey,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleTabChange = useCallback(
    (key: string) => {
      navigate(`?tab=${key}`, { replace: true });
      const filters: CrudFilter[] = [
        {
          field: "email",
          operator: "ncontains",
          value: ADMIN_ACCOUNTS,
        },
      ];

      switch (key) {
        case "all":
          filters.push({
            field: "is_authorized",
            operator: "in",
            value: ["approved", "pending"],
          });
          break;

        case "approved":
          filters.push({
            field: "is_authorized",
            operator: "eq",
            value: "approved",
          });
          break;

        case "pending":
          filters.push({
            field: "is_authorized",
            operator: "eq",
            value: "pending",
          });
          break;

        default:
          break;
      }
      setFilters(filters);
    },
    [navigate, setFilters]
  );

  const handleApprove = (id: BaseRecord["id"]) => {
    if (id) {
      updateStatus(
        {
          resource: "clients",
          id,
          values: { is_authorized: "approved" },
        },
        {
          onSuccess: () => {
            console.log("Status successfully approved.");
            setSorters([{ field: "is_authorized", order: "desc" }]);
          },
          onError: (error) => {
            console.error("Failed to approve status:", error);
          },
        }
      );
    }
  };

  useEffect(() => {
    handleTabChange(initialTab);
  }, [handleTabChange, initialTab]);

  return (
    <List>
      <Tabs activeKey={initialTab} onChange={handleTabChange}>
        <TabPane tab="All" key="all" />
        <TabPane tab="Approved" key="approved" />
        <TabPane tab="Pending" key="pending" />
      </Tabs>
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="id" title={"ID"} />
        <Table.Column dataIndex="name" title={"Name"} />
        <Table.Column dataIndex="email" title={"Email"} />
        <Table.Column dataIndex="address" title={"Address"} />
        <Table.Column
          dataIndex="is_authorized"
          title={"Status"}
          render={(_, record) => {
            return <StatusTag status={record.is_authorized} />;
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
                  onClick={() => navigate(`/clients/edit/${record.id}`)}
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
              {record.is_authorized === "pending" && isUserAdmin(user) && (
                <Tooltip
                  title={record.is_authorized === "pending" ? "Approve" : ""}
                  placement="top"
                >
                  <Popconfirm
                    title="Are you sure you want to approve?"
                    onConfirm={() => handleApprove(record.id)}
                    okText="Yes"
                    cancelText="No"
                    icon={<QuestionCircleOutlined style={{ color: "red" }} />}
                  >
                    <Button
                      type="link"
                      size="small"
                      style={{ border: "1px solid green" }}
                    >
                      <CheckOutlined style={{ color: "green" }} />
                    </Button>
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
