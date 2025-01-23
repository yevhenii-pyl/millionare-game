"use client";

import cn from "classnames";

import useSessionStorage from "@/hooks/useSessionStorage";
import { UiGameData } from "@/types/Game";

import convertIndex from "@/helpers/convertIndexes";

import styles from "./SideSection.module.css";

function SideSection({ isOpen }: { isOpen: boolean }) {
  const [storedGame] = useSessionStorage<UiGameData | null>("game", null);

  return (
    <aside
      className={cn(styles.wrapper, {
        [styles.active]: isOpen,
      })}
    >
      <ul className={styles.list}>
        {storedGame?.questions
          .map(({ uId, status }, index) => (
            <li
              key={uId}
              className={cn(styles.listItem, {
                [styles.active]: status === "active",
              })}
            >
              <div
                className={cn(styles.amount, styles.border, {
                  [styles.active]: status === "active",
                  [styles.answered]: status === "answered",
                })}
              >
                <span>$ {convertIndex(index)}</span>
              </div>
            </li>
          ))
          .reverse()}
      </ul>
    </aside>
  );
}

export default SideSection;
