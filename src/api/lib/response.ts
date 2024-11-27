/* eslint-disable @typescript-eslint/no-explicit-any */
export const success = ({
  data,
  status,
  message,
}: {
  data: any;
  status?: number;
  message?: string;
}) => {
  return {
    status: status ?? 200,
    data,
    message: message ?? "Success",
  };
};

export const failed = ({
  data,
  status,
  message,
}: {
  data: any;
  status?: number;
  message?: string;
}) => {
  return {
    status: status ?? 500,
    data,
    message: message ?? "Success",
  };
};
