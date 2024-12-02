import { IInvitesRecord } from "@/types/client";
import { List, useTable } from "@refinedev/antd";
import { useDelete } from "@refinedev/core";
import { Table } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

export const InvitationList = () => {
  const [filteredData, setFilteredData] = useState<IInvitesRecord[]>([]);

  // Correctly type useTable to ensure dataSource matches IInvitesRecord
  const { tableProps } = useTable<IInvitesRecord>({
    resource: "invites",
    syncWithLocation: true,
  });

  // useDelete hook for deleting expired records
  const { mutate } = useDelete();

  useEffect(() => {
    if (tableProps.dataSource) {
      const now = new Date(); 
      // Filter out expired records by comparing timestamps correctly
      const expiredRecords = tableProps.dataSource.filter((record) => {
        // Parse the record's timestamp to a dayjs object for comparison
        const expirationDate = dayjs(record.expires_at);
        return expirationDate.isBefore(now); // Check if the record has expired
      });

      // Delete expired records one by one
      expiredRecords.forEach((record) => {
        mutate(
          {
            resource: "invites",
            id: record?.id || "",
          },
          {
            onSuccess: () => {
              // Update filtered data to exclude the deleted record
              setFilteredData((prevData) =>
                prevData.filter((item) => item.id !== record.id)
              );
            },
            onError: () => {},
          }
        );
      });

      // Set filtered data to show only non-expired records
      setFilteredData(
        tableProps.dataSource.filter(
          (record) => !dayjs(record.expires_at).isBefore(now)
        )
      );
    }
  }, [tableProps.dataSource, mutate]);

  return (
    <List>
      <Table
        {...tableProps}
        rowKey="id"
        dataSource={filteredData} // Use filtered data for rendering
      >
        <Table.Column dataIndex="email" title="Email" />
        <Table.Column dataIndex="token" title="Token" />
        <Table.Column
          dataIndex="expires_at"
          title="Expires At"
          render={(value) =>
            value ? dayjs(value).format("DD MMM, YYYY - hh:mm A") : "-"
          }
        />
      </Table>
    </List>
  );
};
