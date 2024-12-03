import {
  Modal,
  Upload,
  Row,
  Col,
  Typography,
  Button,
  message,
  Image,
} from "antd";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";
import categories from "@/data/categories.json";
import "./index.css";
import { useState } from "react";
import { supabaseClient } from "@/lib/supbaseClient";
import { UploadInfo } from "@/types/client";

const { Text } = Typography;

interface FileUploadModalProps {
  isOpen: boolean;
  handleSave: () => void;
  handleCancel: () => void;
}

const FileUploadModal = ({
  isOpen,
  handleSave,
  handleCancel,
}: FileUploadModalProps) => {
  const [uploadedFiles, setUploadedFiles] = useState<{
    [key: string]: File | null;
  }>({});
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleUploadChange = async (info: UploadInfo, category: string) => {
    console.log(info, "info info info");
    const fileList = info.fileList;
    const newFile =
      fileList.length > 0 && fileList[0].originFileObj instanceof File
        ? fileList[0].originFileObj
        : null;

    setUploadedFiles((prev) => ({
      ...prev,
      [category]: newFile,
    }));
  };

  const handleUpload = async () => {
    const filesToUpload = Object.entries(uploadedFiles).filter(
      ([_, file]) => file !== null
    );

    if (filesToUpload.length === 0) {
      message.error("No files to upload.");
      return;
    }

    try {
      const uploadPromises = filesToUpload.map(async ([category, file]) => {
        if (file) {
          const filePath = `/${category}/${file.name}`;
          const { data, error } = await supabaseClient.storage
            .from("client_docs")
            .upload(filePath, file);

          if (error) {
            throw new Error(error.message);
          }

          message.success(`File uploaded for ${category}: ${data?.path}`);
        }
      });

      await Promise.all(uploadPromises);
      handleSave(); // Call the save handler after upload
    } catch (error) {
      message.error(
        `Upload failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  const handlePreview = (category: string) => {
    const file = uploadedFiles[category];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setPreviewImage(fileUrl);
      setPreviewVisible(true);
    }
  };

  const handleDelete = (category: { id: string; name: string }) => {
    setUploadedFiles((prev) => ({
      ...prev,
      [category?.id]: null,
    }));
    message.success(`File for category ${category?.name} deleted.`);
  };

  return (
    <Modal
      title="Upload Documents"
      open={isOpen}
      onCancel={handleCancel}
      width={800}
      cancelText="Cancel"
      okText="Upload Files"
      onOk={handleUpload}
      okButtonProps={{
        icon: <UploadOutlined />,
        disabled: Object.values(uploadedFiles).every((file) => file === null),
      }}
    >
      {categories.map((category: { id: string; name: string }) => (
        <Row
          key={category.id}
          align="middle"
          style={{
            marginBottom: 24,
            marginTop: 30,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Col span={6}>
            <Text>{category.name}</Text>
          </Col>
          <Col span={10} style={{ maxWidth: "max-content" }}>
            <div style={{ display: "flex" }}>
              <Upload
                accept=".pdf,.jpg,.jpeg,.png"
                listType="picture"
                maxCount={1}
                className="file-uploader"
                showUploadList={false}
                customRequest={({ _, onSuccess }) => {
                  setTimeout(() => {
                    onSuccess?.();
                  }, 0);
                }}
                onChange={(info) => handleUploadChange(info, category.id)}
              >
                <Button icon={<UploadOutlined />}>Choose File</Button>
              </Upload>
            </div>
          </Col>
          <Col span={8} style={{ textAlign: "center" }}>
            <Text type="secondary">
              {uploadedFiles[category.id] ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    border: "1px solid green",
                    borderRadius: "10px",
                    maxWidth: "650px",
                    padding: "10px",
                  }}
                >
                  <Image
                    width={60}
                    src={URL.createObjectURL(uploadedFiles[category.id]!)}
                    preview={true}
                    style={{ marginTop: 10 }}
                  />
                  <Text
                    style={{
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                      maxWidth: "90px",
                    }}
                  >
                    {uploadedFiles[category.id]?.name}
                  </Text>
                  <Button
                    icon={<DeleteOutlined />}
                    onClick={() => handleDelete(category)}
                    danger
                    style={{ marginTop: 10 }}
                  ></Button>
                </div>
              ) : (
                "No file uploaded"
              )}
            </Text>
          </Col>
        </Row>
      ))}

      <Modal
        visible={previewVisible}
        title="File Preview"
        footer={null}
        onCancel={() => setPreviewVisible(false)}
      >
        {previewImage && <Image src={previewImage} alt="Preview" />}
      </Modal>
    </Modal>
  );
};

export default FileUploadModal;
