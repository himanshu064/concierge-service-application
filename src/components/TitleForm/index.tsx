import { useForm } from "@refinedev/antd";
import { EditOutlined } from "@ant-design/icons";
import { Form, Skeleton, Space } from "antd";

import { CustomAvatar, Text } from "@/components";
import { getNameInitials } from "@/utilities";
import { IClient, TTitleInputProps } from "@/types/client";
import styles from "./title-form.module.css";

export const TitleForm = () => {
  const { formProps, onFinish, query: queryResult } = useForm<IClient>();

  const name = queryResult?.data?.data?.name;

  return (
    <Form {...formProps}>
      <Space size={16}>
        <CustomAvatar
          size="large"
          shape="square"
          src={null}
          name={getNameInitials(name || "")}
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
              value={""}
              loading={false}
              onChange={(value: string) => {
                onFinish?.({
                  name: value,
                });
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
  loading,
  onChange,
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
