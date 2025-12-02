"use client";
import TextInput from "@/components/common/TextInput";
import React, { useEffect, useState } from "react";

const Profile: React.FC = () => {
  const [search, setSearch] = useState("");

  const [query, setQuery] = useState("");

  useEffect(() => {
    const timerId = setTimeout(() => {
      setQuery(search);
      console.log("Heavy operation triggered for:", search);
    }, 500);

    return () => {
      clearTimeout(timerId);
    };
  }, [search]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <div>
      <div>Profile</div>
      <TextInput name="search" className="w-96 mt-5" label="Search" value={search} onChange={handleChange} />

      <div className="w-96 bg-amber-100 rounded-2xl mt-10 p-5 border text-gray-800 border-amber-300">Results for: {query}</div>
    </div>
  );
};

export default Profile;
