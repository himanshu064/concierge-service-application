import { type FC, useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

import { EditButton, FilterDropdown } from "@refinedev/antd";
import { useNavigation } from "@refinedev/core";

import {
  AuditOutlined,
  ExportOutlined,
  PlusCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Card, Input, Select, Skeleton, Space, Table, Tag } from "antd";

import { Text } from "@/components";
import { currencyNumber } from "@/utilities";
import { supabaseClient } from "@/lib/supbaseClient";

type Props = {
  style?: React.CSSProperties;
};

export const CompanyDealsTable: FC<Props> = ({ style }) => {
  const { listUrl } = useNavigation();
  const params = useParams();

  const [tableData, setTableData] = useState<any[]>([]);
  const [totalDealsAmount, setTotalDealsAmount] = useState<number>(0);

  const fetchDeals = async () => {
    const { data, error } = await supabaseClient
      .from("clients")
      .select(
        `id, title, value, stage (id, title), dealOwnerId, dealOwner (id, name), dealContact (id, name)`
      )
      .eq("company_id", params.id)
      .order("updatedAt", { ascending: false });

    if (error) {
      console.error("Error fetching deals:", error);
      return [];
    }
    return data;
  };

  const fetchTotalDealsAmount = async () => {
    const { data, error } = await supabaseClient
      .from("deals")
      .select("value")
      .eq("company_id", params.id);

    if (error) {
      console.error("Error fetching total deal amount:", error);
      return 0;
    }

    const totalAmount = data?.reduce((sum, deal) => sum + (deal.value || 0), 0);
    return totalAmount;
  };

  useEffect(() => {
    fetchDeals().then((data) => setTableData(data));
    fetchTotalDealsAmount().then((amount) => setTotalDealsAmount(amount));
  }, [params.id]);

  const hasData = tableData.length > 0;

  return (
    <Card
      style={style}
      headStyle={{ borderBottom: "1px solid #D9D9D9", marginBottom: "1px" }}
      bodyStyle={{ padding: 0 }}
      title={
        <Space size="middle">
          <AuditOutlined />
          <Text>Deals</Text>
        </Space>
      }
      extra={
        <>
          <Text className="tertiary">Total deal amount: </Text>
          {totalDealsAmount === 0 ? (
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
            filterDropdown={(props) => (
              <FilterDropdown {...props}>
                <Select
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
