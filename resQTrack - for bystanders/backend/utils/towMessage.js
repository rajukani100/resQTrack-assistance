export const generateTowMessage = (cardNumber, latitude, longitude) => {
  return `🚨 *PARKING ALERT* 🚨

Your vehicle *${cardNumber} * is parked in a No Parking Zone. Please remove it within 5 minutes to avoid towing.

📍 *Location:* [Google Maps Link](https://maps.google.com/?q=${latitude},${longitude})

Sent by *ResQTrack Team*`;
};
