// your code here for S2 to display a single user profile after having clicked on it
// each user has their own slug /[id] (/1, /2, /3, ...) and is displayed using this file
// try to leverage the component library from antd by utilizing "Card" to display the individual user
// import { Card } from "antd"; // similar to /app/users/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, Spin, Alert, Button } from "antd";
import { useApi } from "@/hooks/useApi";
import { User } from "@/types/user";

const UserProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const apiService = useApi();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const fetchedUser: User = await apiService.get<User>(`/users/${id}`);
        setUser(fetchedUser);
      } catch (err: any) {
        setError(err.message || "Error loading");
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
        <Spin tip="Lade Userdaten..." />
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
        <Alert message="Fehler" description={error} type="error" showIcon />
      </div>
    );
  }

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
            <strong>Birthday:</strong>{" "}
            {user?.birthday ? user.birthday : "N/A"}
          </p>
        </Card>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <Button
            type="primary"
            className="auth-button"
            onClick={() => router.push("/users")}
          >
            Back
          </Button>
          <Button
            type="primary"
            className="auth-button"
            onClick={() => alert("Edit functionality not implemented yet")}
          >
            Edit
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

