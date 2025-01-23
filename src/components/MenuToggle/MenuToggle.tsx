/* eslint-disable jsx-a11y/click-events-have-key-events */

"use client";

import cn from "classnames";

import styles from "./MenuToggle.module.css";

function MenuToggle({
  isOpen,
  toggle,
}: {
  isOpen: boolean;
  toggle: () => void;
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      className={cn(styles.burger, {
        [styles.open]: isOpen,
      })}
      onClick={toggle}
    >
      <span />
      <span />
      <span />
    </div>
  );
}

export default MenuToggle;
