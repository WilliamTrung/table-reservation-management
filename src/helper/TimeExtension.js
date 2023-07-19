const ConvertTime = ({ passedtime }) => {
  const [time, period] = passedtime.split(" ");
  const [hours, minutes] = time.split(":");

  // Convert the hours and minutes to numbers
  let hours24Hour = parseInt(hours);
  const minutesNum = parseInt(minutes);
  // Adjust the hours for PM time

  hours24Hour += 7;
  if (period === "PM" && hours24Hour !== 12) {
    hours24Hour += 12;
  } 

  // Format the time in 24-hour format (e.g., "4:00 PM" to "16:00")
  const time24Hour = `${hours24Hour.toString().padStart(2, "0")}:${minutesNum
    .toString()
    .padStart(2, "0")}`;
  return time24Hour;
};
export const CombineDateTime = ({ desiredTime, desiredDate }) => {
  if (desiredDate && desiredTime) {
    // Combine the date and time strings into a single datetime string
    const combinedDateTime = `${desiredDate}T${ConvertTime({passedtime: desiredTime})}`;

    // Optionally, create a new Date object from the combined datetime string
    const datetimeObject = new Date(combinedDateTime);
    return datetimeObject; // Return the Date object if needed
  }
  return null;
};
export const GetCurrentDateFormatted = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
  
    return `${year}-${month}-${day}`;
  };
