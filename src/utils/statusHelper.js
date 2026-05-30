export const calculateStationStatus = (dateMaintenance) => {
  if (!dateMaintenance) return { label: 'UNKNOWN', className: 'overdue' };

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize to start of day

  // Replace space with T for proper parsing if format is YYYY-MM-DD HH:MM:SS
  const maintDateString = dateMaintenance.replace(' ', 'T');
  const maintDate = new Date(maintDateString);
  maintDate.setHours(0, 0, 0, 0);

  const diffTime = maintDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { label: 'OVER DUE', className: 'overdue' }; // Past date
  } else if (diffDays <= 14) {
    return { label: 'MAINT.', className: 'maint' }; // within 14 days
  } else {
    return { label: 'ACTIVE', className: 'active' }; // more than 14 days
  }
};
