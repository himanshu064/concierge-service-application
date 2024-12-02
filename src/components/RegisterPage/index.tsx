import { AuthPage } from "@refinedev/antd";
import React from "react";

import authProvider from "@/lib/authProvider";
import { useNavigate } from "react-router-dom";

export const RegisterPage = () => {
  const navigate = useNavigate();

  return (
    <AuthPage
      type="register"
      formProps={{
        initialValues: {
          username: "",
          email: "",
          password: "",
        },
        onFinish: (values) => {
          const nameElement = document.querySelectorAll(
            "#register-form #name"
          )[0] as HTMLInputElement;
          authProvider.register?.({ name: nameElement.value, ...values }).then(()=>{
            navigate("/login");
          })
        },
      }}
      renderContent={(content: React.ReactNode) => {
        if (React.isValidElement(content)) {
          const clonedContent = React.cloneElement(
            content as React.ReactElement,
            {
              children: (
                <>
                  {/* New Name Field */}
                  <div style={{ marginBottom: "16px" }} id="register-form">
                    <label htmlFor="name">Name</label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      className="ant-input ant-input-lg ant-input-outlined nameInput"
                      placeholder="Enter your name"
                      style={{
                        width: "100%",
                        padding: "11px",
                        margin: "8px 0",
                        borderRadius: "8px",
                        border: "1px solid #d9d9d9",
                        fontSize:"15px",
                      }}
                    />
                  </div>
                  {/* Render existing fields */}
                  {content.props.children}
                </>
              ),
            }
          );

          return (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {clonedContent}
            </div>
          );
        }
        return content;
      }}
    />
  );
};
