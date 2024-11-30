import { Card, Table, Space, Button, Skeleton } from "antd";
import { MailOutlined, PhoneOutlined, FileOutlined } from "@ant-design/icons";
import { CustomAvatar, Text } from "@/components";
import { IContact } from "@/types/client";

export const ClientDocumentsTable = () => {
  return (
    <Card
      title={
        <Space size="middle">
          <FileOutlined />
          <Text>Documents</Text>
        </Space>
      }
    >
      {/* eslint-disable-next-line no-constant-binary-expression */}
      {false && (
        <Skeleton
          active
          paragraph={{ rows: 3 }}
          title={false}
          style={{ marginBottom: "16px" }}
        />
      )}
      {/* {!isLoading && <Text>No documents yet</Text>} */}

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
    </Card>
  );
};
