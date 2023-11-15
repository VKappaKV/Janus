export function truncateAndDotify(inputString: string): string {
  if (inputString.length <= 11) {
    return inputString; // No need to truncate and add dots if the string is already short
  }

  const truncatedString = `${inputString.slice(0, 6)}...${inputString.slice(
    -5
  )}`;
  return truncatedString;
}
