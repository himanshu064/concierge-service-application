import { type FC, useMemo, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FilterDropdown, ShowButton, useTable } from "@refinedev/antd";
import { useNavigation } from "@refinedev/core";
import {
  ContainerOutlined,
  ExportOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Button, Card, Input, Select, Space, Table } from "antd";
import { QuoteStatusTag, Text } from "@/components";
import { currencyNumber } from "@/utilities";
import { supabaseClient } from "@/lib/supbaseClient";
type Props = {
  style?: React.CSSProperties;
};

type Quote = {
  id: string;
  title: string;
  total: number;
  status: any;
  salesOwner: { id: string; name: string };
  contact: { id: string; name: string };
  updatedAt: string;
};

export const CompanyQuotesTable: FC<Props> = ({ style }) => {
  const { listUrl } = useNavigation();
  const params = useParams();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuotes = async () => {
      setLoading(true);
      const { data, error } = await supabaseClient
        .from("clients")
        .select(
          `id, title, total, status, salesOwner:users(id, name), contact:users(id, name), updatedAt`
        )
        .eq("company_id", params.id)
        .order("updatedAt", { ascending: false });

      if (error) {
        console.error("Error fetching quotes:", error);
      } else {
        setQuotes(data);
      }
      setLoading(false);
    };

    fetchQuotes();
  }, [params.id]);

  const { tableProps, filters, setFilters } = useTable<Quote>({
    resource: "quotes",
    syncWithLocation: false,
    sorters: {
      initial: [
        {
          field: "updatedAt",
          order: "desc",
        },
      ],
    },
    filters: {
      initial: [
        {
          field: "title",
          value: "",
          operator: "contains",
        },
        {
          field: "status",
          value: undefined,
          operator: "in",
        },
      ],
      permanent: [
        {
          field: "company_id",
          operator: "eq",
          value: params.id,
        },
      ],
    },
  });

  const showResetFilters = useMemo(() => {
    return filters?.filter((filter) => {
      if ("field" in filter && filter.field === "company_id") {
        return false;
      }
      if (!filter.value) {
        return false;
      }
      return true;
    });
  }, [filters]);

  const hasData = (quotes.length || 0) > 0;

  return (
    <Card
      style={style}
      headStyle={{
        borderBottom: "1px solid #D9D9D9",
        marginBottom: "1px",
      }}
      bodyStyle={{ padding: 0 }}
      title={
        <Space size="middle">
          <ContainerOutlined />
          <Text>Quotes</Text>
          {showResetFilters?.length > 0 && (
            <Button size="small" onClick={() => setFilters([], "replace")}>
              Reset filters
            </Button>
          )}
        </Space>
      }
    >
      {loading ? (
        <Text>Loading...</Text>
      ) : !hasData ? (
        <Space direction="vertical" size={16} style={{ padding: 16 }}>
          <Text>No quotes yet</Text>
          <Link to={listUrl("quotes")}>Add quotes</Link>
        </Space>
      ) : (
        <Table
          {...tableProps}
          rowKey="id"
          dataSource={quotes}
          pagination={{
            ...tableProps.pagination,
            showSizeChanger: false,
          }}
        >
          <Table.Column
            title="Quote Title"
            dataIndex="title"
            filterIcon={<SearchOutlined />}
            filterDropdown={(props) => (
              <FilterDropdown {...props}>
                <Input placeholder="Search Title" />
              </FilterDropdown>
            )}
          />
          <Table.Column<Quote>
            title="Total amount"
            dataIndex="total"
            sorter
            render={(_, record) => {
              return <Text>{currencyNumber(record.total || 0)}</Text>;
            }}
          />
          <Table.Column<Quote>
            title="Stage"
            dataIndex="status"
            render={(_, record) => {
              if (!record.status) return null;
              return <QuoteStatusTag status={record.status} />;
            }}
            filterDropdown={(props) => (
              <FilterDropdown {...props}>
                <Select
                  style={{ width: "200px" }}
                  mode="multiple"
                  placeholder="Select Stage"
                  options={statusOptions}
                />
              </FilterDropdown>
            )}
          />
          <Table.Column<Quote>
            dataIndex="salesOwner.id"
            title="Participants"
            filterDropdown={(props) => (
              <FilterDropdown {...props}>
                <Select
                  style={{ width: "200px" }}
                  placeholder="Select Sales Owner"
                  // {...selectPropsUsers}
                />
              </FilterDropdown>
            )}
          />
          <Table.Column<Quote>
            dataIndex="id"
            width={48}
            render={(value) => (
              <ShowButton
                recordItemId={value}
                hideText
                size="small"
                resource="contacts"
                icon={<ExportOutlined />}
              />
            )}
          />
        </Table>
      )}
    </Card>
  );
};

const statusOptions: { label: string; value: string }[] = [
  {
    label: "Draft",
    value: "DRAFT",
  },
  {
    label: "Sent",
    value: "SENT",
  },
  {
    label: "Accepted",
    value: "ACCEPTED",
  },
];