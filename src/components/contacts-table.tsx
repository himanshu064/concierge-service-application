import { Card, Table, Space, Button, Skeleton } from "antd";
import { MailOutlined, PhoneOutlined, FileOutlined } from "@ant-design/icons";
import { CustomAvatar, Text } from "@/components";
import { IClientDocumentsTableProps, IContact } from "@/types/client";
import { useOne } from "@refinedev/core";

export const ClientDocumentsTable: React.FC<IClientDocumentsTableProps> = ({
  clientId,
}) => {
  const { data, isLoading } = useOne({
    resource: "clients", // Supabase resource name
    id: clientId, // Record ID to fetch
    queryOptions: {
      enabled: !!clientId, // Prevent query from running without clientId
    },
    meta: {
      fields: ["id, name, email, contact"], // Specify the fields you need
    },
  });

  return (
    <Card
      title={
        <Space size="middle">
          <FileOutlined />
          <Text>Documents</Text>
        </Space>
      }
    >
      {isLoading && (
        <Skeleton
          active
          paragraph={{ rows: 3 }}
          title={false}
          style={{ marginBottom: "16px" }}
        />
      )}
      {!isLoading && <Text>No documents yet</Text>}
      {data && (
        <Table dataSource={[]} rowKey="id" pagination={false}>
          <Table.Column
            title="Name"
            dataIndex="name"
            render={(_, record: IContact) => (
              <Space>
                <CustomAvatar name={record.name} src={record.name} />
                <Text>{record.name}</Text>
              </Space>
            )}
          />
          <Table.Column title="Title" dataIndex="jobTitle" />
          {/* <Table.Column
            title="Stage"
            dataIndex="status"
            render={(_, record: IContact) => (
              <ContactStatusTag status={record.} />
            )}
          /> */}
          <Table.Column
            dataIndex="id"
            render={(_, record: IContact) => (
              <Space>
                <Button
                  size="small"
                  href={`mailto:${record.email}`}
                  icon={<MailOutlined />}
                />
                <Button
                  size="small"
                  href={`tel:${record.contact}`}
                  icon={<PhoneOutlined />}
                />
              </Space>
            )}
          />
        </Table>
      )}
    </Card>
  );
};
