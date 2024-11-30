import { List, useTable } from "@refinedev/antd";
import { Table } from "antd";
import dayjs from "dayjs";


export const InvitationList = () => {
  const { tableProps } = useTable({
    syncWithLocation: true,
  });

  return (
    <List>
      <Table {...tableProps} rowKey="id">
        {/* <Table.Column dataIndex="id" title={"ID"} /> */}
        <Table.Column dataIndex="email" title={"Email"} />
        <Table.Column dataIndex="token" title={"Token"} />
        <Table.Column dataIndex="expires_at" title={"Expires At"} render={(value) =>
            value ? dayjs(value).format("DD MMM, YYYY - hh:mm A") : "-"
          }/>
      </Table>
    </List>
  );
};
