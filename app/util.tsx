export function onMobile(): boolean {
  return window.innerWidth < 900;
}
export function formatNumberWithCommas(number: number): string {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const gramsPerGrain = 0.04;
const gramsOfRicePerCup = 200;
const grainsPerCupOfRice = gramsOfRicePerCup / gramsPerGrain;
const cupsOfRicePerBurrito = 0.25;
const grainsOfRicePerBurrito = cupsOfRicePerBurrito * grainsPerCupOfRice;
const metersPerGrain = 0.0075;
export const metersOfRicePerBurrito = metersPerGrain * grainsOfRicePerBurrito;
