const scheduleFloatToDate = (time: number, now = new Date()): number => {
  const hour = Math.floor(time);
  const minute = time % 1 ? 30 : 0;
  
  now.setHours(hour, minute);
  
  return now.getTime();
};

export {
  scheduleFloatToDate,
};
