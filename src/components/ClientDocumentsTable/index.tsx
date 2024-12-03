import { Card, Space, Skeleton, Table, Button } from "antd";
import {
  FileOutlined,
  MailOutlined,
  PhoneOutlined,
  UploadOutlined,
} from "@ant-design/icons";

import { Text, StatusTag, CustomAvatar } from "@/components";
import { IClient } from "@/types/client";
import { useState } from "react";
import FileUploadModal from "../FileUploadModal";

export const ClientDocumentsTable = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <Card
      title={
        <Space size="middle">
          <FileOutlined />
          <Text>Documents</Text>
        </Space>
      }
      extra={
        <Button type="primary" icon={<UploadOutlined />} onClick={showModal}>
          Upload Documents
        </Button>
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
      {/* {<Text>No documents yet</Text>} */}
      <Table dataSource={[]} rowKey="id" pagination={false}>
        <Table.Column
          title="Name"
          dataIndex="name"
          render={(_, record: IClient) => (
            <Space>
              <CustomAvatar name={record.name} src={record.name} />
              <Text>{record.name}</Text>
            </Space>
          )}
        />
        <Table.Column title="Title" dataIndex="jobTitle" />
        <Table.Column
          title="Stage"
          dataIndex="status"
          render={() => <StatusTag status="Approve" />}
        />
        <Table.Column
          dataIndex="id"
          render={(_, record: IClient) => (
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
      <FileUploadModal
        isOpen={isModalOpen}
        handleCancel={handleCancel}
        handleSave={() => {}}
      />
    </Card>
  );
};
