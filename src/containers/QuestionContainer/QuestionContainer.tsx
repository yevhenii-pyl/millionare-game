"use client";

import { useEffect, useState } from "react";

import { UidQuestion } from "@/types/Question";

import QuestionSection from "@/containers/QuestionSection/QuestionSection";
import SideSection from "@/containers/SideSection/SideSection";
import MenuToggle from "@/components/MenuToggle/MenuToggle";

import useScreenSize from "@/hooks/useScreenSize";

import styles from "./QuestionContainer.module.css";

function QuestionContainer({ questionData }: { questionData: UidQuestion }) {
  const { isDesktop } = useScreenSize();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    setIsSidebarOpen(isDesktop);

    return () => setIsSidebarOpen(false);
  }, [isDesktop]);

  return (
    <div className={styles.wrapper}>
      {!isDesktop && (
        <MenuToggle isOpen={isSidebarOpen} toggle={toggleSidebar} />
      )}
      <SideSection isOpen={isSidebarOpen} />
      <QuestionSection questionData={questionData} />
    </div>
  );
}

export default QuestionContainer;
