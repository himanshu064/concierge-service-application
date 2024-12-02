import React from "react";
import { ConfigProvider } from "antd";

const DateProvider = ({ children }: { children: React.ReactNode }) => {
  return <ConfigProvider>{children}</ConfigProvider>;
};

export default DateProvider;
