import { auth } from "@clerk/nextjs/server";
import React from "react";

const Test = async () => {
  const { getToken } = await auth();
  const token = await getToken();
  console.log(token);

  const resPaymentService = await fetch("http://localhost:8002/test", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });
  const dataPaymentService = await resPaymentService.json();

  const resProductService = await fetch("http://localhost:8000/test", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });
  const dataProductService = await resProductService.json();

  const resOrder = await fetch("http://localhost:8001/test", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });
  const dataOrder = await resOrder.json();

  console.log("payment:", dataPaymentService);
  console.log("product:", dataProductService);
  console.log("product:", dataOrder);

  return <div>Test</div>;
};

export default Test;
