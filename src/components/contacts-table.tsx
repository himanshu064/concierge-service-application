import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Table, Space, Button } from "antd";
import { supabaseClient } from "@/lib/supbaseClient";
import { ContactStatusTag, CustomAvatar, Text } from "@/components";
import { MailOutlined, PhoneOutlined, TeamOutlined } from "@ant-design/icons";

export const CompanyContactsTable = () => {
  const params = useParams();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContacts = async () => {
      setLoading(true);
      const { data, error } = await supabaseClient
        .from("clients")
        .select("*")
        .eq("company_id", params.id);

      if (error) {
        console.error(error);
      } else {
        setContacts(data);
      }
      setLoading(false);
    };

    fetchContacts();
  }, [params.id]);

  const hasData = !loading && contacts.length > 0;

  return (
    <Card
      title={
        <Space size="middle">
          <TeamOutlined />
          <Text>Contacts</Text>
        </Space>
      }
    >
      {!hasData && <Text>No contacts yet</Text>}
      {hasData && (
        <Table dataSource={contacts} rowKey="id">
          <Table.Column
            title="Name"
            dataIndex="name"
            render={(_, record) => (
              <Space>
                <CustomAvatar name={record.name} src={record.avatarUrl} />
                <Text>{record.name}</Text>
              </Space>
            )}
          />
          <Table.Column title="Title" dataIndex="jobTitle" />
          <Table.Column
            title="Stage"
            dataIndex="status"
            render={(_, record) => <ContactStatusTag status={record.status} />}
          />
          <Table.Column
            dataIndex="id"
            render={(_, record) => (
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
                {/* Add additional actions as needed */}
              </Space>
            )}
          />
        </Table>
      )}
    </Card>
  );
};
