"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export function WithAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("api_token");
    const apiToken = process.env.NEXT_PUBLIC_API_TOKEN;

    if (pathname === "/login") {
      setIsVerified(true);
      return;
    }

    if (!token || token !== apiToken) {
      router.push("/login");
    } else {
      setIsVerified(true);
    }
  }, [pathname, router]);

  if (!isVerified) {
    return null;
  }

  return <>{children}</>;
}
