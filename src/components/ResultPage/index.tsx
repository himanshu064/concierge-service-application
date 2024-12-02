import { Button, Result } from "antd";
import { ResultStatusType } from "antd/es/result";
import { useNavigate } from "react-router-dom";

const Results = ({
  status,
  title,
  subTitle,
}: {
  status: ResultStatusType ;
  title: string;
  subTitle: string;
}) => {
  const navigate = useNavigate();

  return (
    <Result
      status={status}
      title={title}
      subTitle={subTitle}
      extra={<Button type="primary" onClick={()=>navigate("/")}>Back Home</Button>}
    />
  );
};

export default Results;
