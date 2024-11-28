import { Create, useForm } from "@refinedev/antd";
import { Form, Input, DatePicker } from "antd";

export const ClientCreate = () => {
  const { formProps, saveButtonProps  } = useForm({
   
  });

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
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
            {
              pattern: /^[0-9]+$/,
              message: "Contact number must be numeric",
            },
          ]}
        >
          <Input placeholder="Enter client's contact number" />
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
      </Form>
    </Create>
  );
};
