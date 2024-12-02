import React from "react";
import { Skeleton, type FormItemProps } from "antd";
import { Text } from "@/components";
import styles from "./index.module.css";
import { IClient } from "@/types/client";

type StatusElementFormProps = {
  icon?: React.ReactNode;
  itemProps?: FormItemProps;
  state?: "empty" | "form" | "view";
  data?: IClient;
  loading?: boolean;
} & React.PropsWithChildren;

export const StatusElementForm: React.FC<StatusElementFormProps> = ({
  icon,
  itemProps,
  loading,
  data,
}) => {
  const showStatus = () => {
    switch (data?.is_authorized) {
      case "approved":
        return <div style={{ color: "green", fontWeight: 600 }}>Approved</div>;
      case "pending":
        return <div style={{ color: "orange", fontWeight: 600 }}>Pending</div>;
      default:
        return;
    }
  };

  console.log(data, "data datadata");

  return (
    <div className={styles.container}>
      <div className={styles.icon}>{icon}</div>
      <div className={styles.content}>
        <div className={styles.input}>
          <Text size="sm" type="secondary" className={styles.label}>
            {itemProps?.label}
          </Text>
          {loading ? (
            <Skeleton.Input className={styles.skeleton} size="small" active />
          ) : (
            showStatus()
          )}
        </div>
      </div>
    </div>
  );
};
