import React, { useState } from "react";
import { Form, Input, Button, notification, Space } from "antd";
import { useCreate } from "@refinedev/core";
import { useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Create, useForm } from "@refinedev/antd";

// Define types for the form data
interface Service {
  name: string;
}

interface VendorFormData {
  company_name: string;
  contact_person: string;
  phone_number: number;
  email: string;
  address: string;
  services_offered: Service[];
}

const VendorCreate: React.FC = () => {
  const { formProps, saveButtonProps } = useForm<VendorFormData>();
  const [services, setServices] = useState<Service[]>([]); // State to manage services array
  const { mutate } = useCreate({ resource: "vendors" });
  const navigate = useNavigate();

  // Function to handle adding new services
  const addService = () => {
    setServices([...services, { name: "Test Service" }]);
  };

  // Function to handle service name change
  const handleServiceChange = (index: number, value: string) => {
    const newServices = [...services];
    newServices[index].name = value;
    setServices(newServices);
  };

  // Function to handle removing a service
  const removeService = (index: number) => {
    const newServices = services.filter((_, i) => i !== index);
    setServices(newServices);
  };

  // Handle form submission
  const handleSave = async (values: VendorFormData) => {
    const vendorData = {
      ...values,
      services_offered: services.map((service) => service.name),
    };

    try {
      await mutate(
        { values: vendorData },
        {
          onSuccess: async () => {
            formProps.form?.resetFields(); // Reset the form
            navigate("/vendors"); // Navigate to the vendors page
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
        {/* Company Name Field */}
        <Form.Item
          label="Company Name"
          name="company_name"
          rules={[{ required: true, message: "Please enter the company name" }]}
        >
          <Input placeholder="Enter company name" />
        </Form.Item>

        {/* Contact Person Field */}
        <Form.Item
          label="Contact Person"
          name="contact_person"
          rules={[
            { required: true, message: "Please enter the contact person" },
          ]}
        >
          <Input placeholder="Enter contact person's name" />
        </Form.Item>
        <div className="create-page-bottom-fields-container">
          {/* Email Field */}
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                type: "email",
                message: "Please enter a valid email",
              },
            ]}
          >
            <Input placeholder="Enter email" />
          </Form.Item>
          {/* Phone Number Field */}
          <Form.Item
            label="Phone Number"
            name="contact_number"
            rules={[
              { required: true, message: "Please enter the phone number" },
            ]}
          >
            <div className="phone-input-container">
              <PhoneInput
                country={"us"} // Default country code, can be dynamically set
                value={formProps.form?.getFieldValue("phone_number")}
                onChange={(value) =>
                  formProps.form?.setFieldValue("phone_number", value)
                }
                placeholder="Enter phone number"
              />
            </div>
          </Form.Item>
        </div>

        {/* Address Field */}
        <Form.Item
          label="Address"
          name="address"
          rules={[{ required: true, message: "Please enter the address" }]}
        >
          <Input.TextArea placeholder="Enter address" rows={4} />
        </Form.Item>

        {/* Services Offered */}
        <Form.Item
          label="Services Offered"
          rules={[{ required: true}]}
          validateStatus={
            services.length === 0 ||
            services.some((service) => !service.name.trim())
              ? "error"
              : ""
          }
          help={
            services.length === 0
              ? "Please add at least one service to proceed."
              : services.some((service) => !service.name.trim())
              ? "All service fields must be filled out"
              : ""
          }
        >
          <Button
            variant="filled"
            color="primary"
            onClick={addService}
            block
            style={{ maxWidth: "150px", marginBottom: "20px" }}
          >
            Add Service
          </Button>
          <div className="services-container">
            {services.map((service, index) => (
              <Space
                key={index}
                style={{ display: "flex", marginBottom: 8 }}
                align="baseline"
              >
                <Form.Item
                  style={{ marginBottom: 0 }}
                  validateStatus={!service.name.trim() ? "error" : ""}
                  help={!service.name.trim() ? "Service name is required" : ""}
                >
                  <Input
                    placeholder="Service Name"
                    value={service.name}
                    onChange={(e) => handleServiceChange(index, e.target.value)}
                  />
                </Form.Item>
                <Button
                  variant="filled"
                  onClick={() => removeService(index)}
                  color="danger"
                >
                  Delete
                </Button>
              </Space>
            ))}
          </div>
        </Form.Item>
      </Form>
    </Create>
  );
};

export default VendorCreate;
