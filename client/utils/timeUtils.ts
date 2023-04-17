export const unixTimestampToLocalTime = (unixTimestamp: number, onlyDate?: boolean) => {
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
  if (onlyDate) {
    return `${day} ${monthAbbreviation} '${year}`;
  }

  return `${day} ${monthAbbreviation} '${year}, ${hours}:${minutes}:${seconds}`;
}

export const addDays = (date: number, days: number) => {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result.getTime() / 1000;
}

export const getStayDates = (checkIn: number, checkOut: number) => {
  const _MS_PER_DAY = 1000 * 60 * 60 * 24;
  
  const checkInDate = new Date(checkIn * 1000);
  const checkOutDate = new Date(checkOut * 1000);
  const utc1 = Date.UTC(checkInDate.getFullYear(), checkInDate.getMonth(), checkInDate.getDate());
  const utc2 = Date.UTC(checkOutDate.getFullYear(), checkOutDate.getMonth(), checkOutDate.getDate());
  // const date1:any = new Date(checkIn);
  // const date2:any = new Date(checkOut);
  // console.log('date1 :>> ', date1);
  // console.log('date2 :>> ', date2);
  // const diffTime = Math.abs(date2 - date1);
  // const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  //return diffDays;

  return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}