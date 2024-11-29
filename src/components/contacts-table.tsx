import { useEffect, useState } from "react";
import { Card, Table, Space, Button, Skeleton } from "antd";
import { MailOutlined, PhoneOutlined, FileOutlined } from "@ant-design/icons";
import { ContactStatusTag, CustomAvatar, Text } from "@/components";
import { IClientDocumentsTableProps, IContact } from "@/types/client";
import { fetchSpecificClientDetailsByClientId } from "@/services/clients";

export const ClientDocumentsTable: React.FC<IClientDocumentsTableProps> = ({
  clientId,
  loading: parentLoading,
}) => {
  const [contacts, setContacts] = useState<IContact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContacts = async () => {
      const fields = "id, name, email, contact";
      if (!clientId) return;

      setLoading(true);
      const { data, error } = await fetchSpecificClientDetailsByClientId(
        clientId,
        fields
      );

      if (error) {
        console.error(error);
      } else {
        setContacts(data ?? []);
      }
      setLoading(false);
    };

    fetchContacts();
  }, [clientId]);

  const isLoading = loading || parentLoading;
  const hasData = !isLoading && contacts.length > 0;

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
      {!isLoading && !hasData && <Text>No documents yet</Text>}
      {hasData && (
        <Table dataSource={contacts} rowKey="id" pagination={false}>
          <Table.Column
            title="Name"
            dataIndex="name"
            render={(_, record: IContact) => (
              <Space>
                <CustomAvatar name={record.name} src={record.avatar_url} />
                <Text>{record.name}</Text>
              </Space>
            )}
          />
          <Table.Column title="Title" dataIndex="jobTitle" />
          <Table.Column
            title="Stage"
            dataIndex="status"
            render={(_, record: IContact) => (
              <ContactStatusTag status={record.status} />
            )}
          />
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
                  href={`tel:${record.phone}`}
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
