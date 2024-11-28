import { type FC, useMemo } from "react";
import { Link, useParams } from "react-router-dom";

import { EditButton, FilterDropdown } from "@refinedev/antd";
import { useNavigation } from "@refinedev/core";

import {
  AuditOutlined,
  ExportOutlined,
  PlusCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Button, Card, Input, Select, Skeleton, Space, Table, Tag } from "antd";

import { Text } from "@/components";
import { useDealStagesSelect } from "@/hooks/useDealStagesSelect";
import { useUsersSelect } from "@/hooks/useUsersSelect";
import { currencyNumber } from "@/utilities";
import { supabase } from "@/utils/supabaseClient";

type Props = {
  style?: React.CSSProperties;
};

export const CompanyDealsTable: FC<Props> = ({ style }) => {
  const { listUrl } = useNavigation();
  const params = useParams();

  // Use the Supabase client to fetch data for the deals table
  const fetchDeals = async () => {
    const { data, error } = await supabase
      .from("clients")
      .select(
        `id, title, value, stage (id, title), dealOwnerId, dealOwner (id, name), dealContact (id, name)`
      ) // Replace with the appropriate column names
      .eq("company_id", params.id)
      .order("updatedAt", { ascending: false });
    if (error) {
      console.error("Error fetching deals:", error);
      return [];
    }
    return data;
  };

  // Use the Supabase client to fetch the total deals amount
  const fetchTotalDealsAmount = async () => {
    const { data, error } = await supabase
      .from("deals")
      .select("value")
      .eq("company_id", params.id)
      .sum("value", { foreignTable: "deals" });
    if (error) {
      console.error("Error fetching total deal amount:", error);
      return 0;
    }
    return data?.[0]?.sum || 0;
  };

  const { selectProps: usersSelectProps } = useUsersSelect();
  const { selectProps: dealStagesSelectProps } = useDealStagesSelect();

  const [tableData, setTableData] = useMemo(() => [], []);
  const [totalDealsAmount, setTotalDealsAmount] = useMemo(() => 0, []);

  // Fetch data on component mount
  useMemo(() => {
    fetchDeals().then((data) => setTableData(data));
    fetchTotalDealsAmount().then((amount) => setTotalDealsAmount(amount));
  }, [params.id]);

  const hasData = tableData.length > 0;

  const showResetFilters = useMemo(() => {
    // Placeholder logic for resetting filters if needed
    return []; // Add your filter logic
  }, []);

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
          <AuditOutlined />
          <Text>Deals</Text>

          {showResetFilters?.length > 0 && (
            <Button size="small" onClick={() => setFilters([], "replace")}>
              Reset filters
            </Button>
          )}
        </Space>
      }
      extra={
        <>
          <Text className="tertiary">Total deal amount: </Text>
          {isLoadingCompany ? (
            <Skeleton.Input active size="small" />
          ) : (
            <Text strong>{currencyNumber(totalDealsAmount)}</Text>
          )}
        </>
      }
    >
      {!hasData && (
        <Space direction="vertical" size={16} style={{ padding: 16 }}>
          <Text>No deals yet</Text>
          <Link to={listUrl("deals")}>
            <PlusCircleOutlined style={{ marginRight: 4 }} /> Add deals through
            sales pipeline
          </Link>
        </Space>
      )}

      {hasData && (
        <Table dataSource={tableData} rowKey="id">
          <Table.Column
            title="Deal Title"
            dataIndex="title"
            filterIcon={<SearchOutlined />}
            filterDropdown={(props) => (
              <FilterDropdown {...props}>
                <Input placeholder="Search Title" />
              </FilterDropdown>
            )}
          />
          <Table.Column
            title="Deal amount"
            dataIndex="value"
            sorter
            render={(_, record) => (
              <Text>{currencyNumber(record.value || 0)}</Text>
            )}
          />
          <Table.Column
            title="Stage"
            dataIndex={["stage", "id"]}
            render={(_, record) =>
              record.stage ? <Tag>{record.stage.title}</Tag> : null
            }
            filterDropdown={(props) => (
              <FilterDropdown {...props}>
                <Select
                  {...dealStagesSelectProps}
                  style={{ width: "200px" }}
                  mode="multiple"
                  placeholder="Select Stage"
                />
              </FilterDropdown>
            )}
          />
          <Table.Column
            title="Participants"
            dataIndex="dealOwnerId"
            // render={(_, record) => (
            //   <Participants
            //     userOne={record.dealOwner}
            //     userTwo={record.dealContact}
            //   />
            // )}
            filterDropdown={(props) => (
              <FilterDropdown {...props}>
                <Select
                  {...usersSelectProps}
                  style={{ width: "200px" }}
                  placeholder="Select Sales Owner"
                />
              </FilterDropdown>
            )}
          />
          <Table.Column
            dataIndex="id"
            width={48}
            render={(value) => (
              <EditButton
                recordItemId={value}
                hideText
                size="small"
                resource="deals"
                icon={<ExportOutlined />}
              />
            )}
          />
        </Table>
      )}
    </Card>
  );
};
