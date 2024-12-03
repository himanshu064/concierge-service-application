import { Col, Row } from "antd";

import { NotesSection } from "@/components";
import { VendorInfoForm } from "@/components/VendorInfoForm";

export const VendorEditPage = () => {
  return (
    <div className="page-container">
      {/* <TitleForm /> */}
      <Row gutter={[32, 32]} style={{ marginTop: 32 }}>
        <Col span={16}>
          <NotesSection style={{ marginTop: 32 }} />
        </Col>
        <Col span={8}>
          <VendorInfoForm />
        </Col>
      </Row>
    </div>
  );
};
