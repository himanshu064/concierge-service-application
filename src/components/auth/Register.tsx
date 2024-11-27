import React from "react";

import {
  type RegisterFormTypes,
  type RegisterPageProps,
  useActiveAuthProvider,
  useLink,
  useRouterType,
} from "@refinedev/core";
import { useRegister, useRouterContext, useTranslate } from "@refinedev/core";

// import { ThemedTitleV2 } from "@components";
import {
  Button,
  Card,
  type CardProps,
  Col,
  Divider,
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

type RegisterProps = RegisterPageProps<LayoutProps, CardProps, FormProps>;

export const RegisterPage: React.FC<RegisterProps> = ({ providers, title }) => {
  const { token } = theme.useToken();
  const [form] = Form.useForm<RegisterFormTypes>();
  const translate = useTranslate();
  const routerType = useRouterType();
  const Link = useLink();
  const { Link: LegacyLink } = useRouterContext();

  const ActiveLink = routerType === "legacy" ? LegacyLink : Link;

  const authProvider = useActiveAuthProvider();
  const { mutate: register, isLoading } = useRegister<RegisterFormTypes>({
    v3LegacyAuthProviderCompatible: Boolean(authProvider?.isLegacy),
  });

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
      {translate("pages.register.title", "Sign up for your account")}
    </Typography.Title>
  );

  const renderProviders = () => {
    if (providers && providers.length > 0) {
      return (
        <>
          {providers.map((provider) => {
            return (
              <Button
                key={provider.name}
                type="default"
                block
                icon={provider.icon}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  marginBottom: "8px",
                }}
                onClick={() =>
                  register({
                    providerName: provider.name,
                  })
                }
              >
                {provider.label}
              </Button>
            );
          })}
          {
            <Divider>
              <Typography.Text
                style={{
                  color: token.colorTextLabel,
                }}
              >
                {translate(
                  "pages.register.divider",
                  translate("pages.login.divider", "or")
                )}
              </Typography.Text>
            </Divider>
          }
        </>
      );
    }
    return null;
  };

  const CardContent = (
    <Card
      title={CardTitle}
      style={{
        ...containerStyles,
        backgroundColor: token.colorBgElevated,
      }}
    >
      {renderProviders()}
      {
        <Form<RegisterFormTypes>
          layout="vertical"
          form={form}
          onFinish={(values) => register({ ...values })}
          requiredMark={false}
        >
          <Form.Item
            name="name"
            label={translate("pages.register.name", "Name")}
            rules={[
              {
                required: true,
                message: translate(
                  "pages.register.errors.requiredName",
                  "Name is required"
                ),
              },
            ]}
          >
            <Input
              size="large"
              placeholder={translate("pages.register.fields.name", "Name")}
            />
          </Form.Item>
          <Form.Item
            name="email"
            label={translate("pages.register.email", "Email")}
            rules={[
              {
                required: true,
                message: translate(
                  "pages.register.errors.requiredEmail",
                  "Email is required"
                ),
              },
              {
                type: "email",
                message: translate(
                  "pages.register.errors.validEmail",
                  "Invalid email address"
                ),
              },
            ]}
          >
            <Input
              size="large"
              placeholder={translate("pages.register.fields.email", "Email")}
            />
          </Form.Item>
          <Form.Item
            name="password"
            label={translate("pages.register.fields.password", "Password")}
            rules={[
              {
                required: true,
                message: translate(
                  "pages.register.errors.requiredPassword",
                  "Password is required"
                ),
              },
            ]}
          >
            <Input type="password" placeholder="●●●●●●●●" size="large" />
          </Form.Item>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "24px",
            }}
          ></div>
          <Form.Item
            style={{
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
              {translate("pages.register.buttons.submit", "Sign up")}
            </Button>
          </Form.Item>
        </Form>
      }
      {
        <div
          style={{
            marginTop: 16,
          }}
        >
          <Typography.Text
            style={{
              fontSize: 12,
            }}
          >
            {translate(
              "pages.register.buttons.haveAccount",
              translate("pages.login.buttons.haveAccount", "Have an account?")
            )}{" "}
            <ActiveLink
              style={{
                fontWeight: "bold",
                color: token.colorPrimaryTextHover,
              }}
              to="/login"
            >
              {translate(
                "pages.register.signin",
                translate("pages.login.signin", "Sign in")
              )}
            </ActiveLink>
          </Typography.Text>
        </div>
      }
    </Card>
  );

  return (
    <Layout style={layoutStyles}>
      <Row
        justify="center"
        align={"middle"}
        style={{
          padding: "16px 0",
          minHeight: "100dvh",
          paddingTop: "16px",
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
