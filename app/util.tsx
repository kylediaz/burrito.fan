export function onMobile(): boolean {
  return window.innerWidth < 900;
}
export function formatNumberWithCommas(number: number): string {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
