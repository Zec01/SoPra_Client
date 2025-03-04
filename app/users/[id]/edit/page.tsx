"use client";

import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Form, Button, Input, notification } from "antd";
import { useApi } from "@/hooks/useApi";
import useLocalStorage from "@/hooks/useLocalStorage";
import { User } from "@/types/user";

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
      } catch (error: unknown) {
        if (error instanceof Error) {
          notification.error({
            message: "Error Loading User",
            description: error.message,
            placement: "topRight",
            style: { width: "300px" },
          });
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
      notification.success({
        message: "Profile Updated",
        description: "Your profile has been updated successfully.",
        placement: "topRight",
        style: { width: "300px" },
      });
      router.push(`/users/${id}`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        let errorMessage = error.message;
        if (errorMessage.trim() === "400:" || errorMessage.trim() === "400: ") {
          errorMessage = "Invalid birthday format. Please use YYYY-MM-DD.";
        } else if (errorMessage.includes("Username already taken")) {
          errorMessage = "The chosen username is already taken. Please choose another one.";
        }
        notification.error({
          message: "Update Failed",
          description: errorMessage || "An error occurred while updating the profile.",
          placement: "topRight",
          style: { width: "300px" },
        });
      } else {
        notification.error({
          message: "Update Failed",
          description: "An unknown error occurred while updating the profile.",
          placement: "topRight",
          style: { width: "300px" },
        });
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
        style={{ maxWidth: 400 }}
      >
        <Form.Item
          name="username"
          label="Username"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input placeholder="Enter new username" />
        </Form.Item>
        <Form.Item name="birthday" label="Birthday (YYYY-MM-DD)">
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
