import { notification } from "antd";

export const showSuccesNotificaton = ({
  description,
}: {
  description: string;
}) => {
  return notification.open({
    message: "Success",
    description,
    duration: 5,
    style: {
      background: "#5da266",
      color: "white",
    },
  });
};

export const showErrorNotificaton = ({
  description,
}: {
  description: string;
}) => {
  return notification.open({
    message: "Error",
    description,
    duration: 5,
    style: {
      background: "#cc3333",
      color: "white",
    },
  });
};

export const showInfoNotificaton = ({
  description,
}: {
  description: string;
}) => {
  return notification.open({
    message: "Info",
    description,
    duration: 5,
    style: {
      background: "#3988c6",
      color: "white",
    },
  });
};
