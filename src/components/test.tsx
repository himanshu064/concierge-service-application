import { useEffect } from "react";

import { testDB } from "@/api";

const Test = () => {
  useEffect(() => {
    testDB();
    console.log("Test component mounted");
  }, []);

  return null;
};

export default Test;
