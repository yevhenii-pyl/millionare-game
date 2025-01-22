"use client";

import styles from "./CTAButton.module.css";

function CTAButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button onClick={onClick} type="button" className={styles.button}>
      {label}
    </button>
  );
}

export default CTAButton;
