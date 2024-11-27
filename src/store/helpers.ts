// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const unwrapError = (error: any): string => {
  if (error.response) {
    return error.response?.data?.message as string;
  }
  return error.message as string;
};
