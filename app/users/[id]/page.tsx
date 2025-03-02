// your code here for S2 to display a single user profile after having clicked on it
// each user has their own slug /[id] (/1, /2, /3, ...) and is displayed using this file
// try to leverage the component library from antd by utilizing "Card" to display the individual user
// import { Card } from "antd"; // similar to /app/users/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, Spin, Alert, Button } from "antd";
import { useApi } from "@/hooks/useApi";
import useLocalStorage from "@/hooks/useLocalStorage";
import { User } from "@/types/user";

interface FormFieldProps {
  label: string;
  value: string;
}

const UserProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const apiService = useApi();

  const { value: loggedInUserId } = useLocalStorage<number>("userId", 0);

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const fetchedUser: User = await apiService.get<User>(`/users/${id}`);
        setUser(fetchedUser);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Error loading user data");
        }
      } finally {
        setLoading(false);
      }
    };
  
    fetchUser();
  }, [apiService, id]);

  if (loading) {
    return (
      <div
        className="auth-container"
        style={{
          width: "100%",
          minHeight: "100vh",
          padding: "20px",
        }}
      >
        <Spin tip="Loading user data..." />
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="auth-container"
        style={{
          width: "100%",
          minHeight: "100vh",
          padding: "20px",
        }}
      >
        <Alert message="Error" description={error} type="error" showIcon />
      </div>
    );
  }

  const isOwnProfile = Number(id) === loggedInUserId;

  return (
    <div
      className="auth-container"
      style={{
        width: "100%",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <div
        style={{
          maxWidth: "600px",
          margin: "0 auto",
        }}
      >
        <Card
          title={`User Profile: ${user?.username}`}
          bordered={false}
          style={{ marginBottom: "20px" }}
        >
          <p>
            <strong>ID:</strong> {user?.id}
          </p>
          <p>
            <strong>Username:</strong> {user?.username}
          </p>
          <p>
            <strong>Creation Date:</strong> {user?.creationDate}
          </p>
          <p>
            <strong>Status:</strong> {user?.status}
          </p>
          <p>
            <strong>Birthday:</strong> {user?.birthday ? user.birthday : "N/A"}
          </p>
        </Card>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          {isOwnProfile && (
            <Button
              type="primary"
              className="auth-button"
              onClick={() => router.push(`/users/${id}/edit`)}
            >
              Edit
            </Button>
          )}
          <Button
            type="primary"
            className="auth-button"
            onClick={() => router.push("/users")}
          >
            Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

