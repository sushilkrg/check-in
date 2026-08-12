import mongoose from 'mongoose';

const businessMeetingSchema = new mongoose.Schema(
  {
    visitorPhotoUrl: String,
    personToMeet: {
      employeeId: String,
      name: String,
    },
    fullName: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    email: { type: String, required: true },
    companyName: { type: String, required: true },
    purposeOfVisit: { type: String, required: true },
    address: String,
  },
  { timestamps: true },
);

export default mongoose.model('BusinessMeeting', businessMeetingSchema);
