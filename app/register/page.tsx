"use client";

import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import { Button, Form, Input } from "antd";

const Register: React.FC = () => {
  const router = useRouter();
  const apiService = useApi();
  const [form] = Form.useForm();

  const handleRegister = async (values: { username: string; password: string }) => {
    try {
      await apiService.post("/users/register", values);
      alert("Registration successful! You can now log in.");
      router.push("/login"); // Nach erfolgreicher Registrierung zum Login weiterleiten
    } catch (error: unknown) {
        if (error instanceof Error) {
          alert("Registration failed: " + error.message);
        } else {
          alert("An unknown error occurred during registration.");
        }
      }
      
  };

  return (
    <div className="register-container">
      <Form form={form} name="register" size="large" layout="vertical" onFinish={handleRegister}>
        <Form.Item name="username" label="Username" rules={[{ required: true }]}>
          <Input placeholder="Enter username" />
        </Form.Item>
        <Form.Item name="password" label="Password" rules={[{ required: true }]}>
          <Input.Password placeholder="Enter password" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">Register</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Register;
