import styles from "./BigNumber.module.scss";

function numberWithCommas(x: number): string {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const BigNumber = ({ num, subtitle }: { num: number; subtitle: string }) => {
  return (
    <div>
      <div className={styles.bigNumber}>{numberWithCommas(num)}</div>
      <div className={styles.subtitle}>{subtitle}</div>
    </div>
  );
};

export default BigNumber;
