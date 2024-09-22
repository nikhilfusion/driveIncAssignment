const moment = require('moment');

// Function to generate time slots for a vehicle
const generateTimeSlots = (vehicle, date) => {
  console.log("vehicle, date", vehicle, date);
  const dayOfWeek = moment(date).format('ddd'); // Get the day in "Mon", "Tue" format

  // Check if vehicle is available on the given day
  if (!vehicle.availableDays.includes(dayOfWeek)) {
      return [];
  }

  const slots = [];
  const fromTime = moment(`${date}T${vehicle.availableFromTime}`);
  const toTime = moment(`${date}T${vehicle.availableToTime}`);
  const slotDuration = 45; // Set slot duration to 45 minutes
  const bufferTime = vehicle.minimumMinutesBetweenBookings; // Buffer time between bookings
  let currentSlot = fromTime.clone();

    // Generate 45-minute slots within the available time range
    while (currentSlot.isBefore(toTime)) {
        const startSlot = currentSlot.clone();
        const endSlot = startSlot.clone().add(slotDuration, 'minutes');

        // Only add the slot if it ends before or at the availableToTime
        if (endSlot.isBefore(toTime) || endSlot.isSame(toTime)) {
            slots.push({
                start: startSlot.format('HH:mm'),
                end: endSlot.format('HH:mm')
            });
        }

        // Increment the current slot by the duration and buffer time
        currentSlot.add(slotDuration + bufferTime, 'minutes');
    }
    console.log("slots", slots);
    return slots;
};

// Function to check if a slot overlaps with an existing reservation
const isSlotAvailable = (slot, reservations, date) => {
  const slotStart = moment(`${date}T${slot.start}:00`);
  const slotEnd = moment(`${date}T${slot.end}:00`);

  console.log("slot, reservations, date", slot, reservations, date);
  console.log("slotStart, slotEnd", slotStart, slotEnd);

  return !reservations.some(res => {
      const resStart = moment(res.startDateTime);
      const resEnd = moment(res.endDateTime);
      return slotStart.isBetween(resStart, resEnd, null, '[)') || slotEnd.isBetween(resStart, resEnd, null, '(]');
  });
};

// Get available time slots for a vehicle on a specific day
const getAvailableSlots = (vehicle, date, reservations) => {
  const reservedSlots = reservations.map(({ startTime, endTime }) => ({
    start: moment(startTime).format('HH:mm'),
    end: moment(endTime).format('HH:mm')
  }));
  const allSlots = generateTimeSlots(vehicle, date);
  // Filter out reserved slots
  const availableSlots = allSlots.filter(slot => {
    return !reservedSlots.some(reserved => {
      return reserved.start === slot.start && reserved.end === slot.end;
    });
  });
  console.log(availableSlots);
  return availableSlots;
};

module.exports = {
  getAvailableSlots
}