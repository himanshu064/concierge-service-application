import { FC } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "@refinedev/antd";
import { Button, Card, Form, Input, Space, Typography } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { CustomAvatar, Text, TextIcon } from "@/components";
import { supabaseClient } from "@/lib/supbaseClient";
import { useGetIdentity } from "@refinedev/core";

type Props = {
  style?: React.CSSProperties;
};

export const CompanyNotes: FC<Props> = ({ style }) => {
  return (
    <Card
      bodyStyle={{ padding: "0" }}
      headStyle={{ borderBottom: "1px solid #D9D9D9" }}
      title={
        <Space size={16}>
          <TextIcon style={{ width: "24px", height: "24px" }} />
          <Text>Notes</Text>
        </Space>
      }
      style={style}
    >
      <CompanyNoteForm />
      <CompanyNoteList />
    </Card>
  );
};

export const CompanyNoteForm = () => {
  const { id: companyId } = useParams();
  const { data: me } = useGetIdentity();

  const { formProps, form, formLoading } = useForm({
    action: "create",
    resource: "companyNotes",
    redirect: false,
    mutationMode: "optimistic",
    successNotification: () => ({
      key: "company-note",
      message: "Successfully added note",
      description: "Successful",
      type: "success",
    }),
  });

  const handleOnFinish = async (values) => {
    if (!companyId || !values.note.trim()) {
      return;
    }

    try {
      const { error } = await supabaseClient.from("company_notes").insert([
        {
          company_id: companyId,
          created_by: me.id,
          note: values.note.trim(),
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;
      form.resetFields();
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "1rem",
        borderBottom: "1px solid #F0F0F0",
      }}
    >
      <CustomAvatar
        style={{ flexShrink: 0 }}
        name={me?.name}
        src={me?.avatarUrl}
      />
      <Form {...formProps} style={{ width: "100%" }} onFinish={handleOnFinish}>
        <Form.Item
          name="note"
          noStyle
          rules={[
            {
              required: true,
              transform: (value) => value?.trim(),
              message: "Please enter a note",
            },
          ]}
        >
          <Input
            placeholder="Add your note"
            style={{ backgroundColor: "#fff" }}
            addonAfter={formLoading && <LoadingOutlined />}
          />
        </Form.Item>
      </Form>
    </div>
  );
};

export const CompanyNoteList = () => {
  const params = useParams();
  const { data: me } = useGetIdentity();

  const [notes, setNotes] = React.useState([]);

  React.useEffect(() => {
    const fetchNotes = async () => {
      const { data, error } = await supabaseClient
        .from("company_notes")
        .select(`id, created_by, note, created_at`)
        .eq("company_id", params.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching notes:", error);
      } else {
        setNotes(data);
      }
    };

    fetchNotes();
  }, [params.id]);

  return (
    <Space
      size={16}
      direction="vertical"
      style={{
        borderRadius: "8px",
        backgroundColor: "#FAFAFA",
        padding: "1rem",
        width: "100%",
      }}
    >
      {notes.map((item) => {
        const isMe = me?.id === item.created_by;

        return (
          <div key={item.id} style={{ display: "flex", gap: "12px" }}>
            <CustomAvatar
              style={{ flexShrink: 0 }}
              name={item.created_by}
              src={item.created_by?.avatarUrl}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                width: "100%",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text style={{ fontWeight: 500 }}>{item.created_by}</Text>
                <Text size="xs" style={{ color: "#000000a6" }}>
                  {dayjs(item.created_at).format("MMMM D, YYYY - h:ma")}
                </Text>
              </div>
              <Typography.Paragraph
                style={{
                  boxShadow: "0px 1px 2px 0px rgba(0, 0, 0, 0.03)",
                  background: "#fff",
                  borderRadius: "6px",
                  padding: "8px",
                  marginBottom: 0,
                }}
                ellipsis={{ rows: 3, expandable: true }}
              >
                {item.note}
              </Typography.Paragraph>
              {isMe && (
                <Space size={16}>
                  <Typography.Link
                    type="secondary"
                    style={{ fontSize: "12px" }}
                  >
                    Edit
                  </Typography.Link>
                  <Button
                    type="link"
                    danger
                    onClick={async () => {
                      const { error } = await supabaseClient
                        .from("company_notes")
                        .delete()
                        .eq("id", item.id);
                      if (error) console.error("Error deleting note:", error);
                      else setNotes(notes.filter((n) => n.id !== item.id));
                    }}
                  >
                    Delete
                  </Button>
                </Space>
              )}
            </div>
          </div>
        );
      })}
    </Space>
  );
};
