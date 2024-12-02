import { List, useTable } from "@refinedev/antd";
import { Space, Table, Button, Popconfirm } from "antd";
import { BaseKey, BaseRecord, useDelete } from "@refinedev/core";
import {
  DeleteOutlined,
  EyeOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import supabaseAdmin from "@/lib/supabaseAdmin";

export const ClientList = () => {
  const { tableProps } = useTable({
    syncWithLocation: true,
  });

  const navigate = useNavigate();
  const { mutate } = useDelete();

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

  return (
    <List>
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="id" title={"ID"} />
        <Table.Column dataIndex="name" title={"Name"} />
        <Table.Column dataIndex="email" title={"Email"} />
        <Table.Column dataIndex="address" title={"Address"} />
        <Table.Column
          title={"Actions"}
          dataIndex="actions"
          render={(_, record: BaseRecord) => (
            <Space>
              <Button
                icon={<EyeOutlined />}
                size="small"
                onClick={() => navigate(`/clients/edit/${record.id}`)}
              />

              <Popconfirm
                title="Delete this user"
                description="Are you sure to delete this user?"
                onConfirm={() => {
                  handleDelete(record);
                }}
                okText="Delete"
                cancelText="Cancle"
                icon={<QuestionCircleOutlined style={{ color: "red" }} />}
              >
                <Button
                  icon={<DeleteOutlined style={{ color: "#f00" }} />}
                  size="small"
                  style={{ borderColor: "#f00" }}
                />
              </Popconfirm>
            </Space>
          )}
        />
      </Table>
    </List>
  );
};
