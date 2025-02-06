import React from "react";

import Image from "next/image";

import styles from "./Header.module.scss";

function Header(props) {
  return (
    <div className={styles.container}>
      <div>
        <h1 className={styles.title}>I fucking love burritos</h1>
      </div>
    </div>
  );
}

export default Header;
