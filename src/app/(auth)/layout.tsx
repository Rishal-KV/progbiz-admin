"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("admin-Token");
      if (token) {
        router.push("/hero?type=hero");
      }
    }
  }, []);
  return <div>{children}</div>;
};

export default Layout;