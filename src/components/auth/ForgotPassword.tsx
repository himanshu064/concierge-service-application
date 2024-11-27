import React from "react";

import {
  type ForgotPasswordFormTypes,
  type ForgotPasswordPageProps,
  useLink,
  useRouterType,
} from "@refinedev/core";
import {
  useForgotPassword,
  useRouterContext,
  useTranslate,
} from "@refinedev/core";

import {
  Button,
  Card,
  type CardProps,
  Col,
  Form,
  type FormProps,
  Input,
  Layout,
  type LayoutProps,
  Row,
  theme,
  Typography,
} from "antd";

import { containerStyles, layoutStyles, titleStyles } from "./styles";

type ResetPassworProps = ForgotPasswordPageProps<
  LayoutProps,
  CardProps,
  FormProps
>;

export const ForgotPasswordPage: React.FC<ResetPassworProps> = ({ title }) => {
  const { token } = theme.useToken();
  const [form] = Form.useForm<ForgotPasswordFormTypes>();
  const translate = useTranslate();
  const routerType = useRouterType();
  const Link = useLink();
  const { Link: LegacyLink } = useRouterContext();

  const ActiveLink = routerType === "legacy" ? LegacyLink : Link;

  const { mutate: forgotPassword, isLoading } =
    useForgotPassword<ForgotPasswordFormTypes>();

  const PageTitle =
    title === false ? null : (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "32px",
          fontSize: "20px",
        }}
      >
        {title}
      </div>
    );

  const CardTitle = (
    <Typography.Title
      level={3}
      style={{
        color: token.colorPrimaryTextHover,
        ...titleStyles,
      }}
    >
      {translate("pages.forgotPassword.title", "Forgot your password?")}
    </Typography.Title>
  );
  const CardContent = (
    <Card
      title={CardTitle}
      style={{
        ...containerStyles,
        backgroundColor: token.colorBgElevated,
      }}
    >
      <Form<ForgotPasswordFormTypes>
        layout="vertical"
        form={form}
        onFinish={(values) => forgotPassword({ ...values })}
        requiredMark={false}
      >
        <Form.Item
          name="email"
          label={translate("pages.forgotPassword.fields.email", "Email")}
          rules={[
            {
              required: true,
              message: translate(
                "pages.forgotPassword.errors.requiredEmail",
                "Email is required"
              ),
            },
            {
              type: "email",
              message: translate(
                "pages.forgotPassword.errors.validEmail",
                "Invalid email address"
              ),
            },
          ]}
        >
          <Input
            type="email"
            size="large"
            placeholder={translate(
              "pages.forgotPassword.fields.email",
              "Email"
            )}
          />
        </Form.Item>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Typography.Text
            style={{
              fontSize: 12,
              marginLeft: "auto",
            }}
          >
            {translate(
              "pages.forgotPassword.buttons.haveAccount",
              translate(
                "pages.register.buttons.haveAccount",
                "Have an account? "
              )
            )}
            <ActiveLink
              style={{
                fontWeight: "bold",
                color: token.colorPrimaryTextHover,
              }}
              to="/login"
            >
              {translate(
                "pages.forgotPassword.signin",
                translate("pages.login.signin", "Sign in")
              )}
            </ActiveLink>
          </Typography.Text>
        </div>
        <Form.Item
          style={{
            marginTop: "24px",
            marginBottom: 0,
          }}
        >
          <Button
            type="primary"
            size="large"
            htmlType="submit"
            loading={isLoading}
            block
          >
            {translate(
              "pages.forgotPassword.buttons.submit",
              "Send reset instructions"
            )}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );

  return (
    <Layout style={layoutStyles}>
      <Row
        justify="center"
        align="middle"
        style={{
          padding: "16px 0",
          minHeight: "100dvh",
        }}
      >
        <Col xs={22}>
          <>
            {PageTitle}
            {CardContent}
          </>
        </Col>
      </Row>
    </Layout>
  );
};
