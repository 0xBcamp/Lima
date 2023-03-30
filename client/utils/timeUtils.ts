export const unixTimestampToLocalTime = (unixTimestamp: number) => {
  // Create a Date object from the Unix timestamp
  const date = new Date(unixTimestamp * 1000);

  // Format the date and time components
  const day = String(date.getDate()).padStart(2, '0');
  const monthIndex = date.getMonth();
  const year = String(date.getFullYear()).slice(-2);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  // Array of month abbreviations
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  // Get the month abbreviation
  const monthAbbreviation = monthNames[monthIndex];

  // Return the local time as a string
  return `${day} ${monthAbbreviation} '${year}, ${hours}:${minutes}:${seconds}`;
  }