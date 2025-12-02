"use client";
import Button from "@/components/common/Button";
import Metadata from "@/components/common/Metadata";
import { useLogoutMutation } from "@/react-query/auth.react-query";
import React, { useCallback } from "react";

const Dashboard: React.FC = () => {
  const { mutate } = useLogoutMutation();
  const handleLogout = useCallback(() => {
    mutate();
  }, []);
  return (
    <div className="w-full h-full bg-blue-200">
      <Metadata seoTitle={`${process.env.NEXT_PUBLIC_APP_NAME} | Dashboard`} seoDescription="Dashboard" />
      <div className="">Dashboard</div>

      <Button onClick={handleLogout}>Logout</Button>
    </div>
  );
};

export default Dashboard;
