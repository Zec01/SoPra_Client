"use client";

import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Form, Button, Input } from "antd";
import { useApi } from "@/hooks/useApi";
import { User } from "@/types/user";

interface FormFieldProps {
  label: string;
  value: string;
}

const EditUser: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const apiService = useApi();
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user: User = await apiService.get<User>(`/users/${id}`);
        form.setFieldsValue({
          username: user.username || "",
          birthday: user.birthday || "",
        });
      } catch (error) {
        if (error instanceof Error) {
          alert(`Something went wrong while loading the user:\n${error.message}`);
        } else {
          console.error("An unknown error occurred while loading the user.");
        }
      }
    };
    fetchUser();
  }, [apiService, id, form]);

  const onFinish = async (values: { username: string; birthday: string }) => {
    try {
      await apiService.put(`/users/${id}`, {
        username: values.username,
        birthday: values.birthday || null,
      });
      router.push(`/users/${id}`);
    } catch (error) {
      if (error instanceof Error) {
        alert(`Something went wrong while updating the user:\n${error.message}`);
      } else {
        console.error("An unknown error occurred while updating the user.");
      }
    }
  };

  return (
    <div className="auth-container">
      <Form
        form={form}
        name="edit-user"
        size="large"
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item
          name="username"
          label="Username"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input placeholder="Enter new username" />
        </Form.Item>
        <Form.Item
          name="birthday"
          label="Birthday (YYYY-MM-DD)"
        >
          <Input placeholder="YYYY-MM-DD" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="auth-button">
            Save
          </Button>
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            className="auth-button"
            onClick={() => router.push(`/users/${id}`)}
          >
            Back
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditUser;
