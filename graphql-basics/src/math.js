export default function add(numbers) {
  let sum = 0;
  for (let i = 0; i < numbers.length; i++) {
    sum += numbers[i];
  }
  return sum;
}

export function subtract(a, b) {
  return a - b;
}
