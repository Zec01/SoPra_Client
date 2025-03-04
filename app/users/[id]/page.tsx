"use client"; // For components that need React hooks and browser APIs, SSR (server side rendering) has to be disabled.

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, Button, message } from "antd";
import { useApi } from "@/hooks/useApi";
import useLocalStorage from "@/hooks/useLocalStorage";
import { User } from "@/types/user";

const UserProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const apiService = useApi();
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string>("");

  const { value: loggedInUserId } = useLocalStorage<number>("userId", 0);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Fetch the user data from the backend
        const fetchedUser: User = await apiService.get<User>(`/users/${id}`);
        setUser(fetchedUser);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
          message.error("Error loading user data: " + err.message);
        } else {
          setError("Error loading user data");
          message.error("Error loading user data");
        }
      }
    };

    fetchUser();
  }, [apiService, id]);

  const isOwnProfile = Number(id) === loggedInUserId;

  return (
    <div
      className="auth-container"
      style={{ width: "100%", minHeight: "100vh", padding: "20px" }}
    >
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        {user ? (
          <Card
            title={`User Profile: ${user.username}`}
            bordered={false}
            style={{ marginBottom: "20px" }}
          >
            <p>
              <strong>ID:</strong> {user.id}
            </p>
            <p>
              <strong>Username:</strong> {user.username}
            </p>
            <p>
              <strong>Creation Date:</strong> {user.creationDate}
            </p>
            <p>
              <strong>Status:</strong> {user.status}
            </p>
            <p>
              <strong>Birthday:</strong> {user.birthday ? user.birthday : "N/A"}
            </p>
          </Card>
        ) : (
          // If user data is not available, display a loading message
          <p>Loading user data...</p>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
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
