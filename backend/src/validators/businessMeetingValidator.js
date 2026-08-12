const validateMeeting = (data) => {
  const requiredFields = ['fullName', 'mobileNumber', 'email', 'companyName', 'purposeOfVisit'];

  for (const field of requiredFields) {
    if (!String(data[field] ?? '').trim()) return `${field} is required`;
  }

  if (!/^\d{10}$/.test(data.mobileNumber)) return 'Enter a valid 10-digit mobile number';
  if (!/^\S+@\S+\.\S+$/.test(data.email)) return 'Enter a valid email';
  if (!data.personToMeet?.employeeId) return 'Person to meet is required';

  return null;
};

export { validateMeeting };
