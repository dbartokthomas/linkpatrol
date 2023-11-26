export function moveStringToFront(
  arr: string[],
  targetString: string
): string[] {
  // Find the index of the target string
  const index = arr.indexOf(targetString);

  // Check if the string exists in the array
  if (index > -1) {
    // Remove the string from its current position
    arr.splice(index, 1);

    // Add the string to the beginning of the array
    arr.unshift(targetString);
  }

  return arr;
}
