import { FC, useEffect, useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import {
  CheckCircleOutlined,
  ExpandOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { Tag, Spin, Alert } from "antd";

const variant = {
  DRAFT: {
    color: "blue",
    icon: <ExpandOutlined />,
  },
  SENT: {
    color: "cyan",
    icon: <SendOutlined />,
  },
  ACCEPTED: {
    color: "green",
    icon: <CheckCircleOutlined />,
  },
};

type QuoteStatus = "DRAFT" | "SENT" | "ACCEPTED";

type Props = {
  status: QuoteStatus;
};

export const QuoteStatusTag: FC<Props> = ({ status }) => {
  return (
    <Tag
      style={{
        textTransform: "capitalize",
      }}
      color={variant[status].color}
      icon={variant[status].icon}
    >
      {status.toLowerCase()}
    </Tag>
  );
};

// Fetching data from Supabase
const fetchQuoteStatuses = async () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const supabase = useSupabaseClient();

  const { data, error } = await supabase
    .from("quotes") // Replace "quotes" with your actual table name
    .select("status");

  if (error) {
    console.error("Error fetching quote statuses:", error);
    return [];
  }

  return data as { status: QuoteStatus }[]; // Use a more specific type
};

const ExampleComponent: FC = () => {
  const [statuses, setStatuses] = useState<QuoteStatus[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStatuses = async () => {
      try {
        const data = await fetchQuoteStatuses();
        if (data) {
          setStatuses(data.map((quote) => quote.status));
        }
      } catch (err) {
        setError("Failed to fetch statuses",);
      } finally {
        setLoading(false);
      }
    };

    loadStatuses();
  }, []);

  if (loading) {
    return <Spin />;
  }

  if (error) {
    return <Alert message={error} type="error" />;
  }

  return (
    <div>
      {statuses.map((status, index) => (
        <QuoteStatusTag key={index} status={status} />
      ))}
    </div>
  );
};

export default ExampleComponent;
