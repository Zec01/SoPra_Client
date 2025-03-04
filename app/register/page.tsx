"use client"; // For components that need React hooks and browser APIs, SSR (server side rendering) has to be disabled. Read more here: https://nextjs.org/docs/pages/building-your-application/rendering/server-side-rendering

import { useRouter } from "next/navigation"; // use NextJS router for navigation
import { useApi } from "@/hooks/useApi";
import useLocalStorage from "@/hooks/useLocalStorage";
import { User } from "@/types/user";
import { Button, Form, Input, notification } from "antd";
// Optionally, you can import a CSS module or file for additional styling:
// import styles from "@/styles/page.module.css";

interface FormFieldProps {
  label: string;
  value: string;
}

const Register: React.FC = () => {
  const router = useRouter();
  const apiService = useApi();
  const [form] = Form.useForm();
  // useLocalStorage hook example use
  // The hook returns an object with the value and two functions
  // Simply choose what you need from the hook:
  const {
    // value: token, // is commented out because we do not need the token value
    set: setToken, // we need this method to set the value of the token to the one we receive from the POST request to the backend server API
    // clear: clearToken, // is commented out because we do not need to clear the token when logging in
  } = useLocalStorage<string>("token", ""); // note that the key we are selecting is "token" and the default value we are setting is an empty string
  // if you want to pick a different token, i.e "usertoken", the line above would look as follows: } = useLocalStorage<string>("usertoken", "");
  const { set: setUserId } = useLocalStorage<number>("userId", 0);

  const handleRegister = async (values: FormFieldProps) => {
    try {
      // Call the API service and let it handle JSON serialization and error handling
      const response = await apiService.post<User>("/users", values);

      // Use the useLocalStorage hook that returned a setter function (setToken in line 41) to store the token if available
      if (response.token) {
        setToken(response.token);
      }
      if (response.id) {
        setUserId(Number(response.id));
      }
      notification.success({
        message: "Registration Successful",
        description: "You have been successfully registered and logged in.",
        placement: "topRight",
      });
      router.push("/users");
    } catch (error: unknown) {
      if (error instanceof Error) {
        notification.error({
          message: "Registration Failed",
          description: error.message || "An error occurred during registration.",
          placement: "topRight",
        });
      } else {
        notification.error({
          message: "Registration Failed",
          description: "An unknown error occurred during registration.",
          placement: "topRight",
        });
      }
    }
  };

  return (
    <div className="auth-container">
      <Form
        form={form}
        name="register"
        size="large"
        variant="outlined"
        onFinish={handleRegister}
        layout="vertical"
      >
        <Form.Item
          name="username"
          label="Username"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input placeholder="Enter username" />
        </Form.Item>
        <Form.Item
          name="name"
          label="Password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input type="password" placeholder="Enter password" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="auth-button">
            Register
          </Button>
        </Form.Item>
        <Form.Item>
          <Button type="primary" className="auth-button" onClick={() => router.push("/")}>
            Back
          </Button>
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            className="auth-button"
            onClick={() => router.push("/login")}
          >
            Already have an account? Login
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Register;