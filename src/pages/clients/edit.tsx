import { Col, Row } from "antd";
import { useEffect, useState } from "react";
import {
  CompanyContactsTable,
  CompanyInfoForm,
  CompanyNotes,
  CompanyTitleForm,
} from "@/components";
import { supabaseClient } from "@/lib/supbaseClient";
import { ICompany } from "@/types/client";
import { useParams } from "react-router-dom";

const defaultCompany: ICompany = {
  id: "",
  name: "",
  avatar_url: "",
  email: "",
  address: "",
  contact: "",
  date_of_birth: "",
  gender: "",
  nationality: "",
};

export const ClientEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const [company, setCompany] = useState<ICompany>(defaultCompany);
  const [users, setUsers] = useState<{ id: any; name: any; avatar_url: any }[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [{ data: companyData }, { data: usersData }] = await Promise.all([
        supabaseClient.from("clients").select("*").eq("id", id).single(),
        supabaseClient.from("clients").select("*"),
      ]);

      setCompany(companyData || null);
      setUsers(usersData || []);
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div className="page-container">
      <CompanyTitleForm company={company} users={users} loading={loading} />
      <Row gutter={[32, 32]} style={{ marginTop: 32 }}>
        <Col span={16}>
          <CompanyContactsTable
            companyId={company?.id || ""}
            loading={loading}
          />
          <CompanyNotes style={{ marginTop: 32 }} />
        </Col>
        <Col span={8}>
          <CompanyInfoForm company={company} />
        </Col>
      </Row>
    </div>
  );
};
