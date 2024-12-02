import React, { FC, useState } from "react";
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
import {
  useCreate,
  useGetIdentity,
  useList,
  useDelete,
  useUpdate,
} from "@refinedev/core";
import dayjs from "dayjs";

import { CustomAvatar, Text } from "@/components";
import { IClient, INotes } from "@/types/client";

type Props = {
  style?: React.CSSProperties;
};

export const NotesSection: FC<Props> = ({ style }) => {
  const { data } = useGetIdentity<IClient>();
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const id = useParams().id;

  const { data: client } = useList<IClient>({
    resource: "clients",
    queryOptions: {
      enabled: !!data?.id,
    },
    meta: {
      fields: ["*"],
    },
    filters: [
      {
        field: "auth_id",
        operator: "eq",
        value: data?.id,
      },
    ],
  });

  const { data: notesData } = useList<INotes[]>({
    resource: "notes",
    filters: [
      {
        field: "user_id",
        operator: "eq",
        value: id,
      },
    ],
    sorters: [
      {
        field: "created_at",
        order: "desc",
      },
    ],
  });

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
      <NoteForm
        client={client?.data?.[0]}
        clientAuthData={data}
        editingNoteId={editingNoteId}
        setEditingNoteId={setEditingNoteId}
      />
      <NoteList
        notes={(notesData?.data as INotes[]) || []}
        client={client?.data?.[0]}
        editingNoteId={editingNoteId}
        setEditingNoteId={setEditingNoteId}
      />
    </Card>
  );
};

export const NoteForm = ({
  client,
  clientAuthData,
  editingNoteId,
  setEditingNoteId,
}: {
  client: IClient | undefined;
  clientAuthData: IClient | undefined;
  editingNoteId: string | null;
  setEditingNoteId: React.Dispatch<React.SetStateAction<string | null>>;
}) => {
  const { id: clientId } = useParams();
  const [loading, setLoading] = useState(false);
  const { mutate: addNote } = useCreate();
  const { mutate: updateNote } = useUpdate();

  const { formProps, form } = useForm({
    action: editingNoteId ? "edit" : "create",
    resource: "notes",
    redirect: false,
    mutationMode: "optimistic",
    successNotification: () => ({
      key: "client-note",
      message: editingNoteId
        ? "Successfully updated note"
        : "Successfully added note",
      description: "Successful",
      type: "success",
    }),
  });

  const handleOnFinish = async (values: INotes) => {
    if (!clientId || !values?.text?.trim()) {
      return;
    }
    setLoading(true);
    try {
      if (editingNoteId) {
        await updateNote({
          resource: "notes",
          id: editingNoteId,
          values: { text: values.text.trim() },
        });
      } else {
        await addNote({
          resource: "notes",
          values: {
            created_by: client?.id,
            user_id: clientId,
            text: values.text.trim(),
            created_at: new Date().toISOString(),
          },
        });
      }
      form.resetFields();
      setEditingNoteId(null);
    } catch (error) {
      console.error("Error saving note:", error);
    } finally {
      setLoading(false);
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
        name={clientAuthData?.name}
        src={""}
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
            addonAfter={loading && <LoadingOutlined />}
          />
        </Form.Item>
      </Form>
    </div>
  );
};

export const NoteList = ({
  notes,
  // client,
  editingNoteId,
  setEditingNoteId,
}: {
  notes: INotes[];
  client: IClient | undefined;
  editingNoteId: string | null;
  setEditingNoteId: React.Dispatch<React.SetStateAction<string | null>>;
}) => {
  const { mutate: deleteNote } = useDelete();
  const { mutate: updateNote } = useUpdate();
  const { data: clientsData } = useList({ resource: "clients" });

  const mergedNotes = notes?.map((note) => {
    const matchedClient = clientsData?.data.find(
      (client) => client.id === note.created_by
    );
    return { ...note, client: matchedClient };
  });

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
      {mergedNotes?.map((item) => {
        // const isMe = client?.id === item.user_id;
        return (
          <div key={item.id} style={{ display: "flex", gap: "12px" }}>
            <CustomAvatar
              style={{ flexShrink: 0 }}
              name={item.client?.name}
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
                <Text style={{ fontWeight: 500 }}>{item?.client?.name}</Text>
                <Text size="xs" style={{ color: "#000000a6" }}>
                  {dayjs(item.created_at).format("MMMM D, YYYY - h:ma")}
                </Text>
              </div>
              {editingNoteId === item.id ? (
                <Form
                  initialValues={{ text: item.text }}
                  onFinish={async (values) => {
                    try {
                      await updateNote({
                        resource: "notes",
                        id: item.id,
                        values: { text: values.text },
                      });
                      setEditingNoteId(null);
                    } catch (error) {
                      console.error("Error updating note:", error);
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

              {editingNoteId !== item.id && (
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
                      if (!item.id) {
                        notification.error({
                          message: "Error Deleting Note",
                          description:
                            "Note ID is missing. Cannot delete the note.",
                        });
                        return;
                      }

                      try {
                        await deleteNote({
                          resource: "notes",
                          id: item.id,
                        });
                      } catch (error) {
                        console.error("Error deleting note:", error);
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
