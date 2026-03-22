export const generateAccidentMessage = (cardNumber, latitude, longitude) => {
  return `🚨 EMERGENCY ALERT 🚨
Accident detected for vehicle ${cardNumber}. Assistance may be needed.
📍 Location: [Google Maps](${latitude},${longitude})
Please respond urgently.
- Team resQTrack`;
};
