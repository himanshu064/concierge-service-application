import authProvider from "@/lib/authProvider";
import { AuthPage } from "@refinedev/antd";
import React from "react";

export const RegisterPage = () => {
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
          authProvider.register?.({name: nameElement.value, ...values });
        },
      }}
    
      renderContent={(content: React.ReactNode) => {
        // Check if content is a ReactElement
        if (React.isValidElement(content)) {
          // Explicitly type content as React.ReactElement
          const clonedContent = React.cloneElement(
            content as React.ReactElement, // Explicit type cast
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
                      className="ant-input ant-input-lg ant-input-outlined"
                      placeholder="Enter your name"
                      style={{
                        width: "100%",
                        padding: "8px",
                        margin: "8px 0",
                        borderRadius: "4px",
                        border: "1px solid #ccc",
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

        // If content is not a ReactElement, render it as-is
        return content;
      }}
    />
  );
};
