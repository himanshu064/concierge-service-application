import { DeleteButton, List, useTable } from "@refinedev/antd";
import { Space, Table, Button } from "antd";
import { BaseRecord } from "@refinedev/core";
import { EyeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

export const ClientList = () => {
  const { tableProps } = useTable({
    syncWithLocation: true,
  });

  const navigate = useNavigate();

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
              {/* <EditButton hideText size="small" recordItemId={record.id} /> */}
              <DeleteButton hideText size="small" recordItemId={record.id} />
            </Space>
          )}
        />
      </Table>
    </List>
  );
};
