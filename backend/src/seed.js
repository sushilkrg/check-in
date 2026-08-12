import 'dotenv/config';
import connectDB from './config/db.js';
import Employee from './models/Employee.js';

const seedEmployees = async () => {
  await connectDB();

  const count = await Employee.countDocuments();

  if (!count) {
    await Employee.insertMany([
      { name: 'Abhinesh', designation: 'TA', department: 'HR' },
      { name: 'Ananya Adlakha', designation: 'CSM', department: 'PMO' },
      { name: 'Animesh Sharma', designation: 'Inbound Sales', department: 'SALES' },
    ]);
  }

  console.log('Employees seeded');
  process.exit(0);
};

seedEmployees().catch((error) => {
  console.error(error);
  process.exit(1);
});
