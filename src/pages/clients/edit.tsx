import { Col, Row } from "antd";

import {
  ClientDocumentsTable,
  InfoForm,
  NotesSection,
  // TitleForm,
} from "@/components";

export const ClientEditPage = () => {
  return (
    <div className="page-container">
      {/* <TitleForm /> */}
      <Row gutter={[32, 32]} style={{ marginTop: 32 }}>
        <Col span={16}>
          <ClientDocumentsTable />
          <NotesSection style={{ marginTop: 32 }} />
        </Col>
        <Col span={8}>
          <InfoForm />
        </Col>
      </Row>
    </div>
  );
};
