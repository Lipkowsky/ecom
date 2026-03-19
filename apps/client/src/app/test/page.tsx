import { auth } from "@clerk/nextjs/server";
import React from "react";

const Test = async () => {
  const { getToken } = await auth();
  const token = await getToken();

  const res = await fetch("http://localhost:8002/test", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  console.log(data);

  return <div>Test</div>;
};

export default Test;
