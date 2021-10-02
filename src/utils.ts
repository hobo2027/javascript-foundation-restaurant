export function generateUID(): string {
  // I generate the UID from two parts here
  // to ensure the random number provide enough bits.
  var firstPart = (Math.random() * 46656) | 0;
  var secondPart = (Math.random() * 46656) | 0;
  // @ts-ignore
  firstPart = ("000" + firstPart.toString(36)).slice(-3);
  // @ts-ignore
  secondPart = ("000" + secondPart.toString(36)).slice(-3);
  return firstPart.toString() + secondPart.toString();
}

export function error(condition: boolean, message: string) {
  if (condition) throw new Error(message);
}
