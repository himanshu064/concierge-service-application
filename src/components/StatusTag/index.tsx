import React from "react";
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { Tag, type TagProps } from "antd";

export const StatusTag = ({ status }: { status: string }) => {
  let icon: React.ReactNode = null;
  let color: TagProps["color"] = undefined;

  switch (status) {
    case "pending":
      icon = <ExclamationCircleOutlined />;
      color = "orange";
      break;
    case "approved":
      icon = <CheckCircleOutlined />;
      color = "green";
      break;

    default:
      break;
  }

  return (
    <Tag color={color} style={{ textTransform: "capitalize" }}>
      {icon} {status.toLowerCase()}
    </Tag>
  );
};
