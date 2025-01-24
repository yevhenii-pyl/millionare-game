"use client";

import { useState } from "react";

import Loader from "@/components/Loader/Loader";

import styles from "./CTAButton.module.css";

function CTAButton({ onClick, label }: { onClick: () => void; label: string }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    onClick();
    setIsLoading(true);
  };

  return (
    <button
      onClick={handleClick}
      type="button"
      className={styles.button}
      disabled={isLoading}
    >
      {isLoading ? <Loader /> : label}
    </button>
  );
}

export default CTAButton;
