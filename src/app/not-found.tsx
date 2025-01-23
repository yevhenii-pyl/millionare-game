"use client";

import { useRouter } from "next/navigation";
import CTAButton from "@/components/CTAButton/CTAButton";

function NotFound() {
  const router = useRouter();
  const resetGame = () => {
    sessionStorage.removeItem("game");
    router.push("/");
  };

  return (
    <div
      style={{
        textAlign: "center",
        padding: "50px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "30px",
        cursor: "default",
        height: "100vh",
      }}
    >
      <h1 style={{ fontSize: "48px" }}>404 - Not Found</h1>
      <p>Game could not be found</p>
      <CTAButton label="Visit main page" onClick={() => resetGame()} />
    </div>
  );
}

export default NotFound;
