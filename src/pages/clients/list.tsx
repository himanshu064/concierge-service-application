import { useCallback, useEffect } from "react";
import { DeleteButton, List, useTable } from "@refinedev/antd";
import { Space, Table, Button, Tabs, Tooltip, Popconfirm } from "antd";
import { BaseRecord, CrudFilter, useUpdate } from "@refinedev/core";
import { CheckOutlined, EyeOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { StatusTag } from "@/components";
import TabPane from "antd/es/tabs/TabPane";

export const ClientList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { mutate: updateStatus } = useUpdate();

  const urlParams = new URLSearchParams(location.search);
  const initialTab = urlParams.get("tab") || "all";

  const { tableProps, setFilters } = useTable({
    syncWithLocation: true,
    filters: {
      defaultBehavior: "replace",
      initial: [],
    },
  });

  const handleTabChange = useCallback(
    (key: string) => {
      navigate(`?tab=${key}`, { replace: true });

      let filters: CrudFilter[] = [];

      switch (key) {
        case "all":
          filters = [
            {
              field: "is_authorized",
              operator: "in",
              value: ["approved", "pending"],
            },
          ];
          break;

        case "approved":
          filters = [
            { field: "is_authorized", operator: "eq", value: "approved" },
          ];
          break;

        case "pending":
          filters = [
            { field: "is_authorized", operator: "eq", value: "pending" },
          ];
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
              <Tooltip title="Delete" placement="top">
                <DeleteButton hideText size="small" recordItemId={record.id} />
              </Tooltip>
              {record.is_authorized === "pending" && (
                <Tooltip
                  title={record.is_authorized === "pending" ? "Approve" : ""}
                  placement="top"
                >
                  <Popconfirm
                    title="Are you sure you want to approve?"
                    onConfirm={() => handleApprove(record.id)}
                    okText="Yes"
                    cancelText="No"
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
