import { Col, Row } from "antd";
import { useEffect, useState } from "react";
import {
  ClientDocumentsTable,
  CompanyInfoForm,
  CompanyNotes,
  CompanyTitleForm,
} from "@/components";
import { ICompany } from "@/types/client";
import { useParams } from "react-router-dom";
import { fetchClientDetailsByClientId } from "@/services/clients";

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
  const [company, setCompany] = useState<ICompany | null>(defaultCompany);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        console.error("No ID provided");
        setCompany(null);
        setLoading(false);
        return;
      }

      try {
        const { data: companyData, error } = await fetchClientDetailsByClientId(
          id
        );

        if (error) {
          console.error("Error fetching data:", error);
          setCompany(null);
        } else {
          setCompany(companyData?.[0]);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        setCompany(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return (
    <div className="page-container">
      <CompanyTitleForm
        company={company}
        loading={loading}
        onUpdateCompany={(updatedCompany: ICompany) =>
          setCompany(updatedCompany)
        }
      />
      <Row gutter={[32, 32]} style={{ marginTop: 32 }}>
        <Col span={16}>
          <ClientDocumentsTable
            clientId={company?.id || ""}
            loading={loading}
          />
          <CompanyNotes style={{ marginTop: 32 }} />
        </Col>
        <Col span={8}>
          <CompanyInfoForm
            company={company}
            loading={loading}
            onUpdateCompany={(updatedCompany: ICompany) =>
              setCompany(updatedCompany)
            }
          />
        </Col>
      </Row>
    </div>
  );
};
