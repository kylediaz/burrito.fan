import styles from "./BigNumber.module.scss";
import React, { useEffect, useState } from "react";

function numberWithCommas(x: number): string {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const BigNumber = ({ num, subtitle }: { num: number; subtitle: string }) => {
  const [displayNum, setDisplayNum] = useState(0);

  useEffect(() => {
    const increment = num / 100; // Adjust based on the desired speed of the count
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current < num) {
        setDisplayNum(Math.floor(current));
      } else {
        setDisplayNum(num);
        clearInterval(timer);
      }
    }, 10); // Adjust interval speed as needed

    return () => clearInterval(timer);
  }, [num]);

  return (
    <div>
      <div className="sm:text-6xl text-4xl">{numberWithCommas(displayNum)}</div>
      <div className={styles.subtitle}>{subtitle}</div>
    </div>
  );
};

export default BigNumber;
