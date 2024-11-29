import { useForm } from "@refinedev/antd";
import { EditOutlined } from "@ant-design/icons";
import { Form, Skeleton, Space } from "antd";
import { CustomAvatar, Text } from "@/components";
import { getNameInitials } from "@/utilities";
import styles from "./title-form.module.css";
import {
  ICompany,
  TCompanyTitleFormProps,
  TTitleInputProps,
} from "@/types/client";

export const CompanyTitleForm: React.FC<TCompanyTitleFormProps> = ({
  company,
  loading,
  onUpdateCompany,
}) => {
  const { formProps, onFinish } = useForm({
    redirect: false,
  });

  const handleNameChange = (value: string) => {
    const updatedCompany = { ...company, name: value } as ICompany;
    onUpdateCompany(updatedCompany);
  };

  return (
    <Form {...formProps}>
      <Space size={16}>
        <CustomAvatar
          size="large"
          shape="square"
          src={""}
          name={getNameInitials(company?.name || "")}
          style={{
            width: 96,
            height: 96,
            fontSize: 48,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "none",
          }}
        />
        <Space direction="vertical" size={0}>
          <Form.Item name="name" required noStyle>
            <TitleInput
              value={company?.name || ""}
              loading={loading}
              onChange={(value: string) => {
                onFinish?.({
                  name: value,
                });
                handleNameChange(value);
              }}
            />
          </Form.Item>
        </Space>
      </Space>
    </Form>
  );
};

const TitleInput: React.FC<TTitleInputProps> = ({
  value,
  onChange,
  loading,
}) => {
  return (
    <Text
      className={styles.title}
      size="xl"
      strong
      editable={{
        onChange,
        triggerType: ["text", "icon"],
        icon: <EditOutlined className={styles.titleEditIcon} />,
      }}
    >
      {loading ? (
        <Skeleton.Input size="small" style={{ width: 200 }} active />
      ) : (
        value
      )}
    </Text>
  );
};
