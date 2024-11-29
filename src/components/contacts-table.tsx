import { useEffect, useState } from "react";
import { Card, Table, Space, Button, Skeleton } from "antd";
import { MailOutlined, PhoneOutlined, FileOutlined } from "@ant-design/icons";
import { ContactStatusTag, CustomAvatar, Text } from "@/components";
import { supabaseClient } from "@/lib/supbaseClient";
import { ICompanyContactsTableProps, IContact } from "@/types/client";

export const CompanyContactsTable: React.FC<ICompanyContactsTableProps> = ({
  companyId,
  loading: parentLoading,
}) => {
  const [contacts, setContacts] = useState<IContact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContacts = async () => {
      if (!companyId) return;

      setLoading(true);
      const { data, error } = await supabaseClient
        .from("clients")
        .select("id, name, jobTitle, status, email, phone, avatar_url")
        .eq("company_id", companyId);

      if (error) {
        console.error(error);
      } else {
        setContacts(data || []);
      }
      setLoading(false);
    };

    fetchContacts();
  }, [companyId]);

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
