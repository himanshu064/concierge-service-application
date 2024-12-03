import React, { useEffect } from "react";
import { Form, Input, Button, Card, notification } from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Text } from "@/components";
import { getUserFromInvites } from "@/services/auth";
import Loader from "@/components/Loader";
import { supabaseClient } from "@/lib/supbaseClient";
import { useCreate, useDelete } from "@refinedev/core";
import { IClient, IRegister } from "@/types/client";
import Results from "@/components/ResultPage";

const AcceptInvite: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);
  const [userData, setUserData] = React.useState<IClient>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { mutate: createClient } = useCreate({
    resource: "clients",
    mutationOptions: {
      onSuccess: () => {
        notification.success({
          description: "Your account has been verified successfully.",
          message: "Verification Successful",
        });
      },
      onError: () => {},
    },
  });

  const { mutate: deleteInvite } = useDelete();

  const fetchUserData = async (token: string) => {
    try {
      const res = await getUserFromInvites({ token });
      form.setFieldsValue({ email: res.email });
      setUserData(res);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    const token = searchParams.get("token");
    if (token) {
      fetchUserData(token);
    } else {
      setLoading(false);
    }
  }, [searchParams]);

  const handleSignup = async (values: IRegister) => {
    try {
      const res = await supabaseClient.auth.signUp({
        email: values?.email,
        password: values?.password,
      });

      if (res.error) {
        throw new Error(res.error.message);
      }

      const auth_id = res.data.user?.id;

      createClient(
        {
          values: {
            name: userData?.name,
            email: userData?.email,
            contact: userData?.contact,
            address: userData?.address,
            date_of_birth: userData?.date_of_birth,
            gender: userData?.gender,
            nationality: userData?.nationality,
            auth_id,
            is_authorized: "approved",
            register_type: "invited",
          },
        },
        {
          onSuccess: () => {
            notification.success({
              description: "Your account has been verified successfully.",
              message: "Verification Successful",
            });
          },
          onError: () => {
          },
        }
      );

      deleteInvite(
        {
          resource: "invites",
          id: userData?.id || "",
          errorNotification: false,
          successNotification: false,
        },
        {
          // onError: () => {},
          // onSuccess: () => {},
        }
      );

      navigate("/login");
    } catch (error) {
      console.error("Error during signup process:", error);
    }
  };

  if (loading) {
    return <div className="fullScreenLoader">{<Loader />}</div>;
  }

  return (
    <>
      {userData ? (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "100vh",
              backgroundColor: "#f0f2f5",
              padding: "0px !important",
            }}
          >
            <Card title="Accept Invite" style={{ width: 400 }}>
              <Text style={{ display: "block", marginBottom: "16px" }}>
                Hi <strong>{userData?.name || ""}</strong>, please create a
                password to accept the invitation and activate your account.
              </Text>
              <Form form={form} layout="vertical" onFinish={handleSignup}>
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    { required: true, message: "Please enter your email" },
                    {
                      type: "email",
                      message: "Please enter a valid email address",
                    },
                  ]}
                >
                  <Input
                    placeholder="Enter your email"
                    disabled
                    style={{
                      color: "#777",
                    }}
                  />
                </Form.Item>

                <Form.Item
                  label="Password"
                  name="password"
                  rules={[
                    { required: true, message: "Please enter your password" },
                    {
                      min: 6,
                      message: "Password must be at least 6 characters long",
                    },
                  ]}
                >
                  <Input.Password placeholder="Enter your password" />
                </Form.Item>
                <Form.Item
                  label="Confirm Password"
                  name="confirmPassword"
                  dependencies={["password"]}
                  rules={[
                    { required: true, message: "Please confirm your password" },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("password") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error("Passwords do not match")
                        );
                      },
                    }),
                  ]}
                >
                  <Input.Password placeholder="Confirm your password" />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" block>
                    Accept Invite
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </div>
        </>
      ) : (
        <>
          <div className="token-expired-page">
            <Results status="404" title="404" subTitle="Sorry, the page you visited does not exist." />
          </div>
        </>
      )}
    </>
  );
};

export default AcceptInvite;
