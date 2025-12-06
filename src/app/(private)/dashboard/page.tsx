"use client";
import Button from "@/components/common/Button";
import { useLogoutMutation } from "@/react-query/auth.react-query";
import React, { useCallback } from "react";

const Dashboard: React.FC = () => {
  const { mutate } = useLogoutMutation();
  const handleLogout = useCallback(() => {
    mutate();
  }, []);
  return (
    <div className="w-full h-full bg-blue-200">
      <div className="">Dashboard</div>

      <Button onClick={handleLogout}>Logout</Button>
    </div>
  );
};

export default Dashboard;
