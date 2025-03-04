// this code is part of S2 to display a list of all registered users
// clicking on a user in this list will display /app/users/[id]/page.tsx
"use client"; // For components that need React hooks and browser APIs, SSR (server side rendering) has to be disabled. Read more here: https://nextjs.org/docs/pages/building-your-application/rendering/server-side-rendering

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import useLocalStorage from "@/hooks/useLocalStorage";
import { User } from "@/types/user";
import { Button, Card, Table, notification } from "antd";
import type { TableProps } from "antd"; // antd component library allows imports of types
// Optionally, you can import a CSS module or file for additional styling:
// import "@/styles/views/Dashboard.scss";

// Columns for the antd table of User objects
const columns: TableProps<User>["columns"] = [
  {
    title: "Username",
    dataIndex: "username",
    key: "username",
  },
  {
    title: "Creation Date",
    dataIndex: "creationDate",
    key: "creationDate",
  },
  {
    title: "Id",
    dataIndex: "id",
    key: "id",
  },
];

const Dashboard: React.FC = () => {
  const router = useRouter();
  const apiService = useApi();
  const [users, setUsers] = useState<User[] | null>(null);

  // useLocalStorage hook example use
  // The hook returns an object with the value and two functions
  // Simply choose what you need from the hook:
  const {
    // value: token, // is commented out because we dont need to know the token value for logout
    // set: setToken, // is commented out because we dont need to set or update the token value
    clear: clearToken, // all we need in this scenario is a method to clear the token
  } = useLocalStorage<string>("token", "");
  // Here holen wir auch den token-Wert, um den Zugriff auf diese Seite zu schützen:
  const { value: token } = useLocalStorage<string>("token", "");
  
  const { value: userId, clear: clearUserId } = useLocalStorage<number>("userId", 0);

  // Protect this page: If not logged in, redirect to login page.
  useEffect(() => {
    if (!token) {
      notification.error({
        message: "Access Denied",
        description: "Please log in to access the users overview.",
        placement: "topRight",
        style: { width: "300px" },
      });
      router.push("/login");
    }
  }, [token, router]);

  const handleLogout = async (): Promise<void> => {
    try {
      await apiService.put(`/users/${userId}/logout`, {});
      notification.success({
        message: "Logout Successful",
        description: "You have been logged out successfully.",
        placement: "topRight",
        style: { width: "300px" },
      });
      // Clear token using the returned function 'clear' from the hook
      clearToken();
      clearUserId();
      router.push("/login");
    } catch (error: unknown) {
      if (error instanceof Error) {
        notification.error({
          message: "Logout Failed",
          description: error.message || "An error occurred during logout.",
          placement: "topRight",
          style: { width: "300px" },
        });
      } else {
        notification.error({
          message: "Logout Failed",
          description: "An unknown error occurred during logout.",
          placement: "topRight",
          style: { width: "300px" },
        });
      }
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // apiService.get<User[]> returns the parsed JSON object directly,
        // thus we can simply assign it to our users variable.
        const users: User[] = await apiService.get<User[]>("/users");
        setUsers(users);
        console.log("Fetched users:", users);
      } catch (error) {
        if (error instanceof Error) {
          notification.error({
            message: "Error fetching users",
            description: error.message,
            placement: "topRight",
            style: { width: "300px" },
          });
        } else {
          console.error("An unknown error occurred while fetching users.");
        }
      }
    };

    fetchUsers();
  }, [apiService]); // dependency apiService does not re-trigger the useEffect on every render because the hook uses memoization (check useApi.tsx in the hooks).
  // if the dependency array is left empty, the useEffect will trigger exactly once
  // if the dependency array is left away, the useEffect will run on every state change. Since we do a state change to users in the useEffect, this results in an infinite loop.
  // read more here: https://react.dev/reference/react/useEffect#specifying-reactive-dependencies

  return (
    <div className="card-container">
      <Card
        title="Get all users from secure endpoint:"
        loading={!users}
        className="dashboard-container"
      >
        {users && (
          <>
            {/* antd Table: pass the columns and data, plus a rowKey for stable row identity */}
            <Table<User>
              columns={columns}
              dataSource={users}
              rowKey="id"
              onRow={(row) => ({
                onClick: () => router.push(`/users/${row.id}`),
                style: { cursor: "pointer" },
              })}
            />
            <Button onClick={handleLogout} type="primary">
              Logout
            </Button>
          </>
        )}
      </Card>
    </div>
  );
};

export default Dashboard;
