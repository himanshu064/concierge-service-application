import { Col, Row } from "antd";
// import { useEffect, useState } from "react";
import {
  ClientDocumentsTable,
  CompanyInfoForm,
  CompanyNotes,
  // CompanyTitleForm,
} from "@/components";
// import { ICompany } from "@/types/client";
// import { useParams } from "react-router-dom";

export const ClientEditPage = () => {
  return (
    <div className="page-container">
      {/* <CompanyTitleForm /> */}
      <Row gutter={[32, 32]} style={{ marginTop: 32 }}>
        <Col span={16}>
          <ClientDocumentsTable />
          <CompanyNotes style={{ marginTop: 32 }} />
        </Col>
        <Col span={8}>
          <CompanyInfoForm />
        </Col>
      </Row>
    </div>
  );
};
