"use client";

import { useState, useEffect } from "react";

import styles from "./Preloader.module.css";

const Preloader = () => {
  const [count, setCount] = useState(0);
  const [hide, setHide] = useState(false);
  const [animationClass, setAnimationClass] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prevCount) => {
        if (prevCount < 100) {
          return prevCount + 4;
        } else {
          clearInterval(interval);
          setAnimationClass(styles.animateSlideUp);
          setTimeout(() => {
            setHide(true);
          }, 300); // Match timeout to animation duration
          return 100;
        }
      });
    }, 1000 / 30);

    return () => clearInterval(interval);
  }, []);

  return (
    !hide && (
      <div
        className={`fixed inset-0 bg-[#141C18] flex items-center justify-center z-50 overflow-hidden ${animationClass}`}
      >
        <div className="text-screen h-screen w-full flex items-center justify-center font-semibold text-9xl text-[#ECDFD5]">
          {count}%
        </div>
      </div>
    )
  );
};

export default Preloader;
