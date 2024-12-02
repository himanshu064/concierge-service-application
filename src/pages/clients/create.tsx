import { generateInviteLink, sendInviteEmail } from "@/services/auth";
import { Create, useForm } from "@refinedev/antd";
import { useCreate } from "@refinedev/core";
import { Form, Input, DatePicker, notification, Select } from "antd";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css"; // Optional: Import the styles for the phone input
import { IInvitesRecord } from "@/types/client";

export const ClientCreate = () => {
  const { formProps, saveButtonProps } = useForm<IInvitesRecord>();

  const { mutate } = useCreate({
    resource: "invites",
  });
  const navigate = useNavigate();

  const handleSave = async (values: IInvitesRecord) => {
    // Generate a unique token
    const token = uuidv4();

    // Set token expiration (e.g., 1 hours from now)
    const expires_at = new Date();

    expires_at.setHours(expires_at.getHours() + 6.5);
    const clientInfo = {
      ...values,
      token: token,
      expires_at: expires_at,
    };
    try {
      await mutate(
        { values: clientInfo },
        {
          onSuccess: async () => {
            formProps.form?.resetFields(); // Reset the form
            const inviteLink = await generateInviteLink({ token: token });
            await sendInviteEmail({
              email: values.email,
              inviteLink: inviteLink || "",
            });
            navigate("/clients"); // Navigate to the clients page
          },
        }
      );
    } catch (error) {
      console.error("Unexpected error:", error);
      notification.error({
        message: "Unexpected Error",
        description: "An unexpected error occurred. Please try again later.",
      });
    }
  };

  return (
    <Create
      saveButtonProps={{
        ...saveButtonProps,
        onClick: () => formProps.form?.submit(),
      }}
    >
      <Form
        {...formProps}
        layout="vertical"
        onFinish={handleSave}
        form={formProps.form}
        onValuesChange={() => {
          // Manually clear the browser's "unsaved changes" flag
          window.onbeforeunload = null;
        }}
      >
        {/* Name Field */}
        <Form.Item
          label={"Name"}
          name={["name"]}
          rules={[
            {
              required: true,
              message: "Please enter the name",
            },
          ]}
        >
          <Input placeholder="Enter client's name" />
        </Form.Item>

        {/* Email Field */}
        <Form.Item
          label={"Email"}
          name={["email"]}
          rules={[
            {
              required: true,
              type: "email",
              message: "Please enter a valid email",
            },
          ]}
        >
          <Input placeholder="Enter client's email" />
        </Form.Item>

        {/* Contact Field */}
        <Form.Item
          label={"Contact"}
          name={["contact"]}
          rules={[
            {
              required: true,
              message: "Please enter the contact number",
            },
          ]}
        >
          <div className="phone-input-container">
            <PhoneInput
              country={"us"} // Default country code, can be dynamically set
              value={formProps.form?.getFieldValue(["contact"])} // Make sure form data is synced
              onChange={(value) =>
                formProps.form?.setFieldValue(["contact"], value)
              } // Update form state
              placeholder="Enter client's contact number"
            />
          </div>
        </Form.Item>
        {/* Address Field */}
        <Form.Item
          label={"Address"}
          name={["address"]}
          rules={[
            {
              required: true,
              message: "Please enter the address",
            },
          ]}
        >
          <Input.TextArea placeholder="Enter client's address" rows={4} />
        </Form.Item>

        {/* Date of Birth Field */}
        <Form.Item
          label={"Date of Birth"}
          name={["date_of_birth"]}
          rules={[
            {
              required: true,
              message: "Please select the date of birth",
            },
          ]}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>
        <div className="create-page-bottom-fields-container">
          {/* Gender  */}
          <Form.Item
            label={"Gender"}
            name={["gender"]}
            rules={[
              {
                required: true,
                message: "Please select the gender",
              },
            ]}
          >
            <Select placeholder="Select client's gender">
              <Select.Option value="male">Male</Select.Option>
              <Select.Option value="female">Female</Select.Option>
              <Select.Option value="others">Rather not say</Select.Option>
            </Select>
          </Form.Item>

          {/* Nationaliy */}
          <Form.Item
            label={"Nationality"}
            name={["nationality"]}
            rules={[
              {
                required: true,
                message: "Please enter the Nationality",
              },
            ]}
          >
            <Input placeholder="Enter client's Nationality" />
          </Form.Item>
        </div>
      </Form>
    </Create>
  );
};
