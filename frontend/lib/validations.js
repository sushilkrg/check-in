import { z } from "zod";
const req = z.string().trim().min(1, "This field is required");
export const interviewSchema = z.object({
  fullName: req,
  phone: z.string().regex(/^\d{10}$/, "Enter a valid 10-digit phone number"),
  email: z.string().email("Enter a valid email"),
  dateOfBirth: req,
  positionAppliedFor: req,
  source: req,
  currentCompanyName: z.string().optional(),
  companyType: z.string().optional(),
  totalExperience: z.string().optional(),
  relevantExperience: z.string().optional(),
  reasonForChange: z.string().optional(),
  aiKnowledge: z.string().optional(),
  ctcPerAnnum: req,
  monthlyTakeHome: req,
  expectedCtc: req,
  noticePeriod: req,
  resume: z.any().optional(),
});
export const meetingSchema = z.object({
  fullName: req,
  mobileNumber: z
    .string()
    .regex(/^\d{10}$/, "Enter a valid 10-digit phone number"),
  email: z.string().email("Enter a valid email"),
  companyName: req,
  purposeOfVisit: req,
  address: z.string().optional(),
});
