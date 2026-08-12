import mongoose from 'mongoose';

const interviewSchema = new mongoose.Schema(
  {
    candidateInformation: {
      imageUrl: String,
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String, required: true },
      dateOfBirth: Date,
    },
    professionalDetails: {
      positionAppliedFor: String,
      source: String,
      currentCompanyName: String,
      companyType: String,
      totalExperience: String,
      relevantExperience: String,
      reasonForChange: String,
    },
    skillsAndAI: {
      coreTechnicalSkills: [String],
      aiKnowledge: String,
      aiTools: [String],
    },
    compensation: {
      ctcPerAnnum: String,
      monthlyTakeHome: String,
      expectedCtc: String,
      noticePeriod: String,
    },
    previousCompanies: [
      {
        companyName: String,
        ctcPerAnnum: String,
        monthlyTakeHome: String,
        yearsWorked: String,
      },
    ],
    appraisalHistory: [
      {
        year: String,
        appraisalPercentage: String,
      },
    ],
    references: [
      {
        name: String,
        phone: String,
        email: String,
        currentCompany: String,
      },
    ],
    resume: {
      url: String,
      fileName: String,
      publicId: String,
    },
  },
  { timestamps: true },
);

export default mongoose.model('Interview', interviewSchema);
