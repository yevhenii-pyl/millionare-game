"use client";

import { useState } from "react";

import styles from "./CTAButton.module.css";

function CTAButton({ onClick, label }: { onClick: () => void; label: string }) {
  const [disabled, setDisabled] = useState(false);

  const handleClick = () => {
    onClick();
    setDisabled(true);
  };

  return (
    <button
      onClick={handleClick}
      type="button"
      className={styles.button}
      disabled={disabled}
    >
      {label}
    </button>
  );
}

export default CTAButton;
