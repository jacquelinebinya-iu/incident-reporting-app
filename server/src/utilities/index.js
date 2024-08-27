import { createHash } from 'crypto';
import { format, parse } from 'date-fns';

export const generateUniqueIncidentRef = (userId) => {
  const now = new Date();
  const datePart = now.toISOString().slice(2, 10).replace(/-/g, ''); // Format 'YYMMDD'
  const timePart = now.toTimeString().split(' ')[0].replace(/:/g, ''); // Format 'HHMMSS'

  let userIdPart = userId.toString();

  // Pad user ID to 7 characters only if it is less than 7 characters long
  if (userIdPart.length < 7) {
    userIdPart = userIdPart.padStart(7, '0');
  }

  const uniqueString = `${datePart}${timePart}${userIdPart}`; // Combine date, time, and user ID

  // Create a SHA-256 hash of the unique string
  const hash = createHash('sha256').update(uniqueString).digest('hex').substring(0, 8); // Get the first 8 characters of the hash

  // Convert the hash to a purely numeric string
  const numericHash = hash
    .split('')
    .map((char) => {
      // Convert hexadecimal characters to numbers (0-15)
      return parseInt(char, 16).toString();
    })
    .join('');

  return `${datePart}${userIdPart}${numericHash}`;
};

export const formatDate = (isoDateString) => {
  // Extract only the date part (yyyy-MM-dd)
  const datePart = isoDateString.split('T')[0];

  // Parse the date part to a Date object
  const parsedDate = parse(datePart, 'yyyy-MM-dd', new Date());

  // Format the Date object to the desired format
  const formattedDate = format(parsedDate, 'd MMMM yyyy');

  return formattedDate;
};
