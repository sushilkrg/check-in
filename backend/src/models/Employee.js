import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    designation: String,
    department: String,
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export default mongoose.model('Employee', employeeSchema);
