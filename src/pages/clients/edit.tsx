import { Col, Row } from "antd";

import {
  CompanyContactsTable,
  CompanyInfoForm,
  CompanyNotes,
  CompanyTitleForm,
} from "@/components";

export const ClientEditPage = () => {
  return (
    <div className="page-container">
      <CompanyTitleForm />
      <Row
        gutter={[32, 32]}
        style={{
          marginTop: 32,
        }}
      >
        <Col span={16}>
          <CompanyContactsTable />
          <CompanyNotes
            style={{
              marginTop: 32,
            }}
          />
        </Col>
        <Col span={8}>
          <CompanyInfoForm />
        </Col>
      </Row>
    </div>
  );
};
