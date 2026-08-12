const validateInterview = (data) => {
  const requiredFields = [
    'fullName',
    'phone',
    'email',
    'dateOfBirth',
    'positionAppliedFor',
    'source',
    'ctcPerAnnum',
    'monthlyTakeHome',
    'expectedCtc',
    'noticePeriod',
  ];

  for (const field of requiredFields) {
    if (!String(data[field] ?? '').trim()) return `${field} is required`;
  }

  if (!/^\d{10}$/.test(data.phone)) return 'Enter a valid 10-digit phone number';
  if (!/^\S+@\S+\.\S+$/.test(data.email)) return 'Enter a valid email';

  return null;
};

export { validateInterview };
