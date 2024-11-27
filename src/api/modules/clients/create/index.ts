import { failed, success } from "@/api/lib/response";

export const createClient = () => {
  return "ok";

  return success({
    data: {},
  });

  return failed({
    data: {},
  });
};
