import React, { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "@refinedev/antd";
import {
  Button,
  Card,
  Form,
  Input,
  notification,
  Space,
  Typography,
  Popconfirm,
} from "antd";
import { LoadingOutlined, OrderedListOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { CustomAvatar, Text } from "@/components";
import { supabaseClient } from "@/lib/supbaseClient";
import { useGetIdentity } from "@refinedev/core";
import { ICompany, INotes } from "@/types/client";

type Props = {
  style?: React.CSSProperties;
};

export const CompanyNotes: FC<Props> = ({ style }) => {
  const [notes, setNotes] = useState<INotes[]>([]);
  const { data: me } = useGetIdentity<ICompany>();
  const [clientData, setClientData] = useState<INotes>();
  const [editingNoteId, setEditingNoteId] = useState<string | null>("");

  useEffect(() => {
    const fetchClientData = async () => {
      if (!me?.id) return;

      try {
        const { data, error } = await supabaseClient
          .from("clients")
          .select("*")
          .eq("auth_id", me.id);

        if (error) {
          console.error("Error fetching client data:", error);
        } else if (data) {
          setClientData(data?.[0]);
        }
      } catch (error) {
        console.error("Unexpected error:", error);
      }
    };

    fetchClientData();
  }, [me?.id]);

  return (
    <Card
      title={
        <Space size={16}>
          <OrderedListOutlined style={{ width: "24px", height: "24px" }} />
          <Text>Notes</Text>
        </Space>
      }
      style={style}
    >
      <CompanyNoteForm
        setNotes={setNotes}
        clientData={clientData}
        me={me}
        editingNoteId={editingNoteId}
        setEditingNoteId={setEditingNoteId}
      />
      <CompanyNoteList
        notes={notes}
        setNotes={setNotes}
        clientData={clientData}
        me={me}
        editingNoteId={editingNoteId}
        setEditingNoteId={setEditingNoteId}
      />
    </Card>
  );
};

export const CompanyNoteForm = ({
  setNotes,
  clientData,
  me,
  editingNoteId,
  setEditingNoteId,
}: {
  setNotes: React.Dispatch<React.SetStateAction<INotes[]>>;
  clientData: INotes | undefined;
  me: ICompany | undefined;
  editingNoteId: string | null;
  setEditingNoteId: React.Dispatch<React.SetStateAction<string | null>>;
}) => {
  const { id: companyId } = useParams();
  const { formProps, form, formLoading } = useForm({
    action: editingNoteId ? "edit" : "create",
    resource: "notes",
    redirect: false,
    mutationMode: "optimistic",
    successNotification: () => ({
      key: "company-note",
      message: editingNoteId
        ? "Successfully updated note"
        : "Successfully added note",
      description: "Successful",
      type: "success",
    }),
  });

  const handleOnFinish = async (values: INotes) => {
    if (!companyId || !values?.text?.trim()) {
      return;
    }

    try {
      if (editingNoteId) {
        // Update existing note
        const { error } = await supabaseClient
          .from("notes")
          .update({ text: values.text.trim() })
          .eq("id", editingNoteId);

        if (error) throw error;

        notification.success({
          message: "Note Updated",
          description: "Your note was successfully updated.",
        });

        setNotes((prevNotes) =>
          prevNotes.map((note) =>
            note.id === editingNoteId
              ? { ...note, text: values?.text?.trim() }
              : note
          )
        );
      } else {
        // Create new note
        const { data, error } = await supabaseClient
          .from("notes")
          .insert([
            {
              created_by: clientData?.name,
              user_id: clientData?.id,
              text: values.text.trim(),
              created_at: new Date().toISOString(),
            },
          ])
          .select("*")
          .single();

        if (error) throw error;

        notification.success({
          message: "Note Added",
          description: "Your note was successfully added.",
        });

        setNotes((prevNotes) => [
          {
            id: data?.id,
            created_by: clientData?.name,
            user_id: clientData?.id,
            text: values?.text?.trim(),
            created_at: new Date(),
          },
          ...prevNotes,
        ]);
      }
      form.resetFields();
      setEditingNoteId(null);
    } catch (error) {
      console.error("Error saving note:", error);
      notification.error({
        message: "Error Saving Note",
        description: "There was an error saving your note. Please try again.",
      });
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
        src={me?.avatar_url || ""}
      />
      <Form {...formProps} style={{ width: "100%" }} onFinish={handleOnFinish}>
        <Form.Item
          name="text"
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

export const CompanyNoteList = ({
  notes,
  setNotes,
  clientData,
  editingNoteId,
  setEditingNoteId,
}: {
  notes: INotes[];
  setNotes: React.Dispatch<React.SetStateAction<INotes[]>>;
  clientData: INotes | undefined;
  me: ICompany | undefined;
  editingNoteId: string | null;
  setEditingNoteId: React.Dispatch<React.SetStateAction<string | null>>;
}) => {
  useEffect(() => {
    const fetchNotes = async () => {
      const userId = clientData?.id;
      if (userId) {
        const { data, error } = await supabaseClient
          .from("notes")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching notes:", error);
        } else if (data) {
          setNotes(data as INotes[]);
        }
      }
    };

    fetchNotes();
  }, [clientData, setNotes]);

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
        const isMe = clientData?.id === item.user_id;
        return (
          <div key={item.id} style={{ display: "flex", gap: "12px" }}>
            <CustomAvatar
              style={{ flexShrink: 0 }}
              name={item.created_by}
              src={""}
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
              {editingNoteId === item.id ? (
                <Form
                  initialValues={{ text: item.text }}
                  onFinish={async (values) => {
                    try {
                      const { error } = await supabaseClient
                        .from("notes")
                        .update({ text: values.text })
                        .eq("id", item.id);

                      if (error) throw error;

                      setNotes((prevNotes) =>
                        prevNotes.map((note) =>
                          note.id === item.id
                            ? { ...note, text: values.text }
                            : note
                        )
                      );

                      notification.success({
                        message: "Note Updated",
                        description: "Your note was successfully updated.",
                      });
                      setEditingNoteId(null);
                    } catch (error) {
                      console.error("Error updating note:", error);
                      notification.error({
                        message: "Error Updating Note",
                        description:
                          "There was an error updating your note. Please try again.",
                      });
                    }
                  }}
                >
                  <Form.Item
                    name="text"
                    rules={[
                      {
                        required: true,
                        transform: (value) => value?.trim(),
                        message: "Please enter a note",
                      },
                    ]}
                  >
                    <Input.TextArea
                      autoFocus
                      style={{
                        boxShadow: "0px 1px 2px 0px rgba(0, 0, 0, 0.03)",
                        background: "#fff",
                        borderRadius: "6px",
                        padding: "8px",
                      }}
                    />
                  </Form.Item>
                  <Space>
                    <Button type="primary" htmlType="submit">
                      Save
                    </Button>
                    <Button
                      type="default"
                      onClick={() => setEditingNoteId(null)}
                    >
                      Cancel
                    </Button>
                  </Space>
                </Form>
              ) : (
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
                  {item.text}
                </Typography.Paragraph>
              )}

              {isMe && (
                <Space size={16}>
                  <Typography.Link
                    type="secondary"
                    style={{ fontSize: "12px" }}
                    onClick={() => setEditingNoteId(item?.id || null)}
                  >
                    Edit
                  </Typography.Link>
                  <Popconfirm
                    title="Are you sure you want to delete this note?"
                    onConfirm={async () => {
                      try {
                        const { error } = await supabaseClient
                          .from("notes")
                          .delete()
                          .eq("id", item.id);

                        if (error) throw error;

                        setNotes((prevNotes) =>
                          prevNotes.filter((n) => n.id !== item.id)
                        );

                        notification.success({
                          message: "Note Deleted",
                          description: "Your note was successfully deleted.",
                        });
                      } catch (error) {
                        console.error("Error deleting note:", error);
                        notification.error({
                          message: "Error Deleting Note",
                          description:
                            "There was an error deleting your note. Please try again.",
                        });
                      }
                    }}
                    onCancel={() => console.log("Delete cancelled")}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button type="link" danger>
                      Delete
                    </Button>
                  </Popconfirm>
                </Space>
              )}
            </div>
          </div>
        );
      })}
    </Space>
  );
};
