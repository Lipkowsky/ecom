"use client";
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import type { User } from "@clerk/nextjs/server";

type UsersResponse = {
  data: User[];
  totalCount: number;
};

const UsersPage = () => {
  const { getToken } = useAuth();

  const { isPending, error, data } = useQuery<UsersResponse>({
    queryKey: ["users"],
    queryFn: async () => {
      const token = await getToken();

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_AUTH_SERVICE_URL}/users`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch users");
      }

      return res.json();
    },
  });

  if (isPending) {
    return <div>Loading users</div>;
  }

  if (error) {
    return <div>Something went wrong 😢</div>;
  }

  return (
    <div>
      <div className="mb-8 px-4 py-2 bg-secondary rounded-md">
        <h1 className="font-semibold">All Users</h1>
      </div>

      <DataTable columns={columns} data={data?.data ?? []} />
    </div>
  );
};

export default UsersPage;